using System.ComponentModel.DataAnnotations;

namespace BrickNTrack.Domain.CommonModel
{
    public class PaginatedRequest
    {
        [Range(1, int.MaxValue)]
        public int Page { get; set; } = 1;

        [Range(1, 100)]
        public int PageSize { get; set; } = 10;

        public string? SortBy { get; set; }

        public bool SortDescending { get; set; }

        public string? SearchText { get; set; }
    }
}
