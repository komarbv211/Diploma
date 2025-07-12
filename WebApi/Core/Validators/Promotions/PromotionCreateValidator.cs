using Core.DTOs.PromotionDTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators.Promotions
{
    public class PromotionCreateValidator : AbstractValidator<PromotionCreateDto>
    {
        public PromotionCreateValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Назва обов'язкова.")
                .MaximumLength(255);

            RuleFor(x => x.Description)
                .MaximumLength(4000);

            RuleFor(x => x.Image)
                .NotNull().WithMessage("Зображення обов'язкове.");

            RuleFor(x => x.StartDate)
                .NotEmpty().WithMessage("Дата початку обов'язкова.")
                .LessThan(x => x.EndDate)
                .WithMessage("Дата початку має бути раніше за дату завершення.");

            RuleFor(x => x.EndDate)
                .NotEmpty().WithMessage("Дата завершення обов'язкова.");

            RuleFor(x => x.DiscountTypeId)
                .GreaterThan(0).WithMessage("Оберіть тип знижки.");

            RuleFor(x => x)
                .Must(x => x.CategoryId.HasValue || (x.ProductIds != null && x.ProductIds.Any()))
                .WithMessage("Потрібно вибрати або категорію, або хоча б один продукт.");
        }
    }
}
