# Membership Feature Implementation Guide

## Overview
The membership system allows users to purchase membership plans and receive percentage-based discounts on all product purchases at checkout. The implementation includes a complete membership management system with plan selection, purchase functionality, and automatic discount application.

---

## Features Implemented

### 1. **Membership Plans System**
- Multiple membership tiers (Bronze, Silver, Gold, Platinum)
- Each plan has:
  - Unique pricing
  - Discount percentage for purchases
  - Duration (in days)
  - List of benefits
  - Active/inactive status

### 2. **User Membership Management**
- Users can view all available membership plans
- Purchase membership plans
- View active membership status
- Membership expiration tracking
- Automatic discount application at checkout

### 3. **Checkout Integration**
- Automatic membership discount calculation
- Display of discount amount and savings
- Final total reflects membership discount
- Visual indicators for active membership benefits

### 4. **Profile Integration**
- Membership status display in user profile
- Active membership badge with details
- Quick access to view membership plans
- Expiration date tracking

### 5. **Cart Preview**
- Estimated discount preview in cart
- Membership promotion for non-members
- Active membership indicator
- Savings calculation before checkout

---

## File Structure

```
src/
├── api/
│   ├── membership/
│   │   ├── index.ts          # API service for membership operations
│   │   └── type.d.ts         # TypeScript type definitions
│   ├── user/
│   │   └── type.d.ts         # Updated with membership fields
│   └── index.ts              # Updated to include membership API
├── modules/
│   ├── user/
│   │   ├── MembershipView.tsx    # Membership plans page
│   │   └── ProfileView.tsx       # Updated with membership display
│   └── store/
│       ├── CheckoutView.tsx      # Updated with discount logic
│       └── CartView.tsx          # Updated with discount preview
├── components/
│   └── Navigation.tsx        # Added membership menu item
└── router/
    └── Router.tsx           # Added membership route
```

---

## API Endpoints

### Get All Membership Plans
```typescript
GET /Membership/GetAll
Response: MembershipPlan[]
```

### Get User's Active Membership
```typescript
GET /Membership/GetUserMembership?userId={userId}
Response: UserMembership | null
```

### Purchase Membership
```typescript
POST /Membership/Purchase
Body: {
  userID: string;
  membershipID: string;
}
Response: UserMembershipResponse
```

---

## Type Definitions

### MembershipPlan
```typescript
{
  membershipID: string;
  name: string;
  price: number;
  discountPercentage: number;  // e.g., 10 for 10% off
  benefits: string[];
  duration: number;            // Duration in days
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### UserMembership
```typescript
{
  userMembershipID: string;
  userID: string;
  membershipID: string;
  membershipName: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}
```

### Updated User Type
```typescript
{
  // ... existing fields
  membershipName: string | null;
  membershipDiscountPercentage: number;
  membershipEndDate: string | null;
}
```

---

## Component Details

### 1. MembershipView Component
**Location:** `src/modules/user/MembershipView.tsx`

**Features:**
- Displays all active membership plans in a grid layout
- Shows current active membership (if any)
- Color-coded plan cards (Bronze, Silver, Gold, Platinum)
- Discount percentage highlight
- Benefits list for each plan
- Purchase buttons with loading states
- Information section explaining how membership works

**Key Functions:**
- `handlePurchase(membershipID)` - Initiates membership purchase
- `getPlanIcon(planName)` - Returns appropriate icon for plan tier
- `getPlanColor(planName)` - Returns gradient colors for plan cards

### 2. CheckoutView Component
**Location:** `src/modules/store/CheckoutView.tsx`

**Updates:**
- Fetches user's active membership
- Calculates discount based on membership percentage
- Displays membership discount card
- Shows subtotal, discount amount, and final total
- Applies discounted total to order creation

**Discount Calculation:**
```typescript
const membershipDiscount = userMembership?.isActive 
  ? userMembership.discountPercentage 
  : 0;
