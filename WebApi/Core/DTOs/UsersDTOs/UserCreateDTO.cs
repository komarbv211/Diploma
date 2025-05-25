using Infrastructure.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.DTOs.UsersDTOs;

public class UserCreateDTO
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Image { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }

    public string Password { get; set; }
    public string ConfirmPassword { get; set; }

    // якщо не знадобиться видалимо.
    //public IEnumerable<int> Adverts { get; set; } = [];
    //public IEnumerable<int> FavoriteAdverts { get; set; } = [];
}
