namespace BrickNTrack.Repository.Entity
{
    public class SavedProperty : CommonEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int ProjectId { get; set; }

        public UserManager User { get; set; }
        public ProjectMaster ProjectMaster { get; set; }
    }
}