const subtotal = cart.totalPrice;
const discountAmount = (subtotal * membershipDiscount) / 100;
const finalTotal = subtotal - discountAmount;
```

### 3. CartView Component
**Location:** `src/modules/store/CartView.tsx`

**Updates:**
- Shows membership discount preview
- Displays active membership badge
- Shows estimated total with discount
- Promotes membership plans to non-members
- Quick link to membership page

### 4. ProfileView Component
**Location:** `src/modules/user/ProfileView.tsx`

**Updates:**
- Displays active membership card with:
  - Membership name
  - Discount percentage
  - Active badge
  - Expiration date
- Shows "View Plans" button for non-members
- Membership info positioned prominently in sidebar

---

## Usage Examples

### For Users

#### 1. Browse and Purchase Membership
```
1. Navigate to Profile → Membership (or direct to /membership)
2. Review available plans and benefits
3. Click "Purchase Plan" on desired membership
4. Membership becomes active immediately
```

#### 2. Shopping with Membership Discount
```
1. Add products to cart
2. View cart to see discount preview
3. Proceed to checkout
4. Discount automatically applied to final total
5. Order placed with discounted price
```

### For Developers

#### Get User's Membership
```typescript
const { data: userMembership } = api.membership.getUserMembership.useQuery(userId);

if (userMembership?.isActive) {
  const discount = userMembership.discountPercentage;
  // Apply discount logic
}
```

#### Calculate Discount
```typescript
const calculateDiscount = (total: number, percentage: number) => {
  return (total * percentage) / 100;
};

