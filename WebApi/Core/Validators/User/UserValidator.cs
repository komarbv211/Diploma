using Core.DTOs.UsersDTOs;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Validators.User
{
    public class UserValidator : AbstractValidator<UserCreateDTO>
    {
        public UserValidator()
        {
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

            RuleFor(user => user.Image)
                .Must(url => string.IsNullOrEmpty(url) || Uri.IsWellFormedUriString(url, UriKind.Absolute))
                .WithMessage("Image must be a valid URL.");

            RuleFor(user => user.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Email must be a valid email address.");

            RuleFor(user => user.PhoneNumber)
                .Must(phone => string.IsNullOrEmpty(phone) || new System.Text.RegularExpressions.Regex(@"^\+?\d{10,15}$").IsMatch(phone))
                .WithMessage("Phone number must be valid.");

        }
    }

}
