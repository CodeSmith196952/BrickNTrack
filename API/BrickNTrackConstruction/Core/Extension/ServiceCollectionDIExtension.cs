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
        }

        private static void ServiceDependency(IServiceCollection services)
        {

        }
    }
}
