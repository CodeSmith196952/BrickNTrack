using BrickNTrack.Domain.CommonModel;

namespace BrickNTrack.Business.Services
{
    public interface IBudgetCalculationService
    {
        Task<ServiceResult> RecalculateBudgetStatusAsync(int milestoneId);
    }
}
