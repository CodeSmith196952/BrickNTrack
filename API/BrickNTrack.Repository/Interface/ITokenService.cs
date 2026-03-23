using BrickNTrack.Repository.Entity;

namespace BrickNTrack.Repository.Interface
{
    public interface ITokenService
    {
        string GenerateJwtToken(UserManager user);
        string GenerateRefreshToken();
    }
}
