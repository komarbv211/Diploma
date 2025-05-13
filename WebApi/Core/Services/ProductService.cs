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
        private readonly IImageService _imageService;

        public ProductService(DbMakeUpContext context, IMapper mapper, IImageService imageService)
        {
            _context = context;
            _mapper = mapper;
            _imageService = imageService;
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

                await _context.Products.AddAsync(product);
                await _context.SaveChangesAsync(); // потрібно зберегти, щоб отримати ProductId

                // Зберегти зображення, якщо вони є
                if (dto.image is { Count: > 0 })
                {
                    var imageNames = await _imageService.SaveImagesAsync(dto.image);

                    var productImages = imageNames.Select((name, index) => new ProductImageEntity
                    {
                        Name = name,
                        Priority = (short)index,
                        ProductId = product.Id
                    });

                    await _context.ProductImages.AddRangeAsync(productImages);
                    await _context.SaveChangesAsync();
                }
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
                if (dto == null)
                    throw new ArgumentNullException(nameof(dto), "Дані не можуть бути порожніми");

                if (dto.Id <= 0)
                    throw new ArgumentException("Неправильний ідентифікатор продукту");

                var product = await _context.Products
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == dto.Id);

                if (product == null)
                    throw new HttpException("Продукт не знайдено", HttpStatusCode.NotFound);

                // Оновлення основних даних
                _mapper.Map(dto, product);
                _context.Products.Update(product);

                var updatedImages = new List<ProductImageEntity>();
                var existingImages = product.Images.ToDictionary(i => i.Name, i => i);

                for (int i = 0; i < dto.image.Count; i++)
                {
                    var formFile = dto.image[i];

                    if (formFile == null || formFile.Length == 0)
                        continue;

                    if (existingImages.TryGetValue(formFile.FileName, out var existingImage))
                    {
                        existingImage.Priority = (short)i;
                        updatedImages.Add(existingImage);
                        _context.ProductImages.Update(existingImage);
                    }
                    else
                    {
                        var newFileName = await _imageService.SaveImageAsync(formFile);
                        var newImage = new ProductImageEntity
                        {
                            Name = newFileName,
                            Priority = (short)i,
                            ProductId = product.Id
                        };
                        updatedImages.Add(newImage);
                        await _context.ProductImages.AddAsync(newImage);
                    }
                }

                var imagesToDelete = product.Images
                    .Where(img => !updatedImages.Any(u => u.Name == img.Name))
                    .ToList();

                foreach (var img in imagesToDelete)
                {
                    _imageService.DeleteImageIfExists(img.Name);
                }

                _context.ProductImages.RemoveRange(imagesToDelete);
                await _context.SaveChangesAsync();
            }
            catch (ArgumentException ex)
            {
                throw new HttpException(ex.Message, HttpStatusCode.BadRequest);
            }
            catch (Exception ex)
            {
                throw new HttpException("Сталася внутрішня помилка сервера", HttpStatusCode.InternalServerError);
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
