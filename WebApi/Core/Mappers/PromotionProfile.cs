using AutoMapper;
using Core.DTOs.PromotionDTOs;
using Infrastructure.Entities;

namespace Core.Mappers;

public class PromotionProfile : Profile
{
    public PromotionProfile()
    {
        CreateMap<PromotionCreateDto, PromotionEntity>();
        CreateMap<PromotionUpdateDto, PromotionEntity>();
    }
}
