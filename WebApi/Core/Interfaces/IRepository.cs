﻿using Ardalis.Specification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<List<TEntity>> GetAllAsync();
        IQueryable<TEntity> GetAllQueryable();
        Task<bool> AnyAsync();
        Task AddAsync(TEntity entity);
        Task SaveAsync();
        void Delete(object id);
        Task DeleteAsync(object id);
        Task<TEntity?> GetItemBySpec(ISpecification<TEntity> specification);
    }
}
