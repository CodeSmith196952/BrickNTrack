using BrickNTrack.Domain.CommonModel;
using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class UserManagerRequest : CommonModelEntity
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50, MinimumLength = 3)]
        public string UserName { get; set; }

        [Required]
        [StringLength(20)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(20)]
        public string LastName { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(50)]
        public string Email { get; set; }

        [Required]
        [StringLength(20)]
        public string MobileNumber { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        public bool AcceptTerms { get; set; }
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
        public int? BuilderId { get; set; }
        public string? Role { get; set; }
    }
}
