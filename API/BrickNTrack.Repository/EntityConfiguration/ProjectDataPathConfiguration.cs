using BrickNTrack.Repository.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrickNTrack.Repository.EntityConfiguration
{
    public class ProjectDataPathConfiguration : IEntityTypeConfiguration<ProjectDataPath>
    {
        public void Configure(EntityTypeBuilder<ProjectDataPath> builder)
        {
            builder.HasKey(x => x.ProjectDataPathId);
            builder.Property(x => x.ProjectDataPathId).ValueGeneratedOnAdd();

            builder.Property(x => x.DataName).IsRequired(true).HasMaxLength(50);
            builder.Property(x => x.Category).IsRequired(true).HasMaxLength(50);
            builder.Property(x => x.Path).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.FileType).IsRequired(false).HasMaxLength(25);

            builder.HasOne(x => x.ProjectMaster)
                .WithMany(x => x.ProjectDataPaths)
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
