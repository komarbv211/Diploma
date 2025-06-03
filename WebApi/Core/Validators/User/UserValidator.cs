using Core.DTOs.UsersDTOs;
using FluentValidation;

namespace Core.Validators.User
{
    public class UserValidator : AbstractValidator<UserCreateDTO>
    {
             //private readonly DbMakeUpContext _dbContext;
        public UserValidator()
        {

            //_dbContext = dbContext;

            //RuleFor(user => user.Email)
            //    .NotEmpty().WithMessage("Email is required.")
            //    .EmailAddress().WithMessage("Email must be a valid email address.")
            //    .Must(email => !_dbContext.Users.Any(u => u.Email == email))
            //    .WithMessage("Email must be unique.");



        RuleFor(user => user.FirstName)
                .NotEmpty().WithMessage("First name is required.")
                .MinimumLength(2)
                .MaximumLength(50).WithMessage("First name cannot exceed 50 characters.")
               .Matches("[A-Z].*").WithMessage("{PropertyName} must starts with uppercase letter.");

            RuleFor(user => user.LastName)
                .NotEmpty().WithMessage("Last name is required.")
                .MinimumLength(2)
                .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters.")
               .Matches("[A-Z].*").WithMessage("{PropertyName} must starts with uppercase letter.");

            RuleFor(user => user.Image);
                //.Must(url => string.IsNullOrEmpty(url) || Uri.IsWellFormedUriString(url, UriKind.Absolute))
                //.WithMessage("Image must be a valid URL.");

            //RuleFor(user => user.Email)
            //    .NotEmpty().WithMessage("Email is required.")
            //    .EmailAddress().WithMessage("Email must be a valid email address.");

            //RuleFor(user => user.Email)
            //.NotEmpty().WithMessage("Email is required.")
            //.EmailAddress().WithMessage("Email must be a valid email address.")
            //.MustAsync(async (email, cancellation) =>
            //    !await userRepository.ExistsByEmailAsync(email))
            //.WithMessage("Email must be unique.");


            RuleFor(user => user.PhoneNumber)
                .Must(phone => string.IsNullOrEmpty(phone) ||
    new System.Text.RegularExpressions.Regex(@"^\+380\d{9,15}$").IsMatch(phone))
                //.Must(phone => string.IsNullOrEmpty(phone) || new System.Text.RegularExpressions.Regex(@"^\+?\d{10,15}$").IsMatch(phone))
                .WithMessage("Phone number must be valid.");

            RuleFor(user => user.Password)
                .NotEmpty()
                .WithMessage("Пароль обов'язковий!")
                .MinimumLength(6)
                .WithMessage("Пароль має містити не менше 6 символів!")
                .Matches("[A-Z]")
                .WithMessage("Пароль має містити хоча б одну велику літеру!")
                .Matches("[a-z]")
                .WithMessage("Пароль має містити хоча б одну малу літеру!")
                .Matches("[0-9]")
                .WithMessage("Пароль має містити хоча б одну цифру!");

            RuleFor(user => user.ConfirmPassword)
                .NotEmpty()
                .WithMessage("Підтвердження пароля обов'язкове!")
                .Equal(user => user.Password)
                .WithMessage("Паролі не збігаються!");


        }
    }

}
