using BrickNTrack.Doman.CommonModel;
using BrickNTrack.Doman.Model;

namespace BrickNTrack.Repository.Interface
{
    public interface IBuilder
    {
        Task<List<BuilderMasterResponse>> GetAllBuilderAsync();
        Task<List<BuilderMasterResponse>> GetAllActiveBuilderAsync();
        Task<BuilderMasterResponse> GetBuilderByIdAsync(int builderId);
        Task<ResultModel> AddUpdateBuilderAsync(BuilderMasterRequest request, string username);
    }
}
