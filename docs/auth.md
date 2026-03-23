# Authentication & Authorization

## Overview

BrickNTrack uses JWT Bearer token authentication with role-based authorization. Tokens are issued on login and refreshed automatically when expired.

## Roles

| Role | Description | Access Level |
|------|-------------|-------------|
| Admin | Platform administrator | Full access to all features, user management, moderation |
| Builder | Construction company user | Manage own projects, milestones, expenses, respond to reviews |
| Buyer | Property buyer | Search properties, book appointments, write reviews, messaging |

Role constants are defined in `BrickNTrack.Domain.CommonModel.Roles`:
```csharp
public static class Roles
{
    public const string Admin = "Admin";
    public const string Builder = "Builder";
    public const string Buyer = "Buyer";
    public const string AdminOrBuilder = "Admin,Builder";
    public const string All = "Admin,Builder,Buyer";
}
```

## JWT Token Structure

Tokens are generated with these claims:

| Claim | Description |
|-------|-------------|
| `ClaimTypes.Name` | Username |
| `ClaimTypes.NameIdentifier` | User ID |
| `ClaimTypes.Role` | User role (Admin/Builder/Buyer) |
| `UserId` | Custom claim with user ID |
| `BuilderId` | Custom claim with associated builder ID |

**Token Configuration (appsettings.json):**
```json
{
  "JwtSettings": {
    "Key": "your-secret-key",
    "Issuer": "yourapp",
    "Audience": "yourapp_users",
    "DurationInMinutes": 60,
    "RefreshTokenTTL": 60
  }
}
```

## Authentication Flow

```
1. User sends POST /api/UserManager/login
   Body: { username, password }

2. Server validates credentials (BCrypt)
   Returns: { jwtToken, refreshToken, role, userInfo }

3. Frontend stores tokens in sessionStorage
   auth-token = jwtToken
   refresh-token = refreshToken
   auth-user = JSON.stringify(userInfo)

4. All subsequent requests include:
   Authorization: Bearer <jwtToken>

5. On 401 response, interceptor attempts refresh:
   POST /api/UserManager/RefreshToken
   Body: { refreshToken }

6. If refresh succeeds, retry original request
   If refresh fails, redirect to /login
```

## Backend Authorization

Controllers use the `[Authorize]` attribute with role specifications:

```csharp
// Require any authenticated user
[Authorize]

// Require specific role
[Authorize(Roles = Roles.Admin)]

// Require one of multiple roles
[Authorize(Roles = Roles.AdminOrBuilder)]  // "Admin,Builder"

// Allow anonymous access (override controller-level auth)
[AllowAnonymous]
```

## Frontend Guards

**AuthGuard** (`core/guards/auth.guard.ts`):
- Checks if user has a valid (non-expired) JWT token
- Redirects to `/login` if not authenticated
- Applied to the parent `FullComponent` route (protects all child routes)

**RoleGuard** (`core/guards/role.guard.ts`):
- Checks user's role against `route.data.roles` array
- Redirects to `/` if role doesn't match
- Usage in routing:
```typescript
{
  path: 'admin/users',
  component: UserRegistrationComponent,
  canActivate: [RoleGuard],
  data: { roles: ['Admin'] }
}
```

## Frontend Interceptor

**AuthInterceptor** (`core/interceptors/auth.interceptor.ts`):
- Attaches `Authorization: Bearer <token>` to all HTTP requests
- Catches 401 responses (except login/refresh endpoints)
- Attempts automatic token refresh using the refresh token
- Queues concurrent requests during refresh (prevents multiple refresh calls)
- Redirects to login if refresh fails

## Frontend AuthService

**Key methods:**

| Method | Returns | Description |
|--------|---------|-------------|
| `login(request)` | `Observable<UserToken>` | Authenticate and store session |
| `logout()` | void | Clear session, redirect to /login |
| `refreshToken()` | `Observable<string>` | Get new JWT using refresh token |
| `isLoggedIn()` | boolean | Check if token exists and not expired |
| `getToken()` | string | Get current JWT from sessionStorage |
| `getUserRole()` | string | Decode role from JWT payload |
| `getUserId()` | number | Decode user ID from JWT payload |
| `getBuilderId()` | number | Decode builder ID from JWT payload |
| `getUserDisplayName()` | string | Get "FirstName LastName" from stored user |

## Role-Based Sidebar

The sidebar menu is dynamically generated based on the user's role:

**Admin sees:** Dashboard, Admin (User Management, Moderation, Analytics), Master (Builder, Project), Add Property, Messages, Notifications, Bookings

**Builder sees:** Dashboard, Master (Builder, Project), Add Property, Cost Monitoring, Progress Tracker, Messages, Notifications, Bookings, Reviews

**Buyer sees:** Dashboard, Explore Properties, My Bookings, Messages, Notifications, My Reviews

## Password Security

- Passwords are hashed using BCrypt (BCrypt.Net-Next library)
- Password hash is never returned in API responses
- Minimum 6 characters required (enforced by DTO validation)
