# Features Guide

This document maps PDF requirements to implemented features.

## 1. Property Hub (PDF Page 1)

Property listing and management for builders.

**Backend:** ProjectController, FileUploadService
**Frontend:** AddPropertyComponent, ProjectMasterComponent

**Capabilities:**
- View all properties with summary cards (Total, Active, Under Construction, Avg Price)
- Add new property with image upload
- Edit existing properties
- View property details with milestones and expenses
- Builder-scoped property filtering (each builder sees only their properties)

## 2. Property Search (PDF Page 2)

Public property discovery with advanced filters.

**Backend:** PropertySearchController
**Frontend:** ExplorePropertiesComponent

**Capabilities:**
- Full-text search across name, address, city
- Filter by: Property Type, Bedrooms, Price Range, Possession Status, City, Approval Type
- Paginated results sorted by featured status and date
- Property cards showing image, specs, price, builder, completion percentage
- Featured properties appear first

**Search Filters:**
- Property Type: Apartment, Villa, Plot, Commercial
- Bedrooms: 1-5+ BHK
- Price Range: Min/Max slider
- Possession Status: Ready to Move, Under Construction
- Approvals: RERA, HMDA, DTCP

## 3. Property Detail (PDF Page 3)

Comprehensive property information page.

**Backend:** PropertySearchController (GET /{id}), ConstructionProgressController, ReviewController, SavedPropertyController
**Frontend:** PropertyInformationComponent

**Capabilities:**
- Image gallery with fullscreen viewer
- Property specs: sqft, bedrooms, bathrooms, type
- Price display with status badge
- Save/Unsave property (heart icon)
- Book Appointment button
- Full description
- Amenities grid (parsed from JSON)
- Legal documents display (RERA, HMDA, DTCP numbers)
- Construction progress section with per-stage progress bars
- Builder information
- Reviews section with multi-criteria ratings
- Builder responses on reviews
- Write a Review link (authenticated users)

## 4. Construction Progress Tracker (PDF Pages 4-5)

Track construction stages with photos and updates.

**Backend:** ConstructionProgressController
**Frontend:** ProgressTrackerComponent

**8 Standard Construction Stages:**
1. Planning & Permissions
2. Excavation & Foundation
3. Structure & Slabs
4. Brickwork & Walls
5. Electrical & Plumbing
6. Plastering
7. Flooring
8. Painting & Interiors
9. Final Inspection & Handover

**Capabilities:**
- Project selector dropdown
- Overall progress percentage with colored progress bar
- PrimeNG Timeline displaying each stage
- Per-stage: name, completion %, planned/actual dates, notes, status badge
- Stage photo gallery
- Add Construction Update dialog (stage, title, description, completion slider, photo upload)
- Progress summary API (total stages, completed, in-progress, overall %)

## 5. Cost Monitoring Dashboard (PDF Pages 6-7)

Track construction expenses and budget utilization.

**Backend:** CostMonitoringController
**Frontend:** CostMonitoringDashboardComponent

**Capabilities:**
- Summary cards: Total Budget, Total Spent, Remaining, Budget Utilization %
- Project selector (for builders with multiple projects)
- Stage-wise cost breakdown table (budgeted vs spent per milestone)
- Budget health indicator (Healthy/Warning/Critical)
- Recent expenses table
- Builder summary across all projects
- Utilization percentage with progress bar and color coding (green < 75%, yellow 75-90%, red > 90%)

## 6. Real-Time Messaging (PDF Page 8)

Instant messaging between buyers and sellers.

**Backend:** MessagingController, ChatHub (SignalR)
**Frontend:** MessagingModule (ConversationListComponent, ChatWindowComponent)

**Capabilities:**
- Conversation list with last message preview, timestamps, unread badges
- Real-time chat with SignalR
- Message sent/received styling (blue = sent, grey = received)
- Typing indicators (shows "X is typing...")
- Mark messages as read
- Message flagging for admin moderation
- Conversation creation per property

## 7. Notifications (PDF Page 9)

Smart notification system with user preferences.

**Backend:** NotificationController
**Frontend:** NotificationsModule (NotificationListComponent, NotificationSettingsComponent)

**Notification Types:** message, booking, review, system

**Capabilities:**
- Notification list with read/unread styling
- Mark individual or all as read
- Unread count API (for header badge)
- Notification settings: toggle Email, SMS, Push, In-App
- Auto-create default settings for new users

## 8. Admin Panel (PDF Pages 9, 12)

Platform administration and moderation.

**Backend:** AdminController
**Frontend:** AdminController endpoints (Admin Dashboard section)

