using System.Linq.Expressions;
using BrickNTrack.Repository.Entity;
using BrickNTrack.Repository.EntityConfiguration;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

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

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.ConfigureWarnings(w =>
                w.Log(RelationalEventId.PendingModelChangesWarning));
        }

        public virtual DbSet<UserManager> UserManager { get; set; }
        public virtual DbSet<UserToken> Tokens { get; set; }
        public virtual DbSet<BuilderMaster> BuilderMasters {  get; set; }
        public virtual DbSet<ProjectMaster> ProjectMasters { get; set; }
        public virtual DbSet<ProjectDataPath> ProjectDataPaths {  get; set; }
        public virtual DbSet<ProjectMilestone> ProjectMilestones {  get; set; }
        public virtual DbSet<ProjectExpenses> ProjectExpenses {  get; set; }
        public virtual DbSet<ConstructionStageProgress> ConstructionStageProgress { get; set; }
        public virtual DbSet<StagePhoto> StagePhotos { get; set; }
        public virtual DbSet<Conversation> Conversations { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<NotificationSetting> NotificationSettings { get; set; }
        public virtual DbSet<PropertyBooking> PropertyBookings { get; set; }
        public virtual DbSet<Review> Reviews { get; set; }
        public virtual DbSet<UserReport> UserReports { get; set; }
        public virtual DbSet<Appointment> Appointments { get; set; }
        public virtual DbSet<Announcement> Announcements { get; set; }
        public virtual DbSet<SavedProperty> SavedProperties { get; set; }
        public virtual DbSet<ProjectUnitType> ProjectUnitTypes { get; set; }
        public virtual DbSet<AmenityMaster> AmenityMasters { get; set; }
        public virtual DbSet<ProjectAmenity> ProjectAmenities { get; set; }

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

            // ConstructionStageProgress
            modelBuilder.Entity<ConstructionStageProgress>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.StageName).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
                entity.Property(e => e.Notes).HasMaxLength(2000);
                entity.HasOne(e => e.ProjectMaster).WithMany(p => p.ConstructionStageProgress).HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.Cascade);
            });

            // StagePhoto
            modelBuilder.Entity<StagePhoto>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.PhotoPath).HasMaxLength(500).IsRequired();
                entity.Property(e => e.Caption).HasMaxLength(500);
                entity.HasOne(e => e.StageProgress).WithMany(s => s.StagePhotos).HasForeignKey(e => e.StageProgressId).OnDelete(DeleteBehavior.Cascade);
            });

            // Conversation
            modelBuilder.Entity<Conversation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasOne(e => e.BuyerUser).WithMany().HasForeignKey(e => e.BuyerUserId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.SellerUser).WithMany().HasForeignKey(e => e.SellerUserId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ProjectMaster).WithMany().HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.SetNull);
            });

            // Message
            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.MessageType).HasMaxLength(50).HasDefaultValue("Text");
                entity.HasOne(e => e.Conversation).WithMany(c => c.Messages).HasForeignKey(e => e.ConversationId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.SenderUser).WithMany().HasForeignKey(e => e.SenderUserId).OnDelete(DeleteBehavior.Restrict);
            });

            // Notification
            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Body).HasMaxLength(2000).IsRequired();
                entity.Property(e => e.Type).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Category).HasMaxLength(50);
                entity.Property(e => e.ActionUrl).HasMaxLength(500);
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            // NotificationSetting
            modelBuilder.Entity<NotificationSetting>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => e.UserId).IsUnique();
            });

            // PropertyBooking
            modelBuilder.Entity<PropertyBooking>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.PaymentStatus).HasMaxLength(50).HasDefaultValue("Pending");
                entity.Property(e => e.PaymentMode).HasMaxLength(50);
                entity.Property(e => e.TransactionId).HasMaxLength(200);
                entity.Property(e => e.Notes).HasMaxLength(2000);
                entity.HasOne(e => e.ProjectMaster).WithMany().HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.BuyerUser).WithMany().HasForeignKey(e => e.BuyerUserId).OnDelete(DeleteBehavior.Restrict);
            });

            // Review
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.OverallRating).IsRequired();
                entity.Property(e => e.ReviewText).HasMaxLength(2000);
                entity.Property(e => e.BuilderResponse).HasMaxLength(2000);
                entity.HasOne(e => e.ProjectMaster).WithMany().HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.BuyerUser).WithMany().HasForeignKey(e => e.BuyerUserId).OnDelete(DeleteBehavior.Restrict);
            });

            // UserReport
            modelBuilder.Entity<UserReport>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Reason).HasMaxLength(2000).IsRequired();
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
                entity.Property(e => e.AdminNotes).HasMaxLength(2000);
                entity.HasOne(e => e.ReporterUser).WithMany().HasForeignKey(e => e.ReporterUserId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ReportedMessage).WithMany().HasForeignKey(e => e.ReportedMessageId).OnDelete(DeleteBehavior.SetNull);
                entity.HasOne(e => e.ReportedReview).WithMany().HasForeignKey(e => e.ReportedReviewId).OnDelete(DeleteBehavior.SetNull);
            });

            // Appointment
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Pending");
                entity.Property(e => e.TimeSlot).HasMaxLength(50);
                entity.Property(e => e.Notes).HasMaxLength(500);
                entity.Property(e => e.CancellationReason).HasMaxLength(500);
                entity.HasOne(e => e.BuyerUser).WithMany().HasForeignKey(e => e.BuyerUserId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.SellerUser).WithMany().HasForeignKey(e => e.SellerUserId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ProjectMaster).WithMany().HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.Restrict);
            });

            // Announcement
            modelBuilder.Entity<Announcement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Title).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.Category).HasMaxLength(50);
                entity.Property(e => e.TargetRole).HasMaxLength(20);
                entity.HasOne(e => e.CreatedByUser).WithMany().HasForeignKey(e => e.CreatedByUserId).OnDelete(DeleteBehavior.Restrict);
            });

            // ProjectUnitType
            modelBuilder.Entity<ProjectUnitType>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.UnitName).HasMaxLength(200).IsRequired();
                entity.Property(e => e.UnitType).HasMaxLength(100);
                entity.Property(e => e.FacingDirection).HasMaxLength(50);
                entity.Property(e => e.FurnishingStatus).HasMaxLength(50);
                entity.Property(e => e.FloorPlanImage).HasMaxLength(500);
                entity.HasOne(e => e.ProjectMaster).WithMany(p => p.ProjectUnitTypes).HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.Cascade);
            });

            // SavedProperty
            modelBuilder.Entity<SavedProperty>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.ProjectMaster).WithMany().HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => new { e.UserId, e.ProjectId }).IsUnique();
            });

            // Performance indexes
            modelBuilder.Entity<UserManager>().HasIndex(e => e.UserName).IsUnique();
            modelBuilder.Entity<UserManager>().HasIndex(e => e.Email);
            modelBuilder.Entity<UserManager>().HasIndex(e => e.Role);
            modelBuilder.Entity<ProjectMaster>().HasIndex(e => e.BuilderId);
            modelBuilder.Entity<ProjectMaster>().HasIndex(e => e.Status);
            modelBuilder.Entity<ProjectMaster>().HasIndex(e => e.City);
            modelBuilder.Entity<ProjectMaster>().HasIndex(e => e.PropertyType);
            modelBuilder.Entity<ProjectMaster>().HasIndex(e => e.IsFeatured);
            modelBuilder.Entity<ProjectMilestone>().HasIndex(e => e.ProjectId);
            modelBuilder.Entity<ProjectExpenses>().HasIndex(e => e.ProjectMilestoneId);
            modelBuilder.Entity<ProjectDataPath>().HasIndex(e => e.ProjectId);
            modelBuilder.Entity<Message>().HasIndex(e => e.ConversationId);
            modelBuilder.Entity<Message>().HasIndex(e => e.CreatedDate);
            modelBuilder.Entity<Notification>().HasIndex(e => new { e.UserId, e.IsRead });
            modelBuilder.Entity<PropertyBooking>().HasIndex(e => e.BuyerUserId);
            modelBuilder.Entity<PropertyBooking>().HasIndex(e => e.ProjectId);
            modelBuilder.Entity<Review>().HasIndex(e => e.ProjectId);
            modelBuilder.Entity<ConstructionStageProgress>().HasIndex(e => e.ProjectId);
            modelBuilder.Entity<ProjectUnitType>().HasIndex(e => e.ProjectId);

            // AmenityMaster
            modelBuilder.Entity<AmenityMaster>(entity =>
            {
                entity.HasKey(e => e.AmenityId);
                entity.Property(e => e.AmenityId).ValueGeneratedOnAdd();
                entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Icon).HasMaxLength(100);
                entity.Property(e => e.Category).HasMaxLength(50);
                entity.HasIndex(e => e.Name).IsUnique();
            });

            // ProjectAmenity (join table - no soft delete)
            modelBuilder.Entity<ProjectAmenity>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.HasOne(e => e.ProjectMaster).WithMany(p => p.ProjectAmenities).HasForeignKey(e => e.ProjectId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.AmenityMaster).WithMany(a => a.ProjectAmenities).HasForeignKey(e => e.AmenityId).OnDelete(DeleteBehavior.Cascade);
                entity.HasIndex(e => new { e.ProjectId, e.AmenityId }).IsUnique();
            });

            // Global soft-delete filter: auto-filter IsActive == true for all CommonEntity-derived types
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(CommonEntity).IsAssignableFrom(entityType.ClrType))
                {
                    var param = Expression.Parameter(entityType.ClrType, "e");
                    var prop = Expression.Property(param, nameof(CommonEntity.IsActive));
                    modelBuilder.Entity(entityType.ClrType).HasQueryFilter(Expression.Lambda(prop, param));
                }
            }
        }


    }
}
