using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;

namespace BrickNTrack.Business.Services
{
    public interface IExpenseService
    {
        Task<ServiceResult> AddUpdateExpenseAsync(ProjectExpensesRequest request, string username);
        Task<ServiceResult<List<ProjectExpensesResponse>>> GetAllExpensesAsync();
        Task<ServiceResult<List<ProjectExpensesResponse>>> GetAllActiveExpensesAsync();
        Task<ServiceResult<ProjectExpensesResponse>> GetExpenseByIdAsync(int expenseId);
        Task<ServiceResult<List<ProjectExpensesResponse>>> GetExpensesByMilestoneIdAsync(int milestoneId);
        Task<ServiceResult> SoftDeleteExpenseAsync(int expenseId, string username);
    }
}
