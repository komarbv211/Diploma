using AutoMapper;
using Core.DTOs.UsersDTOs;
using Microsoft.Graph.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Mappers
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            //CreateMap<User, ChatOlxUserDto>()
            //   .ForMember(x => x.Description, opt => opt.MapFrom(x => x.GetUserDescription()));

            CreateMap<UserCreationModel, User>()
                .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email));

            CreateMap<GoogleUserInfo, User>()
                .ForMember(x => x.FirstName, opt => opt.MapFrom(x => x.Given_Name))
                .ForMember(x => x.LastName, opt => opt.MapFrom(x => x.Family_Name))
                .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.Email))
                .ForMember(x => x.Email, opt => opt.MapFrom(x => x.Email))
                .ForMember(x => x.EmailConfirmed, opt => opt.MapFrom(x => x.Email_Verified));

            CreateMap<User, UserDTO>()
                .ForMember(x => x.SettlementDescrption, opt => opt.MapFrom(z => z.Settlement != null ? z.Settlement.Description : null))
                .ForMember(x => x.Adverts, opt => opt.MapFrom(z => z.Adverts.Select(y => y.Id)))
                .ForMember(x => x.FavoriteAdverts, opt => opt.MapFrom(z => z.FavoriteAdverts.Select(y => y.Id)));

            CreateMap<UserEditModel, OlxUser>();

            CreateMap<OlxUser, OlxUserShortDto>()
                 .ForMember(x => x.SettlementDescrption, opt => opt.MapFrom(z => z.Settlement != null ? z.Settlement.Description : null));

            CreateMap<UserPageRequest, OlxUserFilter>();
        }
    }
}
