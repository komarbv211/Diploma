using Core.DTOs.ProductsDTO;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators.Products
{
    public class ProductEditDtoValidator : AbstractValidator<ProductUpdateDto>
    {

        public ProductEditDtoValidator() {

            RuleFor(p => p.Name)
            .NotEmpty().WithMessage("Product name is required.");

            RuleFor(p => p.Price)
                    .GreaterThan(0).WithMessage("Price must be greater than zero.");

            RuleFor(p => p.CategoryId)
                    .GreaterThan(0).WithMessage("Category is required.");

            RuleForEach(p => p.image)
                    .Must(file => file.Length < 5 * 1024 * 1024) // max 5 MB
                    .WithMessage("Each image must be less than 5MB.")
                    .When(p => p.image != null);
        }
    }
}
