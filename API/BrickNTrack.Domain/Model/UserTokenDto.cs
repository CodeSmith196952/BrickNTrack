using System.Text.Json.Serialization;

namespace BrickNTrack.Domain.Model
{
    public class UserTokenDto
    {
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        public string JwtToken { get; set; }
        public string RefreshToken { get; set; }
        public string Role { get; set; }
    }
}
