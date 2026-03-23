using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Interface;
using Microsoft.Extensions.Configuration;
using static BrickNTrack.Domain.CommonModel.ApplicationConstant;

namespace BrickNTrack.Business.BusinessLogic
{
    public class ProjectManager : IProjectManager
    {
        private readonly IProject _project;
        private readonly IConfiguration _config;

        public ProjectManager(IProject project , IConfiguration configuration) 
        {
            _project = project;
            _config = configuration;
        }

        public async Task<ResultModel> AddUpdateImageAsync(ProjectMasterRequest request, string userName)
        {
            ResultModel retValue = new ResultModel();
            try
            {
                if (request.ProfileImageFile != null && request.ProfileImageFile.Length > 0)
                {
                    var fileName = request.ProfileImageFile.FileName;
                    var imageLocalPath = _config["AppSettings:ImageLocalDirectory"];
                    var imageVirtualPath = _config["AppSettings:ImageVirtualDirectoryURL"];
                    var fullImageLocalPath = $"{imageLocalPath}/{request.ProjectName}";
                    var filePath = Path.Combine(fullImageLocalPath, fileName);

                    if (!Directory.Exists(fullImageLocalPath))
                        Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    // Save the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.ProfileImageFile.CopyToAsync(stream);
                    }

                    var virtualImagePath = filePath.Replace(imageLocalPath, imageVirtualPath);
                    virtualImagePath = virtualImagePath.Replace("\\", "/");
                    request.ProfileImage = virtualImagePath;
                }

                return await _project.AddUpdateProjectAsync(request, userName);
            }
            catch (Exception ex)
            {
                retValue.StatusCode = ResultCode.Invalid;
                retValue.ErrorMessage = ex.ToString();
            }
            return retValue;
        }

        public async Task<ResultModel> AddUpdatePropertyImagesAsync(ProjectDataPathRequest request, string userName)
        {
            ResultModel retValue = new ResultModel();
            try
            {
                if (request.ProfileDataFile != null && request.ProfileDataFile.Length > 0)
                {
                    var ProjectDetail = await _project.GetProjectbyIdAsync(request.ProjectId);
                    if (ProjectDetail == null) 
                    {
                        retValue.StatusCode = ResultCode.RecordNotFound;
                        retValue.ErrorMessage = "Property not found";
                        return retValue;
                    }
                    var fileName = request.ProfileDataFile.FileName;
                    var fileExtension = Path.GetExtension(request.ProfileDataFile.FileName);
                    var imageLocalPath = _config["AppSettings:ImageLocalDirectory"];
                    var imageVirtualPath = _config["AppSettings:ImageVirtualDirectoryURL"];
                    var fullImageLocalPath = $"{imageLocalPath}/{ProjectDetail.ProjectName}";
                    var filePath = Path.Combine(fullImageLocalPath, fileName);

                    if (!Directory.Exists(fullImageLocalPath))
                        Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                    // Save the file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await request.ProfileDataFile.CopyToAsync(stream);
                    }

                    var virtualImagePath = filePath.Replace(imageLocalPath, imageVirtualPath);
                    request.Path = virtualImagePath;
                    request.FileType = fileExtension.Replace(".","").ToUpper();
                }
                return await _project.AddUpdateProjectDataFileAsync(request, userName);
            }
            catch (Exception ex)
            {
                retValue.StatusCode = ResultCode.Invalid;
                retValue.ErrorMessage = ex.ToString();
            }
            return retValue;
        }
    }
}
