using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using FluentValidation;

namespace Core.Validators.Category
{
    public class CategoryCreateValidator : AbstractValidator<CategoryCreateDto>
{

    private readonly ICategoryRepository categoryRepository;

    public CategoryCreateValidator(ICategoryRepository category_Repository)
    {
        categoryRepository = category_Repository;

        RuleFor(x => x.Name)
        .NotEmpty()
        .MinimumLength(2)
        .Matches("[A-Z].*").WithMessage("{PropertyName} must start with an uppercase letter.")
        .MustAsync(async (name, cancellation) => 
            !await categoryRepository.ExistsByNameAsync(name))
        .WithMessage("{PropertyName} must be unique.");


        RuleFor(category => category.Image);
           

        RuleFor(x => x.Description)
              .NotEmpty()
              .MinimumLength(2)
              .Matches("[A-Z].*").WithMessage("{PropertyDescription} must starts with uppercase letter.");

    }

}
}
