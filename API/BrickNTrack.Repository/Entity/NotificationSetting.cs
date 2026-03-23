namespace BrickNTrack.Repository.Entity
{
    public class NotificationSetting : CommonEntity
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool EmailEnabled { get; set; } = true;
        public bool SmsEnabled { get; set; }
        public bool PushEnabled { get; set; }
        public bool InAppEnabled { get; set; } = true;

        public UserManager User { get; set; }
    }
}
