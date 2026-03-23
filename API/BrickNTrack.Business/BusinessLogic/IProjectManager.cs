using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;

namespace BrickNTrack.Business.BusinessLogic
{
    public interface IProjectManager
    {
        Task<ResultModel> AddUpdateImageAsync(ProjectMasterRequest request, string userName);
        Task<ResultModel> AddUpdatePropertyImagesAsync(ProjectDataPathRequest request, string userName);
    }
}
