using AutoMapper;
using Core.DTOs.AuthorizationDTOs;
using Infrastructure.Entities;

namespace Core.Mappers
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<RegisterDto, UserEntity>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));
        }
    }
}
