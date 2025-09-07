using Core.DTOs.CartDTOs;

namespace Core.Interfaces;

public interface ICartService
{
    Task CreateUpdate(CartCreateUpdateDTO model);
    Task<List<CartItemDTO>> GetCartItems();
    Task Delete(long id);
    Task ClearCart(long userId);
}
