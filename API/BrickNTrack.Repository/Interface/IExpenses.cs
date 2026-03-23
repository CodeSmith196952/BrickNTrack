using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;

namespace BrickNTrack.Repository.Interface
{
    public interface IExpenses
    {
        Task<ResultModel> AddUpdateExpensesAsync(ProjectExpensesRequest request, string username);
        Task<ResultModel> UpdateProjectBudgetStatusAsync(int milestoneId);
        Task<List<ProjectExpensesResponse>> GetAllExpensesAsync();
        Task<List<ProjectExpensesResponse>> GetAllActiveExpensesAsync();
        Task<ProjectExpensesResponse> GetAllExpensesByIdAsync(int expenseId);
        Task<List<ProjectExpensesResponse>> GetAllExpensesByMilestoneIdAsync(int milestoneId);
    }
}
