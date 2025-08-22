using Core.DTOs.CommentDTOs;
using FluentValidation;

namespace Core.Validators.Comments
{
    public class CommentCreateDtoValidator : AbstractValidator<CommentCreateDto>
    {
        public CommentCreateDtoValidator()
        {
            RuleFor(c => c.ProductId)
                .GreaterThan(0).WithMessage("Продукт обов'язковий.");

            RuleFor(c => c.UserId)
                .GreaterThan(0).WithMessage("Користувач обов'язковий.");

            RuleFor(c => c.Text)
                .NotEmpty().WithMessage("Текст коментаря не може бути порожнім.")
                .MaximumLength(1000).WithMessage("Текст коментаря не може перевищувати 1000 символів.");
        }
    }
}
