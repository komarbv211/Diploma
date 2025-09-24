using Core.DTOs.BrandsDTOs;
using Core.Interfaces;
using FluentValidation;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Validators.Brands;

public class BrandCreateValidator : AbstractValidator<BrandCreateDto>
{
    private readonly IRepository<BrandEntity> _brandRepository;

    public BrandCreateValidator(IRepository<BrandEntity> brandRepository)
    {
        _brandRepository = brandRepository;

        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Назва бренду обов'язкова.")
            .MinimumLength(2).WithMessage("Назва бренду має містити щонайменше 2 символи.")
            .Matches("^[А-ЯA-Z]").WithMessage("Назва бренду має починатися з великої літери.")
            .MustAsync(async (name, cancellation) =>
                !await _brandRepository
                    .GetAllQueryable()
                    .AnyAsync(b => b.Name.ToLower() == name.ToLower(), cancellation))
            .WithMessage("Назва бренду має бути унікальною.");
    }
}
