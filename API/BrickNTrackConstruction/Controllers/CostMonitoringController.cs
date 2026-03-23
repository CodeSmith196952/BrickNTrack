using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.AdminOrBuilder)]
    public class CostMonitoringController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public CostMonitoringController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<ServiceResult<CostMonitoringResponse>>> GetProjectCosts(int projectId)
        {
            var project = await _context.ProjectMasters
                .Include(p => p.ProjectMilestones)
                    .ThenInclude(m => m.ProjectExpenses)
                .FirstOrDefaultAsync(p => p.ProjectId == projectId);

            if (project == null)
                return NotFound(ServiceResult<CostMonitoringResponse>.NotFound("Project not found"));

            var totalSpent = project.ProjectMilestones
                .SelectMany(m => m.ProjectExpenses.Where(e => e.IsActive))
                .Sum(e => e.Amount);

            var stageWiseCosts = project.ProjectMilestones.Select(m => new StageWiseCost
            {
                MilestoneId = m.MilestoneId,
                StageName = m.MilestoneName,
                Budget = m.Budget,
                Spent = m.ProjectExpenses.Where(e => e.IsActive).Sum(e => e.Amount)
            }).ToList();

            var recentExpenses = project.ProjectMilestones
                .SelectMany(m => m.ProjectExpenses.Where(e => e.IsActive))
                .OrderByDescending(e => e.CreatedDate)
                .Take(10)
                .Select(e => new ProjectExpensesResponse
                {
                    ExpenseId = e.ExpenseId,
                    Details = e.Details,
                    Amount = e.Amount,
                    VendorSupplier = e.VendorSupplier,
                    Category = e.Category,
                    ProjectMilestoneId = e.ProjectMilestoneId,
                    PaymentStatus = e.PaymentStatus,
                    PaymentMode = e.PaymentMode,
                    PaymentDate = e.PaymentDate
                }).ToList();

            var response = new CostMonitoringResponse
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                TotalBudget = project.Budget,
                TotalSpent = totalSpent,
                Remaining = project.Budget - totalSpent,
                UtilizationPercentage = project.Budget > 0 ? Math.Round(totalSpent / project.Budget * 100, 2) : 0,
                StageWiseCosts = stageWiseCosts,
                RecentExpenses = recentExpenses
            };

            return Ok(ServiceResult<CostMonitoringResponse>.Ok(response));
        }

        [HttpGet("builder-summary")]
        public async Task<ActionResult<ServiceResult<List<CostMonitoringResponse>>>> GetBuilderSummary()
        {
            var builderIdStr = User.FindFirst("BuilderId")?.Value;
            if (string.IsNullOrEmpty(builderIdStr) || !int.TryParse(builderIdStr, out var bid) || bid == 0)
                return BadRequest(ServiceResult<List<CostMonitoringResponse>>.Fail("Builder ID not found"));

            var projects = await _context.ProjectMasters
                .Include(p => p.ProjectMilestones)
                    .ThenInclude(m => m.ProjectExpenses)
                .Where(p => p.BuilderId == bid)
                .ToListAsync();

            var summaries = projects.Select(project =>
            {
                var totalSpent = project.ProjectMilestones
                    .SelectMany(m => m.ProjectExpenses.Where(e => e.IsActive))
                    .Sum(e => e.Amount);

                return new CostMonitoringResponse
                {
                    ProjectId = project.ProjectId,
                    ProjectName = project.ProjectName,
                    TotalBudget = project.Budget,
                    TotalSpent = totalSpent,
                    Remaining = project.Budget - totalSpent,
                    UtilizationPercentage = project.Budget > 0 ? Math.Round(totalSpent / project.Budget * 100, 2) : 0
                };
            }).ToList();

            return Ok(ServiceResult<List<CostMonitoringResponse>>.Ok(summaries));
        }
    }
}
