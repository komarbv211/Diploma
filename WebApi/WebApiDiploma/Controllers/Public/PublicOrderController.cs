using Core.DTOs.OrderDTOs;
using Core.Interfaces;
using Core.Services;
using MailKit.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;
using System.Security.Claims;
using System.Text.Json;

namespace WebApiDiploma.Controllers.Public
{
    [ApiController]
    [Route("api/order")]
    public class PublicOrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly NovaPoshtaService _novaPoshtaService;

        public PublicOrderController(IOrderService orderService, NovaPoshtaService novaPoshtaService)
        {
            _orderService = orderService;
            _novaPoshtaService = novaPoshtaService;
        }

        [HttpGet("my")]
        [Authorize]
        public async Task<ActionResult> GetMyOrders()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var orders = await _orderService.GetOrdersByUserIdAsync(long.Parse(userId));
            return Ok(orders);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<OrderDto>> GetById(long id) =>
            Ok(await _orderService.GetOrderByIdAsync(id));

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto dto)
        {
            long? userId = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                var user = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (!string.IsNullOrEmpty(user)) userId = long.Parse(user);
            }

            var request = this.Request;
            var createdOrder = await _orderService.CreateOrderAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = createdOrder.Id }, createdOrder);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(long id)
        {
            await _orderService.DeleteOrderAsync(id);
            return Ok(id);
        }

        [HttpGet("warehouses/{cityRef}")]
        public async Task<ActionResult<List<NovaPostWarehouseDto>>> GetWarehousesByCity(string cityRef)
        {
            var warehouses = await _novaPoshtaService.GetAllWarehousesAsync(cityRef);
            return Ok(warehouses);
        }
    }
}
