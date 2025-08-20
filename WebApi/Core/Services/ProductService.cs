using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.DTOs.PaginationDTOs;
using Core.DTOs.ProductsDTO;
using Core.Exceptions;
using Core.Interfaces;
using Core.Models.Search;
using Core.Specifications;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;
using WebApiDiploma.Pagination;

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

    public async Task SetProductPromotionAsync(ProductSetPromotionDto dto)
    {
        if (dto == null)
            throw new HttpException("Дані не можуть бути порожніми", HttpStatusCode.BadRequest);

        try
        {
            // Отримуємо продукт із бази
            var product = await _productRepository.FirstOrDefaultAsync(new ProductWithImagesSpecification(dto.ProductId));
            if (product == null)
                throw new HttpException("Продукт не знайдено", HttpStatusCode.NotFound);

            // Мапимо дані з DTO на продукт
            //product.PromotionId = dto.PromotionId;
            //product.DiscountPercent = dto.DiscountPercent;

            // Зберігаємо зміни
            await _productRepository.Update(product);
            await _productRepository.SaveAsync();
        }
        catch (HttpException)
        {
            throw;
        }
        catch (Exception ex)
        {
            throw new HttpException("Сталася внутрішня помилка сервера при оновленні акції продукту", HttpStatusCode.InternalServerError, ex);
        }
    }





    //public async Task<SearchResult<ProductItemModel>> SearchProductsAsync(ProductSearchModel model, bool isAdmin = false)
    //{

    //    var query = _productRepository
    //        .GetAllQueryable()
    //        //.Include(p => p.Brand)
    //        .Include(p => p.Category)
    //        .Include(p => p.Images)
    //        .AsQueryable();

    //    // 🔐 Фільтр для публічної частини
    //    //if (!isAdmin)
    //    //{
    //    //    query = query.Where(p => p.IsActive); // або твоя умова доступності
    //    //}

    //    // 🔍 Фільтри
    //    if (model.CategoryId.HasValue)
    //        query = query.Where(p => p.CategoryId == model.CategoryId);

    //    //if (model.BrandId.HasValue)
    //    //    query = query.Where(p => p.BrandId == model.BrandId);

    //    if (model.PriceMin.HasValue)
    //        query = query.Where(p => p.Price >= model.PriceMin.Value);

    //    if (model.PriceMax.HasValue)
    //        query = query.Where(p => p.Price <= model.PriceMax.Value);

    //    if (model.MinRating.HasValue)
    //        query = query.Where(p => p.AverageRating >= model.MinRating.Value);

    //    if (model.InStock.HasValue && model.InStock.Value)
    //    {
    //        query = query.Where(p => p.Carts.Any()); // або пиши свою перевірку на наявність
    //    }

    //    var startDate = model.GetParsedStartDate();
    //    //if (startDate.HasValue)
    //    //    query = query.Where(p => p.CreatedAt >= startDate.Value);

    //    //var endDate = model.GetParsedEndDate();
    //    //if (endDate.HasValue)
    //    //    query = query.Where(p => p.CreatedAt <= endDate.Value);





    //     // 🔢 Загальна кількість
    //        var totalCount = await query.CountAsync();

    //        // 📄 Пейджинг
    //        var safeItemsPerPage = model.ItemPerPage < 1 ? 10 : model.ItemPerPage;
    //        var totalPages = (int)Math.Ceiling(totalCount / (double)safeItemsPerPage);
    //        var safePage = Math.Min(Math.Max(1, model.Page), Math.Max(1, totalPages));

    //    // 🔽 Сортування
    //    query = model.SortBy switch
    //    {
    //        "Price" => model.SortDesc ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
    //        "Rating" => model.SortDesc ? query.OrderByDescending(p => p.AverageRating) : query.OrderBy(p => p.AverageRating),
    //       // "CreatedAt" => model.SortDesc ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
    //        _ => query.OrderBy(p => p.Id)
    //    };

    //    // 📦 Пагінація
    //    //var total = await query.CountAsync();
    //    //var items = await query
    //    //    .Skip((model.Page - 1) * model.ItemsPerPage)
    //    //    .Take(model.ItemsPerPage)
    //    //    .Select(p => new ProductItemModel
    //    //    {
    //    //        Id = p.Id,
    //    //        Name = p.Name,
    //    //        Price = p.Price,
    //    //        Rating = p.AverageRating,
    //    //        ImageUrl = p.Images.FirstOrDefault().Url,
    //    //        BrandName = p.Brand != null ? p.Brand.Name : null,
    //    //        CategoryName = p.Category != null ? p.Category.Name : null
    //    //    })
    //    //    .ToListAsync();

    //    //return new SearchResult<ProductItemModel>
    //    //{
    //    //    //Items = items,
    //    //    //TotalCount = total
    //    //};

    //    // Завантаження продуктів з пагінацією
    //    var products = await query
    //        .Skip((safePage - 1) * safeItemsPerPage)
    //        .Take(safeItemsPerPage)
    //        .ProjectTo<ProductItemModel>(_mapper.ConfigurationProvider)
    //        .ToListAsync();

    //    // Підрахунок загальної кількості сторінок
    //    var totalPagess = (int)Math.Ceiling(totalCount / (double)safeItemsPerPage);

    //    // Формування результату
    //    return new SearchResult<ProductItemModel>
    //    {
    //        Items = products,
    //        Pagination = new PagedResultDto<ProductItemModel>
    //        {
    //            CurrentPage = safePage,
    //            PageSize = safeItemsPerPage,
    //            TotalCount = totalCount,
    //            TotalPages = totalPagess,
    //            // Items можна не дублювати тут, бо є зовні
    //        }
    //    };

    //}

    public async Task<SearchResult<ProductItemModel>> SearchProductsAsync(ProductSearchModel model, bool isAdmin = false)
    {
        var query = _productRepository
            .GetAllQueryable()
            .Include(p => p.Brand)
            .Include(p => p.Category)
            .Include(p => p.Images)
            .AsQueryable();

        // 🔐 Якщо не адмін, фільтруй за активністю (опціонально)
        if (!isAdmin)
        {
            query = query.Where(p => p.Quantity > 0); // або p.IsActive, якщо є таке поле
        }

        // 🔍 Фільтрація
        if (model.CategoryId.HasValue)
            query = query.Where(p => p.CategoryId == model.CategoryId.Value);

        if (model.BrandId.HasValue)
            query = query.Where(p => p.BrandId == model.BrandId.Value);

        if (model.PriceMin.HasValue)
            query = query.Where(p => p.Price >= model.PriceMin.Value);

        if (model.PriceMax.HasValue)
            query = query.Where(p => p.Price <= model.PriceMax.Value);

        if (model.MinRating.HasValue)
            query = query.Where(p => p.AverageRating >= model.MinRating.Value);

        if (model.InStock == true)
            query = query.Where(p => p.Quantity > 0);


        // 🆕 Пошук по тексту
        if (!string.IsNullOrWhiteSpace(model.Query))
        {
            var keyword = model.Query.Trim().ToLower();

            query = query.Where(p =>
                p.Name.ToLower().Contains(keyword) ||
                (p.Brand != null && p.Brand.Name.ToLower().Contains(keyword)) ||
                (p.Category != null && p.Category.Name.ToLower().Contains(keyword))
            );
        }

        //if (!string.IsNullOrWhiteSpace(model.Query))
        //{
        //    var keyword = model.Query.Trim().ToLower();
        //    query = query.Where(p =>
        //        p.Name.ToLower().Contains(keyword) ||
        //        (p.Description != null && p.Description.ToLower().Contains(keyword)));
        //}

        var startDate = model.GetParsedStartDate();
        if (startDate.HasValue)
            query = query.Where(p => p.DateCreated >= startDate.Value);

        var endDate = model.GetParsedEndDate();
        if (endDate.HasValue)
            query = query.Where(p => p.DateCreated <= endDate.Value);

        // 🔢 Загальна кількість перед пагінацією
        var totalCount = await query.CountAsync();

        // 🧾 Безпечна пагінація
        var safeItemsPerPage = model.ItemPerPage < 1 ? 10 : model.ItemPerPage;
        var totalPages = (int)Math.Ceiling(totalCount / (double)safeItemsPerPage);
        var safePage = Math.Min(Math.Max(1, model.Page), Math.Max(1, totalPages));

        // 🔽 Сортування
        query = model.SortBy switch
        {
            "Price" => model.SortDesc
                ? query.OrderByDescending(p => p.Price)
                : query.OrderBy(p => p.Price),

            "Rating" => model.SortDesc
                ? query.OrderByDescending(p => p.AverageRating)
                : query.OrderBy(p => p.AverageRating),

            "CreatedAt" => model.SortDesc
                ? query.OrderByDescending(p => p.DateCreated)
                : query.OrderBy(p => p.DateCreated),

            _ => query.OrderBy(p => p.Id)
        };

        // 📦 Пагінація
        var products = await query
            .Skip((safePage - 1) * safeItemsPerPage)
            .Take(safeItemsPerPage)
            .Select(p => new ProductItemModel
            {
                Id = p.Id,
                Name = p.Name,
                Price = (int)p.Price,
                Rating = p.AverageRating,
                //ImageUrl = p.Images.Select(i => i.ImageUrl).FirstOrDefault(),

                BrandName = p.Brand != null ? p.Brand.Name : null,
                CategoryName = p.Category != null ? p.Category.Name : null,
                IsInStock = p.Quantity > 0
            })
            .ToListAsync();

        // 📤 Результат
        return new SearchResult<ProductItemModel>
        {
            Items = products,
            Pagination = new PagedResultDto<ProductItemModel>
            {
                CurrentPage = safePage,
                PageSize = safeItemsPerPage,
                TotalCount = totalCount,
                TotalPages = totalPages
            }
        };
    }




}
