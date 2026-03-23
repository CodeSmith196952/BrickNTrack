using BrickNTrack.Repository.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrickNTrack.Repository.EntityConfiguration
{
    public class ProjectMilestoneConfiguration : IEntityTypeConfiguration<ProjectMilestone>
    {
        public void Configure(EntityTypeBuilder<ProjectMilestone> builder) 
        {
            builder.HasKey(x => x.MilestoneId);
            builder.Property(x => x.MilestoneId).ValueGeneratedOnAdd();

            builder.Property(x => x.MilestoneName).IsRequired(true).HasMaxLength(50);
            builder.Property(x => x.MilestoneDetails).IsRequired(true).HasMaxLength(250);
            builder.Property(x => x.BudgetStatus).IsRequired(false).HasMaxLength(25);
            builder.Property(x => x.Status).IsRequired(false).HasMaxLength(25);
            builder.Property(x => x.PlannedStartDate).IsRequired(false);
            builder.Property(x => x.PlannedTargetDate).IsRequired(false);
            builder.Property(x => x.ActualStartDate).IsRequired(false);
            builder.Property(x => x.ActualTargetDate).IsRequired(false);

            builder.HasOne(x => x.ProjectMaster)
                .WithMany(x => x.ProjectMilestones)
                .HasForeignKey(x => x.ProjectId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.CreatedBy).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.ModifiedBy).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.CreatedDate).IsRequired(true).HasColumnType("datetime");
            builder.Property(x => x.ModifiedDate).IsRequired(false).HasColumnType("datetime");
            builder.Property(x => x.IsActive).HasDefaultValue(true);
        }
    }
}
