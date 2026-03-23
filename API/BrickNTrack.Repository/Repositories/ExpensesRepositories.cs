using AutoMapper;
using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using BrickNTrack.Repository.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static BrickNTrack.Domain.CommonModel.ApplicationConstant;

namespace BrickNTrack.Repository.Repositories
{
    public class ExpensesRepositories : BaseRepository<ProjectExpenses>, IExpenses
    {
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        public ExpensesRepositories(BrickNTrackContext context,
            IConfiguration configuration, IMapper mapper) : base(context)
        {
            _config = configuration;
            _mapper = mapper;
        }

        public async Task<ResultModel> AddUpdateExpensesAsync(ProjectExpensesRequest request, string username)
        {
            ResultModel retValue = new ResultModel();
            try
            {
                var milestone = await _context.ProjectMilestones.FirstOrDefaultAsync(x => x.MilestoneId == request.ProjectMilestoneId);
                if (milestone == null)
                {
                    retValue.StatusCode = ResultCode.RecordNotFound;
                    retValue.ErrorMessage = "Milestone detail not found";
                    return retValue;
                }
                if (request.ExpenseId == 0)
                {
                    request.CreatedBy = username;
                    request.CreatedDate = CommonHelper.GetISTTime(DateTime.Now);
                    request.IsActive = true;
                    var expenses = _mapper.Map<ProjectExpenses>(request);
                    _context.ProjectExpenses.Add(expenses);
                    await _context.SaveChangesAsync();
                    retValue.StatusCode = ResultCode.SuccessfullyCreated;
                    retValue.ResponseMessage = "Expenses added successfully";
                }
                else
                {
                    var expenses = await _context.ProjectExpenses.FirstOrDefaultAsync(x => x.ExpenseId == request.ExpenseId);
                    var oldMilestoneId = 0;
                    if(expenses != null)
                    {
                        if (expenses.Details != request.Details)
                            expenses.Details = request.Details;

                        if (expenses.Amount != request.Amount)
                            expenses.Amount = request.Amount;

                        if (expenses.VendorSupplier != request.VendorSupplier)
                            expenses.VendorSupplier = request.VendorSupplier;

                        if (expenses.Category != request.Category)
                            expenses.Category = request.Category;

                        if (expenses.ProjectMilestoneId != request.ProjectMilestoneId)
                        {
                            oldMilestoneId = expenses.ProjectMilestoneId;
                            expenses.ProjectMilestoneId = request.ProjectMilestoneId;
                        }

                        expenses.IsActive = request.IsActive;
                        expenses.ModifiedBy = username;
                        expenses.ModifiedDate = CommonHelper.GetISTTime(DateTime.Now);
                        _context.ProjectExpenses.Update(expenses);
                        await _context.SaveChangesAsync();

                        retValue.StatusCode = ResultCode.SuccessfullyUpdated;
                        retValue.ResponseMessage = "Expensess updated successfully";

                        if (oldMilestoneId > 0)
                            await UpdateProjectBudgetStatusAsync(oldMilestoneId);
                    }
                    else
                    {
                        retValue.StatusCode = ResultCode.RecordNotFound;
                        retValue.ErrorMessage = "Expenses detail not found";
                    }
                }
                await UpdateProjectBudgetStatusAsync(milestone.MilestoneId);
            }
            catch (Exception ex)
            {
                retValue.StatusCode = ResultCode.Invalid;
                retValue.ErrorMessage = ex.Message;
            }
            return retValue;
        }

        public async Task<ResultModel> UpdateProjectBudgetStatusAsync(int milestoneId)
        {
            ResultModel retValue = new ResultModel();
            try
            {
                var milestone = await _context.ProjectMilestones.Include(x => x.ProjectExpenses).FirstOrDefaultAsync(x => x.MilestoneId == milestoneId);
                var budgetAmount = milestone.ProjectExpenses.Sum(x => x.Amount);
                if (budgetAmount > 0)
                {
                    if (milestone.Budget < budgetAmount)
                    {
                        milestone.BudgetStatus = BudgetStatusConstant.OverBudget;
                    }
                    else if (milestone.Budget >= budgetAmount)
                    {
                        milestone.BudgetStatus = BudgetStatusConstant.InBudget;
                    }
                    _context.ProjectMilestones.Update(milestone);
                    await _context.SaveChangesAsync();

                    retValue.StatusCode = ResultCode.SuccessfullyUpdated;
                    retValue.ResponseMessage = "Budget status updated successfully";
                }
            }
            catch (Exception ex)
            {
                retValue.StatusCode = ResultCode.Invalid;
                retValue.ErrorMessage = ex.Message;
            }
            return retValue;
        }

        public async Task<List<ProjectExpensesResponse>> GetAllExpensesAsync()
        {
            try
            {
                var expenses = await _context.ProjectExpenses.IgnoreQueryFilters().ToListAsync();
                return _mapper.Map<List<ProjectExpensesResponse>>(expenses);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ProjectExpensesResponse>> GetAllActiveExpensesAsync()
        {
            try
            {
                var expenses = await _context.ProjectExpenses.ToListAsync();
                return _mapper.Map<List<ProjectExpensesResponse>>(expenses);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ProjectExpensesResponse> GetAllExpensesByIdAsync(int expenseId)
        {
            try
            {
                var expenses = await _context.ProjectExpenses.FirstOrDefaultAsync(x => x.ExpenseId == expenseId);
                return _mapper.Map<ProjectExpensesResponse>(expenses);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ProjectExpensesResponse>> GetAllExpensesByMilestoneIdAsync(int milestoneId)
        {
            try
            {
                var expenses = await _context.ProjectExpenses.Where(x => x.ProjectMilestoneId == milestoneId).ToListAsync();
                return _mapper.Map<List<ProjectExpensesResponse>>(expenses);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
