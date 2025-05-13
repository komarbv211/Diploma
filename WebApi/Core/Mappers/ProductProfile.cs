using AutoMapper;
using Core.DTOs.ProductDTOs;
using Core.DTOs.ProductsDTO;
using Infrastructure.Entities;

public class ProductProfile : Profile
{
    public ProductProfile()
    {
        CreateMap<ProductImageEntity, ProductImageDto>().ReverseMap();

        CreateMap<ProductEntity, ProductItemDto>()
            .ForMember(dest => dest.Images, opt => opt.MapFrom(src =>
                src.Images != null ? src.Images.OrderBy(i => i.Priority).ToList() : new List<ProductImageEntity>()));

        CreateMap<ProductCreateDto, ProductEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore());

        CreateMap<ProductUpdateDto, ProductEntity>()
            .ForMember(dest => dest.Images, opt => opt.Ignore());
    }
}
