using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Interfaces;
using Infrastructure.Entities;
using Infrastructure.Data;

namespace Infrastructure.Repositories
{
    public class CategoryRepository : IRepositoryCategory
    {
        private readonly DbMakeUpContext _context;

        public CategoryRepository(DbMakeUpContext context)
        {
            _context = context;
        }

        public async Task<CategoryEntity?> GetByIdAsync(long id)
        {
            return await _context.Categories
                .Include(c => c.Parent)    
                .Include(c => c.Children)  
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<CategoryEntity>> GetAllAsync()
        {
            return await _context.Categories
                .Include(c => c.Parent)    
                .Include(c => c.Children)  
                .ToListAsync();
        }

 
        public async Task AddAsync(CategoryEntity entity)
        {
            await _context.Categories.AddAsync(entity);   
            await _context.SaveChangesAsync();            
        }

        public async Task UpdateAsync(CategoryEntity entity)
        {
            _context.Categories.Update(entity);  
            await _context.SaveChangesAsync();     
        }

        public async Task DeleteAsync(long id)
        {
            var category = await GetByIdAsync(id); 
            if (category != null)
            {
                _context.Categories.Remove(category); 
                await _context.SaveChangesAsync();     
            }
        }

        public async Task<CategoryEntity?> GetParentAsync(long categoryId)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(c => c.Id == categoryId);
            return category?.Parent; 
        }

        public async Task<IEnumerable<CategoryEntity>> GetByParentIdAsync(long parentId)
        {
            return await _context.Categories
                .Where(c => c.ParentId == parentId)  
                .Include(c => c.Parent)               
                .Include(c => c.Children)             
                .ToListAsync();
        }
    }
}

