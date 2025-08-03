using BrickNTrack.Repository.Entity;
using BrickNTrack.Repository.EntityConfiguration;
using Microsoft.EntityFrameworkCore;

namespace BrickNTrack.Repository.Context
{
    public class BrickNTrackContext : DbContext
    {
        public DbContextOptions<BrickNTrackContext> Options { get; }

        public BrickNTrackContext() { }

        public BrickNTrackContext(DbContextOptions<BrickNTrackContext> options)
            : base(options)
        {
            Options = options;
        }

        public virtual DbSet<UserManager> UserManager { get; set; }
        public virtual DbSet<UserToken> Tokens { get; set; }
        public virtual DbSet<BuilderMaster> BuilderMasters {  get; set; }
        public virtual DbSet<ProjectMaster> ProjectMasters { get; set; }
        public virtual DbSet<ProjectDataPath> ProjectDataPaths {  get; set; }
        public virtual DbSet<ProjectMilestone> ProjectMilestones {  get; set; }
        public virtual DbSet<ProjectExpenses> ProjectExpenses {  get; set; }

        [System.Obsolete]
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            #region Config related table configuration
            modelBuilder.ApplyConfiguration(new UserManagerConfiguration());
            modelBuilder.ApplyConfiguration(new BuilderMasterConfiguration());
            modelBuilder.ApplyConfiguration(new ProjectMasterConfiguration());
            modelBuilder.ApplyConfiguration(new ProjectDataPathConfiguration());
            modelBuilder.ApplyConfiguration(new ProjectMilestoneConfiguration());
            modelBuilder.ApplyConfiguration(new ProjectExpensesConfiguration());
            #endregion
        }


    }
}
