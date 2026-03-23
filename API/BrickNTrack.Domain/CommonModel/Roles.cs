namespace BrickNTrack.Domain.CommonModel
{
    public static class Roles
    {
        public const string Admin = "Admin";
        public const string Builder = "Builder";
        public const string Buyer = "Buyer";

        public const string AdminOrBuilder = "Admin,Builder";
        public const string All = "Admin,Builder,Buyer";
    }
}
