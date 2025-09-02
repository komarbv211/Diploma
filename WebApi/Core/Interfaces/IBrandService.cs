using Core.DTOs.BrandsDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IBrandService
    {
        Task<List<BrandItemDto>> GetBrandsAsync();
        Task<BrandItemDto?> GetByIdAsync(long id);
        Task<BrandItemDto> CreateBrandAsync(BrandCreateDto dto);
        Task UpdateBrandAsync(BrandUpdateDto dto);
        Task DeleteBrandAsync(long id);
    }
}
