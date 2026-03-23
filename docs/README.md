# BrickNTrack Documentation

BrickNTrack is a full-stack construction and property management platform built with ASP.NET Core 8 (backend) and Angular 15 (frontend).

## Documentation Index

| Document | Description |
|----------|-------------|
| [Architecture Overview](./architecture.md) | System architecture, project structure, tech stack |
| [Entity Reference](./entities.md) | All database entities with field descriptions |
| [API Reference](./api-reference.md) | All REST API endpoints grouped by controller |
| [Frontend Modules](./frontend-modules.md) | Angular module structure, components, services |
| [Authentication & Authorization](./auth.md) | JWT auth flow, role-based access, guards |
| [Features Guide](./features.md) | Feature descriptions mapped to PDF requirements |
| [Setup Guide](./setup.md) | How to build, run, and configure the project |

## Quick Start

```bash
# Backend
cd API
dotnet ef database update
dotnet run --project BrickNTrackConstruction

# Frontend
cd Frontend
npm install
ng serve
```

## Tech Stack

- **Backend:** .NET 8, Entity Framework Core 9, SQL Server, SignalR, JWT Authentication
- **Frontend:** Angular 15, PrimeNG 15, Bootstrap 5, Angular Material, Leaflet Maps
- **Real-time:** SignalR (chat, notifications)
