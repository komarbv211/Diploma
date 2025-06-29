using Core.DTOs.ProductDTOs;
using FluentValidation;

namespace Core.Validators.Products
{
    public class ProductImageDtoValidator : AbstractValidator<ProductImageDto>
    {
        public ProductImageDtoValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Потрібно вказати назву зображення.")
                .MaximumLength(255).WithMessage("Назва зображення не повинна перевищувати 255 символів.");

            RuleFor(p => p.Priority)
                .GreaterThanOrEqualTo((short)0).WithMessage("Пріоритет має бути нульовим або додатним числом.");

            RuleFor(p => p.ProductId)
                .GreaterThan(0).WithMessage("ProductId має бути дійсним посиланням на продукт.");
        }
    }
}
