using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.User
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService service;

        public UserController(IUserService services)
        {
            service = services;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetById(long id)
        {
            var user = await service.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(user);
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

        //[HttpPost("register")]
        //public async Task<ActionResult> Register(UserDTO user)
        //{
        //    var existingUser = await service.GetByEmailAsync(user.Email);
        //    if (existingUser != null)
        //    {
        //        return Conflict(new { message = "Ви вже зареєстровані", redirect = "/reset-password" });
        //    }

        //    await service.CreateUserAsync(user);
        //    return Created("/users/" + user.Email, new { message = "Користувач успішно зареєстрований" });
        //}
    }

}
