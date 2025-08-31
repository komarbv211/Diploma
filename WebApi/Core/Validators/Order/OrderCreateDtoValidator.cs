using Core.DTOs.OrderDTOs;
using FluentValidation;
using Infrastructure.Enums;

namespace Core.Validators.Order
{
    public class OrderCreateDtoValidator : AbstractValidator<OrderCreateDto>
    {
        public OrderCreateDtoValidator()
        {
            RuleFor(x => x.TotalPrice)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Загальна вартість замовлення не може бути від’ємною");

            RuleFor(x => x.Items)
                .NotEmpty()
                .WithMessage("Список товарів не може бути порожнім");

            RuleForEach(x => x.Items)
                .SetValidator(new OrderItemCreateDtoValidator());

            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("Ім’я обов’язкове");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Прізвище обов’язкове");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email обов’язковий")
                .EmailAddress().WithMessage("Некоректний формат email");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Телефон обов’язковий");

            RuleFor(x => x.City)
                .NotEmpty().WithMessage("Місто обов’язкове");

            When(x => x.DeliveryType == DeliveryType.Courier, () =>
            {
                RuleFor(x => x.Street)
                    .NotEmpty()
                    .WithMessage("Вулиця обов'язкова для кур'єрської доставки");

                RuleFor(x => x.House)
                    .NotEmpty()
                    .WithMessage("Будинок обов'язковий для кур'єрської доставки");
            });

            When(x => x.DeliveryType == DeliveryType.NovaPoshta, () =>
            {
                RuleFor(x => x.WarehouseId)
                    .NotNull()
                    .WithMessage("Не вибрано відділення для доставки");
            });
        }
    }
}
