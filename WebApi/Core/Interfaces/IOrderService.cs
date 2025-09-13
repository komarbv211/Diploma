using Core.DTOs.OrderDTOs;

namespace Core.Interfaces
{
    public interface IOrderService
    {
        Task<List<OrderDto>> GetOrders();
        Task<OrderDto?> GetOrderByIdAsync(long id);
        Task<List<OrderDto>> GetOrdersByUserIdAsync(long? userId = null);
        Task<OrderDto> CreateOrderAsync(OrderCreateDto dto, long? userId = null);
        Task UpdateOrderAsync(OrderUpdateDto dto);
        Task UpdateOrderStatusAsync(OrderStatusUpdateDto dto);
        Task DeleteOrderAsync(long id);
    }
}
