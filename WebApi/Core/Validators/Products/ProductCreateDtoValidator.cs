using Core.DTOs.ProductsDTO;
using FluentValidation;

namespace Core.Validators.Products
{
    public class ProductCreateDtoValidator : AbstractValidator<ProductCreateDto>
    {
        public ProductCreateDtoValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Назва продукту обов'язкова.");

            RuleFor(p => p.Price)
                .GreaterThan(0).WithMessage("Ціна має бути більшою за нуль.");

            RuleFor(p => p.CategoryId)
                .GreaterThan(0).WithMessage("Категорія обов'язкова.");

            RuleFor(p => p.image)
                .Must(images => images == null || images.Count <= 20)
                .WithMessage("Можна завантажити максимум 15 фото.");

            RuleForEach(p => p.image)
                .Must(file => file.Length <= 10 * 1024 * 1024) // 10 МБ
                .WithMessage("Розмір кожного зображення має бути менше або дорівнювати 10 МБ.")
                .When(p => p.image != null);
        }
    }
}
