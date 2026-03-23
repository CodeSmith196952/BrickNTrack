# BrickNTrack

**Transparent Construction Tracking & Real Estate Platform**

A full-stack real estate platform that connects home buyers with builders, offering real-time construction progress tracking, property search, and comprehensive property management.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 14, PrimeNG, Angular Material, Leaflet Maps |
| Backend | .NET 9, ASP.NET Core Web API, Entity Framework Core |
| Database | SQL Server (Azure SQL Edge via Docker) |
| Real-time | SignalR (messaging, notifications) |
| Auth | JWT Bearer tokens with role-based access (Admin, Builder, Buyer) |

## Quick Start

### Prerequisites
- Node.js 18+
- .NET 9 SDK
- Docker (for SQL Server)

### Database
```bash
# SQL Server runs in Docker
docker ps  # should show brickntrack-sqlserver container
# Connection: localhost:1433, sa/BrickN#Track2024, Database: Brickntrack
```

### Backend API
```bash
cd API/BrickNTrackConstruction
dotnet run --environment Development --urls http://localhost:5001
# Swagger: http://localhost:5001/swagger
```

### Frontend
```bash
cd Frontend
npm install
ng serve --port 4200
# App: http://localhost:4200
```

### Default Accounts
| Role | Username | Password |
|------|----------|----------|
| Admin | admin@local.com | Admin@12345 |

## Architecture

```
BrickNTrack/
├── API/
│   ├── BrickNTrack.Domain/          # DTOs, Request/Response models
│   ├── BrickNTrack.Repository/      # EF Core entities, DbContext, repositories
│   │   ├── Entity/                  # Domain entities
│   │   ├── Context/                 # BrickNTrackContext with soft-delete filter
│   │   ├── Migrations/              # Single consolidated migration
│   │   └── Repositories/            # BaseRepository<T> + specific repos
│   ├── BrickNTrack.Business/        # Service layer
│   └── BrickNTrackConstruction/     # ASP.NET Core Web API
│       ├── Controllers/             # REST API endpoints
│       ├── Core/Extension/          # DI, DbSeeder, AutoMapper
│       ├── Hubs/                    # SignalR ChatHub
│       └── Middleware/              # Exception handling
│
└── Frontend/src/app/
    ├── core/                        # Services (API, Auth, SignalR), guards, models
    ├── shared/                      # Shared components, base classes
    ├── layouts/full/                # Authenticated layout (sidebar + topbar)
    ├── dashboard/                   # Role-based dashboards
    ├── explore-properties/          # Public property search with filters
    ├── property-information/        # Property detail (2-column layout)
    ├── add-property/                # Add/edit property (tabbed dialog)
    ├── Master/                      # Builder Master, Project Master, Milestones, Expenses
    ├── features/
    │   ├── messaging/               # Real-time chat (SignalR)
    │   ├── notifications/           # Notification center
    │   ├── booking/                 # Property bookings
    │   └── reviews/                 # Property reviews & ratings
    ├── saved-properties/            # Saved/favorited properties
    ├── recently-viewed/             # Recently viewed properties
    ├── property-compare/            # Side-by-side property comparison
    ├── cost-monitoring-dashboard/   # Budget vs spend tracking
    └── progress-tracker/            # Construction stage tracking
```

## Key Features

### For Home Buyers
- **Property Search** - Full-text search with filters (type, price, bedrooms, possession, approvals, amenities, area, furnishing, facing)
- **Property Detail** - 2-column layout with image gallery, specs, amenities with icons, construction progress timeline, legal documents, builder info, location map
- **Save & Compare** - Heart button to save properties, compare up to 4 side-by-side
- **Book Appointments** - Schedule site visits with date/time slot picker
- **Contact Builder** - Real-time messaging via SignalR
- **Reviews & Ratings** - Rate properties on quality, value, location
- **EMI Calculator** - Built into property detail page
- **Map View** - Leaflet-based map with property markers

### For Builders
- **Property Management** - Tabbed add/edit form (Basic Details, Location, Features, Media)
- **Unit Configurations** - Define multiple unit types per project (2BHK, 3BHK, etc.) with floor plans
- **Construction Progress** - Stage-by-stage tracking with photos
- **Cost Monitoring** - Budget vs actual spend per milestone
- **Amenity Management** - Select from 48 predefined amenities with icons
- **Media Upload** - Multi-photo upload with categories, profile images
- **Appointments** - View and manage buyer visit requests

