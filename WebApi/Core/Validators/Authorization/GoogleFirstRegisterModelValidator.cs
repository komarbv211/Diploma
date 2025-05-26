using Core.Models.Authentication;
using FluentValidation;

namespace Core.Validators.Authorization
{
    public class GoogleFirstRegisterModelValidator : AbstractValidator<GoogleFirstRegisterModel>
    {
        public GoogleFirstRegisterModelValidator()
        {
            RuleFor(x => x.GoogleAccessToken)
                .NotEmpty().WithMessage("Google access token is required.");

            RuleFor(x => x.FirstName)
                .MaximumLength(255).WithMessage("First name cannot exceed 255 characters.");

            RuleFor(x => x.LastName)
                .MaximumLength(255).WithMessage("Last name cannot exceed 255 characters.");

            RuleFor(x => x.PhoneNumber)
                .Matches(@"^\+?[0-9]{7,15}$")
                .When(x => !string.IsNullOrWhiteSpace(x.PhoneNumber))
                .WithMessage("Invalid phone number format.");

            RuleFor(x => x.Image)
                .Must(file => file.Length < 5 * 1024 * 1024) // max 5 MB
                .WithMessage("Each image must be less than 5MB.")
                .When(x => x.Image != null);
        }
    }
}
