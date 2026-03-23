namespace BrickNTrack.Repository.Entity
{
    public class BuilderMaster : CommonEntity
    {
        public int BuilderId { get; set; }
        public string Name { get; set; }
        public string TagLine { get; set; }
        public string Description { get; set; }
        public string OfficeAddress { get; set; }
        public string LangLog { get; set; }
        public string EmailAddress { get; set; }
        public string Contact1 { get; set; }
        public string Contact2 { get; set; } = string.Empty;
        public string GSTNo { get; set; }
        public string OwnerName { get; set; }
        public bool IsVerified { get; set; }
        public string? LogoUrl { get; set; }
        public string? WebsiteUrl { get; set; }
        public int? YearEstablished { get; set; }
        public string? OperatingCities { get; set; }
        public virtual ICollection<UserManager> UserManager { get; set; }
        public virtual ICollection<ProjectMaster> ProjectMaster { get; set; }

    }
}
