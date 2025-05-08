using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models.TermStore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories;

public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
{
    protected readonly DbSet<TEntity> dbSet;
    protected readonly DbMakeUpContext context;

    public Repository(DbMakeUpContext context)
    {
        dbSet = context.Set<TEntity>();
        this.context = context; 
    }


    // Отримання всіх елементів без умов
    public async Task<IEnumerable<TEntity>> GetAllAsync()
    {
        return await dbSet.ToListAsync();
    }

    //public async Task<List<TEntity>> GetAllAsync()
    //{
    //    return await dbSet.ToListAsync();
    //}

    public IQueryable<TEntity> GetAllQueryable()
    {
        return dbSet.AsQueryable();
    }

    public async virtual Task<bool> AnyAsync() => await dbSet.AnyAsync();
  // public virtual async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> exp) => await dbSet.AnyAsync(exp);

    public async virtual Task AddAsync(TEntity entity) => await dbSet.AddAsync(entity);

    public async Task SaveAsync() => await context.SaveChangesAsync();//



    public virtual void Delete(object id)
    {
        TEntity? entityToDelete = dbSet.Find(id);
        if (entityToDelete != null)
        {
            Delete(entityToDelete);
        }
    }

    public async virtual Task DeleteAsync(object id)
    {
        TEntity? entityToDelete = await dbSet.FindAsync(id);
        if (entityToDelete != null)
        {
            Delete(entityToDelete);
        }
    }
    public virtual void Delete(TEntity entityToDelete)
    {
        if (context.Entry(entityToDelete).State == EntityState.Detached)
        {
            dbSet.Attach(entityToDelete);
        }
        dbSet.Remove(entityToDelete);
    }
    public async Task<TEntity?> GetItemBySpec(ISpecification<TEntity> specification) =>
           await ApplySpecification(specification).FirstOrDefaultAsync();
    private IQueryable<TEntity> ApplySpecification(ISpecification<TEntity> specification)
    {
        var evaluator = new SpecificationEvaluator();
        return evaluator.GetQuery(dbSet, specification);
    }

    // Вставка нової сутності
    public async Task Insert(TEntity entity)
    {
        await dbSet.AddAsync(entity);
    }
    // Отримання сутності за ID
    public async Task<TEntity?> GetByID(object id)
    {
        return await dbSet.FindAsync(id);
    }

    public Task Update(TEntity entityToUpdate)
    {
        return Task.Run(() =>
        {
            dbSet.Attach(entityToUpdate);
            context.Entry(entityToUpdate).State = EntityState.Modified;
        });
    }


    //метод в асинхронному режимі додає колекцію entities до dbSet, який представляє набір об'єктів в Entity Framework.
    public async virtual Task AddRangeAsync(IEnumerable<TEntity> entities) => await dbSet.AddRangeAsync(entities);

}
