using BrickNTrack.Repository.Entity;

namespace BrickNTrack.Repository.Interface
{
    public interface IBaseRepository<TEntity> where TEntity : CommonEntity
    {
        IQueryable<TEntity> Query();
        IQueryable<TEntity> QueryAll();
        Task<TEntity?> GetByIdAsync(int id);
        Task AddAsync(TEntity entity, string userName);
        void Update(TEntity entity, string userName);
        Task SoftDeleteAsync(int id, string userName);
        Task<int> SaveChangesAsync();
    }
}
