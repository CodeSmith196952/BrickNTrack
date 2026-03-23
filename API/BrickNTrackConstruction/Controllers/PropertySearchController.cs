using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Domain.Model;
using BrickNTrack.Repository.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BrickNTrackConstruction.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertySearchController : ControllerBase
    {
        private readonly BrickNTrackContext _context;

        public PropertySearchController(BrickNTrackContext context)
        {
            _context = context;
        }

        [HttpGet("suggest")]
        public async Task<ActionResult<ServiceResult<List<SearchSuggestion>>>> Suggest([FromQuery] string? q)
        {
            if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
                return Ok(ServiceResult<List<SearchSuggestion>>.Ok(new List<SearchSuggestion>()));

            var search = q.ToLower();

            // Search projects
            var projects = await _context.ProjectMasters
                .Include(p => p.BuilderMaster)
                .Where(p => p.IsActive)
                .Where(p => p.ProjectName.ToLower().Contains(search) ||
                             p.ProjectAddress.ToLower().Contains(search) ||
                             (p.City != null && p.City.ToLower().Contains(search)) ||
                             (p.Locality != null && p.Locality.ToLower().Contains(search)))
                .Take(5)
                .Select(p => new SearchSuggestion
                {
                    Text = p.ProjectName,
                    SubText = p.ProjectAddress,
                    Type = "property",
                    Id = p.ProjectId
                })
                .ToListAsync();

            // Search builders
            var builders = await _context.BuilderMasters
                .Where(b => b.IsActive)
                .Where(b => b.Name.ToLower().Contains(search))
                .Take(3)
                .Select(b => new SearchSuggestion
                {
                    Text = b.Name,
                    SubText = b.OfficeAddress,
                    Type = "builder",
                    Id = b.BuilderId
                })
                .ToListAsync();

            // Search cities/localities
            var locations = await _context.ProjectMasters
                .Where(p => p.IsActive)
                .Where(p => (p.City != null && p.City.ToLower().Contains(search)) ||
                             (p.Locality != null && p.Locality.ToLower().Contains(search)))
                .Select(p => new { p.City, p.Locality })
                .Distinct()
                .Take(3)
                .ToListAsync();

            var locationSuggestions = locations
                .Select(l => new SearchSuggestion
                {
                    Text = !string.IsNullOrEmpty(l.Locality) ? l.Locality : l.City ?? "",
                    SubText = l.City ?? "",
                    Type = "location",
                    Id = 0
                })
                .Where(s => !string.IsNullOrEmpty(s.Text))
                .ToList();

            var results = new List<SearchSuggestion>();
            results.AddRange(projects);
            results.AddRange(builders);
            results.AddRange(locationSuggestions);

            return Ok(ServiceResult<List<SearchSuggestion>>.Ok(results));
        }

        [HttpGet("search")]
        public async Task<ActionResult<ServiceResult<PaginatedResult<ProjectMasterResponse>>>> Search(
            [FromQuery] string? searchText,
            [FromQuery] string? propertyType,
            [FromQuery] int? minBedrooms,
            [FromQuery] int? maxBedrooms,
            [FromQuery] double? minPrice,
            [FromQuery] double? maxPrice,
            [FromQuery] string? possessionStatus,
            [FromQuery] string? city,
            [FromQuery] string? approvalType,
            [FromQuery] string? furnishingStatus,
            [FromQuery] string? facingDirection,
            [FromQuery] string? transactionType,
            [FromQuery] double? minArea,
            [FromQuery] double? maxArea,
            [FromQuery] bool? isGatedCommunity,
            [FromQuery] bool? hasParking,
            [FromQuery] double? minLat,
            [FromQuery] double? maxLat,
            [FromQuery] double? minLng,
            [FromQuery] double? maxLng,
            [FromQuery] string? sortBy,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.ProjectMasters
                .Include(p => p.BuilderMaster)
                .Include(p => p.ProjectUnitTypes)
                .Where(p => p.IsActive);

            if (!string.IsNullOrWhiteSpace(searchText))
            {
                var search = searchText.ToLower();
                query = query.Where(p =>
                    p.ProjectName.ToLower().Contains(search) ||
                    p.ProjectAddress.ToLower().Contains(search) ||
                    (p.City != null && p.City.ToLower().Contains(search)));
            }
            if (!string.IsNullOrWhiteSpace(propertyType))
                query = query.Where(p => p.PropertyType == propertyType);
            if (minBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms >= minBedrooms);
            if (maxBedrooms.HasValue)
                query = query.Where(p => p.Bedrooms <= maxBedrooms);
            if (minPrice.HasValue)
                query = query.Where(p => p.Budget >= minPrice);
            if (maxPrice.HasValue)
                query = query.Where(p => p.Budget <= maxPrice);
            if (!string.IsNullOrWhiteSpace(possessionStatus))
                query = query.Where(p => p.PossessionStatus == possessionStatus);
            if (!string.IsNullOrWhiteSpace(city))
                query = query.Where(p => p.City == city);
            if (!string.IsNullOrWhiteSpace(approvalType))
            {
                var approvalTypes = approvalType.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
                query = query.Where(p =>
                    (p.ApprovalType != null && approvalTypes.Any(a => p.ApprovalType.Contains(a))) ||
                    (approvalTypes.Contains("RERA") && p.ReraNumber != null && p.ReraNumber != "") ||
                    (approvalTypes.Contains("HMDA") && p.HMDANumber != null && p.HMDANumber != "") ||
                    (approvalTypes.Contains("DTCP") && p.DTCPNumber != null && p.DTCPNumber != ""));
            }
            if (!string.IsNullOrWhiteSpace(furnishingStatus))
                query = query.Where(p => p.FurnishingStatus == furnishingStatus);
            if (!string.IsNullOrWhiteSpace(facingDirection))
                query = query.Where(p => p.FacingDirection == facingDirection);
            if (!string.IsNullOrWhiteSpace(transactionType))
                query = query.Where(p => p.TransactionType == transactionType);
            if (minArea.HasValue)
                query = query.Where(p => p.AreaSqFt >= minArea);
            if (maxArea.HasValue)
                query = query.Where(p => p.AreaSqFt <= maxArea);
            if (isGatedCommunity.HasValue && isGatedCommunity.Value)
                query = query.Where(p => p.IsGatedCommunity);
            if (hasParking.HasValue && hasParking.Value)
                query = query.Where(p => p.ParkingCount != null && p.ParkingCount > 0);
            if (minLat.HasValue && maxLat.HasValue && minLng.HasValue && maxLng.HasValue)
                query = query.Where(p => p.Latitude >= minLat && p.Latitude <= maxLat
                                      && p.Longitude >= minLng && p.Longitude <= maxLng);

            var totalCount = await query.CountAsync();

            // Apply sorting
            IOrderedQueryable<BrickNTrack.Repository.Entity.ProjectMaster> orderedQuery;
            switch (sortBy?.ToLower())
            {
                case "price_asc":
                    orderedQuery = query.OrderBy(p => p.Budget);
                    break;
                case "price_desc":
                    orderedQuery = query.OrderByDescending(p => p.Budget);
                    break;
                case "newest":
                    orderedQuery = query.OrderByDescending(p => p.CreatedDate);
                    break;
                case "completion":
                    orderedQuery = query.OrderByDescending(p => p.CompletionPercentage);
                    break;
                case "area":
                    orderedQuery = query.OrderByDescending(p => p.AreaSqFt);
                    break;
                default:
                    orderedQuery = query.OrderByDescending(p => p.IsFeatured)
                        .ThenByDescending(p => p.CreatedDate);
                    break;
            }

            var projects = await orderedQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProjectMasterResponse
                {
                    ProjectId = p.ProjectId,
                    ProjectName = p.ProjectName,
                    ProjectDescription = p.ProjectDescription,
                    CompletionPercentage = p.CompletionPercentage,
                    ProjectAddress = p.ProjectAddress,
                    ProfileImage = p.ProfileImage,
                    Budget = p.Budget,
                    Status = p.Status,
                    BuilderId = p.BuilderId,
                    BuilderName = p.BuilderMaster.Name,
                    PropertyType = p.PropertyType,
                    Bedrooms = p.Bedrooms,
                    Bathrooms = p.Bathrooms,
                    AreaSqFt = p.AreaSqFt,
                    PricePerSqFt = p.PricePerSqFt,
                    PossessionStatus = p.PossessionStatus,
                    City = p.City,
                    State = p.State,
                    IsFeatured = p.IsFeatured,
                    ReraNumber = p.ReraNumber,
                    CarpetArea = p.CarpetArea,
                    SuperBuiltUpArea = p.SuperBuiltUpArea,
                    FurnishingStatus = p.FurnishingStatus,
                    FacingDirection = p.FacingDirection,
                    FloorNumber = p.FloorNumber,
                    TotalFloors = p.TotalFloors,
                    ParkingCount = p.ParkingCount,
                    ParkingType = p.ParkingType,
                    BalconyCount = p.BalconyCount,
                    TransactionType = p.TransactionType,
                    OwnershipType = p.OwnershipType,
                    MaintenanceCharges = p.MaintenanceCharges,
                    PropertyAge = p.PropertyAge,
                    HasPowerBackup = p.HasPowerBackup,
                    HasWaterSupply = p.HasWaterSupply,
                    IsGatedCommunity = p.IsGatedCommunity,
                    ViewCount = p.ViewCount,
                    Latitude = p.Latitude,
                    Longitude = p.Longitude,
                    Locality = p.Locality,
                    ApprovalType = p.ApprovalType,
                    HMDANumber = p.HMDANumber,
                    DTCPNumber = p.DTCPNumber,
                    MinUnitPrice = p.ProjectUnitTypes.Any(u => u.IsActive && u.Price > 0)
                        ? p.ProjectUnitTypes.Where(u => u.IsActive && u.Price > 0).Min(u => u.Price)
                        : (double?)null,
                    MaxUnitPrice = p.ProjectUnitTypes.Any(u => u.IsActive && u.Price > 0)
                        ? p.ProjectUnitTypes.Where(u => u.IsActive && u.Price > 0).Max(u => u.Price)
                        : (double?)null,
                    IsBuilderVerified = p.BuilderMaster != null && p.BuilderMaster.IsVerified
                })
                .ToListAsync();

            var result = PaginatedResult<ProjectMasterResponse>.Create(projects, totalCount, page, pageSize);
            return Ok(ServiceResult<PaginatedResult<ProjectMasterResponse>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceResult<ProjectMasterResponse>>> GetById(int id)
        {
            var project = await _context.ProjectMasters
                .Include(p => p.BuilderMaster)
                .Include(p => p.ProjectDataPaths.Where(d => d.IsActive))
                .Include(p => p.ProjectAmenities).ThenInclude(pa => pa.AmenityMaster)
                .FirstOrDefaultAsync(p => p.ProjectId == id && p.IsActive);

            if (project == null)
                return NotFound(ServiceResult<ProjectMasterResponse>.NotFound("Property not found"));

            // Increment view count
            project.ViewCount++;
            await _context.SaveChangesAsync();

            var response = new ProjectMasterResponse
            {
                ProjectId = project.ProjectId,
                ProjectName = project.ProjectName,
                ProjectDescription = project.ProjectDescription,
                CompletionPercentage = project.CompletionPercentage,
                StartDate = project.StartDate,
                CompletionDate = project.CompletionDate,
                ProjectAddress = project.ProjectAddress,
                ProfileImage = project.ProfileImage,
                ReraNumber = project.ReraNumber,
                Budget = project.Budget,
                Status = project.Status,
                BuilderId = project.BuilderId,
                BuilderName = project.BuilderMaster?.Name,
                PropertyType = project.PropertyType,
                Bedrooms = project.Bedrooms,
                Bathrooms = project.Bathrooms,
                AreaSqFt = project.AreaSqFt,
                PricePerSqFt = project.PricePerSqFt,
                PossessionStatus = project.PossessionStatus,
                ApprovalType = project.ApprovalType,
                HMDANumber = project.HMDANumber,
                DTCPNumber = project.DTCPNumber,
                City = project.City,
                State = project.State,
                Pincode = project.Pincode,
                Amenities = project.Amenities,
                IsFeatured = project.IsFeatured,
                CarpetArea = project.CarpetArea,
                SuperBuiltUpArea = project.SuperBuiltUpArea,
                FurnishingStatus = project.FurnishingStatus,
                FacingDirection = project.FacingDirection,
                FloorNumber = project.FloorNumber,
                TotalFloors = project.TotalFloors,
                ParkingCount = project.ParkingCount,
                ParkingType = project.ParkingType,
                BalconyCount = project.BalconyCount,
                TransactionType = project.TransactionType,
                OwnershipType = project.OwnershipType,
                MaintenanceCharges = project.MaintenanceCharges,
                FloorPlanImage = project.FloorPlanImage,
                VideoTourUrl = project.VideoTourUrl,
                BrochureUrl = project.BrochureUrl,
                PropertyAge = project.PropertyAge,
                HasPowerBackup = project.HasPowerBackup,
                HasWaterSupply = project.HasWaterSupply,
                IsGatedCommunity = project.IsGatedCommunity,
                ViewCount = project.ViewCount,
                Latitude = project.Latitude,
                Longitude = project.Longitude,
                Locality = project.Locality,
                IsBuilderVerified = project.BuilderMaster != null && project.BuilderMaster.IsVerified,
                BuilderMaster = project.BuilderMaster != null ? new BuilderMasterResponse
                {
                    BuilderId = project.BuilderMaster.BuilderId,
                    Name = project.BuilderMaster.Name,
                    TagLine = project.BuilderMaster.TagLine,
                    Description = project.BuilderMaster.Description,
                    OfficeAddress = project.BuilderMaster.OfficeAddress,
                    EmailAddress = project.BuilderMaster.EmailAddress,
                    Contact1 = project.BuilderMaster.Contact1,
                    IsVerified = project.BuilderMaster.IsVerified
                } : null
            };

            // Load unit types
            var unitTypes = await _context.ProjectUnitTypes
                .Where(u => u.ProjectId == id)
                .OrderBy(u => u.Bedrooms)
                .ThenBy(u => u.Price)
                .Select(u => new ProjectUnitTypeResponse
                {
                    Id = u.Id, UnitName = u.UnitName, UnitType = u.UnitType,
                    Bedrooms = u.Bedrooms, Bathrooms = u.Bathrooms,
                    CarpetArea = u.CarpetArea, SuperBuiltUpArea = u.SuperBuiltUpArea,
                    Price = u.Price, PricePerSqFt = u.PricePerSqFt,
                    FacingDirection = u.FacingDirection, FurnishingStatus = u.FurnishingStatus,
                    FloorNumber = u.FloorNumber, TotalFloors = u.TotalFloors,
                    ParkingCount = u.ParkingCount, BalconyCount = u.BalconyCount,
                    TotalUnits = u.TotalUnits, AvailableUnits = u.AvailableUnits
                })
                .ToListAsync();
            response.UnitTypes = unitTypes;

            // Load amenities
            response.AmenityList = project.ProjectAmenities?
                .Where(pa => pa.AmenityMaster != null)
                .Select(pa => new AmenityMasterResponse
                {
                    AmenityId = pa.AmenityMaster.AmenityId,
                    Name = pa.AmenityMaster.Name,
                    Icon = pa.AmenityMaster.Icon,
                    Category = pa.AmenityMaster.Category
                }).ToList() ?? new List<AmenityMasterResponse>();

            return Ok(ServiceResult<ProjectMasterResponse>.Ok(response));
        }
    }

    public class SearchSuggestion
    {
        public string Text { get; set; } = "";
        public string SubText { get; set; } = "";
        public string Type { get; set; } = ""; // "property", "builder", "location"
        public int Id { get; set; }
    }
}
