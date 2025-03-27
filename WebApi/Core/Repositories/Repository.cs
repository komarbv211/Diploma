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

    public Repository(DbMakeUpContext context)
    {
        dbSet = context.Set<TEntity>();
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
}
