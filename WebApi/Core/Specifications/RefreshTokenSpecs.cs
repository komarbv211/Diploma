using Ardalis.Specification;
using Infrastructure.Entities;

namespace Core.Specifications
{
    public static class RefreshTokenSpecs
    {
        public class GetByValue : Specification<RefreshToken>
        {
            public GetByValue(string token, bool tracking = false) =>
                Query.Where(x => x.Token == token)
                     .AsTracking(tracking);
        }
        public class GetExpired : Specification<RefreshToken>
        {
            public GetExpired(bool tracking = false) =>
                Query.Where(x => x.ExpirationDate < DateTime.UtcNow)
                     .AsTracking(tracking);
        }
    }
}
