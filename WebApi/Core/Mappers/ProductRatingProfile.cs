using AutoMapper;
using Core.DTOs.ProductDTOs;
using Core.DTOs.ProductRatingDTOs;
using Infrastructure.Entities;

namespace Core.Mappers;

public class ProductRatingProfile : Profile
{
    public ProductRatingProfile()
    {
        CreateMap<ProductRatingEntity, ProductRatingDto>().ReverseMap();
    }

}
