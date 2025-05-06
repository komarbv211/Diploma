using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService service;

        public UserController(IUserService services)
        {
            service = services;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetAll()
        {
            var users = await service.GetAllAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetById(long id)
        {
            var user = await service.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }


        [HttpPost]
        public async Task<ActionResult> Create([FromBody] UserCreateDTO dto)
        {
            await service.CreateUserAsync(dto);
            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> Update([FromBody] UserUpdateDTO dto)
        {
            await service.UpdateUserAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(long id)
        {
            await service.DeleteUserAsync(id);
            return NoContent();
        }
        [HttpGet("email")]
        public async Task<ActionResult<UserDTO>> GetByEmail([FromQuery] string email)
        {
            var user = await service.GetByEmailAsync(email);
            if (user == null)
                return NotFound();
            return Ok(user);
        }

    }

}
