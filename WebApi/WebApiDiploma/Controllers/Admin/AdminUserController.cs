using Core.DTOs.UsersDTO;
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
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll()
        {
            var users = await service.GetAllAsync();
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
