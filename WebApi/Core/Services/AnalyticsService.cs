using Core.DTOs.AnalyticsDTOs;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly DbMakeUpContext _db;

    public AnalyticsService(DbMakeUpContext db)
    {
        _db = db;
    }

    // Revenue grouped by day (UTC)
    public async Task<IEnumerable<RevenuePointDto>> GetRevenueByPeriodAsync(DateTime startUtc, DateTime endUtc)
    {
        // normalize bounds
        var start = startUtc.Date;
        var end = endUtc.Date.AddDays(1).AddTicks(-1);

        var q = await _db.Orders
            .Where(o => o.DateCreated >= start && o.DateCreated <= end)
            .GroupBy(o => o.DateCreated.Date)
            .Select(g => new RevenuePointDto
            {
                Date = g.Min(x => x.DateCreated).Date,
                Revenue = g.Sum(x => x.TotalPrice),
                OrdersCount = g.Count()
            })
            .OrderBy(r => r.Date)
            .ToListAsync();

        // if EF.Functions.DateFromParts not supported in your provider, you can use:
        // GroupBy(o => o.DateCreated.Date) with client-evaluation fallback or use DB functions.

        return q;
    }

    public async Task<IEnumerable<TopProductDto>> GetTopProductsAsync(int top = 10, DateTime? startUtc = null, DateTime? endUtc = null)
    {
        var items = _db.OrderItems.AsQueryable();
        var orders = _db.Orders.AsQueryable();

        if (startUtc.HasValue || endUtc.HasValue)
        {
            var start = startUtc?.Date ?? DateTime.MinValue;
            var end = endUtc?.Date.AddDays(1).AddTicks(-1) ?? DateTime.MaxValue;
            orders = orders.Where(o => o.DateCreated >= start && o.DateCreated <= end);
        }

        var q = await (from oi in items
                       join o in orders on oi.OrderId equals o.Id
                       join p in _db.Products on oi.ProductId equals p.Id
                       group new { oi, p } by new { oi.ProductId, p.Name } into g
                       select new TopProductDto
                       {
                           ProductId = g.Key.ProductId,
                           ProductName = g.Key.Name,
                           QuantitySold = g.Sum(x => (long)x.oi.Quantity),
                           Revenue = g.Sum(x => x.oi.Price * x.oi.Quantity)
                       })
                       .OrderByDescending(x => x.Revenue)
                       .Take(top)
                       .ToListAsync();

        return q;
    }

    public async Task<OrdersSummaryDto> GetOrdersSummaryAsync(DateTime startUtc, DateTime endUtc)
    {
        var start = startUtc;
        var end = endUtc;

        var orders = await _db.Orders
            .Where(o => o.DateCreated >= start && o.DateCreated <= end)
            .ToListAsync();

        var totalRevenue = orders.Sum(o => o.TotalPrice);
        var count = orders.Count;
        var avg = count > 0 ? totalRevenue / count : 0m;

        return new OrdersSummaryDto
        {
            OrdersCount = count,
            TotalRevenue = totalRevenue,
            AverageOrderValue = Math.Round(avg, 2)
        };
    }

    public async Task<IEnumerable<CategorySalesDto>> GetSalesByCategoryAsync(DateTime startUtc, DateTime endUtc)
    {
        var start = startUtc;
        var end = endUtc;

        var q = await (from oi in _db.OrderItems
                       join o in _db.Orders on oi.OrderId equals o.Id
                       join p in _db.Products on oi.ProductId equals p.Id
                       join c in _db.Categories on p.CategoryId equals c.Id
                       where o.DateCreated >= start && o.DateCreated <= end
                       group new { oi, p, c } by new { c.Id, c.Name } into g
                       select new CategorySalesDto
                       {
                           CategoryId = g.Key.Id,
                           CategoryName = g.Key.Name,
                           QuantitySold = g.Sum(x => (long)x.oi.Quantity),
                           Revenue = g.Sum(x => x.oi.Price * x.oi.Quantity)
                       })
                       .OrderByDescending(x => x.Revenue)
                       .ToListAsync();

        return q;
    }

    public async Task<NewCustomersDto> GetNewCustomersCountAsync(DateTime startUtc, DateTime endUtc)
    {
        var count = await _db.Users
            .CountAsync(u => u.CreatedDate >= startUtc && u.CreatedDate <= endUtc);

        return new NewCustomersDto { NewCustomers = count };
    }

    public async Task<RepeatPurchaseDto> GetRepeatPurchaseStatsAsync(DateTime startUtc, DateTime endUtc)
    {
        // Customers who made at least 2 orders in period
        var customersWithCounts = await _db.Orders
            .Where(o => o.DateCreated >= startUtc && o.DateCreated <= endUtc && o.UserId != null)
            .GroupBy(o => o.UserId)
            .Select(g => new { UserId = g.Key, OrdersCount = g.Count() })
            .ToListAsync();

        var customersTotal = customersWithCounts.Count;
        var repeat = customersWithCounts.Count(x => x.OrdersCount > 1);

        return new RepeatPurchaseDto
        {
            CustomersWithRepeatPurchase = repeat,
            CustomersTotal = customersTotal
        };
    }
    public async Task<UserAnalyticsDto> GetUserAnalyticsAsync(DateTime startUtc, DateTime endUtc)
    {
        var totalUsers = await _db.Users.CountAsync();

        var newUsers = await _db.Users
            .CountAsync(u => u.CreatedDate >= startUtc && u.CreatedDate <= endUtc);

        var activeUsers = await _db.Orders
            .Where(o => o.DateCreated >= startUtc && o.DateCreated <= endUtc && o.UserId != null)
            .Select(o => o.UserId)
            .Distinct()
            .CountAsync();

        var inactiveUsers = totalUsers - activeUsers;

        var revenueByUsers = await _db.Orders
            .Where(o => o.DateCreated >= startUtc && o.DateCreated <= endUtc && o.UserId != null)
            .GroupBy(o => o.UserId)
            .Select(g => g.Sum(x => x.TotalPrice))
            .ToListAsync();

        var ltv = revenueByUsers.Any() ? revenueByUsers.Average() : 0m;

        return new UserAnalyticsDto
        {
            TotalUsers = totalUsers,
            NewUsers = newUsers,
            ActiveUsers = activeUsers,
            InactiveUsers = inactiveUsers,
            LifetimeValue = Math.Round(ltv, 2)
        };
    }

}