const finalPrice = total - calculateDiscount(total, membershipDiscount);
```

---

## Navigation Updates

### User Account Menu
Added "Membership" item to dropdown menu:
- Desktop: User icon dropdown → Membership
- Mobile: Hamburger menu → User dropdown → Membership

**Menu Order:**
1. Profile
2. **Membership** ← New
3. My Diet Plan
4. My Workout Plan
5. My Progress
6. Order History
7. Delivery Tracking

---

## Styling & UI

### Color Scheme by Plan Tier
- **Bronze/Basic:** Orange gradient (`from-orange-500/20 to-orange-600/10`)
- **Silver:** Gray gradient (`from-gray-400/20 to-gray-500/10`)
- **Gold:** Yellow gradient (`from-yellow-500/20 to-yellow-600/10`)
- **Platinum/Elite:** Purple gradient (`from-purple-500/20 to-purple-600/10`)

### Icons Used
- `Crown` - Active membership indicator
- `Shield` - Bronze/Basic tier
- `Star` - Silver tier
- `Crown` - Gold tier
- `Sparkles` - Platinum/Elite tier

### Badges
- **Active Membership:** Green badge with "Active" text
- **Current Plan:** Accent-colored badge on plan cards

---

## Backend Requirements

### Database Schema

#### Membership Table
```sql
CREATE TABLE Memberships (
  MembershipID VARCHAR(50) PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Price DECIMAL(10,2) NOT NULL,
  DiscountPercentage INT NOT NULL,
  Benefits TEXT,  -- JSON array of strings
  Duration INT NOT NULL,  -- Days
  IsActive BIT DEFAULT 1,
  CreatedAt DATETIME DEFAULT GETDATE(),
  UpdatedAt DATETIME DEFAULT GETDATE()
);
```

#### UserMembership Table
```sql
CREATE TABLE UserMemberships (
  UserMembershipID VARCHAR(50) PRIMARY KEY,
  UserID VARCHAR(50) FOREIGN KEY REFERENCES Users(UserID),
  MembershipID VARCHAR(50) FOREIGN KEY REFERENCES Memberships(MembershipID),
  MembershipName VARCHAR(100),
  DiscountPercentage INT,
  StartDate DATETIME NOT NULL,
  EndDate DATETIME NOT NULL,
  IsActive BIT DEFAULT 1,
  CreatedAt DATETIME DEFAULT GETDATE()
);
```

### Sample Membership Plans

```json
[
  {
    "name": "Bronze",
    "price": 9.99,
    "discountPercentage": 5,
    "duration": 30,
    "benefits": [
      "5% off on all purchases",
      "Priority email support",
      "Monthly fitness tips newsletter"
    ]
  },
  {
    "name": "Silver",
    "price": 19.99,
    "discountPercentage": 10,
    "duration": 30,
    "benefits": [
      "10% off on all purchases",
      "Priority email support",
      "Weekly workout recommendations",
      "Exclusive member-only content"
    ]
  },
  {
    "name": "Gold",
    "price": 29.99,
    "discountPercentage": 15,
    "duration": 30,
    "benefits": [
      "15% off on all purchases",
      "24/7 priority support",
      "Personalized meal plans",
      "Free shipping on all orders",
      "Early access to new products"
    ]
  },
  {
    "name": "Platinum",
    "price": 49.99,
    "discountPercentage": 20,
    "duration": 30,
    "benefits": [
      "20% off on all purchases",
      "VIP 24/7 support",
      "Custom workout & diet plans",
      "Free express shipping",
      "Exclusive events access",
      "Personal trainer consultation"
    ]
  }
]
```

---

## Testing Checklist

### Membership Page
- [ ] All active plans display correctly
- [ ] Current membership badge shows for active members
- [ ] Purchase button triggers API call
- [ ] Success toast appears after purchase
- [ ] Membership data refreshes after purchase
- [ ] Non-members see all plans available
- [ ] Active members can upgrade to higher tier

### Checkout Flow
- [ ] Membership discount displays for active members
- [ ] Discount percentage matches membership plan
- [ ] Subtotal shows original price
- [ ] Discount amount calculated correctly
- [ ] Final total reflects discount
- [ ] Order created with discounted total
- [ ] Non-members see no discount section

### Cart Preview
- [ ] Active membership badge shows in cart
- [ ] Estimated discount displays correctly
- [ ] Non-members see membership promotion
- [ ] "View Memberships" button navigates correctly
- [ ] Calculations update when cart changes

### Profile Page
- [ ] Active membership card displays with correct info
- [ ] Expiration date shows correctly
- [ ] Non-members see "View Plans" button
- [ ] Discount percentage displays
- [ ] Active badge shows for active memberships

---

## Error Handling

### Purchase Errors
```typescript
onError: () => {
  toast.error("Failed to purchase membership. Please try again.");
}
```

### Loading States
- Membership plans page shows loader while fetching
- Purchase button shows "Processing..." during mutation
- Current plan button disabled to prevent duplicate purchases

### Edge Cases
- Expired memberships show as inactive
- No membership shows promotional content
- Invalid user ID returns null for membership query
- Failed API calls show error toasts

---

## Future Enhancements

1. **Membership Renewal**
   - Auto-renewal option
   - Renewal reminder notifications
   - Grace period after expiration

2. **Membership History**
   - View past memberships
   - Purchase history
   - Benefits usage tracking

3. **Tiered Benefits**
   - Cumulative discounts
   - Loyalty points system
   - Referral bonuses

4. **Admin Panel**
   - Create/edit membership plans
   - View membership analytics
   - Manage user memberships
   - Revenue tracking by plan

5. **Payment Integration**
   - Stripe/PayPal integration
   - Recurring billing
   - Invoice generation

6. **Additional Discounts**
   - Stack with product discounts
   - Special member-only sales
   - Birthday discounts
   - Seasonal promotions

---

## Troubleshooting

### Issue: Discount not applying at checkout
**Solution:** Ensure:
1. User membership is active (`isActive: true`)
2. Membership hasn't expired (check `endDate`)
3. `discountPercentage` is correctly set
4. Cart total is being calculated correctly

### Issue: Membership not showing in profile
**Solution:** Check:
1. User ID is correct in the query
2. API endpoint is returning data
3. Membership exists in database
4. Component is properly fetching membership data

### Issue: Purchase fails
**Solution:** Verify:
1. User is authenticated
2. Membership ID is valid
3. Backend API is accessible
4. User doesn't already have active membership of same tier

---

## Summary

The membership feature is now fully integrated into PrimePulse Fitness, providing users with:
- ✅ Multiple membership tiers with varying benefits
- ✅ Automatic percentage-based discounts at checkout
- ✅ Visual membership status in profile and cart
- ✅ Easy membership purchase flow
- ✅ Discount preview before checkout
- ✅ Seamless integration with existing shopping cart

All components are connected through the API layer, ensuring consistent data across the application. The system is scalable and ready for future enhancements.
