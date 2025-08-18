using AutoMapper;
using Core.DTOs.ProductsDTO;
using Core.Exceptions;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Core.Services;

public class ProductService : IProductService
{
    private readonly IRepository<ProductEntity> _productRepository;
    private readonly IRepository<ProductImageEntity> _imageRepository;
    private readonly IMapper _mapper;
    private readonly IImageService _imageService;

    public ProductService(
        IRepository<ProductEntity> productRepository,
        IRepository<ProductImageEntity> imageRepository,
        IMapper mapper,
        IImageService imageService)
    {
        _productRepository = productRepository;
        _imageRepository = imageRepository;
        _mapper = mapper;
        _imageService = imageService;
    }

    public async Task<List<ProductItemDto>> GetProductsAsync()
    {
        try
        {
            var products = await _productRepository.GetAllQueryable()
                .Include(p => p.Images)
                .Include(p => p.Ratings)
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
            var product = await _productRepository.FirstOrDefaultAsync(new ProductWithImagesSpecification(id));

            if (product == null)
                throw new HttpException("Продукт не знайдений", HttpStatusCode.NotFound);

            return _mapper.Map<ProductItemDto>(product);
        }
        catch (HttpException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new HttpException("Помилка при отриманні продукту", HttpStatusCode.InternalServerError, ex);
        }
    }

    public async Task<ProductItemDto> CreateProductAsync(ProductCreateDto dto)
    {
        try
        {
            var product = _mapper.Map<ProductEntity>(dto);
            product.RatingsCount = 0;
            await _productRepository.AddAsync(product);
            await _productRepository.SaveAsync();

            if (dto.image is { Count: > 0 })
            {
                var imageNames = await _imageService.SaveImagesAsync(dto.image);
                var productImages = imageNames.Select((name, index) => new ProductImageEntity
                {
                    Name = name,
                    Priority = (short)index,
                    ProductId = product.Id
                });

                await _imageRepository.AddRangeAsync(productImages);
                await _imageRepository.SaveAsync();
            }
            var model = await _productRepository.FirstOrDefaultAsync(new ProductWithImagesSpecification(product.Id));
            return _mapper.Map<ProductItemDto>(model);
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
        if (dto == null)
            throw new HttpException("Дані не можуть бути порожніми", HttpStatusCode.BadRequest);
        if (dto.Id <= 0)
            throw new HttpException("Неправильний ідентифікатор продукту", HttpStatusCode.BadRequest);

        try
        {
            var product = await _productRepository.FirstOrDefaultAsync(new ProductWithImagesSpecification(dto.Id));
            if (product == null)
                throw new HttpException("Продукт не знайдено", HttpStatusCode.NotFound);

            _mapper.Map(dto, product);
            await _productRepository.Update(product);
            await _productRepository.SaveAsync();
            await HandleProductImagesUpdateAsync(dto, product);
        }
        catch (HttpException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new HttpException("Сталася внутрішня помилка сервера", HttpStatusCode.InternalServerError, ex);
        }
    }

    private async Task HandleProductImagesUpdateAsync(ProductUpdateDto dto, ProductEntity product)
    {
        var existingImages = product.Images!.ToDictionary(i => i.Name, i => i);
        var updatedImages = new List<ProductImageEntity>();

        if (dto.image != null)
        {
            for (int i = 0; i < dto.image.Count; i++)
            {
                var formFile = dto.image[i];

                if (formFile == null)
                    continue;

                if (formFile.ContentType == "old-image")
                {
                    // Це старе зображення, оновлюємо пріоритет
                    var imageName = formFile.FileName;

                    if (existingImages.TryGetValue(imageName, out var oldImage))
                    {
                        oldImage.Priority = (short)i;
                        updatedImages.Add(oldImage);
                        await _imageRepository.Update(oldImage);
                    }
                }
                else
                {
                    // Нове зображення
                    var newFileName = await _imageService.SaveImageAsync(formFile);
                    var newImage = new ProductImageEntity
                    {
                        Name = newFileName,
                        Priority = (short)i,
                        ProductId = product.Id
                    };
                    updatedImages.Add(newImage);
                    await _imageRepository.AddAsync(newImage);
                }
            }
        }

        // Видаляємо всі зображення, яких немає у списку оновлених
        var imagesToDelete = product.Images!
            .Where(img => !updatedImages.Any(updated => updated.Name == img.Name))
            .ToList();

        foreach (var img in imagesToDelete)
        {
            _imageService.DeleteImageIfExists(img.Name);
            _imageRepository.Delete(img.Id);
        }

        await _imageRepository.SaveAsync();
    }

    public async Task DeleteProductAsync(long id)
    {
        try
        {
            var product = await _productRepository.FirstOrDefaultAsync(new ProductWithImagesSpecification(id));
            if (product == null)
                throw new HttpException("Продукт не знайдений для видалення", HttpStatusCode.NotFound);

            if (product.Images != null && product.Images.Any())
            {
                foreach (var img in product.Images)
                {
                    _imageService.DeleteImageIfExists(img.Name);
                }
                _imageRepository.DeleteRange(product.Images);
            }

            _productRepository.Delete(product.Id);
            await _productRepository.SaveAsync();
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
