using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators.Category
{
    public class CategoryValidator : AbstractValidator<CategoryCreateDto>
{

    private readonly ICategoryRepository categoryRepository;

    public CategoryValidator(ICategoryRepository category_Repository)
    {
        categoryRepository = category_Repository;

        RuleFor(x => x.Name)
        .NotEmpty()
        .MinimumLength(2)
        .Matches("[A-Z].*").WithMessage("{PropertyName} must start with an uppercase letter.")
        .MustAsync(async (name, cancellation) => 
            !await categoryRepository.ExistsByNameAsync(name))
        .WithMessage("{PropertyName} must be unique.");


        RuleFor(category => category.Image)
           .Must(url => string.IsNullOrEmpty(url) || Uri.IsWellFormedUriString(url, UriKind.Absolute))
           .WithMessage("Image must be a valid URL.");

        RuleFor(x => x.Description)
              .NotEmpty()
              .MinimumLength(2)
              .Matches("[A-Z].*").WithMessage("{PropertyDescription} must starts with uppercase letter.");

    }

}
}
