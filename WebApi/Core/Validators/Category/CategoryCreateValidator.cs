using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using FluentValidation;

namespace Core.Validators.Category;

public class CategoryCreateValidator : AbstractValidator<CategoryCreateDto>
{

    private readonly ICategoryRepository categoryRepository;

    public CategoryCreateValidator(ICategoryRepository category_Repository)
    {
        categoryRepository = category_Repository;

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Назва обов'язкова.")
            .MinimumLength(2).WithMessage("Назва має містити щонайменше 2 символи.")
            .Matches("^[А-ЯA-Z]").WithMessage("Назва має починатися з великої літери.")
            .MustAsync(async (name, cancellation) => 
                !await categoryRepository.ExistsByNameAsync(name))
            .WithMessage("Назва має бути унікальною.");

        RuleFor(x => x.Description)
            .MinimumLength(2).When(x => !string.IsNullOrWhiteSpace(x.Description))
            .WithMessage("Опис має містити щонайменше 2 символи.")
            .Matches("^[А-ЯA-Z]").When(x => !string.IsNullOrWhiteSpace(x.Description))
            .WithMessage("Опис має починатися з великої літери.");

        RuleFor(category => category.Image)
            .Must(file => file == null || file.Length <= 2 * 1024 * 1024)
            .WithMessage("Розмір зображення не повинен перевищувати 2 МБ.");

    }

}

