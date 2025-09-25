using AutoMapper;
using Core.DTOs.PaginationDTOs;
using Core.DTOs.ProductDTOs;
using Core.DTOs.ProductsDTO;
using Core.Exceptions;
using Core.Interfaces;
using Core.Models.Search;
using Core.Repositories;
using Core.Specifications;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebApiDiploma.Pagination;

namespace Core.Services;

public class ProductService : IProductService
{
    private readonly IRepository<ProductEntity> _productRepository;
    private readonly IRepository<PromotionEntity> _promotionRepository;
    private readonly IRepository<ProductImageEntity> _imageRepository;
    private readonly IRepository<CategoryEntity> _categoryRepository;
    private readonly IRepository<FavoriteEntity> _favoriteRepository;
    private readonly IMapper _mapper;
    private readonly IImageService _imageService;
    private readonly IAuthService _authService;

    public ProductService(
        IRepository<ProductEntity> productRepository,
        IRepository<ProductImageEntity> imageRepository,
        IRepository<CategoryEntity> categoryRepository,
        IRepository<PromotionEntity> promotionRepository,
        IRepository<FavoriteEntity> favoriteRepository,
        IMapper mapper,
        IImageService imageService,
        IAuthService authService)
    {
        _productRepository = productRepository;
        _imageRepository = imageRepository;
        _mapper = mapper;
        _imageService = imageService;
        _categoryRepository = categoryRepository;
        _promotionRepository = promotionRepository;
        _favoriteRepository = favoriteRepository;
        _authService = authService;
    }

    private async Task<long?> GetUserIdSafeAsync()
    {
        try
        {
            return await _authService.GetUserId();
        }
        catch
        {
            return null;
        }
    }

    // ✅ Отримання всіх продуктів
    public async Task<List<ProductItemDto>> GetProductsAsync()
    {
        var userId = await GetUserIdSafeAsync();

        var products = await _productRepository.GetAllQueryable()
            .Include(p => p.Images)
            .Include(p => p.Ratings)
            .Include(p => p.Comments)
            .ToListAsync();

        var favoriteIds = userId.HasValue
            ? await _favoriteRepository.GetAllQueryable()
                .Where(f => f.UserId == userId.Value)
                .Select(f => f.ProductId)
                .ToListAsync()
            : new List<long>();

        var result = _mapper.Map<List<ProductItemDto>>(products);
        foreach (var p in result)
            p.IsFavorite = favoriteIds.Contains(p.Id);

        return result;
    }

    // ✅ Отримання одного продукту
    public async Task<ProductItemDto?> GetByIdAsync(long id)
    {
        var userId = await GetUserIdSafeAsync();

        var product = await _productRepository.FirstOrDefaultAsync(new ProductWithImagesSpecification(id));
        if (product == null)
            throw new HttpException("Продукт не знайдений", HttpStatusCode.NotFound);

        var dto = _mapper.Map<ProductItemDto>(product);
        dto.IsFavorite = userId.HasValue
            ? await _favoriteRepository.GetAllQueryable()
                .AnyAsync(f => f.UserId == userId.Value && f.ProductId == product.Id)
            : false;

        return dto;
    }

    // ✅ Створення продукту
    public async Task<ProductItemDto> CreateProductAsync(ProductCreateDto dto)
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

