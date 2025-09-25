using AutoMapper;
using Core.DTOs.CartDTOs;
using Infrastructure.Entities;

namespace Core.Mappers;

public class CartMapper : Profile
{
    public CartMapper()
    {
        CreateMap<CartEntity, CartItemDTO>()
            .ForMember(x => x.ProductId, opt => opt.MapFrom(x => x.Product!.Id))
            .ForMember(x => x.CategoryId, opt => opt.MapFrom(x => x.Product!.Category!.Id))
            .ForMember(x => x.CategoryName, opt => opt.MapFrom(x => x.Product!.Category!.Name))
            .ForMember(x => x.Name, opt => opt.MapFrom(x => x.Product!.Name))
            .ForMember(x => x.Price, opt => opt.MapFrom(x => x.Product!.Price))
            .ForMember(dest => dest.DiscountPercent, opt => opt.MapFrom(src => src.Product!.DiscountPercent))
            .ForMember(dest => dest.FinalPrice, opt => opt.MapFrom(src =>
                src.Product!.DiscountPercent.HasValue
                    ? src.Product.Price - (src.Product.Price * (src.Product.DiscountPercent.Value / 100))
                    : src.Product.Price
            ))
            .ForMember(x => x.ImageName, opt => opt.MapFrom(x =>
                x.Product!.Images != null && x.Product.Images.Any()
                    ? x.Product.Images.OrderBy(x => x.Priority).First().Name
                    : null));
    }
}
