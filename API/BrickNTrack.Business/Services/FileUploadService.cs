using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Interface;
using Microsoft.Extensions.Configuration;

namespace BrickNTrack.Business.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IProject _project;
        private readonly IConfiguration _config;

        public FileUploadService(IProject project, IConfiguration configuration)
        {
            _project = project;
            _config = configuration;
        }

        public async Task<ServiceResult> AddUpdateProjectImageAsync(ProjectMasterRequest request, string userName)
        {
            if (request.ProfileImageFile != null && request.ProfileImageFile.Length > 0)
            {
                var fileName = request.ProfileImageFile.FileName;
                var imageLocalPath = _config["AppSettings:ImageLocalDirectory"];
                var imageVirtualPath = _config["AppSettings:ImageVirtualDirectoryURL"];
                var fullImageLocalPath = $"{imageLocalPath}/{request.ProjectName}";
                var filePath = Path.Combine(fullImageLocalPath, fileName);

                if (!Directory.Exists(fullImageLocalPath))
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.ProfileImageFile.CopyToAsync(stream);
                }

                var virtualImagePath = filePath.Replace(imageLocalPath!, imageVirtualPath!);
                virtualImagePath = virtualImagePath.Replace("\\", "/");
                request.ProfileImage = virtualImagePath;
            }

            var result = await _project.AddUpdateProjectAsync(request, userName);

            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyCreated)
                return ServiceResult.Created(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated)
                return ServiceResult.Ok(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.RecordNotFound)
                return ServiceResult.NotFound(result.ErrorMessage);

            return ServiceResult.Fail(result.ErrorMessage ?? "Operation failed");
        }

        public async Task<ServiceResult> AddUpdatePropertyImagesAsync(ProjectDataPathRequest request, string userName)
        {
            if (request.ProfileDataFile != null && request.ProfileDataFile.Length > 0)
            {
                var projectDetail = await _project.GetProjectbyIdAsync(request.ProjectId);
                if (projectDetail == null)
                    return ServiceResult.NotFound("Property not found");

                var fileName = request.ProfileDataFile.FileName;
                var fileExtension = Path.GetExtension(request.ProfileDataFile.FileName);
                var imageLocalPath = _config["AppSettings:ImageLocalDirectory"];
                var imageVirtualPath = _config["AppSettings:ImageVirtualDirectoryURL"];
                var fullImageLocalPath = $"{imageLocalPath}/{projectDetail.ProjectName}";
                var filePath = Path.Combine(fullImageLocalPath, fileName);

                if (!Directory.Exists(fullImageLocalPath))
                    Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await request.ProfileDataFile.CopyToAsync(stream);
                }

                var virtualImagePath = filePath.Replace(imageLocalPath!, imageVirtualPath!);
                request.Path = virtualImagePath;
                request.FileType = fileExtension.Replace(".", "").ToUpper();
            }

            var result = await _project.AddUpdateProjectDataFileAsync(request, userName);

            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyCreated)
                return ServiceResult.Created(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated)
                return ServiceResult.Ok(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.RecordNotFound)
                return ServiceResult.NotFound(result.ErrorMessage);

            return ServiceResult.Fail(result.ErrorMessage ?? "Operation failed");
        }

        public async Task<ServiceResult<ProjectDataPathResponse>> GetProjectDataDetailByIdAsync(int projectDataPathId)
        {
            var result = await _project.GetProjectDataDetailByIdAsync(projectDataPathId);
            if (result == null)
                return ServiceResult<ProjectDataPathResponse>.NotFound("Project data not found");
            return ServiceResult<ProjectDataPathResponse>.Ok(result);
        }

        public async Task<ServiceResult<List<ProjectDataPathResponse>>> GetAllActiveProjectDataDetailAsync()
        {
            var result = await _project.GetAllActiveProjectDataDetailAsync();
            return ServiceResult<List<ProjectDataPathResponse>>.Ok(result ?? new List<ProjectDataPathResponse>());
        }

        public async Task<ServiceResult<List<ProjectDataPathResponse>>> GetAllProjectDataDetailAsync()
        {
            var result = await _project.GetAllProjectDataDetailAsync();
            return ServiceResult<List<ProjectDataPathResponse>>.Ok(result ?? new List<ProjectDataPathResponse>());
        }

        public async Task<ServiceResult<List<ProjectDataPathResponse>>> GetProjectDataDetailByProjectIdAsync(int projectId)
        {
            var result = await _project.GetProjectDataDetailByProjectIdAsync(projectId);
            return ServiceResult<List<ProjectDataPathResponse>>.Ok(result ?? new List<ProjectDataPathResponse>());
        }
    }
}
