using BrickNTrack.Doman.Model;
using BrickNTrack.Repository.Entity;
using BrickNTrack.Repository.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static BrickNTrack.Doman.CommonModel.ApplicationConstant;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenses _expenses;
        
        public ExpensesController(IExpenses expenses)
        {
            _expenses = expenses;
        }

        [Route("addUpdateExpenses")]
        [HttpPost]
        public async Task<IActionResult> AddUpdateExpensesAsync([FromBody] ProjectExpensesRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value;
            var result = await _expenses.AddUpdateExpensesAsync(request, userName);
            if (result.StatusCode == ResultCode.SuccessfullyCreated || result.StatusCode == ResultCode.SuccessfullyUpdated)
                return Ok(result);
            else
                return NotFound(result);
        }

        [Route("getAllExpenses")]
        [HttpGet]
        public async Task<List<ProjectExpensesResponse>> GetAllExpensesAsync()
        {
            var result = await _expenses.GetAllExpensesAsync();
            return result;
        }

        [Route("getAllActiveExpenses")]
        [HttpGet]
        public async Task<List<ProjectExpensesResponse>> GetAllActiveExpensesAsync()
        {
            var result = await _expenses.GetAllActiveExpensesAsync();
            return result;
        }

        [Route("getAllExpensesById")]
        [HttpGet]
        public async Task<ProjectExpensesResponse> GetAllExpensesByIdAsync([FromQuery] int expenseId)
        {
            var result = await _expenses.GetAllExpensesByIdAsync(expenseId);
            return result;
        }

        [Route("getAllExpensesByMilestoneId")]
        [HttpGet]
        public async Task<List<ProjectExpensesResponse>> GetAllExpensesByMilestoneIdAsync([FromQuery] int milestoneId)
        {
            var result = await _expenses.GetAllExpensesByMilestoneIdAsync(milestoneId);
            return result;
        }
    }
}
