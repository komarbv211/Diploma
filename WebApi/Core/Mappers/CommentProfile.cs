using AutoMapper;
using Core.DTOs.CommentDTOs;
using Core.DTOs.UsersDTOs;
using Infrastructure.Entities;

namespace Core.Mappers;

public class CommentProfile : Profile
{
    public CommentProfile()
    {
        CreateMap<CommentEntity, CommentItemDto>()
                   .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User))
                   .ForMember(dest => dest.Product, opt => opt.MapFrom(src => src.Product));

        CreateMap<CommentCreateDto, CommentEntity>();
    }
}
