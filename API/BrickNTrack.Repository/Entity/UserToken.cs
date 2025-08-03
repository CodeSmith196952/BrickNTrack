namespace BrickNTrack.Repository.Entity
{
    public class UserToken
    {
        public int Id { get; set; }
        public string JwtToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTime Expiration { get; set; }
        public int UserId { get; set; }
        public UserManager User { get; set; }
    }
}
