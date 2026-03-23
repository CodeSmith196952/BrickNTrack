namespace BrickNTrack.Domain.Model
{
    public class ProjectDataPathResponse
    {
        public int ProjectDataPathId { get; set; }
        public string DataName { get; set; }
        public string Category { get; set; }
        public string Path { get; set; }
        public string FileType { get; set; }
        public int ProjectId { get; set; }
        public string ProjectName { get; set; }
    }
}
