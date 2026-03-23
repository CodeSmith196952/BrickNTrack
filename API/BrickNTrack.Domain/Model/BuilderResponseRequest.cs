using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class BuilderResponseRequest
    {
        [Required]
        public int ReviewId { get; set; }

        [Required, StringLength(2000)]
        public string Response { get; set; }
    }
}
