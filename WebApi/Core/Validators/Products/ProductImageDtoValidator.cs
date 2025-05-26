using Core.DTOs.ProductDTOs;
using FluentValidation;

namespace Core.Validators.Products
{
    public class ProductImageDtoValidator : AbstractValidator<ProductImageDto>
    {
        public ProductImageDtoValidator()
        {
            RuleFor(p => p.Name)
                .NotEmpty().WithMessage("Image name is required.")
                .MaximumLength(255).WithMessage("Image name must not exceed 255 characters.");

            RuleFor(p => p.Priority)
                .GreaterThanOrEqualTo((short)0).WithMessage("Priority must be zero or a positive number.");

            RuleFor(p => p.ProductId)
                .GreaterThan(0).WithMessage("ProductId must be a valid product reference.");
        }
    }
}