**Capabilities:**
- Platform statistics: Total Users, Active Listings, Pending Approvals, Support Tickets
- Flagged messages list with content review
- User reports management (Pending, Reviewed, Resolved, Dismissed)
- User role management (change user roles)
- Platform analytics (new buyers, sellers, inquiries)
- Pending approvals with Approve/Reject actions

## 9. Builder Dashboard (PDF Page 10)

Builder-specific dashboard with project overview.

**Backend:** DashboardController (GET /builder)
**Frontend:** DashboardComponent (builder section)

**Stats displayed:**
- Total Projects / Active Projects
- Active Milestones
- Total Budget / Total Spent
- Total Bookings / Pending Bookings
- Average Rating

## 10. Buyer Dashboard (PDF Page 11)

Buyer-specific dashboard with bookings and activity.

**Backend:** DashboardController (GET /buyer)
**Frontend:** DashboardComponent (buyer section)

**Stats displayed:**
- Total Bookings / Active Bookings
- Unread Messages
- Reviews Given

## 11. Admin Dashboard (PDF Page 12)

Admin overview with platform-wide statistics.

**Backend:** DashboardController (GET /admin)
**Frontend:** DashboardComponent (admin section)

**Stats displayed:**
- Total Users / Builders / Buyers
- Total Projects / Active Projects
- Pending Reports / Flagged Messages
- Total Bookings / Total Revenue

## 12. Property Booking (PDF Pages 13-15)

Property reservation system.

**Backend:** BookingController
**Frontend:** BookingModule (BookingFormComponent, BookingHistoryComponent)

**Capabilities:**
- Booking form: amount, payment mode, transaction ID, notes
- Buyer's booking history with status badges (Pending, Confirmed, Rejected)
- Builder's booking management with Confirm/Reject actions
- Booking status tracking

**Payment Statuses:** Pending, Confirmed, Rejected, Refunded

## 13. Reviews & Ratings (PDF Page 16)

Multi-criteria review system.

**Backend:** ReviewController
**Frontend:** ReviewsModule (ReviewListComponent, ReviewFormComponent)

**Rating Categories:**
- Overall Rating (required, 1-5 stars)
- Construction Quality (optional, 1-5)
- Value for Money (optional, 1-5)
- Location (optional, 1-5)

**Capabilities:**
- Submit review with text and multi-criteria star ratings
- One review per user per property (enforced by backend)
- Reviews displayed on property detail page
- Builder can respond to reviews
- Star rating component (interactive + readonly modes)
- Reviews sorted by newest first

## 14. Appointments (PDF Pages 10-11)

Property visit scheduling between buyers and sellers.

**Backend:** AppointmentController
**Frontend:** Via booking flow

**Capabilities:**
- Buyer schedules appointment with date, time slot, notes
- Seller can confirm, complete, or cancel appointments
- List appointments for both buyer and seller
- Cancellation with reason

**Statuses:** Pending, Confirmed, Completed, Cancelled

## 15. Announcements (PDF Pages 10, 12)

Platform-wide announcements from admins.

**Backend:** AnnouncementController

**Capabilities:**
- Admin creates announcements with title, content, category
- Target specific roles or all users
- Auto-expiry support
- Filtered by user's role when fetching
- Soft-delete support

## 16. Saved Properties (PDF Page 11)

Property favoriting for buyers.

**Backend:** SavedPropertyController

**Capabilities:**
- Save/unsave a property (toggle)
- List all saved properties with full details
- Check if a specific property is saved (for UI toggle)
- Unique constraint prevents duplicate saves
- Integrated into property detail page (heart icon)

## Feature Matrix by Role

| Feature | Admin | Builder | Buyer | Public |
|---------|-------|---------|-------|--------|
| Property Search | Yes | Yes | Yes | Yes |
| Property Detail | Yes | Yes | Yes | Yes |
| Add/Edit Property | Yes | Yes | No | No |
| Construction Progress | Yes | Yes | No | No |
| Cost Monitoring | Yes | Yes | No | No |
| Messaging | Yes | Yes | Yes | No |
| Notifications | Yes | Yes | Yes | No |
| Booking (create) | No | No | Yes | No |
| Booking (manage) | Yes | Yes | No | No |
| Reviews (write) | No | No | Yes | No |
| Reviews (respond) | Yes | Yes | No | No |
| Reviews (view) | Yes | Yes | Yes | Yes |
| Appointments | Yes | Yes | Yes | No |
| Saved Properties | Yes | Yes | Yes | No |
| User Management | Yes | No | No | No |
| Moderation | Yes | No | No | No |
| Announcements | Yes (create) | Yes (view) | Yes (view) | No |
| Analytics | Yes | No | No | No |
