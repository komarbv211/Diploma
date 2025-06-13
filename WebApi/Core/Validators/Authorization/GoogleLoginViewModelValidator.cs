using Core.Models.Authentication;
using FluentValidation;

namespace Core.Validators.Authorization
{
    public class GoogleLoginViewModelValidator : AbstractValidator<GoogleLoginViewModel>
    {
        public GoogleLoginViewModelValidator()
        {
            RuleFor(x => x.GoogleAccessToken)
                .NotEmpty().WithMessage("Google Access Token обов'язковий.")
                .MinimumLength(10).WithMessage("Google Access Token виглядає надто коротким.");
        }
    }
}
