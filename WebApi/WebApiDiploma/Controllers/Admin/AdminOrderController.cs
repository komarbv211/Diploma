using Core.DTOs.OrderDTOs;
using Core.Interfaces;
using Core.Services;
using Infrastructure.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/order")]
    [Authorize(Roles = "Admin")]
    public class AdminOrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly NovaPoshtaService _novaPoshtaService;

        public AdminOrderController(IOrderService orderService, NovaPoshtaService novaPoshtaService)
        {
            _orderService = orderService;
            _novaPoshtaService = novaPoshtaService;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders() =>
        Ok(await _orderService.GetOrders());

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetById(long id) =>
            Ok(await _orderService.GetOrderByIdAsync(id));

        [HttpGet("user/{userId:long}")]
        public async Task<IActionResult> GetOrdersByUserId(long userId)
        {
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto dto)
        {
            var createdOrder = await _orderService.CreateOrderAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = createdOrder.Id }, createdOrder);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] OrderUpdateDto dto)
        {
            await _orderService.UpdateOrderAsync(dto);
            var upd = await _orderService.GetOrderByIdAsync(dto.Id);
            return Ok(upd);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await _orderService.DeleteOrderAsync((int)id);
            return Ok(id);
        }

        [HttpPost("update-warehouses")]
        public async Task<IActionResult> UpdateWarehouses()
        {
            await _novaPoshtaService.UpdateWarehousesAsync();
            return Ok();
        }
    }
}
