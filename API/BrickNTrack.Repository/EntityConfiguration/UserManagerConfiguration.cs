using BrickNTrack.Repository.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BrickNTrack.Repository.EntityConfiguration
{
    public class UserManagerConfiguration : IEntityTypeConfiguration<UserManager>
    {
        public void Configure(EntityTypeBuilder<UserManager> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.UserName).HasMaxLength(50);
            builder.Property(x => x.FirstName).HasMaxLength(20);
            builder.Property(x => x.LastName).HasMaxLength(20);
            builder.Property(x => x.Email).HasMaxLength(50);
            builder.Property(x => x.MobileNumber).HasMaxLength(20);
            builder.Property(x => x.AcceptTerms).HasMaxLength(1);
            builder.Property(x => x.Role).HasMaxLength(20).HasDefaultValue("Builder");

            builder.HasOne(x => x.BuilderMaster)
                .WithMany(x => x.UserManager)
                .HasForeignKey(x => x.BuilderId)
                .OnDelete(DeleteBehavior.Restrict).IsRequired(false);

            builder.Property(x => x.CreatedBy).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.ModifiedBy).IsRequired(false).HasMaxLength(100);
            builder.Property(x => x.CreatedDate).IsRequired(true).HasColumnType("datetime");
            builder.Property(x => x.ModifiedDate).IsRequired(false).HasColumnType("datetime");
            builder.Property(x => x.IsActive).HasDefaultValue(true);
        }

    }
}
