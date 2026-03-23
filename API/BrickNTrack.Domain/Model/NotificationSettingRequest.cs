namespace BrickNTrack.Domain.Model
{
    public class NotificationSettingRequest
    {
        public bool EmailEnabled { get; set; } = true;
        public bool SmsEnabled { get; set; }
        public bool PushEnabled { get; set; }
        public bool InAppEnabled { get; set; } = true;
    }
}
