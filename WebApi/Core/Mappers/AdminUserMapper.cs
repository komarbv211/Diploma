using AutoMapper;
using Core.Models.AdminUser;
using Infrastructure.Entities;

namespace Core.Mappers;

public class AdminUserMapper : Profile
{
    public AdminUserMapper()
    {
        CreateMap<UserEntity, AdminUserItemModel>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
            .ForMember(dest => dest.IsLoginGoogle, opt => opt.MapFrom(src => src.UserLogins!.Any(l => l.LoginProvider == "Google")))
            .ForMember(dest => dest.IsLoginPassword, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.PasswordHash)))
            .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => src.CreatedDate.ToString("dd.MM.yyyy HH:mm:ss", new System.Globalization.CultureInfo("uk-UA"))))
            .ForMember(dest => dest.LastActivity, opt => opt.MapFrom(src => src.LastActivity.HasValue ? src.LastActivity.Value.ToString("dd.MM.yyyy HH:mm:ss", new System.Globalization.CultureInfo("uk-UA")) : string.Empty))
            .ForMember(dest => dest.Roles, opt => opt.MapFrom(src => src.UserRoles!.Select(ur => ur.Role.Name).ToList()));
    }
}
