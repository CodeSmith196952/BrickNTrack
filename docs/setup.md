# Setup Guide

## Prerequisites

- .NET 8 SDK
- Node.js 16+ and npm
- SQL Server (local or remote)
- Angular CLI (`npm install -g @angular/cli@15`)

## Backend Setup

### 1. Configure Database Connection

Edit `API/BrickNTrackConstruction/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=BrickNTrack;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "JwtSettings": {
    "Key": "your-secret-key-minimum-32-characters-long",
    "Issuer": "yourapp",
    "Audience": "yourapp_users",
    "DurationInMinutes": 60,
    "RefreshTokenTTL": 60,
    "ExpiryMinutes": 60
  },
  "AppSettings": {
    "ImageLocalDirectory": "D://BrickNTrack//ProjectImagePath",
    "ImageVirtualDirectoryURL": "http://localhost:5000/ProjectImage"
  }
}
```

### 2. Apply Database Migrations

```bash
cd API
dotnet ef migrations add InitialCreate --project BrickNTrack.Repository --startup-project BrickNTrackConstruction
dotnet ef database update --project BrickNTrack.Repository --startup-project BrickNTrackConstruction
```

### 3. Build and Run

```bash
cd API
dotnet build
dotnet run --project BrickNTrackConstruction
```

The API will start at `http://localhost:5000` (or the configured port).
Swagger UI available at `http://localhost:5000/swagger`.

### 4. Create Initial Admin User

Use Swagger or a POST request to register the first user, then update their role directly in the database:

```sql
UPDATE UserManager SET Role = 'Admin' WHERE UserName = 'your-admin-username';
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd Frontend
npm install
```

### 2. Configure API URL

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api',
  signalRUrl: 'http://localhost:5000/hubs/chat'
};
```

### 3. Build and Run

```bash
# Development server
ng serve

# Production build
ng build --configuration production
```

The app will be available at `http://localhost:4200`.

## CORS Configuration

The backend allows all origins by default (configured in Program.cs). For production, restrict CORS to your frontend domain:

```csharp
builder.AllowAnyOrigin()  // Change to: builder.WithOrigins("https://yourdomain.com")
.AllowAnyMethod()
.AllowAnyHeader();
```

Note: When restricting origins, also add `.AllowCredentials()` for SignalR to work properly.

## Image Upload Configuration

Create the image upload directory on the server:

```bash
mkdir -p /path/to/BrickNTrack/ProjectImagePath
```

Update `appsettings.json` with the correct paths:
- `ImageLocalDirectory`: Physical path where files are stored
- `ImageVirtualDirectoryURL`: Public URL to access uploaded files

For production, configure a static file server or CDN to serve images from the upload directory.

## Project Structure Quick Reference

```
API/BrickNTrackConstruction.sln
  BrickNTrackConstruction.csproj    -> Web API (net8.0)
  BrickNTrack.Business.csproj       -> Service layer (net8.0)
  BrickNTrack.Domain.csproj         -> DTOs (net8.0)
  BrickNTrack.Repository.csproj     -> Data access (net8.0)

Frontend/
  angular.json                      -> Angular 15 config
  package.json                      -> Dependencies
  src/app/                          -> Application source
```

## Key NuGet Packages

| Package | Version | Purpose |
|---------|---------|---------|
| Microsoft.EntityFrameworkCore.SqlServer | 9.0.7 | SQL Server EF provider |
| Microsoft.AspNetCore.Authentication.JwtBearer | 8.0.18 | JWT authentication |
| AutoMapper | 12.0.0 | Object mapping |
| BCrypt.Net-Next | 4.0.3 | Password hashing |
| Microsoft.AspNetCore.SignalR.Common | 8.0.0 | Real-time communication |
| Swashbuckle.AspNetCore | 6.6.2 | Swagger/OpenAPI |

## Key npm Packages

| Package | Version | Purpose |
|---------|---------|---------|
| @angular/core | 15.x | Angular framework |
| primeng | 15.4.x | UI component library |
| @microsoft/signalr | latest | SignalR client for real-time chat |
| sweetalert2 | latest | Alert/confirmation dialogs |
| angular-feather | latest | Feather icons for sidebar |
| bootstrap | 5.1.x | CSS framework |
| leaflet | 1.9.x | Map component |
| exceljs | 4.4.x | Excel export |

## Troubleshooting

**Database migration fails:**
Ensure SQL Server is running and the connection string is correct. Check that the EF Core tools are installed: `dotnet tool install --global dotnet-ef`

**Angular build warnings about CommonJS:**
These are harmless warnings about SweetAlert2. Add to `angular.json` under `build.options`:
```json
"allowedCommonJsDependencies": ["sweetalert2"]
```

**SignalR connection fails:**
Ensure CORS is configured to allow the frontend origin. Check that the JWT token is being passed correctly in the SignalR connection query string.

**Images not loading:**
Verify the `ImageLocalDirectory` path exists and the application has write permissions. Check that the `ImageVirtualDirectoryURL` matches your server's static file configuration.
