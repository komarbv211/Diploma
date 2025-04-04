using Core.Interfaces;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Graph.Models.TermStore;
using System;
using System.Collections.Generic;
using System.Linq;
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

    public async Task<List<TEntity>> GetAllAsync()
    {
        return await dbSet.ToListAsync();
    }

    public IQueryable<TEntity> GetAllQueryable()
    {
        return dbSet.AsQueryable();
    }

    public async virtual Task<bool> AnyAsync() => await dbSet.AnyAsync();


    public async virtual Task AddAsync(TEntity entity) => await dbSet.AddAsync(entity);

    public async Task SaveAsync() => await context.SaveChangesAsync();

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
}
