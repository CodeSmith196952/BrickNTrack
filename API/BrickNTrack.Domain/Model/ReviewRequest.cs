using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.Model
{
    public class ReviewRequest
    {
        [Required]
        public int ProjectId { get; set; }

        [Required, Range(1, 5)]
        public int OverallRating { get; set; }

        [Range(1, 5)]
        public int? QualityRating { get; set; }

        [Range(1, 5)]
        public int? ValueRating { get; set; }

        [Range(1, 5)]
        public int? LocationRating { get; set; }

        [StringLength(2000)]
        public string? ReviewText { get; set; }
    }
}
