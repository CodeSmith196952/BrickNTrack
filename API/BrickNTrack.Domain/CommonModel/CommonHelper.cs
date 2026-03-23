namespace BrickNTrack.Domain.CommonModel
{
    public class CommonHelper
    {
        public static DateTime GetISTTime(DateTime dt)
        {
            return TimeZoneInfo.ConvertTimeBySystemTimeZoneId(dt, TimeZoneInfo.Local.Id, "India Standard Time");
        }
    }
}
