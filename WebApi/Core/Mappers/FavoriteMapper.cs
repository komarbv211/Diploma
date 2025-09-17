using AutoMapper;
using Core.DTOs.FavoriteDTOs;
using Infrastructure.Entities;

namespace Core.Mappers;

public class FavoriteMapper : Profile
{
    public FavoriteMapper()
    {
        CreateMap<FavoriteEntity, FavoriteItemDTO>()
            .ForMember(x => x.ProductId, opt => opt.MapFrom(x => x.Product!.Id))
            .ForMember(x => x.CategoryId, opt => opt.MapFrom(x => x.Product!.Category!.Id))
            .ForMember(x => x.CategoryName, opt => opt.MapFrom(x => x.Product!.Category!.Name))
            .ForMember(x => x.Name, opt => opt.MapFrom(x => x.Product!.Name))
            .ForMember(x => x.Price, opt => opt.MapFrom(x => x.Product!.Price))
            .ForMember(x => x.ImageName, opt => opt.MapFrom(x =>
                x.Product!.Images != null && x.Product.Images.Any()
                    ? x.Product.Images.OrderBy(img => img.Priority).First().Name
                    : null));
    }
}
