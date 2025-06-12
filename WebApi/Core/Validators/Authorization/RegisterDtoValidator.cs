using Core.DTOs.AuthorizationDTOs;
using FluentValidation;

namespace Core.Validators.Authorization
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MaximumLength(255)
                .Matches("^[A-Z]").WithMessage("Ім'я має починатись з великої літери.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MaximumLength(255)
                .Matches("^[A-Z]").WithMessage("Прізвище має починатись з великої літери.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Невірна електронна пошта.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6)
                .Matches("[A-Z]").WithMessage("Пароль повинен містити хоча б одну велику літеру.")
                .Matches("[a-z]").WithMessage("Пароль повинен містити хоча б одну малу літеру.")
                .Matches("[0-9]").WithMessage("Пароль повинен містити принаймні одну цифру.");

            RuleFor(x => x.Image)
                .Must(uri => string.IsNullOrEmpty(uri) || Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                .WithMessage("Зображення має бути дійсною URL-адресою.");
        }
    }
}
