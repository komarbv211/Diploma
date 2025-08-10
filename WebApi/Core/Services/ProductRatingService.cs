using AutoMapper;
using Core.DTOs.ProductRatingDTOs;
using Core.Exceptions;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Core.Services
{
    public class ProductRatingService : IProductRatingService
    {
        private readonly IRepository<ProductRatingEntity> _ratingRepository;
        private readonly IMapper _mapper;
        private readonly DbMakeUpContext _context;
        public ProductRatingService(IRepository<ProductRatingEntity> ratingRepository, IMapper mapper, DbMakeUpContext context)
        {
            _ratingRepository = ratingRepository;
            _mapper = mapper;
            _context = context;
        }

        public async Task<List<ProductRatingDto>> GetRatingsByProductIdAsync(long productId)
        {
            try
            {
                var ratings = await _ratingRepository.GetAllQueryable()
                    .Where(r => r.ProductId == productId)
                    .ToListAsync();

                return _mapper.Map<List<ProductRatingDto>>(ratings);
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при отриманні рейтингів продукту", HttpStatusCode.InternalServerError, ex);
            }
        }

        public async Task<ProductRatingDto> AddOrUpdateRatingAsync(ProductRatingCreateDto dto)
        {
            if (dto.Rating < 1 || dto.Rating > 5)
                throw new HttpException("Рейтинг має бути від 1 до 5", HttpStatusCode.BadRequest);

            try
            {
                var existingRating = await _ratingRepository.GetAllQueryable()
                    .FirstOrDefaultAsync(r => r.ProductId == dto.ProductId && r.UserId == dto.UserId);

                if (existingRating != null)
                {
                    existingRating.Rating = dto.Rating;
                    existingRating.CreatedAt = DateTime.UtcNow;
                    await _ratingRepository.Update(existingRating);
                }
                else
                {
                    var newRating = new ProductRatingEntity
                    {
                        ProductId = dto.ProductId,
                        UserId = dto.UserId,
                        Rating = dto.Rating,
                        CreatedAt = DateTime.UtcNow
                    };
                    await _ratingRepository.AddAsync(newRating);
                }

                await _ratingRepository.SaveAsync();

                await UpdateProductRatingStatsAsync(dto.ProductId);

                // Після оновлення статистики отримуємо останній рейтинг для повернення
                var rating = await _ratingRepository.GetAllQueryable()
                    .FirstOrDefaultAsync(r => r.ProductId == dto.ProductId && r.UserId == dto.UserId);

                return _mapper.Map<ProductRatingDto>(rating);
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при додаванні або оновленні рейтингу", HttpStatusCode.InternalServerError, ex);
            }
        }

        private async Task UpdateProductRatingStatsAsync(long productId)
        {
            var ratings = await _ratingRepository.GetAllQueryable()
                .Where(r => r.ProductId == productId)
                .ToListAsync();

            var product = await _context.Products.FindAsync(productId);
            if (product != null)
            {
                product.RatingsCount = ratings.Count;
                product.AverageRating = ratings.Any() ? ratings.Average(r => r.Rating) : (double?)null;

                await _context.SaveChangesAsync();
            }
        }


        public async Task DeleteRatingAsync(long id)
        {
            try
            {
                await _ratingRepository.DeleteAsync(id);
                await _ratingRepository.SaveAsync();
            }
            catch (Exception ex)
            {
                throw new HttpException("Помилка при видаленні рейтингу", HttpStatusCode.InternalServerError, ex);
            }
        }
        

    }
}
