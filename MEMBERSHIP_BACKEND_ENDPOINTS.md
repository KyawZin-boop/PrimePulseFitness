# Membership System - Backend API Endpoints

## Required Endpoints

### 1. Get All Membership Plans (Public)
```
GET /Membership/GetAll
```
**Response:**
```json
[
  {
    "membershipID": "uuid",
    "name": "Gold Membership",
    "price": 99.99,
    "discountPercentage": 20,
    "benefits": ["20% off all purchases", "Priority booking", "Exclusive content"],
    "duration": 365,
    "activeFlag": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

### 2. Get User's Membership
```
GET /Membership/GetUserMembership?userID={userId}
```
**Response:**
```json
{
  "userMembershipID": "uuid",
  "userID": "uuid",
  "membershipID": "uuid",
  "membershipName": "Gold Membership",
  "discountPercentage": 20,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2025-01-01T00:00:00Z",
  "activeFlag": true,
  "status": "approved",  // "pending" | "approved" | "rejected"
  "receiptImageUrl": "https://...",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### 3. Purchase Membership (User)
```
POST /Membership/Purchase
Content-Type: application/json
```
**Request Body:**
```json
{
  "userID": "uuid",
  "membershipID": "uuid",
  "receiptImageUrl": "https://cloudinary.com/..."
}
```
**Business Rules:**
- Check if user already has a membership:
  - If `status === "pending"`: Return 400 "You already have a pending membership request"
  - If `status === "approved" AND activeFlag === true`: Return 400 "You already have an active membership"
  - If `status === "rejected"`: Allow new purchase (delete or update old record)
- Creates a UserMembership record with `status: "pending"`
- Sets `activeFlag: false` initially
- Sets `startDate: NULL` and `endDate: NULL` (will be set on approval)

**Response:** `201 Created`

### 4. Create Membership Plan (Admin)
```
POST /Membership/Create
Content-Type: application/json
```
**Request Body:**
```json
{
  "name": "Gold Membership",
  "price": 99.99,
  "discountPercentage": 20,
  "benefits": ["20% off all purchases", "Priority booking"],
  "duration": 365,
  "activeFlag": true
}
```
**Response:** `201 Created`

### 5. Update Membership Plan (Admin)
```
PUT /Membership/Update
Content-Type: application/json
```
**Request Body:**
```json
{
  "membershipID": "uuid",
  "name": "Gold Membership",
  "price": 89.99,
  "discountPercentage": 25,
  "benefits": ["25% off all purchases", "Priority booking"],
  "duration": 365,
  "activeFlag": true
}
```
**Response:** `200 OK`

### 6. Delete Membership Plan (Admin)
```
DELETE /Membership/Delete?membershipID={id}
```
**Response:** `204 No Content`

### 7. Get All User Memberships (Admin)
```
GET /Membership/GetAllUserMemberships
```
**Response:** Array of UserMembership objects (all statuses)
```json
[
  {
    "userMembershipID": "uuid",
    "userID": "uuid",
    "membershipID": "uuid",
    "membershipName": "Gold Membership",
    "discountPercentage": 20,
    "startDate": "2024-01-01T00:00:00Z",
    "endDate": "2025-01-01T00:00:00Z",
    "activeFlag": false,
    "status": "pending",
    "receiptImageUrl": "https://...",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### 8. Approve Membership Request (Admin)
```
POST /Membership/ApproveRequest?userMembershipID={id}
```
**Action:**
- Set `status: "approved"`
- Set `activeFlag: true`
- Set `startDate: NOW()`
- Set `endDate: startDate + duration days`

**Response:** `200 OK`

### 9. Reject Membership Request (Admin)
```
POST /Membership/RejectRequest?userMembershipID={id}
```
**Action:**
- Set `status: "rejected"`
- Keep `activeFlag: false`

**Response:** `200 OK`

## Database Schema

### MembershipPlan Table
```sql
CREATE TABLE MembershipPlan (
  MembershipID UNIQUEIDENTIFIER PRIMARY KEY,
  Name NVARCHAR(100) NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  DiscountPercentage INT NOT NULL,
  Benefits NVARCHAR(MAX), -- JSON array
  Duration INT NOT NULL, -- days
  ActiveFlag BIT DEFAULT 1,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME DEFAULT GETDATE()
)
```

### UserMembership Table
```sql
CREATE TABLE UserMembership (
  UserMembershipID UNIQUEIDENTIFIER PRIMARY KEY,
  UserID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(UserID),
  MembershipID UNIQUEIDENTIFIER FOREIGN KEY REFERENCES MembershipPlan(MembershipID),
  MembershipName NVARCHAR(100), -- Denormalized for history
  DiscountPercentage INT, -- Denormalized for history
  StartDate DATETIME NULL,
  EndDate DATETIME NULL,
  ActiveFlag BIT DEFAULT 0,
  Status NVARCHAR(20) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  ReceiptImageUrl NVARCHAR(500),
  CreatedAt DATETIME DEFAULT GETDATE(),
  
  -- Ensure user can only have one active or pending membership at a time
  -- Option 1: Use a unique filtered index
  -- CREATE UNIQUE INDEX IX_UserMembership_Active 
  -- ON UserMembership(UserID) 
  -- WHERE Status IN ('pending', 'approved') AND ActiveFlag = 1
  
  -- Option 2: Handle in application logic (recommended for flexibility)
)

-- Index for quick lookups
CREATE INDEX IX_UserMembership_UserID ON UserMembership(UserID);
CREATE INDEX IX_UserMembership_Status ON UserMembership(Status);
```

**Note:** Consider adding logic to prevent multiple pending/active memberships:
- Before INSERT: Check if user has status = 'pending' or (status = 'approved' AND activeFlag = 1)
- If rejected membership exists, you can either:
  - Delete the old rejected record before creating new one
  - Update the existing rejected record to pending with new data

## Business Logic

### On Purchase:
1. **Validation**: Check if user already has a membership
   - If status is "pending": Reject with error message
   - If status is "approved" and activeFlag is true: Reject with error message
   - If status is "rejected": Allow new purchase (can delete old record or update it)
2. User selects plan and uploads receipt image
3. Create UserMembership with:
   - `status: "pending"`
   - `activeFlag: false`
   - `startDate: NULL`
   - `endDate: NULL`
   - Store receipt URL
4. User sees "Pending Approval" status in UI

### On Approval:
1. Admin reviews receipt in admin panel
2. Admin clicks "Approve"
3. Update UserMembership:
   - `status: "approved"`
   - `activeFlag: true`
   - `startDate: NOW()`
   - `endDate: startDate + duration`
4. User can now use discount at checkout
5. User sees "Active" status with expiration date

### On Rejection:
1. Admin reviews receipt
2. Admin clicks "Reject"
3. Update UserMembership:
   - `status: "rejected"`
   - `activeFlag: false`
4. User sees rejection in profile and can purchase again
5. When user purchases again, old rejected record can be deleted or overwritten

### On Expiration:
- Consider adding a scheduled job to check for expired memberships:
  ```sql
  UPDATE UserMembership 
  SET activeFlag = 0 
  WHERE status = 'approved' 
    AND activeFlag = 1 
    AND endDate < GETDATE()
  ```

### At Checkout:
- Only apply discount if ALL conditions are met:
  - `userMembership.activeFlag === true`
  - `userMembership.status === "approved"`
  - `userMembership.endDate > NOW()`
