using Core.DTOs.OrderDTOs;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<List<OrderDto>> GetOrders();
        Task<OrderDto?> GetOrderByIdAsync(long id);
        Task<List<OrderDto>> GetOrdersByUserIdAsync(long userId);
        Task<OrderDto> CreateOrderAsync(OrderCreateDto dto, long? userId);
        Task UpdateOrderAsync(OrderUpdateDto dto);
        Task DeleteOrderAsync(long id);
    }
}
