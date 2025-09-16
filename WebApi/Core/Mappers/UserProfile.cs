using AutoMapper;
using Core.DTOs.AuthorizationDTOs;
using Core.Models;
using Core.DTOs.UsersDTO;
using Core.DTOs.UsersDTOs;
using Infrastructure.Entities;

namespace Core.Mappers
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<RegisterDto, UserEntity>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Phone));

            CreateMap<GoogleUserInfo, UserEntity>()
                .ForMember(x => x.FirstName, opt => opt.MapFrom(x => x.Given_Name))
                .ForMember(x => x.LastName, opt => opt.MapFrom(x => x.Family_Name))
                .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email))
                .ForMember(x => x.Email, opt => opt.MapFrom(x => x.Email))
                .ForMember(x => x.EmailConfirmed, opt => opt.MapFrom(x => x.Email_Verified));


            CreateMap<UserDTO, UserEntity>();
            CreateMap<UserEntity, UserDTO>()
                .ForMember(x => x.BirthDate, opt => opt.MapFrom(x => x.BirthDate.Value.ToString("yyyy-MM-dd")));
            CreateMap<UserCreateDTO, UserEntity>().ReverseMap();
            CreateMap<UserUpdateDTO, UserEntity>().ReverseMap();

            CreateMap<UserEntity, UserShortDto>();


        }
    }
}
