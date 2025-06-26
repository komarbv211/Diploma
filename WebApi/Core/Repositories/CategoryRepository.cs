using Core.DTOs.CategoryDTOs;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class CategoryRepository : Repository<CategoryEntity>, ICategoryRepository
{
    public CategoryRepository(DbMakeUpContext context)
        : base(context)
    {
    }

    public override void Delete(object id)
    {
        var entity = dbSet
            .Include(c => c.Children)
            .FirstOrDefault(c => c.Id == (long)id);

        if (entity != null)
        {
            DeleteCategoryWithChildren(entity);
        }
    }

    private void DeleteCategoryWithChildren(CategoryEntity category)
    {
        // Рекурсивно видаляємо всіх дітей
        foreach (var child in category.Children.ToList())
        {
            DeleteCategoryWithChildren(child);
        }

        // Видаляємо поточну категорію
        if (context.Entry(category).State == EntityState.Detached)
        {
            dbSet.Attach(category);
        }
        dbSet.Remove(category);
    }


    public override async Task DeleteAsync(object id)
    {
        var entity = await dbSet
            .Include(c => c.Children)
            .FirstOrDefaultAsync(c => c.Id == (long)id);

        if (entity != null)
        {
            Delete(entity);
        }
    }

    public override void Delete(CategoryEntity entityToDelete)
    {
        if (entityToDelete.Children != null && entityToDelete.Children.Any())
        {
            foreach (var child in entityToDelete.Children.ToList())
            {
                Delete(child);
            }
        }

        if (context.Entry(entityToDelete).State == EntityState.Detached)
        {
            dbSet.Attach(entityToDelete);
        }

        dbSet.Remove(entityToDelete);
    }

    public async Task<CategoryEntity?> GetBySlugAsync(string slug)
    {
        return await dbSet.FirstOrDefaultAsync(c => c.UrlSlug == slug);
    }

    public async Task<IEnumerable<CategoryEntity>> GetChildrenAsync(long parentId)
    {
        return await dbSet
            .Where(c => c.ParentId == parentId)
            .ToListAsync();
    }

    public async Task<CategoryEntity?> GetCategoryWithChildrenAsync(long id)
    {
        return await dbSet
            .Include(c => c.Children)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<CategoryEntity?> GetParentCategoryAsync(long categoryId)
    {
        var category = await dbSet
            .Include(c => c.Parent)
            .FirstOrDefaultAsync(c => c.Id == categoryId);

        return category?.Parent;
    }

    public async Task<IEnumerable<CategoryEntity>> GetRootCategoriesAsync()
    {
        return await dbSet
            .Where(c => c.ParentId == null)
            .ToListAsync();
    }

    public async Task<bool> ExistsByNameAsync(string name)
    {
        return await context.Categories.AnyAsync(c => c.Name == name);
    }

    public async Task<IEnumerable<CategoryNameDto>> GetCategoriesNamesAsync()
    {
        return await dbSet
            .Select(c => new CategoryNameDto
            {
                Id = c.Id,
                Name = c.Name
            })
            .ToListAsync();
    }

    //public async Task<CategoryEntity?> GetByIdAsync(long id)
    //{
    //    return await context.Users.FirstOrDefaultAsync(u => u.Id == id);
    //}
}
