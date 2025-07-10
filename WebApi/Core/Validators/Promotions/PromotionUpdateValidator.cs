using Core.DTOs.PromotionDTOs;
using FluentValidation;

namespace Core.Validators.Promotions;
public class PromotionUpdateValidator : AbstractValidator<PromotionUpdateDto>
{
    public PromotionUpdateValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва обов'язкова.")
            .MaximumLength(255);

        RuleFor(x => x.StartDate)
            .LessThan(x => x.EndDate)
            .WithMessage("Дата початку має бути раніше за дату завершення.");

        RuleFor(x => x.DiscountTypeId)
            .GreaterThan(0).WithMessage("Оберіть тип знижки.");


    }
}