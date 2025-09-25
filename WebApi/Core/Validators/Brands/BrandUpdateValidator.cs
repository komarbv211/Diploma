using Core.DTOs.BrandsDTOs;
using FluentValidation;
using Infrastructure.Entities;
using Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Core.Validators.Brands;

public class BrandUpdateValidator : AbstractValidator<BrandUpdateDto>
{
    private readonly IRepository<BrandEntity> _brandRepository;

    public BrandUpdateValidator(IRepository<BrandEntity> brandRepository)
    {
        _brandRepository = brandRepository;

        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Id бренду має бути більшим за 0.");

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Назва бренду обов'язкова.")
            .MinimumLength(2)
            .WithMessage("Назва бренду має містити щонайменше 2 символи.")
            .Matches("^[А-ЯA-Z]")
            .WithMessage("Назва бренду має починатися з великої літери.")
            .MustAsync(async (dto, name, cancellation) =>
                !await _brandRepository
                    .GetAllQueryable()
                    .AnyAsync(b => b.Name.ToLower() == name.ToLower() && b.Id != dto.Id, cancellation)
            )
            .WithMessage("Назва бренду має бути унікальною.");
    }
}
