using BrickNTrack.Doman.CommonModel;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations.Schema;

namespace BrickNTrack.Doman.Model
{
    public class ProjectDataPathRequest : CommonModelEntity
    {
        public int ProjectDataPathId { get; set; }
        public string DataName { get; set; }
        public string Category { get; set; }
        public string Path { get; set; }
        public string FileType { get; set; }
        public int ProjectId { get; set; }
        [NotMapped]
        public IFormFile? ProfileDataFile { get; set; }
    }
}
