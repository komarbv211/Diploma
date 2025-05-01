using Ardalis.Specification;
using Infrastructure.Entities;

namespace Core.Specifications
{
    internal static class UserSpecs
    {       
        // Специфікація для фільтрації користувачів за датою реєстрації
        internal class ByRegistrationDate : Specification<UserEntity>
        {
            public ByRegistrationDate(DateTime startDate, DateTime endDate)
            {
                Query
                    .Where(x => x.CreatedDate >= startDate && x.CreatedDate <= endDate);
            }
        }
        internal class ByEmailSpec : Specification<UserEntity>
        {
            public ByEmailSpec(string email)
            {
                Query.Where(u => u.Email == email);
            }
        }
    }
}