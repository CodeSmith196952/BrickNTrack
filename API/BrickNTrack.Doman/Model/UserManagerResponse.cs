namespace BrickNTrack.Doman.Model
{
    public class UserManagerResponse
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string MobileNumber { get; set; }
        public bool AcceptTerms { get; set; }
        public string? ResetToken { get; set; }
        public int BuilderId { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
        public string BuilderName { get; set; }
    }
}
