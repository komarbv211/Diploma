using AutoMapper;
using Core.DTOs.CategoryDTOs;
using Infrastructure.Entities;

namespace Core.Mappers
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<CategoryEntity, CategoryDto>()
                .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.Children)); 

            CreateMap<CategoryDto, CategoryEntity>()
                .ForMember(dest => dest.Children, opt => opt.Ignore());

            CreateMap<CategoryCreateDto, CategoryEntity>()
                .ForMember(dest => dest.Children, opt => opt.Ignore());

            CreateMap<CategoryUpdateDto, CategoryEntity>()
                .ForMember(dest => dest.Children, opt => opt.Ignore())  
                .ForMember(dest => dest.ParentId, opt => opt.MapFrom(src => src.ParentId)); 
        }
    }
}
