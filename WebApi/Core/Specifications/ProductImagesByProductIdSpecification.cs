using Ardalis.Specification;
using Infrastructure.Entities;

public class ProductImagesByProductIdSpecification : Specification<ProductImageEntity>
{
    public ProductImagesByProductIdSpecification(long productId)
    {
        Query
            .Where(img => img.ProductId == productId)
            .OrderBy(img => img.Priority);
    }
}
