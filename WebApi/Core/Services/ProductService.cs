using AutoMapper;
using Core.DTOs.ProductsDTO;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;
using Core.Exceptions;

namespace Core.Services
{
    public class ProductService : IProductService
    {
        private readonly DbMakeUpContext _context;
        private readonly IMapper _mapper;

        public ProductService(DbMakeUpContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ProductItemDto>> GetProductsAsync()
        {
            try
            {
                var products = await _context.Products
                    .Include(p => p.Images)
                    .ToListAsync();

                return _mapper.Map<List<ProductItemDto>>(products);
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при отриманні списку продуктів", HttpStatusCode.InternalServerError, ex);
            }
        }

        public async Task<ProductItemDto?> GetByIdAsync(long id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    throw new HttpException("Продукт не знайдений", HttpStatusCode.NotFound);
                }

                return _mapper.Map<ProductItemDto>(product);
            }
            catch (HttpException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при отриманні продукту", HttpStatusCode.InternalServerError, ex);
            }
        }

        public async Task CreateProductAsync(ProductCreateDto dto)
        {
            try
            {
                var product = _mapper.Map<ProductEntity>(dto);

                // Колекцію зображень не чіпаємо – вона буде додана окремим сервісом
                await _context.Products.AddAsync(product);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbEx)
            {
                throw new HttpException("Помилка при збереженні продукту в базі даних", HttpStatusCode.InternalServerError, dbEx);
            }
            catch (Exception ex)
            {
                throw new HttpException("Невідома помилка при створенні продукту", HttpStatusCode.InternalServerError, ex);
            }
        }

        public async Task UpdateProductAsync(ProductUpdateDto dto)
        {
            try
            {
                var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == dto.Id);
                if (product == null)
                {
                    throw new HttpException("Продукт не знайдений для оновлення", HttpStatusCode.NotFound);
                }

                _mapper.Map(dto, product);

                _context.Products.Update(product);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbEx)
            {
                throw new HttpException("Помилка при оновленні продукту в базі даних", HttpStatusCode.InternalServerError, dbEx);
            }
            catch (Exception ex)
            {
                throw new HttpException("Невідома помилка при оновленні продукту", HttpStatusCode.InternalServerError, ex);
            }
        }

        public async Task DeleteProductAsync(long id)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null)
                {
                    throw new HttpException("Продукт не знайдений для видалення", HttpStatusCode.NotFound);
                }

                if (product.Images != null)
                {
                    _context.ProductImages.RemoveRange(product.Images);
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException dbEx)
            {
                throw new HttpException("Помилка при видаленні продукту з бази даних", HttpStatusCode.InternalServerError, dbEx);
            }
            catch (Exception ex)
            {
                throw new HttpException("Невідома помилка при видаленні продукту", HttpStatusCode.InternalServerError, ex);
            }
        }
    }
}
