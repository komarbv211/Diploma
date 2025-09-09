using Core.DTOs.CommentDTOs;
using Core.Interfaces;
using Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.User
{
    [Route("api/[controller]/[action]")]
    [ApiController]   
    public class CommentController(ICommentService commentService) : ControllerBase
    {
        [HttpGet("{productId}")]
        public async Task<IActionResult> GetByProduct(long productId)
        {
            var comments = await commentService.GetCommentsByProductIdAsync(productId);
            return Ok(comments);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CommentCreateDto model)
        {
            var comment = await commentService.AddCommentAsync(model);
            return Ok(comment);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await commentService.DeleteCommentAsync(id);
            return Ok();
        }

        [HttpGet("{count?}")]
        public async Task<IActionResult> GetRandom(int count = 5)
        {
            var comments = await commentService.GetRandomCommentsAsync(count);
            return Ok(comments);
        }
    }
}
