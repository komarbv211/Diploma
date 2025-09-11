using Core.DTOs.CommentDTOs;

namespace Core.Interfaces;

public interface ICommentService
{
    Task<List<CommentItemDto>> GetCommentsByProductIdAsync(long productId);
    Task<CommentItemDto> AddCommentAsync(CommentCreateDto dto);
    Task DeleteCommentAsync(long id);
    Task<List<CommentItemDto>> GetRandomCommentsAsync(int count = 5);
}
