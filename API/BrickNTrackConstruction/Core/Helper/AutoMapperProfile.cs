using AutoMapper;
using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Entity;

namespace BrickNTrackConstruction.Core.Helper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UserManagerRequest, UserManager>();

            CreateMap<BuilderMasterRequest, BuilderMaster>();
            CreateMap<BuilderMaster, BuilderMasterResponse>();

            CreateMap<ProjectMasterRequest, ProjectMaster>();
            CreateMap<ProjectMaster, ProjectMasterResponse>()
                .ForMember(dest => dest.BuilderName, opt => opt.MapFrom(src => src.BuilderMaster.Name));

            CreateMap<ProjectDataPathRequest, ProjectDataPath>();
            CreateMap<ProjectDataPath, ProjectDataPathResponse>()
                .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.ProjectMaster.ProjectName));

            CreateMap<ProjectMilestoneRequest, ProjectMilestone>();
            CreateMap<ProjectMilestone, ProjectMilestoneResponse>()
                .ForMember(dest => dest.ProjectName, opt => opt.MapFrom(src => src.ProjectMaster.ProjectName));

            CreateMap<ProjectExpensesRequest, ProjectExpenses>();
            CreateMap<ProjectExpenses, ProjectExpensesResponse>()
                .ForMember(dest => dest.MilestoneName, opt => opt.MapFrom(src => src.ProjectMilestone.MilestoneName));


            //CreateMap<UserManager, UserManagerRequest>();
            //CreateMap<RegisterUserRequest, UserManager>().ReverseMap();
            //CreateMap<UserManager, AuthenticateResponse>()
            //    .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.RoleMaster.RoleName));
        }
    }
}
