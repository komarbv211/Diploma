using AutoMapper;
using Core.DTOs.PromotionDTOs;
using Core.Interfaces;
using Infrastructure.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly IPromotionRepository _promotionRepository;
        private readonly IRepository<PromotionEntity> _repository;
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;

        public PromotionService(
            IPromotionRepository promotionRepository,
            IRepository<PromotionEntity> repository,
            IMapper mapper,
            IImageService imageService)
        {
            _promotionRepository = promotionRepository;
            _repository = repository;
            _mapper = mapper;
            _imageService = imageService;
        }

        public async Task CreatePromotionAsync(PromotionCreateDto dto)
        {
            var entity = _mapper.Map<PromotionEntity>(dto);

            entity.StartDate = DateTime.SpecifyKind(dto.StartDate, DateTimeKind.Utc);
            entity.EndDate = DateTime.SpecifyKind(dto.EndDate, DateTimeKind.Utc);

            if (dto.Image != null)
            {
                var imageName = await _imageService.SaveImageAsync(dto.Image);
                entity.Image = imageName;
            }

            if (dto.ProductIds != null && dto.ProductIds.Any())
            {
                entity.PromotionProducts = dto.ProductIds.Select(id => new PromotionProductEntity
                {
                    ProductId = id
                }).ToList();
            }

            await _repository.AddAsync(entity);
            await _repository.SaveAsync();
        }

        public async Task DeletePromotionAsync(long id)
        {
            var entity = await _promotionRepository.GetByIdWithProductsAsync(id);
            if (entity == null)
                throw new Exception("Promotion not found");

            if (!string.IsNullOrEmpty(entity.Image))
                _imageService.DeleteImageIfExists(entity.Image);

            await _repository.DeleteAsync(id);
            await _repository.SaveAsync();
        }

        public async Task UpdatePromotionAsync(PromotionUpdateDto dto)
        {
            var promotion = await _promotionRepository.GetByIdWithProductsAsync(dto.Id);
            if (promotion == null) return;

            string oldImage = promotion.Image ?? string.Empty;

            _mapper.Map(dto, promotion);

            promotion.StartDate = DateTime.SpecifyKind(promotion.StartDate, DateTimeKind.Utc);
            promotion.EndDate = DateTime.SpecifyKind(promotion.EndDate, DateTimeKind.Utc);

            if (dto.Image != null)
            {
                if (!string.IsNullOrEmpty(oldImage))
                    _imageService.DeleteImageIfExists(oldImage);

                var imageName = await _imageService.SaveImageAsync(dto.Image);
                promotion.Image = imageName;
            }
            else
            {
                promotion.Image = oldImage;
            }

            promotion.PromotionProducts = dto.ProductIds?
                .Select(pid => new PromotionProductEntity { ProductId = pid, PromotionId = dto.Id })
                .ToList();

            await _promotionRepository.Update(promotion);
            await _promotionRepository.SaveAsync();
        }

        public async Task<List<PromotionViewDto>> GetAllPromotionsAsync()
        {
            var promotions = await _promotionRepository.GetAllWithDetailsAsync();

            var promotionDtos = promotions.Select(p => new PromotionViewDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                ImageUrl = p.Image,
                StartDate = p.StartDate,
                EndDate = p.EndDate,
                IsActive = p.IsActive,
                CategoryId = p.CategoryId,
                CategoryName = p.Category?.Name,
                DiscountTypeId = p.DiscountTypeId,
                DiscountTypeName = p.DiscountType?.Name ?? string.Empty,
                DiscountAmount = p.Amount,
                ProductIds = p.PromotionProducts?.Select(pp => pp.ProductId).ToList() ?? new List<long>()
            }).ToList();

            return promotionDtos;
        }

        public async Task<PromotionViewDto?> GetPromotionByIdAsync(long id)
        {
            var promotion = await _promotionRepository.GetByIdWithProductsAndDetailsAsync(id);
            if (promotion == null) return null;

            var dto = new PromotionViewDto
            {
                Id = promotion.Id,
                Name = promotion.Name,
                Description = promotion.Description,
                ImageUrl = promotion.Image,
                StartDate = promotion.StartDate,
                EndDate = promotion.EndDate,
                IsActive = promotion.IsActive,
                CategoryId = promotion.CategoryId,
                CategoryName = promotion.Category?.Name,
                DiscountTypeId = promotion.DiscountTypeId,
                DiscountTypeName = promotion.DiscountType?.Name ?? string.Empty,
                DiscountAmount = promotion.Amount,
                ProductIds = promotion.PromotionProducts?.Select(pp => pp.ProductId).ToList() ?? new List<long>()
            };

            return dto;
        }
    }
}
