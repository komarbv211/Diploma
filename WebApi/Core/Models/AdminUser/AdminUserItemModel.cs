namespace Core.Models.AdminUser;

public class AdminUserItemModel
{
    public long Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public bool IsLoginGoogle { get; set; } = false;
    public bool IsLoginPassword { get; set; } = false;
    public string CreatedDate { get; set; } = string.Empty;
    public string LastActivity { get; set; } = string.Empty;
    public List<string> Roles { get; set; } = new();
    public DateTimeOffset? LockoutEnd { get; set; }
    public bool IsBlocked => LockoutEnd.HasValue && LockoutEnd.Value > DateTimeOffset.UtcNow;
}
