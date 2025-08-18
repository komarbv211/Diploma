using Core.DTOs.OrderDTOs;
using FluentValidation;

namespace Core.Validators.Order
{
    public class OrderItemCreateDtoValidator : AbstractValidator<OrderItemCreateDto>
    {
        public OrderItemCreateDtoValidator()
        {
            RuleFor(x => x.ProductId).GreaterThan(0);
            RuleFor(x => x.ProductName)
              .NotEmpty()
              .WithMessage("Назва продукту не може бути порожньою");

            RuleFor(x => x.Quantity)
                .GreaterThan(0)
                .WithMessage("Кількість продукту має бути більшою за 0");

            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Ціна продукту не може бути від’ємною");
        }
    }
}
