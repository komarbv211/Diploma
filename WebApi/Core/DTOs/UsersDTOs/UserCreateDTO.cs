using Microsoft.AspNetCore.Http;

namespace Core.DTOs.UsersDTOs;

public class UserCreateDTO
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public IFormFile? Image { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public DateTime? BirthDate {get; set;}

    public string Password { get; set; }
    public string ConfirmPassword { get; set; }


    // якщо не знадобиться видалимо.
    //public IEnumerable<int> Adverts { get; set; } = [];
    //public IEnumerable<int> FavoriteAdverts { get; set; } = [];
}
