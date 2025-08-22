namespace Core.DTOs.CommentDTOs;

public class CommentCreateDto
{
    public long ProductId { get; set; }
    public long UserId { get; set; }
    public string Text { get; set; }
}
