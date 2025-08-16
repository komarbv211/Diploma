using Core.DTOs.OrderDTOs;
using FluentValidation;

namespace Core.Validators.Order
{
    public class OrderUpdateDtoValidator : AbstractValidator<OrderUpdateDto>
    {
        public OrderUpdateDtoValidator()
        {
            Include(new OrderCreateDtoValidator());
            RuleFor(x => x.Status)
                .IsInEnum()
                .WithMessage("Статус замовлення містить недопустиме значення");
        }
    }
}
