using Core.DTOs.PaginationDTOs;
using Core.DTOs.UsersDTOs;
using Core.Interfaces;
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
        public async Task<ActionResult> Create([FromBody] UserCreateDTO dto)
        {
            await service.CreateUserAsync(dto);
            return Ok();
        }

    }

}