### For Admin
- **User Management** - Create/manage users with role assignment
- **Builder Verification** - Verify builder profiles
- **Announcements** - Broadcast to all users or specific roles
- **Reports** - User reports and moderation

## Database Entities

### Core
- `UserManager` - Users with roles (Admin, Builder, Buyer)
- `BuilderMaster` - Builder profiles with verification
- `ProjectMaster` - Properties with 50+ fields (specs, location, pricing, approvals)

### Property Details
- `ProjectUnitType` - Unit configurations (BHK types, pricing, floor plans)
- `ProjectDataPath` - Property images/documents
- `AmenityMaster` - 48 predefined amenities with icons & categories
- `ProjectAmenity` - Many-to-many join (project <-> amenities)
- `ProjectMilestone` - Construction milestones with budgets
- `ProjectExpenses` - Expense tracking per milestone
- `ConstructionStageProgress` - Stage-wise progress with photos

### Social
- `Conversation` / `Message` - Real-time messaging
- `Review` - Property reviews with multi-criteria ratings
- `SavedProperty` - Favorited properties
- `PropertyBooking` - Property reservations with payments
- `Appointment` - Site visit scheduling
- `Notification` / `NotificationSetting` - Push notifications
- `Announcement` - Builder/admin announcements
- `UserReport` - Content reporting/moderation

## API Endpoints

### Property Search (Public)
- `GET /api/PropertySearch/search` - Paginated search with 20+ filter params
- `GET /api/PropertySearch/suggest` - Autocomplete suggestions
- `GET /api/PropertySearch/{id}` - Property detail with unit types & amenities

### Amenities
- `GET /api/Amenity/all` - All amenities grouped by category
- `GET /api/Amenity/project/{id}` - Project amenities
- `POST /api/Amenity/project/{id}` - Update project amenities

### Appointments
- `POST /api/Appointment` - Schedule site visit (auto-resolves builder user)
- `GET /api/Appointment/my-appointments` - List appointments
- `PUT /api/Appointment/{id}/status` - Update status (Confirmed/Cancelled)

### Messaging
- `GET /api/Messaging/conversations` - List conversations
- `POST /api/Messaging/conversations` - Start conversation
- `GET /api/Messaging/conversations/{id}/messages` - Get messages
- `POST /api/Messaging/messages` - Send message
- SignalR Hub: `/hubs/chat` - Real-time messaging

## Configuration

### API Settings (`appsettings.Development.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;User Id=sa;Password=BrickN#Track2024;Database=Brickntrack;TrustServerCertificate=True;"
  },
  "AppSettings": {
    "ImageVirtualDirectoryURL": "http://localhost:5001/ProjectImage",
    "ImageLocalDirectory": "/tmp/BrickNTrack/ProjectImagePath"
  }
}
```

### Frontend Environment (`environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api',
  signalRUrl: 'http://localhost:5001/hubs/chat'
};
```

## Approvals System
Properties can have multiple approval types simultaneously:
- **RERA** - Real Estate Regulatory Authority
- **HMDA** - Hyderabad Metropolitan Development Authority
- **DTCP** - Directorate of Town and Country Planning

Each stored as separate fields (`ReraNumber`, `HMDANumber`, `DTCPNumber`) with a combined `ApprovalType` field for filtering.

## Amenities
48 predefined amenities across 6 categories, seeded on first startup:
- **Top Facilities** - Swimming Pool, Gymnasium, Club House, etc.
- **Sports** - Badminton, Basketball, Cricket, Tennis, etc.
- **Leisure** - Yoga, Sun Deck, Library, Mini Theatre, etc.
- **Security** - Gated Community, CCTV, Fire Fighting, etc.
- **Convenience** - Parking, Lifts, Shopping, EV Charging, etc.
- **Utilities** - Power Backup, Water Supply, Solar, Wi-Fi, etc.

## Global Soft-Delete
All entities extending `CommonEntity` have automatic `IsActive` query filters via EF Core's `HasQueryFilter`. Use `.IgnoreQueryFilters()` to include inactive records.
