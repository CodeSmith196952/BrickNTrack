# Frontend Module Structure

## Module Hierarchy

```
AppModule (root)
  ├── CoreModule (singleton services, interceptors)
  ├── SharedModule (reusable components, PrimeNG re-exports)
  ├── DashboardModule (dashboard + sub-components)
  ├── ComponentsModule (Material demo components)
  └── Lazy-loaded Feature Modules
      ├── MessagingModule (/messaging)
      ├── NotificationsModule (/notifications)
      ├── BookingModule (/booking)
      └── ReviewsModule (/reviews)
```

## Core Module

Location: `src/app/core/`

Imported once in AppModule. Provides singleton services and the HTTP interceptor.

**Services (all `providedIn: 'root'`):**

| Service | File | Purpose |
|---------|------|---------|
| ApiService | `services/api.service.ts` | HTTP client wrapper with typed ServiceResult responses |
| AuthService | `services/auth.service.ts` | Login, logout, token management, JWT decoding, user info |
| MenuService | `services/menu.service.ts` | Returns role-based sidebar menu items |
| SignalRService | `services/signalr.service.ts` | SignalR hub connection for real-time messaging |

**Guards:**

| Guard | File | Purpose |
|-------|------|---------|
| AuthGuard | `guards/auth.guard.ts` | Blocks unauthenticated access, redirects to /login |
| RoleGuard | `guards/role.guard.ts` | Checks user role against `route.data.roles` array |

**Interceptors:**

| Interceptor | File | Purpose |
|-------------|------|---------|
| AuthInterceptor | `interceptors/auth.interceptor.ts` | Attaches Bearer token, handles 401 with auto-refresh |

**Models:**

| File | Exports |
|------|---------|
| `models/index.ts` | TypeScript interfaces for all entities (ProjectMaster, BuilderMaster, Conversation, ChatMessage, Notification, PropertyBooking, Review, CostMonitoring, etc.) |

## Shared Module

Location: `src/app/shared/`

Imported by feature modules. Declares reusable components and re-exports common Angular + PrimeNG modules.

**Components:**

| Component | Selector | Purpose |
|-----------|----------|---------|
| PropertyCardComponent | `<app-property-card>` | Property listing card with image, specs, price, builder |
| PaginationComponent | `<app-pagination>` | Previous/Next pagination with page counter |
| StarRatingComponent | `<app-star-rating>` | Interactive star rating (1-5) with hover, supports readonly |
| ConfirmationDialogComponent | `<app-confirmation-dialog>` | Modal confirmation dialog using PrimeNG Dialog |

**Re-exported Modules:** CommonModule, FormsModule, ReactiveFormsModule, RouterModule, TableModule, DialogModule, ToastModule, DropdownModule, InputTextModule, InputNumberModule, CheckboxModule, TimelineModule, TabViewModule, MultiSelectModule, AccordionModule, BadgeModule

## Feature Modules (Lazy-loaded)

### MessagingModule
Location: `src/app/features/messaging/`
Route: `/messaging`

| Component | Route | Purpose |
|-----------|-------|---------|
| ConversationListComponent | `/messaging` | Lists conversations with unread badges |
| ChatWindowComponent | `/messaging/:id` | Real-time chat with SignalR integration |

### NotificationsModule
Location: `src/app/features/notifications/`
Route: `/notifications`

| Component | Route | Purpose |
|-----------|-------|---------|
| NotificationListComponent | `/notifications` | Lists notifications with mark-read actions |
| NotificationSettingsComponent | `/notifications/settings` | Toggle email/SMS/push/in-app preferences |

### BookingModule
Location: `src/app/features/booking/`
Route: `/booking`

| Component | Route | Purpose |
|-----------|-------|---------|
| BookingFormComponent | `/booking/create/:projectId` | Booking form with payment details |
| BookingHistoryComponent | `/booking/my-bookings` | Buyer's booking history |
| BookingHistoryComponent | `/booking/manage` | Builder's booking management |

### ReviewsModule
Location: `src/app/features/reviews/`
Route: `/reviews`

| Component | Route | Purpose |
|-----------|-------|---------|
| ReviewListComponent | `/reviews` | Lists reviews with star ratings |
| ReviewFormComponent | `/reviews/create/:projectId` | Multi-criteria review submission form |

## App-level Components (declared in AppModule)

| Component | Route | Purpose |
|-----------|-------|---------|
| LoginComponent | `/login` | User login form |
| LandingPageComponent | `/landingPage` | Public homepage with featured properties |
| ExplorePropertiesComponent | `/exploreProperties` | Public property search with filters and pagination |
| PropertyInformationComponent | `/propertyInformation/:id` | Property detail with amenities, progress, reviews, save |
| AddPropertyComponent | `/property` | Add/edit property form |
| CostMonitoringDashboardComponent | `/costMonitoringDashboard` | Cost tracking with stage breakdown |
| ProgressTrackerComponent | `/progressTracker` | Construction stage timeline |
| DashboardComponent | `/dashboard` | Role-based dashboard (Builder/Buyer/Admin) |
| BuilderMasterComponent | `/buildermaster` | Builder CRUD |
| ProjectMasterComponent | `/projectmaster` | Project CRUD |
| ProjectmilestoneComponent | `/projectmilestone/:id` | Milestone CRUD per project |
| ExpensesComponent | `/expenses/:id` | Expense CRUD per milestone |
| UserRegistrationComponent | `/userRegister` | User management (Admin) |
| EditProfileComponent | `/editProfile` | Edit user profile |
| ContactUsComponent | `/contactUs` | Contact page |
| AboutUsComponent | `/aboutUs` | About page |
| PageNotFoundComponent | `**` | 404 page |

## Layout

| Component | Purpose |
|-----------|---------|
| FullComponent | Authenticated layout with role-based sidebar, header with user menu, and router-outlet |

The sidebar menu is dynamically generated by `MenuService.getMenuForRole(role)` based on the logged-in user's role (Admin, Builder, or Buyer).

## Routing Summary

**Public routes (no auth required):**
- `/landingPage`, `/login`, `/exploreProperties`, `/contactUs`, `/aboutUs`, `/propertyInformation/:id`

**Authenticated routes (AuthGuard, inside FullComponent sidebar layout):**
- All dashboard, master, property, cost, progress routes
- Lazy-loaded feature modules: `/messaging/*`, `/notifications/*`, `/booking/*`, `/reviews/*`

**Admin-only routes (RoleGuard):**
- `/admin/users`
