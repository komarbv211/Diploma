using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services
{
    public class CategoryService : ICategoryService
    {

        private readonly IRepository<CategoryEntity> _repository;
        private readonly IMapper _mapper;

        public CategoryService(IRepository<CategoryEntity> repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public Task<List<CategoryDto>> GetCategoriesAsync()
        {
            var categories = _repository.GetAllQueryable()
                           .ProjectTo<CategoryDto>(_mapper.ConfigurationProvider)
                           .ToListAsync();

            return categories;
        }

    }
}
