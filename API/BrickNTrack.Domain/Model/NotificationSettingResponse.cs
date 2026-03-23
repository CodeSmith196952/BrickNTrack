namespace BrickNTrack.Domain.Model
{
    public class NotificationSettingResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool EmailEnabled { get; set; }
        public bool SmsEnabled { get; set; }
        public bool PushEnabled { get; set; }
        public bool InAppEnabled { get; set; }
    }
}
