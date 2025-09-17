using Core.DTOs.FavoriteDTOs;

namespace Core.Interfaces;

public interface IFavoriteService
{
    Task Add(FavoriteCreateDTO model);

 
    Task<List<FavoriteItemDTO>> GetFavorites();


    Task Delete(long productId);

    Task ClearFavorites();
}
