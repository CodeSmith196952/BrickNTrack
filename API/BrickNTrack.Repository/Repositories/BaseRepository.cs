using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using BrickNTrack.Repository.Interface;
using Microsoft.EntityFrameworkCore;

namespace BrickNTrack.Repository.Repositories
{
    public class BaseRepository<TEntity> : IBaseRepository<TEntity> where TEntity : CommonEntity
    {
        protected readonly BrickNTrackContext _context;
        protected readonly DbSet<TEntity> _dbSet;

        public BaseRepository(BrickNTrackContext context)
        {
            _context = context;
            _dbSet = context.Set<TEntity>();
        }

        /// <summary>
        /// Returns active-only records (global query filter applied automatically).
        /// </summary>
        public IQueryable<TEntity> Query()
        {
            return _dbSet.AsQueryable();
        }

        /// <summary>
        /// Returns all records including soft-deleted ones.
        /// </summary>
        public IQueryable<TEntity> QueryAll()
        {
            return _dbSet.IgnoreQueryFilters();
        }

        public async Task<TEntity?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task AddAsync(TEntity entity, string userName)
        {
            entity.CreatedBy = userName;
            entity.CreatedDate = CommonHelper.GetISTTime(DateTime.Now);
            entity.IsActive = true;
            await _dbSet.AddAsync(entity);
        }

        public void Update(TEntity entity, string userName)
        {
            entity.ModifiedBy = userName;
            entity.ModifiedDate = CommonHelper.GetISTTime(DateTime.Now);
            _dbSet.Update(entity);
        }

        public async Task SoftDeleteAsync(int id, string userName)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity != null)
            {
                entity.IsActive = false;
                entity.ModifiedBy = userName;
                entity.ModifiedDate = CommonHelper.GetISTTime(DateTime.Now);
                _dbSet.Update(entity);
            }
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
