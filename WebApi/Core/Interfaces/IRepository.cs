using Ardalis.Specification;

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
        void DeleteRange(IEnumerable<TEntity> entities);
        Task<TEntity?> GetItemBySpec(ISpecification<TEntity> specification);
        Task Insert(TEntity entity);//
        Task Update(TEntity entity);//
        Task<TEntity?> GetByID(object id);//
        Task<TEntity?> FirstOrDefaultAsync(ISpecification<TEntity> specification);
        Task AddRangeAsync(IEnumerable<TEntity> entities);

        //Task<bool> ExistsByEmailAsync(string email);
            //Task<TEntity> GetByIdAsync(int id);


    }
}
