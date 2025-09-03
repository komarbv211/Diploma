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
