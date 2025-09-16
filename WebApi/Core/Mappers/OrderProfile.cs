using AutoMapper;
using Core.DTOs.OrderDTOs;
using Infrastructure.Entities;

namespace Core.Mappers
{
    public class OrderProfile : Profile
    {
        public OrderProfile()
        {
            CreateMap<OrderEntity, OrderDto>();
            CreateMap<OrderCreateDto, OrderEntity>()
                .ForMember(dest => dest.TotalPrice, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.Items, opt => opt.Ignore());

            CreateMap<OrderUpdateDto, OrderEntity>();

            CreateMap<OrderItemEntity, OrderItemDto>();
            CreateMap<OrderItemCreateDto, OrderItemEntity>();
            CreateMap<OrderItemUpdateDto, OrderItemEntity>();

            CreateMap<OrderItemEntity, OrderHistoryItemDto>()
           .ForMember(dest => dest.Name,
                      opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : string.Empty))
           .ForMember(dest => dest.ImageUrl,
                      opt => opt.MapFrom(src => src.Product != null && src.Product.Images != null
                          ? src.Product.Images.OrderBy(img => img.Priority).FirstOrDefault().Name
                          : null));

            CreateMap<OrderEntity, OrderHistoryDto>()
                .ForMember(dest => dest.TotalPrice,
                           opt => opt.MapFrom(src => src.Items.Sum(i => i.Price * i.Quantity)));

            CreateMap<NovaPostWarehouseEntity, NovaPostWarehouseDto>();
            CreateMap<NovaPostWarehouseData, NovaPostWarehouseEntity>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Description))
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.CityDescription))
                .ForMember(dest => dest.WarehouseCode, opt => opt.MapFrom(src => src.Number))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Orders, opt => opt.Ignore());

        }
    }
}
