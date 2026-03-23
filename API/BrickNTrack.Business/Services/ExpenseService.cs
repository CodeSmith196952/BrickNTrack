using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Interface;

namespace BrickNTrack.Business.Services
{
    public class ExpenseService : IExpenseService
    {
        private readonly IExpenses _expenseRepo;
        private readonly IBudgetCalculationService _budgetCalc;

        public ExpenseService(IExpenses expenseRepo, IBudgetCalculationService budgetCalc)
        {
            _expenseRepo = expenseRepo;
            _budgetCalc = budgetCalc;
        }

        public async Task<ServiceResult> AddUpdateExpenseAsync(ProjectExpensesRequest request, string username)
        {
            var result = await _expenseRepo.AddUpdateExpensesAsync(request, username);

            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyCreated)
                return ServiceResult.Created(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated)
                return ServiceResult.Ok(result.ResponseMessage);
            if (result.StatusCode == ApplicationConstant.ResultCode.RecordNotFound)
                return ServiceResult.NotFound(result.ErrorMessage);

            return ServiceResult.Fail(result.ErrorMessage ?? "Operation failed");
        }

        public async Task<ServiceResult<List<ProjectExpensesResponse>>> GetAllExpensesAsync()
        {
            var result = await _expenseRepo.GetAllExpensesAsync();
            return ServiceResult<List<ProjectExpensesResponse>>.Ok(result ?? new List<ProjectExpensesResponse>());
        }

        public async Task<ServiceResult<List<ProjectExpensesResponse>>> GetAllActiveExpensesAsync()
        {
            var result = await _expenseRepo.GetAllActiveExpensesAsync();
            return ServiceResult<List<ProjectExpensesResponse>>.Ok(result ?? new List<ProjectExpensesResponse>());
        }

        public async Task<ServiceResult<ProjectExpensesResponse>> GetExpenseByIdAsync(int expenseId)
        {
            var result = await _expenseRepo.GetAllExpensesByIdAsync(expenseId);
            if (result == null)
                return ServiceResult<ProjectExpensesResponse>.NotFound("Expense not found");
            return ServiceResult<ProjectExpensesResponse>.Ok(result);
        }

        public async Task<ServiceResult<List<ProjectExpensesResponse>>> GetExpensesByMilestoneIdAsync(int milestoneId)
        {
            var result = await _expenseRepo.GetAllExpensesByMilestoneIdAsync(milestoneId);
            return ServiceResult<List<ProjectExpensesResponse>>.Ok(result ?? new List<ProjectExpensesResponse>());
        }

        public async Task<ServiceResult> SoftDeleteExpenseAsync(int expenseId, string username)
        {
            var expense = await _expenseRepo.GetAllExpensesByIdAsync(expenseId);
            if (expense == null)
                return ServiceResult.NotFound("Expense not found");

            var request = new ProjectExpensesRequest
            {
                ExpenseId = expenseId,
                Details = expense.Details,
                Amount = expense.Amount,
                VendorSupplier = expense.VendorSupplier,
                Category = expense.Category,
                ProjectMilestoneId = expense.ProjectMilestoneId,
                IsActive = false
            };
            var result = await _expenseRepo.AddUpdateExpensesAsync(request, username);
            return result.StatusCode == ApplicationConstant.ResultCode.SuccessfullyUpdated
                ? ServiceResult.Ok("Expense deleted successfully")
                : ServiceResult.Fail("Failed to delete expense");
        }
    }
}
