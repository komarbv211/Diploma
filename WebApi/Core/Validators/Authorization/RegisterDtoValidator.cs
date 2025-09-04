using Core.DTOs.AuthorizationDTOs;
using FluentValidation;

namespace Core.Validators.Authorization
{
    public class RegisterDtoValidator : AbstractValidator<RegisterDto>
    {
        public RegisterDtoValidator()
        {
            //RuleFor(x => x.FirstName)
            //    .NotEmpty().WithMessage("First name is required.")
            //    .MaximumLength(255)
            //    .Matches("^[A-Z]").WithMessage("Ім'я має починатись з великої літери.");

            //RuleFor(x => x.FirstName)
            //    .NotEmpty().WithMessage("Ім'я є обов'язковим.")
            //    .MaximumLength(255).WithMessage("Ім'я не може перевищувати 255 символів.")
            //    .Matches(@"^[А-ЯІЇЄҐ][а-яіїєґ']+$").WithMessage("Ім'я має бути українською мовою і починатися з великої літери.");

            RuleFor(x => x.FirstName)
                  .NotEmpty().WithMessage("Ім'я є обов'язковим.")
                  .MaximumLength(255).WithMessage("Ім'я не може перевищувати 255 символів.")
                  .Matches(@"^([А-ЯІЇЄҐ][а-яіїєґ']+|[A-Z][a-z]+)$")
                  .WithMessage("Ім'я має бути українською або англійською мовою і починатися з великої літери.");


            //RuleFor(x => x.LastName)
            //    .NotEmpty().WithMessage("Last name is required.")
            //    .MaximumLength(255)
            //    .Matches("^[A-Z]").WithMessage("Прізвище має починатись з великої літери.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Прізвище є обов'язковим.")
                .MaximumLength(255).WithMessage("Прізвище не може перевищувати 255 символів.")
                .Matches(@"^([А-ЯІЇЄҐ][а-яіїєґ']+|[A-Z][a-z]+)$")
                .WithMessage("Прізвище має бути українською мовою і починатися з великої літери.");


            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Необхідно вказати адресу електронної пошти.")
                .EmailAddress().WithMessage("Невірна електронна пошта.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Необхідно ввести пароль.")
                .MinimumLength(6)
                .Matches("[A-Z]").WithMessage("Пароль повинен містити хоча б одну велику літеру.")
                .Matches("[a-z]").WithMessage("Пароль повинен містити хоча б одну малу літеру.")
                .Matches("[0-9]").WithMessage("Пароль повинен містити принаймні одну цифру.");

            RuleFor(x => x.Image)
                .Must(uri => string.IsNullOrEmpty(uri) || Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                .WithMessage("Зображення має бути дійсною URL-адресою.");
            RuleFor(x => x.RecaptchaToken)
                .NotEmpty().WithMessage("Будь ласка, підтвердіть, що ви не робот (reCAPTCHA).");

        }
    }
}
