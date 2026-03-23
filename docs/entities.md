# Entity Reference

All entities inherit from `CommonEntity` which provides:

| Field | Type | Description |
|-------|------|-------------|
| CreatedBy | string | Username who created the record |
| CreatedDate | DateTime | Record creation timestamp |
| ModifiedBy | string | Username who last modified |
| ModifiedDate | DateTime? | Last modification timestamp |
| IsActive | bool | Soft-delete flag (true = active) |


## UserManager

User accounts for the platform.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated user ID |
| UserName | string(20) | Unique login username |
| FirstName | string(20) | User's first name |
| LastName | string(20) | User's last name |
| Email | string(50) | Email address |
| MobileNumber | string(20) | Phone number |
| PasswordHash | string | BCrypt hashed password |
| AcceptTerms | bool | Terms acceptance flag |
| Role | string(20) | "Admin", "Builder", or "Buyer" (default: "Builder") |
| ResetToken | string? | Password reset token |
| ResetTokenExpires | DateTime? | Reset token expiry |
| BuilderId | int (FK) | Associated builder company |

**Relationships:** Belongs to BuilderMaster


## BuilderMaster

Builder/construction company profiles.

| Field | Type | Description |
|-------|------|-------------|
| BuilderId | int (PK) | Auto-generated builder ID |
| Name | string | Company name |
| TagLine | string | Company tagline |
| Description | string | Company description |
| OfficeAddress | string | Office address |
| LangLog | string | Latitude/Longitude |
| EmailAddress | string | Contact email |
| Contact1 | string | Primary phone |
| Contact2 | string | Secondary phone |
| GSTNo | string | GST registration number (unique) |
| OwnerName | string | Owner/director name |

**Relationships:** Has many UserManagers, ProjectMasters


## ProjectMaster

Properties/construction projects.

| Field | Type | Description |
|-------|------|-------------|
| ProjectId | int (PK) | Auto-generated project ID |
| ProjectName | string | Property/project name |
| ProjectDescription | string | Detailed description |
| CompletionPercentage | int | 0-100% completion |
| StartDate | DateTime? | Planned start date |
| CompletionDate | DateTime? | Planned completion date |
| ActualStartDate | DateTime? | Actual start date |
| ActualCompletionDate | DateTime? | Actual completion date |
| ProjectAddress | string | Property address |
| Latlong | string | GPS coordinates |
| ProfileImage | string | Main image path |
| ReraNumber | string | RERA registration number |
| Budget | double | Total project budget |
| Status | string | "New", "UnderConstruction", "Completed" |
| **PropertyType** | string? | "Apartment", "Villa", "Plot", "Commercial" |
| **Bedrooms** | int? | Number of bedrooms |
| **Bathrooms** | int? | Number of bathrooms |
| **AreaSqFt** | double? | Property area in sq.ft |
| **PricePerSqFt** | double? | Price per sq.ft |
| **PossessionStatus** | string? | "Ready to Move", "Under Construction" |
| **ApprovalType** | string? | "RERA", "HMDA", "DTCP" |
| **HMDANumber** | string? | HMDA approval number |
| **DTCPNumber** | string? | DTCP approval number |
| **City** | string? | City name |
| **State** | string? | State name |
| **Pincode** | string? | Postal code |
| **Amenities** | string? | JSON array of amenity names |
| **IsFeatured** | bool | Featured listing flag |
| BuilderId | int (FK) | Owning builder company |

**Relationships:** Belongs to BuilderMaster; Has many ProjectDataPaths, ProjectMilestones, ConstructionStageProgress


## ProjectMilestone

Construction milestones within a project.

