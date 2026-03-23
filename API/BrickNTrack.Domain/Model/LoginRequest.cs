using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class LoginRequestDTO
    {
        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
