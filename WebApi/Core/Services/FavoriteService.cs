using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.FavoriteDTOs;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class FavoriteService(DbMakeUpContext makeUpContext,
    IAuthService authService, IMapper mapper) : IFavoriteService
{
    // Додати один товар у вподобані
    public async Task Add(FavoriteCreateDTO model)
    {
        var userId = await authService.GetUserId();

        var exists = await makeUpContext.Favorites
            .AnyAsync(x => x.UserId == userId && x.ProductId == model.ProductId);

        if (!exists)
        {
            var entity = new FavoriteEntity
            {
                UserId = userId,
                ProductId = model.ProductId
            };
            makeUpContext.Favorites.Add(entity);
            await makeUpContext.SaveChangesAsync();
        }
    }

    // Отримати всі вподобані товари користувача
    public async Task<List<FavoriteItemDTO>> GetFavorites()
    {
        var userId = await authService.GetUserId();

        return await makeUpContext.Favorites
            .Where(x => x.UserId == userId)
            .ProjectTo<FavoriteItemDTO>(mapper.ConfigurationProvider)
            .ToListAsync();
    }

    // Видалити один товар з вподобаних
    public async Task Delete(long productId)
    {
        var userId = await authService.GetUserId();

        var item = await makeUpContext.Favorites
            .SingleOrDefaultAsync(x => x.UserId == userId && x.ProductId == productId);

        if (item != null)
        {
            makeUpContext.Favorites.Remove(item);
            await makeUpContext.SaveChangesAsync();
        }
    }

    // Очистити всі вподобані
    public async Task ClearFavorites()
    {
        var userId = await authService.GetUserId();

        var items = makeUpContext.Favorites.Where(f => f.UserId == userId);
        makeUpContext.Favorites.RemoveRange(items);
        await makeUpContext.SaveChangesAsync();
    }
}
