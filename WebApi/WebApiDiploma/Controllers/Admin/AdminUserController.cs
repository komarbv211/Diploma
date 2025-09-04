using Core.DTOs.PaginationDTOs;
using Core.DTOs.UsersDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Core.Models.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace WebApiDiploma.Controllers.Admin
{
    [Route("api/admin/user")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminUserController : ControllerBase
    {
        private readonly IUserService _service;
        private readonly IEmailService _emailService;
        private readonly ILogger<AdminUserController> _logger;

        public AdminUserController(IUserService service, IEmailService emailService, ILogger<AdminUserController> logger)
        {
            _service = service;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpGet("users")]
        public async Task<ActionResult<PagedResultDto<UserDTO>>> GetAll([FromQuery] PagedRequestDto request)
        {
            var users = await _service.GetAllAsync(request);
            return Ok(users);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromForm] UserCreateDTO dto)
        {
            await _service.CreateUserAsync(dto);
            return Ok();
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] UserSearchModel model)
        {
            if (model.Roles != null && model.Roles.Any())
            {
                _logger.LogInformation("Roles from query: {Roles}", string.Join(", ", model.Roles));
            }
            else
            {
                _logger.LogInformation("No roles provided in the query.");
            }

            var result = await _service.SearchUsersAsync(model);
            return Ok(result);
        }

        [HttpPost("send-message")]
        public async Task<IActionResult> SendMessageToUser([FromBody] UserMessageDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Subject) || string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest("Subject and Message cannot be empty.");
            }

            try
            {
                var user = await _service.GetByIdAsync(dto.Id);
                if (user == null)
                {
                    return NotFound($"User with Id {dto.Id} not found.");
                }

                await _emailService.SendEmailAsync(user.Email, dto.Subject, dto.Message);

                _logger.LogInformation("Email sent to user {UserId} ({Email}) with subject '{Subject}'", user.Id, user.Email, dto.Subject);

                return Ok("Message sent successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending email to user {UserId}", dto.Id);
                return StatusCode(500, "An error occurred while sending the email.");
            }
        }

        [HttpPost("block")]
        public async Task<IActionResult> BlockUser([FromBody] UserBlockDTO dto)
        {
            await _service.BlockUserAsync(dto);
            return Ok(new
            {
                Message = $"User {dto.Id} blocked {(dto.Until.HasValue ? $"until {dto.Until}" : "permanently")}"
            });
        }

        [HttpPost("{id}/unblock")]
        public async Task<IActionResult> UnblockUser(long id)
        {
            await _service.UnblockUserAsync(id);
            return Ok(new { Message = $"User {id} unblocked" });
        }

        [HttpPost("{id}/promote-to-admin")]
        public async Task<IActionResult> PromoteToAdmin(long id)
        {
            await _service.PromoteUserToAdminAsync(id);
            return Ok(new { Message = $"User {id} promoted to Admin" });
        }


    }
}
