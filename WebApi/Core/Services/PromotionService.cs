using AutoMapper;
using Core.DTOs.PromotionDTOs;
using Core.Interfaces;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

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

            // Оновлення зв'язку з продуктами
            promotion.PromotionProducts = dto.ProductIds?
                .Select(pid => new PromotionProductEntity { ProductId = pid, PromotionId = dto.Id })
                .ToList();

            await _promotionRepository.Update(promotion);
            await _promotionRepository.SaveAsync();
        }
    }
}
