using AutoMapper;
using Core.DTOs.BrandsDTOs;
using Infrastructure.Entities;


namespace Core.Mappers
{
    public class BrandProfile : Profile
    {
        public BrandProfile()
        {
        CreateMap<BrandEntity, BrandItemDto>(). ReverseMap();
            CreateMap<BrandCreateDto, BrandEntity>();

        }
    }
}
