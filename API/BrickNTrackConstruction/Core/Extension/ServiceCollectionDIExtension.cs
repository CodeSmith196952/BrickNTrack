using BrickNTrack.Business.BusinessLogic;
using BrickNTrack.Business.Services;
using BrickNTrack.Repository.Interface;
using BrickNTrack.Repository.Repositories;

namespace BrickNTrackConstruction.Core.Extension
{
    public class ServiceCollectionDIExtension
    {
        public static void ConfigureServicesDependency(IServiceCollection services)
        {
            RepositoryDependency(services);
            ServiceDependency(services);
        }

        private static void RepositoryDependency(IServiceCollection services)
        {
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IUserManager, UserManagerRepositories>();
            services.AddScoped<IBuilder, BuilderRepositories>();
            services.AddScoped<IProject, ProjectRepositories>();
            services.AddScoped<IExpenses, ExpensesRepositories>();
            services.AddScoped<IProjectMilestone, ProjectMilestoneRepositories>();
        }

        private static void ServiceDependency(IServiceCollection services)
        {
            services.AddScoped<IProjectManager, ProjectManager>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IBuilderService, BuilderService>();
            services.AddScoped<IProjectService, ProjectService>();
            services.AddScoped<IMilestoneService, MilestoneService>();
            services.AddScoped<IExpenseService, ExpenseService>();
            services.AddScoped<IFileUploadService, FileUploadService>();
            services.AddScoped<IBudgetCalculationService, BudgetCalculationService>();
        }
    }
}