| Field | Type | Description |
|-------|------|-------------|
| MilestoneId | int (PK) | Auto-generated ID |
| ProjectId | int (FK) | Parent project |
| MilestoneName | string | Milestone name |
| MilestoneDetails | string | Description |
| Budget | double | Allocated budget |
| BudgetStatus | string | "Under budget" / "Over budget" |
| Status | string | "New", "Pending", "In Progress", "Completed", "Hold" |
| PlannedStartDate | DateTime? | Planned start |
| PlannedTargetDate | DateTime? | Planned end |
| PlannedDuration | int | Duration in days (auto-calculated) |
| ActualStartDate | DateTime? | Set when status = "In Progress" |
| ActualTargetDate | DateTime? | Set when status = "Completed" |
| ActualDuration | int | Actual duration in days |
| MilestoneCompletionPer | int | 0-100% |

**Relationships:** Belongs to ProjectMaster; Has many ProjectExpenses


## ProjectExpenses

Expense records against milestones.

| Field | Type | Description |
|-------|------|-------------|
| ExpenseId | int (PK) | Auto-generated ID |
| Details | string | Expense description |
| Amount | double | Expense amount |
| VendorSupplier | string | Vendor/supplier name |
| Category | string | "Material", "Labor", "Equipment", etc. |
| **PaymentStatus** | string? | "Paid", "Pending", "Partial" |
| **PaymentMode** | string? | "Cash", "Cheque", "Bank Transfer", "UPI" |
| **InvoicePath** | string? | Uploaded invoice file path |
| **Notes** | string? | Additional notes |
| **PaymentDate** | DateTime? | When payment was made |
| **TotalCost** | double? | Calculated total cost |
| ProjectMilestoneId | int (FK) | Parent milestone |

**Relationships:** Belongs to ProjectMilestone


## ProjectDataPath

File/document uploads for projects.

| Field | Type | Description |
|-------|------|-------------|
| ProjectDataPathId | int (PK) | Auto-generated ID |
| DataName | string | File display name |
| Category | string? | File category |
| Path | string? | Virtual file path |
| FileType | string? | "JPG", "PNG", "PDF", etc. |
| ProjectId | int (FK) | Parent project |

**Relationships:** Belongs to ProjectMaster


## ConstructionStageProgress

Tracks progress for each construction stage.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| ProjectId | int (FK) | Parent project |
| StageName | string(200) | Stage name (e.g., "Foundation", "Structure") |
| StageOrder | int | Display order |
| CompletionPercentage | int | 0-100% |
| PlannedStartDate | DateTime? | Planned start |
| PlannedEndDate | DateTime? | Planned end |
| ActualStartDate | DateTime? | Actual start |
| ActualEndDate | DateTime? | Actual end |
| Notes | string?(2000) | Progress notes |
| Status | string(50) | "Pending", "In Progress", "Completed", "Delayed" |

**Relationships:** Belongs to ProjectMaster; Has many StagePhotos


## StagePhoto

Photos attached to construction stages.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| StageProgressId | int (FK) | Parent stage |
| PhotoPath | string(500) | Photo file path |
| Caption | string?(500) | Photo caption |

**Relationships:** Belongs to ConstructionStageProgress


## Conversation

Messaging threads between buyers and sellers.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| BuyerUserId | int (FK) | Buyer participant |
| SellerUserId | int (FK) | Seller participant |
| ProjectId | int? (FK) | Related project (optional) |
| LastMessageAt | DateTime | Timestamp of latest message |

**Relationships:** Has many Messages; Belongs to BuyerUser, SellerUser, ProjectMaster


## Message

Individual chat messages within conversations.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| ConversationId | int (FK) | Parent conversation |
| SenderUserId | int (FK) | Message sender |
| Content | string | Message text |
| MessageType | string(50) | "Text" (default), "Image", "File" |
| IsRead | bool | Read receipt flag |
| IsFlagged | bool | Admin moderation flag |

**Relationships:** Belongs to Conversation, SenderUser


## Notification

User notifications for events.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| UserId | int (FK) | Target user |
| Title | string(200) | Notification title |
| Body | string(2000) | Notification content |
| Type | string(50) | "message", "booking", "review", "system" |
| Category | string?(50) | Optional category |
| IsRead | bool | Read flag |
| ActionUrl | string?(500) | Deep link URL |

