using AutoMapper;
using Core.DTOs.ProductsDTO;
using Infrastructure.Entities;

namespace Core.Mappers
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<ProductEntity, ProductItemDto>()
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src =>
                    src.Images != null ? src.Images.OrderBy(i => i.Priority).Select(i => i.Name).ToList() : new List<string>()));

            CreateMap<ProductCreateDto, ProductEntity>()
                .ForMember(dest => dest.Images, opt => opt.Ignore());

            CreateMap<ProductUpdateDto, ProductEntity>()
                .ForMember(dest => dest.Images, opt => opt.Ignore());
        }
    }
}
