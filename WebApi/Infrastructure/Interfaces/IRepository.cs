using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Interfaces
{
    public interface IRepository<T, TKey> where T : class
    {
        Task<T?> GetByIdAsync(TKey id);          // Отримати сутність за ID
        Task<IEnumerable<T>> GetAllAsync();      // Отримати всі сутності
        Task AddAsync(T entity);                 // Додати нову сутність
        Task UpdateAsync(T entity);              // Оновити сутність
        Task DeleteAsync(TKey id);               // Видалити сутність
    }
}
