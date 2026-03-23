# API Reference

Base URL: `http://localhost:5000/api`

All authenticated endpoints require `Authorization: Bearer <jwt_token>` header.

All responses use the `ServiceResult<T>` wrapper:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success",
  "errors": [],
  "data": { ... }
}
```


## Authentication (UserManagerController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/UserManager/login` | Public | Login with username/password |
| POST | `/UserManager/AddUser` | Public | Register new user |
| POST | `/UserManager/RefreshToken` | Public | Refresh JWT token |
| GET | `/UserManager/getUserDetailById?userId={id}` | All roles | Get user by ID |
| GET | `/UserManager/getAllActiveUserDetail` | All roles | List active users |
| GET | `/UserManager/getAllUserDetail` | Admin, Builder | List all users |
| GET | `/UserManager/getAllActiveUserDetailOfBuilder` | Admin, Builder | List builder's active users |
| GET | `/UserManager/getAllUserDetailOfBuilder` | Admin, Builder | List all builder's users |

**Login Request:**
```json
{ "username": "string", "password": "string" }
```

**Login Response Data:**
```json
{
  "userName": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "mobileNumber": "string",
  "role": "Builder",
  "jwtToken": "string",
  "refreshToken": "string"
}
```


## Builder (BuilderController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/Builder/addUpdateBuilder` | Admin, Builder | Create or update builder |
| GET | `/Builder/getAllBuilder` | Admin | List all builders |
| GET | `/Builder/getAllActiveBuilder` | All roles | List active builders |
| GET | `/Builder/getBuilderById?builderId={id}` | All roles | Get builder by ID |
| DELETE | `/Builder/deleteBuilder?builderId={id}` | Admin | Soft-delete builder |


## Project (ProjectController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/Project/addUpdateProject` | Admin, Builder | Create/update project (multipart form) |
| GET | `/Project/getAllProject` | Admin | List all projects |
| GET | `/Project/getAllActiveProject` | All roles | List active projects |
| GET | `/Project/getAllProjectOfBuilder` | Admin, Builder | List builder's projects |
| GET | `/Project/getAllActiveProjectOfBuilder` | Admin, Builder | List builder's active projects |
| GET | `/Project/getProjectbyId?projectId={id}` | All roles | Get project by ID |
| POST | `/Project/addUpdatePropertyImages` | Admin, Builder | Upload property images |
| GET | `/Project/getAllProjectDataDetail` | Admin, Builder | List all project files |
| GET | `/Project/getAllActiveProjectDataDetail` | All roles | List active project files |
| GET | `/Project/getProjectDataDetailById?projectDataPathId={id}` | All roles | Get file by ID |
| GET | `/Project/getProjectDataDetailByProjectId?projectId={id}` | All roles | List files for project |
| GET | `/Project/getProjectsPaginated` | All roles | Paginated project search |
| DELETE | `/Project/deleteProject?projectId={id}` | Admin, Builder | Soft-delete project |


## Milestone (MilestoneController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/Milestone/addUpdateMilestone` | Admin, Builder | Create/update milestone |
| GET | `/Milestone/getAllMilestones` | Admin | List all milestones |
| GET | `/Milestone/getAllActiveMilestones` | Admin, Builder | List active milestones |
| GET | `/Milestone/getMilestonesById?milestoneId={id}` | Admin, Builder | Get milestone by ID |
| GET | `/Milestone/getMilestonesByProjectId?projectId={id}` | Admin, Builder | List project milestones |
| DELETE | `/Milestone/deleteMilestone?milestoneId={id}` | Admin, Builder | Soft-delete milestone |


## Expenses (ExpensesController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/Expenses/addUpdateExpenses` | Admin, Builder | Create/update expense |
| GET | `/Expenses/getAllExpenses` | Admin | List all expenses |
| GET | `/Expenses/getAllActiveExpenses` | Admin, Builder | List active expenses |
| GET | `/Expenses/getAllExpensesById?expenseId={id}` | Admin, Builder | Get expense by ID |
| GET | `/Expenses/getAllExpensesByMilestoneId?milestoneId={id}` | Admin, Builder | List milestone expenses |
| DELETE | `/Expenses/deleteExpense?expenseId={id}` | Admin, Builder | Soft-delete expense |


## Property Search (PropertySearchController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/PropertySearch/search` | Public | Search properties with filters |
| GET | `/PropertySearch/{id}` | Public | Get property detail by ID |

**Search Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| searchText | string? | Search in name, address, city |
| propertyType | string? | "Apartment", "Villa", "Plot", "Commercial" |
| minBedrooms | int? | Minimum bedrooms |
| maxBedrooms | int? | Maximum bedrooms |
| minPrice | double? | Minimum budget |
| maxPrice | double? | Maximum budget |
| possessionStatus | string? | "Ready to Move", "Under Construction" |
| city | string? | City filter |
| approvalType | string? | "RERA", "HMDA", "DTCP" |
| page | int | Page number (default: 1) |
| pageSize | int | Items per page (default: 10) |


