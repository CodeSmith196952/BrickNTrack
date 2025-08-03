using BrickNTrack.Repository.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrickNTrack.Repository.EntityConfiguration
{
    public class ProjectMasterConfiguration : IEntityTypeConfiguration<ProjectMaster>
    {
        public void Configure(EntityTypeBuilder<ProjectMaster> builder)
        {
            builder.HasKey(x => x.ProjectId);
            builder.Property(x => x.ProjectId).ValueGeneratedOnAdd();
            builder.Property(x => x.ProjectName).IsRequired(true).HasMaxLength(100);
            builder.Property(x => x.ProjectDescription).IsRequired(true).HasMaxLength(250);
            builder.Property(x => x.StartDate).IsRequired(false);
            builder.Property(x => x.CompletionDate).IsRequired(false);
            builder.Property(x => x.ActualStartDate).IsRequired(false);
            builder.Property(x => x.ActualCompletionDate).IsRequired(false);
            builder.Property(x => x.ProjectAddress).IsRequired(false);
            builder.Property(x => x.Latlong).IsRequired(false);
            builder.Property(x => x.ProfileImage).IsRequired(false);
            builder.Property(x => x.ReraNumber).IsRequired(false);
            builder.Property(x => x.Status).IsRequired(false);

            builder.HasOne(x => x.BuilderMaster)
                .WithMany(x => x.ProjectMaster)
                .HasForeignKey(x => x.BuilderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.CreatedBy).IsRequired(false).HasMaxLength(30);
            builder.Property(x => x.ModifiedBy).IsRequired(false).HasMaxLength(30);
            builder.Property(x => x.CreatedDate).IsRequired(true).HasColumnType("datetime");
            builder.Property(x => x.ModifiedDate).IsRequired(false).HasColumnType("datetime");
            builder.Property(x => x.IsActive).HasDefaultValue(true);
        }
    }
}
