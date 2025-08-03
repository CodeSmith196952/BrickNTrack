namespace BrickNTrack.Repository.Entity
{
    public class ProjectDataPath : CommonEntity
    {
        public int ProjectDataPathId { get; set; }
        public string DataName { get; set; }
        public string Category { get; set; }
        public string Path { get; set; }
        public string FileType { get; set; }
        public int ProjectId { get; set; }
        public ProjectMaster ProjectMaster { get; set; }
    }
}