## Construction Progress (ConstructionProgressController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/ConstructionProgress/project/{projectId}` | Admin, Builder | List stages for project |
| POST | `/ConstructionProgress` | Admin, Builder | Create stage |
| PUT | `/ConstructionProgress/{id}` | Admin, Builder | Update stage |
| DELETE | `/ConstructionProgress/{id}` | Admin, Builder | Soft-delete stage |
| POST | `/ConstructionProgress/{stageId}/photos` | Admin, Builder | Upload stage photo |
| GET | `/ConstructionProgress/summary/{projectId}` | Admin, Builder | Get progress summary |


## Cost Monitoring (CostMonitoringController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/CostMonitoring/project/{projectId}` | Admin, Builder | Get project cost breakdown |
| GET | `/CostMonitoring/builder-summary` | Admin, Builder | Get all projects cost summary |

**Response includes:** totalBudget, totalSpent, remaining, utilizationPercentage, stageWiseCosts[], recentExpenses[]


## Dashboard (DashboardController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/Dashboard/builder` | Admin, Builder | Builder dashboard stats |
| GET | `/Dashboard/buyer` | Buyer | Buyer dashboard stats |
| GET | `/Dashboard/admin` | Admin | Admin dashboard stats |


## Messaging (MessagingController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/Messaging/conversations` | Authenticated | List user's conversations |
| POST | `/Messaging/conversations` | Authenticated | Create conversation |
| GET | `/Messaging/conversations/{id}/messages` | Authenticated | List messages (paginated) |
| POST | `/Messaging/messages` | Authenticated | Send message |
| PUT | `/Messaging/messages/{conversationId}/read` | Authenticated | Mark messages as read |


## Notifications (NotificationController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/Notification` | Authenticated | List notifications (paginated) |
| GET | `/Notification/unread-count` | Authenticated | Get unread count |
| PUT | `/Notification/{id}/read` | Authenticated | Mark one as read |
| PUT | `/Notification/read-all` | Authenticated | Mark all as read |
| GET | `/Notification/settings` | Authenticated | Get notification settings |
| PUT | `/Notification/settings` | Authenticated | Update notification settings |


## Booking (BookingController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/Booking` | Buyer | Create booking |
| GET | `/Booking/my-bookings` | Buyer | List buyer's bookings |
| GET | `/Booking/project/{projectId}` | Admin, Builder | List project bookings |
| PUT | `/Booking/{id}/status?status={status}` | Admin, Builder | Update booking status |


## Reviews (ReviewController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/Review/project/{projectId}` | Public | List reviews for property |
| POST | `/Review` | Buyer | Create review |
| POST | `/Review/builder-response` | Admin, Builder | Add builder response to review |


## Admin (AdminController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/Admin/reports?status={status}` | Admin | List user reports |
| PUT | `/Admin/reports/{id}?status={s}&adminNotes={n}` | Admin | Update report status |
| GET | `/Admin/flagged-messages` | Admin | List flagged messages |
| PUT | `/Admin/users/{userId}/role?role={role}` | Admin | Change user role |
| GET | `/Admin/analytics` | Admin | Platform analytics |


## Appointments (AppointmentController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/Appointment` | Buyer | Schedule appointment |
| GET | `/Appointment/my-appointments` | Authenticated | List user's appointments |
| PUT | `/Appointment/{id}/status?status={status}` | Authenticated | Update appointment status |


## Announcements (AnnouncementController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/Announcement` | Authenticated | List active announcements (filtered by role) |
| POST | `/Announcement` | Admin | Create announcement |
| DELETE | `/Announcement/{id}` | Admin | Delete announcement |


## Saved Properties (SavedPropertyController)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/SavedProperty/{projectId}` | Authenticated | Save/favorite a property |
| DELETE | `/SavedProperty/{projectId}` | Authenticated | Unsave a property |
| GET | `/SavedProperty` | Authenticated | List saved properties |
| GET | `/SavedProperty/check/{projectId}` | Authenticated | Check if property is saved |


## Property (PropertyController) - Legacy

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/Property/getAllActiveProject` | Public | List active properties |
| GET | `/Property/search` | Public | Paginated property search |


## SignalR Hub

**URL:** `/hubs/chat`

**Authentication:** JWT Bearer token via query string

| Method | Direction | Description |
|--------|-----------|-------------|
| `JoinConversation(conversationId)` | Client → Server | Join conversation group |
| `LeaveConversation(conversationId)` | Client → Server | Leave conversation group |
| `SendMessage(conversationId, content, messageType)` | Client → Server | Send message |
| `TypingIndicator(conversationId, isTyping)` | Client → Server | Send typing status |
| `MessageRead(conversationId, messageId)` | Client → Server | Send read receipt |
| `ReceiveMessage(message)` | Server → Client | Receive new message |
| `UserTyping(data)` | Server → Client | Receive typing indicator |
| `MessageRead(data)` | Server → Client | Receive read receipt |
