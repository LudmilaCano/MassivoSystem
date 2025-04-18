using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Infraestructure.Data
{
    public abstract class RepositoryBase<T> : IRepositoryBase<T> where T : class
    {

        protected readonly DbContext _dbContext;
        // Se cambio de private a protected para permitir el acceso controlado desde UserRepository
        // mientras se mantiene el encapsulamiento. Esto permite:
        // - Acceder al DbContext en clases derivadas para operaciones específicas
        // - Mantener la gestión centralizada del contexto en la clase base
        // - Implementar el principio de herencia sin exponer el campo públicamente
        public RepositoryBase(DbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public virtual async Task<List<T>> ListAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public virtual async Task<T?> GetByIdAsync<TId>(TId id)
        {
            return await _dbContext.Set<T>().FindAsync(new object[] { id });
        }
        public virtual async Task<T> AddAsync(T entity)
        {
            _dbContext.Set<T>().Add(entity);
            await SaveChangesAsync();
            return entity;
        }
        public virtual async Task UpdateAsync(T entity)
        {
            _dbContext.Set<T>().Update(entity);
            await SaveChangesAsync();
        }
        public virtual async Task DeleteAsync(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
            await SaveChangesAsync();
        }
        public virtual async Task<int> SaveChangesAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
