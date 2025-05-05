using Core.DTOs.ProductsDTO;
using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Services
{
    internal class ProductService : IProductService
    {
        public Task CreateProductAsync(ProductCreateDto dto)
        {
            throw new NotImplementedException();
        }

        public Task DeleteProductAsync(long id)
        {
            throw new NotImplementedException();
        }

        public Task<ProductItemDto?> GetByIdAsync(long id)
        {
            throw new NotImplementedException();
        }

        public Task<ProductItemDto?> GetBySlugAsync(string slug)
        {
            throw new NotImplementedException();
        }

        public Task<List<ProductItemDto>> GetProductsAsync()
        {
            throw new NotImplementedException();
        }

        public Task UpdateProductAsync(ProductUpdateDto dto)
        {
            throw new NotImplementedException();
        }
    }
}
