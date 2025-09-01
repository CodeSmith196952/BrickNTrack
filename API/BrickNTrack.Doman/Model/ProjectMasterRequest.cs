using BrickNTrack.Doman.CommonModel;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BrickNTrack.Doman.Model
{
    public class ProjectMasterRequest : CommonModelEntity
    {
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
        public string ProjectDescription { get; set; }
        public int CompletionPercentage { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public string ProjectAddress { get; set; }
        public string Latlong { get; set; }
        public string? ProfileImage { get; set; }
        public string ReraNumber { get; set; }
        public double Budget { get; set; }
        public string Status { get; set; }
        public int BuilderId { get; set; }
        public IFormFile? ProfileImageFile { get; set; }
    }
}
