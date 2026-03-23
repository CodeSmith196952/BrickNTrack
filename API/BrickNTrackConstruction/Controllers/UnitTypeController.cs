using AutoMapper;
using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnitTypeController : ControllerBase
    {
        private readonly BrickNTrackContext _context;
        private readonly IMapper _mapper;

        public UnitTypeController(BrickNTrackContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("project/{projectId}")]
        public async Task<ActionResult<ServiceResult<List<ProjectUnitTypeResponse>>>> GetByProject(int projectId)
        {
            var units = await _context.ProjectUnitTypes
                .Where(u => u.ProjectId == projectId)
                .OrderBy(u => u.Bedrooms)
                .ThenBy(u => u.Price)
                .ToListAsync();
            return Ok(ServiceResult<List<ProjectUnitTypeResponse>>.Ok(_mapper.Map<List<ProjectUnitTypeResponse>>(units)));
        }

        [HttpPost]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> AddUpdate([FromBody] ProjectUnitTypeRequest request)
        {
            var userName = User.FindFirst(ClaimTypes.Name)?.Value ?? "system";

            if (request.Id == 0)
            {
                request.CreatedBy = userName;
                request.CreatedDate = CommonHelper.GetISTTime(DateTime.Now);
                request.IsActive = true;
                var entity = _mapper.Map<ProjectUnitType>(request);
                _context.ProjectUnitTypes.Add(entity);
                await _context.SaveChangesAsync();
                return Ok(ServiceResult.Created("Unit type added"));
            }
            else
            {
                var existing = await _context.ProjectUnitTypes.FindAsync(request.Id);
                if (existing == null) return NotFound(ServiceResult.NotFound("Unit type not found"));

                existing.UnitName = request.UnitName;
                existing.UnitType = request.UnitType;
                existing.Bedrooms = request.Bedrooms;
                existing.Bathrooms = request.Bathrooms;
                existing.CarpetArea = request.CarpetArea;
                existing.SuperBuiltUpArea = request.SuperBuiltUpArea;
                existing.Price = request.Price;
                existing.PricePerSqFt = request.PricePerSqFt;
                existing.FacingDirection = request.FacingDirection;
                existing.FurnishingStatus = request.FurnishingStatus;
                existing.FloorNumber = request.FloorNumber;
                existing.TotalFloors = request.TotalFloors;
                existing.ParkingCount = request.ParkingCount;
                existing.BalconyCount = request.BalconyCount;
                existing.FloorPlanImage = request.FloorPlanImage;
                existing.TotalUnits = request.TotalUnits;
                existing.AvailableUnits = request.AvailableUnits;
                existing.ModifiedBy = userName;
                existing.ModifiedDate = CommonHelper.GetISTTime(DateTime.Now);

                await _context.SaveChangesAsync();
                return Ok(ServiceResult.Ok("Unit type updated"));
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = Roles.AdminOrBuilder)]
        public async Task<ActionResult<ServiceResult>> Delete(int id)
        {
            var unit = await _context.ProjectUnitTypes.FindAsync(id);
            if (unit == null) return NotFound(ServiceResult.NotFound("Unit type not found"));
            unit.IsActive = false;
            await _context.SaveChangesAsync();
            return Ok(ServiceResult.Ok("Unit type removed"));
        }
    }
}
