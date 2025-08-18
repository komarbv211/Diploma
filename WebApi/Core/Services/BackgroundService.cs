using Core.Interfaces;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Core.Services
{

    public class WarehouseBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _checkInterval = TimeSpan.FromHours(1);
        private readonly TimeSpan _updateThreshold = TimeSpan.FromHours(24);

        public WarehouseBackgroundService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckAndUpdateWarehousesAsync(stoppingToken);
                await Task.Delay(_checkInterval, stoppingToken);
            }
        }

        private async Task CheckAndUpdateWarehousesAsync(CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();

            var npService = scope.ServiceProvider.GetRequiredService<NovaPoshtaService>();
            var db = scope.ServiceProvider.GetRequiredService<IRepository<WarehouseUpdateHistoryEntity>>();

            var history = await db.GetAllQueryable().FirstOrDefaultAsync(stoppingToken)
                          ?? new WarehouseUpdateHistoryEntity { LastUpdatedAt = DateTime.MinValue };

            if (history == null)
            {
                history = new WarehouseUpdateHistoryEntity { LastUpdatedAt = DateTime.UtcNow };
                await db.AddAsync(history);
                await db.SaveAsync();
                Console.WriteLine("BG Service started");
                return;
            }

            if (DateTime.UtcNow - history.LastUpdatedAt > _updateThreshold)
            {
                try
                {
                    await npService.UpdateWarehousesAsync();

                    history.LastUpdatedAt = DateTime.UtcNow;
                    if (history.Id == 0)
                        await db.AddAsync(history);
                    else
                        await db.Update(history);

                    await db.SaveAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error updating warehouses: {ex.Message}");
                }
            }
        }
    }
}
