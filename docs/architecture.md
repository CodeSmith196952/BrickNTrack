# Architecture Overview

## System Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Angular Frontend                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │   Core   │  │  Shared  │  │ Features │  │Layouts │  │
│  │ Module   │  │  Module  │  │ (Lazy)   │  │        │  │
│  └────┬─────┘  └──────────┘  └──────────┘  └────────┘  │
│       │ ApiService (HTTP)         │ SignalRService     │
└───────┼───────────────────────────┼────────────────────┘
        │                           │
        ▼                           ▼
┌───────────────────────────────────────────────────────────┐
│               ASP.NET Core 8 Web API                      │
│  ┌──────────────────┐  ┌───────────────┐  ┌───────────┐   │
│  │   Controllers    │  │  Middleware   │  │  SignalR  │   │
│  │   (19 total)     │  │  (Exception)  │  │  ChatHub  │   │
│  └────────┬─────────┘  └───────────────┘  └───────────┘   │
│           │                                               │
│  ┌────────▼─────────┐                                     │
│  │  Service Layer   │  (BrickNTrack.Business)             │
│  │  (6 services)    │                                     │
│  └────────┬─────────┘                                     │
│           │                                               │
│  ┌────────▼─────────┐                                     │
│  │  Repository Layer│  (BrickNTrack.Repository)           │
│  │  (5 repositories)│                                     │
│  └────────┬─────────┘                                     │
│           │                                               │
│  ┌────────▼─────────┐                                     │
│  │  Entity Framework│  (BrickNTrackContext)               │
│  │  Core 9 + SQL Srv│                                     │ 
│  └──────────────────┘                                     │
└───────────────────────────────────────────────────────────┘
```

## Project Structure

```
BrickNTrack/
├── API/
│   ├── BrickNTrackConstruction.sln
│   ├── BrickNTrackConstruction/          # Web API project
│   │   ├── Controllers/                  # 19 API controllers
│   │   ├── Core/
│   │   │   ├── Extension/                # DI registration
│   │   │   └── Helper/                   # JwtService, AutoMapperProfile
│   │   ├── Hubs/                         # SignalR ChatHub
│   │   ├── Middleware/                   # ExceptionHandlingMiddleware
│   │   └── Program.cs
│   ├── BrickNTrack.Business/             # Service layer
│   │   ├── BusinessLogic/                # Legacy ProjectManager
│   │   └── Services/                     # 6 service interfaces + implementations
│   ├── BrickNTrack.Domain/               # DTOs & shared models
│   │   ├── CommonModel/                  # ServiceResult, Pagination, Roles, etc.
│   │   └── Model/                        # 38 request/response DTOs
│   └── BrickNTrack.Repository/           # Data access layer
│       ├── Context/                      # EF DbContext
│       ├── Entity/                       # 20 entity classes
│       ├── EntityConfiguration/          # Fluent API configs
│       ├── Interface/                    # 5 repository interfaces
│       ├── Migrations/                   # EF migrations
│       └── Repositories/                 # 5 repository implementations
│
├── Frontend/
│   └── src/app/
│       ├── core/                         # Singleton services, guards, interceptors
│       ├── shared/                       # Reusable UI components
│       ├── features/                     # Lazy-loaded feature modules
│       ├── layouts/                      # Full layout (sidebar + header)
│       ├── dashboard/                    # Dashboard module
│       ├── login/                        # Login page
│       ├── landing-page/                 # Public landing page
│       ├── explore-properties/           # Property search
│       ├── property-information/         # Property detail page
│       ├── add-property/                 # Add property form
│       ├── cost-monitoring-dashboard/    # Cost tracking
│       ├── progress-tracker/             # Construction progress
│       ├── Master/                       # Builder & Project CRUD
│       ├── Admin-Role/                   # User management
│       └── service/                      # Legacy services (deprecated)
│
└── docs/                                 # This documentation
```

## Layer Responsibilities

| Layer | Project | Purpose |
|-------|---------|---------|
| **Presentation** | BrickNTrackConstruction | Controllers, middleware, SignalR hub, DI config |
| **Business** | BrickNTrack.Business | Service layer with validation, soft-delete, pagination |
| **Domain** | BrickNTrack.Domain | DTOs, ServiceResult, Roles, pagination models |
| **Data Access** | BrickNTrack.Repository | Entities, DbContext, repositories, EF configurations |

## Design Patterns

- **Repository Pattern** - Individual repository interfaces per entity (IBuilder, IProject, etc.)
- **Service Layer** - Business services wrap repositories, add validation and business logic
- **Result Pattern** - `ServiceResult<T>` provides consistent API responses with success/failure/status
- **Soft Delete** - Entities use `IsActive` flag instead of hard deletes
- **Role-Based Access** - JWT claims + `[Authorize(Roles = "...")]` on controllers
- **Lazy Loading** - Frontend feature modules loaded on demand via Angular router
