# BrickNTrack Frontend

Angular 14 SPA for the BrickNTrack real estate platform.

## Setup
```bash
npm install
ng serve --port 4200
```

## API Connection
Configure in `src/environments/environment.ts`:
```typescript
apiUrl: 'http://localhost:5001/api'
```

## Project Structure
- `core/` - ApiService, AuthService, SignalRService, guards, interceptors
- `shared/` - Reusable components (Pagination, MapView, PropertyCard, StarRating, EmiCalculator)
- `layouts/full/` - Authenticated shell with sidebar navigation
- `explore-properties/` - Property search with hero banner, filters, card grid
- `property-information/` - Property detail with 2-column layout (main + sidebar)
- `add-property/` - Tabbed property form (Basic, Location, Features with amenity picker, Media)
- `features/` - Lazy-loaded modules (messaging, notifications, booking, reviews)

## Roles
- **Buyer** - Search, save, compare, review, message builders, book visits
- **Builder** - Manage properties, unit configs, milestones, expenses, appointments
- **Admin** - User management, builder verification, announcements
