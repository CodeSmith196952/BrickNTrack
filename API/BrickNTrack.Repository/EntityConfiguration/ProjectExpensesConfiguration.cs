using BrickNTrack.Repository.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrickNTrack.Repository.EntityConfiguration
{
    public class ProjectExpensesConfiguration : IEntityTypeConfiguration<ProjectExpenses>
    {
        public void Configure(EntityTypeBuilder<ProjectExpenses> builder)
        {

            builder.HasKey(x => x.ExpenseId);
            builder.Property(x => x.ExpenseId).ValueGeneratedOnAdd();

            builder.Property(x => x.Details).IsRequired(true).HasMaxLength(100);
            builder.Property(x => x.VendorSupplier).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.Category).IsRequired(false).HasMaxLength(50);

            builder.HasOne(x => x.ProjectMilestone)
                .WithMany(x => x.ProjectExpenses)
                .HasForeignKey(x => x.ProjectMilestoneId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.CreatedBy).IsRequired(false).HasMaxLength(30);
            builder.Property(x => x.ModifiedBy).IsRequired(false).HasMaxLength(30);
            builder.Property(x => x.CreatedDate).IsRequired(true).HasColumnType("datetime");
            builder.Property(x => x.ModifiedDate).IsRequired(false).HasColumnType("datetime");
            builder.Property(x => x.IsActive).HasDefaultValue(true);
        }
    }
}
