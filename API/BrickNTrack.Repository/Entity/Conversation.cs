namespace BrickNTrack.Repository.Entity
{
    public class Conversation : CommonEntity
    {
        public int Id { get; set; }
        public int BuyerUserId { get; set; }
        public int SellerUserId { get; set; }
        public int? ProjectId { get; set; }
        public DateTime LastMessageAt { get; set; }

        public UserManager BuyerUser { get; set; }
        public UserManager SellerUser { get; set; }
        public ProjectMaster? ProjectMaster { get; set; }
        public ICollection<Message> Messages { get; set; }
    }
}
