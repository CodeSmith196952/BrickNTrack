using BrickNTrack.Business.Services;
using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpPost("addUpdateExpenses")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> AddUpdateExpenses([FromBody] ProjectExpensesRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var result = await _expenseService.AddUpdateExpenseAsync(request, userName);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllExpenses")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<ActionResult<ServiceResult<List<ProjectExpensesResponse>>>> GetAllExpenses()
        {
            var result = await _expenseService.GetAllExpensesAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllActiveExpenses")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<List<ProjectExpensesResponse>>>> GetAllActiveExpenses()
        {
            var result = await _expenseService.GetAllActiveExpensesAsync();
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllExpensesById")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<ProjectExpensesResponse>>> GetAllExpensesById([FromQuery] int expenseId)
        {
            var result = await _expenseService.GetExpenseByIdAsync(expenseId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpGet("getAllExpensesByMilestoneId")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult<List<ProjectExpensesResponse>>>> GetAllExpensesByMilestoneId([FromQuery] int milestoneId)
        {
            var result = await _expenseService.GetExpensesByMilestoneIdAsync(milestoneId);
            return StatusCode(result.StatusCode, result);
        }

        [HttpDelete("deleteExpense")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> DeleteExpense([FromQuery] int expenseId)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value!;
            var result = await _expenseService.SoftDeleteExpenseAsync(expenseId, userName);
            return StatusCode(result.StatusCode, result);
        }
    }
}
