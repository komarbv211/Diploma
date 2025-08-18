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

            RuleFor(x => x)
            .Custom((order, context) =>
            {
                if ((order.DeliveryType == DeliveryType.NovaPoshta || order.DeliveryType == DeliveryType.Pickup)
                    && !order.WarehouseId.HasValue)
                {
                    context.AddFailure("WarehouseId", "Не вибрано відділення для доставки або самовивозу");
                }

                if (order.DeliveryType == DeliveryType.Courier && string.IsNullOrWhiteSpace(order.DeliveryAddress))
                {
                    context.AddFailure("DeliveryAddress", "Для кур’єрської доставки необхідно вказати адресу");
                }
            });

        }
    }
}
