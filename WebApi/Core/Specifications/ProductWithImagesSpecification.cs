using Ardalis.Specification;
using Infrastructure.Entities;

namespace Core.Specifications;

public class ProductWithImagesSpecification : Specification<ProductEntity>
{
    public ProductWithImagesSpecification()
    {
        Query.Include(p => p.Images);
    }

    public ProductWithImagesSpecification(long productId)
    {
        Query.Where(p => p.Id == productId)
             .Include(p => p.Images)
             .Include(p => p.Comments);
    }
}
