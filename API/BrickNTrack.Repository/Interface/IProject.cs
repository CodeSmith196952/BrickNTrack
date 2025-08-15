using BrickNTrack.Doman.CommonModel;
using BrickNTrack.Doman.Model;

namespace BrickNTrack.Repository.Interface
{
    public interface IProject
    {
        Task<List<ProjectMasterResponse>> GetAllProjectAsync();
        Task<List<ProjectMasterResponse>> GetAllActiveProjectAsync();
        Task<ProjectMasterResponse> GetProjectbyIdAsync(int projectId);
        Task<ResultModel> AddUpdateProjectAsync(ProjectMasterRequest request, string username);
        Task<ResultModel> AddUpdateProjectDataFileAsync(ProjectDataPathRequest request, string userName);
        Task<ProjectDataPathResponse> GetProjectDataDetailByIdAsync(int projectDataPathId);
        Task<List<ProjectDataPathResponse>> GetAllActiveProjectDataDetailAsync();
        Task<List<ProjectDataPathResponse>> GetAllProjectDataDetailAsync();
        Task<List<ProjectDataPathResponse>> GetProjectDataDetailByProjectIdAsync(int projectId);
    }
}
