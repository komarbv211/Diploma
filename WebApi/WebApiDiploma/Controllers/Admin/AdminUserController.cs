using Core.DTOs.PaginationDTOs;
using Core.DTOs.UsersDTOs;
using Core.Interfaces;
using Core.Models.Search;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Admin
{
    [Route("api/admin/user")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminUserController : ControllerBase
    {
        private readonly IUserService service;

        public AdminUserController(IUserService services)
        {
            service = services;
        }

        [HttpGet("users")]
        public async Task<ActionResult<PagedResultDto<UserDTO>>> GetAll([FromQuery] PagedRequestDto request)
        {
            var users = await service.GetAllAsync(request);
            return Ok(users);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromForm] UserCreateDTO dto)
        {
            await service.CreateUserAsync(dto);
            return Ok();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] UserSearchModel model)
        {
            var result = await service.SearchUsersAsync(model);
            return Ok(result);
        }

    }

}
