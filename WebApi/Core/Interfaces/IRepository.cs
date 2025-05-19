using Ardalis.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        //Task<List<TEntity>> GetAllAsync();
        Task<IEnumerable<TEntity>> GetAllAsync();
        IQueryable<TEntity> GetAllQueryable();
        Task<bool> AnyAsync();
       // Task<bool> AnyAsync(Expression<Func<TEntity, bool>> exp);
        Task AddAsync(TEntity entity);
        Task SaveAsync();
        void Delete(object id);
        Task DeleteAsync(object id);
        Task<TEntity?> GetItemBySpec(ISpecification<TEntity> specification);
        Task Insert(TEntity entity);//
        Task Update(TEntity entity);//
        Task<TEntity?> GetByID(object id);//
        Task<TEntity?> FirstOrDefaultAsync(ISpecification<TEntity> specification);
        Task AddRangeAsync(IEnumerable<TEntity> entities);
    }
}
