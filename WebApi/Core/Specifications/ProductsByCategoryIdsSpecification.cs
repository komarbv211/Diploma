using Ardalis.Specification;

public class ProductsByCategorySpecification : Specification<ProductEntity>
{
    public ProductsByCategorySpecification(IEnumerable<long> categoryIds)
    {
        Query
            .Where(p => categoryIds.Contains(p.CategoryId))
            .Include(p => p.Images)
            .Include(p => p.Ratings)
            .Include(p => p.Brand)
            .Include(p => p.Category) // 🟢 Підтягуємо категорію
            .AsNoTracking();
    }

    public ProductsByCategorySpecification(long categoryId)
    {
        Query
            .Where(p => p.CategoryId == categoryId)
            .Include(p => p.Images)
            .Include(p => p.Ratings)
            .Include(p => p.Brand)
            .Include(p => p.Category) // 🟢 Так само тут
            .AsNoTracking();
    }
}
