using BrickNTrack.Business.BusinessLogic;
using BrickNTrack.Repository.Interface;
using BrickNTrack.Repository.Repositories;
using BrickNTrackConstruction.Core.Helper;


namespace BrickNTrackConstruction.Core.Extension
{
    public class ServiceCollectionDIExtension
    {
        public static void ConfigureServicesDependency(IServiceCollection services)
        {
            services.AddScoped<JwtService>();
            RepositoryDependency(services);
            ServiceDependency(services);
        }

        private static void RepositoryDependency(IServiceCollection services)
        {
            services.AddScoped<IUserManager, UserManagerRepositories>();
            services.AddScoped<IBuilder, BuilderRepositories>();
            services.AddScoped<IProject, ProjectRepositories>();
            services.AddScoped<IExpenses, ExpensesRepositories>();
            services.AddScoped<IProjectMilestone, ProjectMilestoneRepositories>();
        }

        private static void ServiceDependency(IServiceCollection services)
        {
            services.AddScoped<IProjectManager, ProjectManager>();
        }
    }
}
