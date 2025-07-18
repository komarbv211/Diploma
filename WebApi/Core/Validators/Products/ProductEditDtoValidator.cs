﻿using Core.DTOs.ProductsDTO;
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
            .NotEmpty().WithMessage("Назва продукту обов'язкова.");

            RuleFor(p => p.Price)
                    .GreaterThan(0).WithMessage("Ціна має бути більшою за нуль.");

            RuleFor(p => p.CategoryId)
                    .GreaterThan(0).WithMessage("Категорія обов'язкова.");

            RuleForEach(p => p.image)
                    .Must(file => file.Length < 5 * 1024 * 1024) 
                    .WithMessage("Розмір кожного зображення має бути менше 5 МБ.")
                    .When(p => p.image != null);
        }
    }
}
