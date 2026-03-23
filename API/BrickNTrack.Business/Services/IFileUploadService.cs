using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;

namespace BrickNTrack.Business.Services
{
    public interface IFileUploadService
    {
        Task<ServiceResult> AddUpdateProjectImageAsync(ProjectMasterRequest request, string userName);
        Task<ServiceResult> AddUpdatePropertyImagesAsync(ProjectDataPathRequest request, string userName);
        Task<ServiceResult<ProjectDataPathResponse>> GetProjectDataDetailByIdAsync(int projectDataPathId);
        Task<ServiceResult<List<ProjectDataPathResponse>>> GetAllActiveProjectDataDetailAsync();
        Task<ServiceResult<List<ProjectDataPathResponse>>> GetAllProjectDataDetailAsync();
        Task<ServiceResult<List<ProjectDataPathResponse>>> GetProjectDataDetailByProjectIdAsync(int projectId);
    }
}
