using Core.DTOs.UsersDTOs;

namespace Core.DTOs.CommentDTOs;

public class CommentItemDto
{
    public long Id { get; set; }
    public long ProductId { get; set; }
    public long UserId { get; set; }
    public string Text { get; set; }
    public DateTime DateCreated { get; set; }
    public UserShortDto? User { get; set; }
}
