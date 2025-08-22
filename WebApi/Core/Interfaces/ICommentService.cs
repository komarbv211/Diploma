using Core.DTOs.CommentDTOs;

namespace Core.Interfaces;

public interface ICommentService
{
    Task<List<CommentItemDto>> GetCommentsByProductIdAsync(long productId);
    Task<CommentItemDto> AddCommentAsync(CommentCreateDto dto);
    Task DeleteCommentAsync(long id);
}
