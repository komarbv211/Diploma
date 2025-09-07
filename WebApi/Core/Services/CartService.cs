using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.CartDTOs;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class CartService(DbMakeUpContext makeUpContext,
    IAuthService authService, IMapper mapper) : ICartService
{
    public async Task CreateUpdate(CartCreateUpdateDTO model)
    {
        var userId = await authService.GetUserId();
        var entity = makeUpContext.Carts
            .SingleOrDefault(x => x.UserId == userId && x.ProductId == model.ProductId);
        if (entity != null)
            entity.Quantity = model.Quantity;
        else
        {
            entity = new CartEntity
            {
                UserId = userId,
                ProductId = model.ProductId,
                Quantity = model.Quantity
            };
            makeUpContext.Carts.Add(entity);
        }
        await makeUpContext.SaveChangesAsync();
    }

    public async Task<List<CartItemDTO>> GetCartItems()
    {
        var userId = await authService.GetUserId();

        var items = await makeUpContext.Carts
            .Where(x => x.UserId == userId)
            .ProjectTo<CartItemDTO>(mapper.ConfigurationProvider)
            .ToListAsync();

        return items;
    }

    public async Task Delete(long id)
    {
        var userId = await authService.GetUserId();
        var item = await makeUpContext.Carts
            .SingleOrDefaultAsync(x => x.UserId == userId && x.ProductId == id);
        if (item != null)
        {
            makeUpContext.Carts.Remove(item);
            await makeUpContext.SaveChangesAsync();
        }
    }

    public async Task ClearCart(long userId)
    {
        var items = makeUpContext.Carts.Where(c => c.UserId == userId);
        makeUpContext.Carts.RemoveRange(items);
        await makeUpContext.SaveChangesAsync();
    }
}