    // ✅ Оновлення продукту
    public async Task UpdateProductAsync(ProductUpdateDto dto)
    {
        if (dto == null)
            throw new HttpException("Дані не можуть бути порожніми", HttpStatusCode.BadRequest);
        if (dto.Id <= 0)
            throw new HttpException("Неправильний ідентифікатор продукту", HttpStatusCode.BadRequest);

        var product = await _productRepository.FirstOrDefaultAsync(new ProductWithImagesSpecification(dto.Id));
        if (product == null)
            throw new HttpException("Продукт не знайдено", HttpStatusCode.NotFound);

        _mapper.Map(dto, product);
        await _productRepository.Update(product);
        await _productRepository.SaveAsync();

        await HandleProductImagesUpdateAsync(dto, product);
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
                if (formFile == null) continue;

                if (formFile.ContentType == "old-image")
                {
                    if (existingImages.TryGetValue(formFile.FileName, out var oldImage))
                    {
                        oldImage.Priority = (short)i;
                        updatedImages.Add(oldImage);
                        await _imageRepository.Update(oldImage);
                    }
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
                    await _imageRepository.AddAsync(newImage);
                }
            }
        }

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

    // ✅ Видалення продукту
    public async Task DeleteProductAsync(long id)
    {
        var product = await _productRepository.FirstOrDefaultAsync(new ProductWithImagesSpecification(id));
        if (product == null)
            throw new HttpException("Продукт не знайдений для видалення", HttpStatusCode.NotFound);

        if (product.Images != null && product.Images.Any())
        {
            foreach (var img in product.Images)
                _imageService.DeleteImageIfExists(img.Name);

            _imageRepository.DeleteRange(product.Images);
        }

        _productRepository.Delete(product.Id);
        await _productRepository.SaveAsync();
    }

    // ✅ Прив’язка до акції
    public async Task SetProductPromotionAsync(ProductSetPromotionDto dto)
    {
        if (dto == null)
            throw new HttpException("Дані не можуть бути порожніми", HttpStatusCode.BadRequest);

        var product = await _productRepository.FirstOrDefaultAsync(new ProductWithImagesSpecification(dto.ProductId));
        if (product == null)
            throw new HttpException("Продукт не знайдено", HttpStatusCode.NotFound);

        PromotionEntity? promotion = null;

        if (dto.PromotionId.HasValue)
        {
            promotion = await _promotionRepository.GetAllQueryable()
                .Include(p => p.Products)
                .FirstOrDefaultAsync(p => p.Id == dto.PromotionId.Value);

            if (promotion == null)
                throw new HttpException("Акція не знайдена", HttpStatusCode.NotFound);

            promotion.Products ??= new List<ProductEntity>();

            if (!promotion.Products.Any(p => p.Id == product.Id))
                promotion.Products.Add(product);
        }

        product.PromotionId = promotion?.Id;
        product.DiscountPercent = dto.DiscountPercent;

        await _productRepository.Update(product);
        if (promotion != null)
            await _promotionRepository.Update(promotion);

        await _productRepository.SaveAsync();
        await _promotionRepository.SaveAsync();
    }

    // ✅ Пошук продуктів з улюбленими
    public async Task<SearchResult<ProductItemModel>> SearchProductsAsync(ProductSearchModel model, bool isAdmin = false)
    {
        var userId = await GetUserIdSafeAsync();

        var query = _productRepository
            .GetAllQueryable()
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Images)
            .AsQueryable();

        if (!isAdmin)
            query = query.Where(p => p.Quantity > 0);

        if (model.CategoryId.HasValue)
        {
            var allCategoryIds = await _categoryRepository.GetAllQueryable()
                .Where(c => c.Id == model.CategoryId.Value || c.ParentId == model.CategoryId.Value)
                .Select(c => c.Id)
                .ToListAsync();

            query = query.Where(p => allCategoryIds.Contains(p.CategoryId));
        }

        if (model.BrandIds != null && model.BrandIds.Any())
            query = query.Where(p => model.BrandIds.Contains(p.BrandId));

        if (model.PriceMin.HasValue)
            query = query.Where(p => p.Price >= model.PriceMin.Value);

        if (model.PriceMax.HasValue)
            query = query.Where(p => p.Price <= model.PriceMax.Value);

        if (model.MinRating.HasValue)
            query = query.Where(p => p.AverageRating >= model.MinRating.Value);

        if (model.InStock == true)
            query = query.Where(p => p.Quantity > 0);

        if (!string.IsNullOrWhiteSpace(model.Query))
        {
            var keyword = model.Query.Trim().ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(keyword) ||
                (p.Brand != null && p.Brand.Name.ToLower().Contains(keyword)) ||
                (p.Category != null && p.Category.Name.ToLower().Contains(keyword)) ||
                (p.Description != null && p.Description.ToLower().Contains(keyword))
            );
        }

        var startDate = model.GetParsedStartDate();
        if (startDate.HasValue)
            query = query.Where(p => p.DateCreated >= startDate.Value);

        var endDate = model.GetParsedEndDate();
        if (endDate.HasValue)
            query = query.Where(p => p.DateCreated <= endDate.Value);

        var totalCount = await query.CountAsync();
        var safeItemsPerPage = model.ItemPerPage < 1 ? 10 : model.ItemPerPage;
        var totalPages = (int)Math.Ceiling(totalCount / (double)safeItemsPerPage);
        var safePage = Math.Min(Math.Max(1, model.Page), Math.Max(1, totalPages));

        query = model.SortBy switch
        {
            "Price" => model.SortDesc ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "Rating" => model.SortDesc ? query.OrderByDescending(p => p.AverageRating) : query.OrderBy(p => p.AverageRating),
            "CreatedAt" => model.SortDesc ? query.OrderByDescending(p => p.DateCreated) : query.OrderBy(p => p.DateCreated),
            _ => query.OrderBy(p => p.Id)
        };

        var products = await query
            .Skip((safePage - 1) * safeItemsPerPage)
            .Take(safeItemsPerPage)
            .ToListAsync();

        var favoriteIds = userId.HasValue
            ? await _favoriteRepository.GetAllQueryable()
                .Where(f => f.UserId == userId.Value)
                .Select(f => f.ProductId)
                .ToListAsync()
            : new List<long>();

        var items = products.Select(p => new ProductItemModel
        {
            Id = p.Id,
            Name = p.Name,
            Price = (int)p.Price,
            Rating = p.AverageRating,
            ImageUrl = p.Images?.Select(i => i.Name).FirstOrDefault(),
            Quantity = p.Quantity,
            BrandName = p.Brand?.Name,
            CategoryName = p.Category?.Name,
            CreatedAt = p.DateCreated,
            IsInStock = p.Quantity > 0,
            IsFavorite = favoriteIds.Contains(p.Id),
            DiscountPercent = p.DiscountPercent
        }).ToList();

        return new SearchResult<ProductItemModel>
        {
            Items = items,
            Pagination = new PagedResultDto<ProductItemModel>
            {
                CurrentPage = safePage,
                PageSize = safeItemsPerPage,
                TotalCount = totalCount,
                TotalPages = totalPages
            }
        };
    }

    // ✅ За категоріями
    public async Task<List<ProductItemDto>> GetProductsByCategoriesAsync(IEnumerable<long> categoryIds)
    {
        var userId = await GetUserIdSafeAsync();

        var products = await _productRepository.ListAsync(new ProductsByCategorySpecification(categoryIds));

        var favoriteIds = userId.HasValue
            ? await _favoriteRepository.GetAllQueryable()
                .Where(f => f.UserId == userId.Value)
                .Select(f => f.ProductId)
                .ToListAsync()
            : new List<long>();

        var result = _mapper.Map<List<ProductItemDto>>(products);
        foreach (var p in result)
            p.IsFavorite = favoriteIds.Contains(p.Id);

        return result;
    }
}
