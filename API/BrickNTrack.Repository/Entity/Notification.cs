namespace BrickNTrack.Repository.Entity
{
    public class Notification : CommonEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string Type { get; set; }
        public string? Category { get; set; }
        public bool IsRead { get; set; }
        public string? ActionUrl { get; set; }

        public UserManager User { get; set; }
    }
}
