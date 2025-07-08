using AutoMapper;
using Core.DTOs.PromotionDTOs;
using Core.Interfaces;
using Infrastructure.Entities;

namespace Core.Services
{
    public class PromotionService : IPromotionService
    {
        private readonly IPromotionRepository _promotionRepository;
        private readonly IMapper _mapper;
        private readonly IImageService _imageService;

        public PromotionService(IPromotionRepository promotionRepository, IMapper mapper, IImageService imageService)
        {
            _promotionRepository = promotionRepository;
            _mapper = mapper;
            _imageService = imageService;
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