**Relationships:** Belongs to User


## NotificationSetting

Per-user notification preferences.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| UserId | int (FK) | User (unique) |
| EmailEnabled | bool | Email notifications on/off |
| SmsEnabled | bool | SMS notifications on/off |
| PushEnabled | bool | Push notifications on/off |
| InAppEnabled | bool | In-app notifications on/off |

**Relationships:** Belongs to User (one-to-one)


## PropertyBooking

Property reservation records.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| ProjectId | int (FK) | Booked property |
| BuyerUserId | int (FK) | Buyer who booked |
| BookingAmount | double | Reservation amount |
| PaymentStatus | string(50) | "Pending", "Confirmed", "Rejected", "Refunded" |
| PaymentMode | string?(50) | Payment method used |
| TransactionId | string?(200) | Payment transaction reference |
| Notes | string?(2000) | Additional notes |

**Relationships:** Belongs to ProjectMaster, BuyerUser


## Review

Buyer reviews for properties.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| ProjectId | int (FK) | Reviewed property |
| BuyerUserId | int (FK) | Review author |
| OverallRating | int | 1-5 star rating |
| QualityRating | int? | Construction quality (1-5) |
| ValueRating | int? | Value for money (1-5) |
| LocationRating | int? | Location rating (1-5) |
| ReviewText | string?(2000) | Written review |
| BuilderResponse | string?(2000) | Builder's reply |
| BuilderResponseDate | DateTime? | When builder responded |

**Relationships:** Belongs to ProjectMaster, BuyerUser


## UserReport

Admin moderation reports.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| ReporterUserId | int (FK) | User who filed report |
| ReportedMessageId | int? (FK) | Flagged message (if applicable) |
| ReportedReviewId | int? (FK) | Flagged review (if applicable) |
| Reason | string(2000) | Report reason |
| Status | string(50) | "Pending", "Reviewed", "Resolved", "Dismissed" |
| AdminNotes | string?(2000) | Admin's resolution notes |

**Relationships:** Belongs to ReporterUser, ReportedMessage, ReportedReview


## Appointment

Property visit scheduling.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| BuyerUserId | int (FK) | Buyer requesting visit |
| SellerUserId | int (FK) | Seller/builder |
| ProjectId | int (FK) | Property to visit |
| ScheduledDate | DateTime | Appointment date |
| TimeSlot | string?(50) | Time slot (e.g., "10:00 AM - 11:00 AM") |
| Status | string(50) | "Pending", "Confirmed", "Completed", "Cancelled" |
| Notes | string?(500) | Additional notes |
| CancellationReason | string?(500) | Reason if cancelled |

**Relationships:** Belongs to BuyerUser, SellerUser, ProjectMaster


## Announcement

Platform announcements from admins.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| Title | string(200) | Announcement title |
| Content | string | Full announcement content |
| Category | string?(50) | Optional category |
| TargetRole | string?(20) | Target audience role (null = all) |
| ExpiresAt | DateTime? | Auto-expire date |
| CreatedByUserId | int (FK) | Admin who created it |

**Relationships:** Belongs to CreatedByUser


## SavedProperty

User's saved/favorited properties.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| UserId | int (FK) | User who saved |
| ProjectId | int (FK) | Saved property |

**Constraints:** Unique index on (UserId, ProjectId)

**Relationships:** Belongs to User, ProjectMaster


## UserToken

JWT token tracking for refresh token flow.

| Field | Type | Description |
|-------|------|-------------|
| Id | int (PK) | Auto-generated ID |
| JwtToken | string | Current JWT token |
| RefreshToken | string | Refresh token |
| Expiration | DateTime | Token expiry |
| UserId | int (FK) | Token owner |

**Relationships:** Belongs to UserManager
