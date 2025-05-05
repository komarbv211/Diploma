using AutoMapper;
using Core.DTOs.ProductsDTO;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

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
        var products = await _context.Products
            .Include(p => p.Images)
            .ToListAsync();

        return _mapper.Map<List<ProductItemDto>>(products);
    }

    public async Task<ProductItemDto?> GetByIdAsync(long id)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        return product == null ? null : _mapper.Map<ProductItemDto>(product);
    }

    public async Task CreateProductAsync(ProductCreateDto dto)
    {
        var product = _mapper.Map<ProductEntity>(dto);

        // Додаємо зображення, якщо є
        if (dto.Images is { Count: > 0 })
        {
            product.Images = dto.Images.Select(name => new ProductImageEntity
            {
                Name = name,
                ProductId = product.Id
            }).ToList();
        }
        await _context.Products.AddAsync(product);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateProductAsync(ProductUpdateDto dto)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == dto.Id);

        if (product == null) return;

        _mapper.Map(dto, product);

        // Якщо є нові зображення — замінити старі
        if (dto.Images is { Count: > 0 })
        {
            if (product.Images != null)
            {
                _context.ProductImages.RemoveRange(product.Images);
            }

            product.Images = dto.Images.Select(name => new ProductImageEntity
            {
                Name = name,
                ProductId = product.Id
            }).ToList();
        }

        _context.Products.Update(product);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteProductAsync(long id)
    {
        var product = await _context.Products
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return;

        if (product.Images != null)
        {
            _context.ProductImages.RemoveRange(product.Images);
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();
    }

}
