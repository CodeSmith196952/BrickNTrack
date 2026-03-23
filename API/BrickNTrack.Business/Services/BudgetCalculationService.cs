using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using Microsoft.EntityFrameworkCore;
using static BrickNTrack.Domain.CommonModel.ApplicationConstant;

namespace BrickNTrack.Business.Services
{
    public class BudgetCalculationService : IBudgetCalculationService
    {
        private readonly BrickNTrackContext _context;

        public BudgetCalculationService(BrickNTrackContext context)
        {
            _context = context;
        }

        public async Task<ServiceResult> RecalculateBudgetStatusAsync(int milestoneId)
        {
            try
            {
                var milestone = await _context.ProjectMilestones
                    .Include(x => x.ProjectExpenses)
                    .FirstOrDefaultAsync(x => x.MilestoneId == milestoneId);

                if (milestone == null)
                    return ServiceResult.NotFound("Milestone not found");

                var totalExpenses = milestone.ProjectExpenses.Sum(x => x.Amount);

                if (totalExpenses > 0)
                {
                    milestone.BudgetStatus = milestone.Budget < totalExpenses
                        ? BudgetStatusConstant.OverBudget
                        : BudgetStatusConstant.InBudget;

                    _context.ProjectMilestones.Update(milestone);
                    await _context.SaveChangesAsync();
                }

                return ServiceResult.Ok("Budget status updated successfully");
            }
            catch (Exception ex)
            {
                return ServiceResult.Fail(ex.Message);
            }
        }
    }
}
