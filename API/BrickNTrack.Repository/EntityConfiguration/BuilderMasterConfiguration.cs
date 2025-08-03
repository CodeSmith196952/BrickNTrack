using BrickNTrack.Repository.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrickNTrack.Repository.EntityConfiguration
{
    public class BuilderMasterConfiguration : IEntityTypeConfiguration<BuilderMaster>
    {
        public void Configure(EntityTypeBuilder<BuilderMaster> builder) 
        {
            builder.HasKey(x => x.BuilderId);
            builder.Property(x => x.BuilderId).ValueGeneratedOnAdd();
            builder.Property(x => x.Name).IsRequired(true).HasMaxLength(50);
            builder.Property(x => x.TagLine).IsRequired(false);
            builder.Property(x => x.Description).IsRequired(false);
            builder.Property(x => x.OfficeAddress).IsRequired(false);
            builder.Property(x => x.LangLog).IsRequired(false);
            builder.Property(x => x.EmailAddress).IsRequired(false);
            builder.Property(x => x.Contact1).IsRequired(false);
            builder.Property(x => x.Contact2).IsRequired(false);
            builder.Property(x => x.GSTNo).IsRequired(false);
            builder.Property(x => x.OwnerName).IsRequired(false);

            builder.Property(x => x.CreatedBy).IsRequired(false).HasMaxLength(30);
            builder.Property(x => x.ModifiedBy).IsRequired(false).HasMaxLength(30);
            builder.Property(x => x.CreatedDate).IsRequired(true).HasColumnType("datetime");
            builder.Property(x => x.ModifiedDate).IsRequired(false).HasColumnType("datetime");
            builder.Property(x => x.IsActive).HasDefaultValue(true);
        }
    }
}
