using AutoMapper;
using Core.DTOs.UsersDTOs;
using Infrastructure.Entities;
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

            CreateMap<UserDTO, UserEntity>().ReverseMap();
                //.ForMember(x => x.SettlementDescrption, opt => opt.MapFrom(z => z.Settlement != null ? z.Settlement.Description : null))
                //.ForMember(x => x., opt => opt.MapFrom(z => z.Adverts.Select(y => y.Id)))
                //.ForMember(x => x.FavoriteAdverts, opt => opt.MapFrom(z => z.FavoriteAdverts.Select(y => y.Id)));

            //CreateMap<UserEditModel, OlxUser>();

            //CreateMap<OlxUser, OlxUserShortDto>()
            //     .ForMember(x => x.SettlementDescrption, opt => opt.MapFrom(z => z.Settlement != null ? z.Settlement.Description : null));

            //CreateMap<UserPageRequest, OlxUserFilter>();
        }
    }
}
