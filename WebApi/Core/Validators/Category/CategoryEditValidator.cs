using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using FluentValidation;

namespace Core.Validators.Category
{
    public class CategoryEditValidator : AbstractValidator<CategoryUpdateDto>
    {
        private readonly ICategoryRepository categoryRepository;

        public CategoryEditValidator(ICategoryRepository category_Repository)
        {
            categoryRepository = category_Repository;

            RuleFor(x => x.Name)
                .NotEmpty()
                .MinimumLength(2)
                .Matches("^[A-Z]").WithMessage("{PropertyName} must start with an uppercase letter.")
                .MustAsync(async (dto, name, cancellation) =>
                    !await categoryRepository.ExistsByNameExceptIdAsync(name, dto.Id))
                .WithMessage("{PropertyName} must be unique.");

            RuleFor(x => x.Description)
                .NotEmpty()
                .MinimumLength(2)
                .Matches("^[A-Z]").WithMessage("{PropertyName} must start with an uppercase letter.");
        }
    }
}
