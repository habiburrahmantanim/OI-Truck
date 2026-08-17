# OI-Truck Full Workflow Guide

## Project Overview
**OI-Truck (Truck Lagbe)** is a modern truck booking platform built with Next.js and React. It enables customers to book trucks for deliveries and provides drivers and admins with management tools.

---

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend Framework**: Next.js 16.3.0 with React 19
- **Styling**: Tailwind CSS 4
- **UI Icons**: Lucide React & FontAwesome
- **Language**: TypeScript
- **State Management**: React Context (BookingContext)

### Project Structure
```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── admin/             # Admin dashboard routes
│   ├── driver/            # Driver portal routes
│   ├── booking/           # Booking management
│   ├── login/             # Authentication
│   ├── register/          # User registration
│   ├── profile/           # User profile
│   ├── tracking/          # Real-time tracking
│   └── trucks/            # Truck browsing
├── components/            # Reusable React components
├── context/               # React Context providers
├── data/                  # Static data & constants
├── hooks/                 # Custom React hooks
├── public/                # Static assets
└── types/                 # TypeScript definitions
```

---

## 👥 User Roles & Workflows

### 1. **CUSTOMER WORKFLOW**

#### Registration & Login Flow
```
Homepage → Click "Get Started" / Login
         → Register Page (customer/page.tsx)
         → Set email, password, personal details
         → Redirects to Profile or Dashboard
```

#### Booking Flow (Core Feature)
```
Homepage (page.tsx)
  ├─ Enter Pickup Location
  ├─ Enter Delivery Location
  └─ Click "Find Trucks"
      ↓
Trucks Listing Page (trucks/page.tsx)
  ├─ View available trucks
  ├─ Filter by price, capacity, etc.
  └─ Click on truck
      ↓
Booking Form (booking/page.tsx)
  ├─ Review truck details
  ├─ Confirm pickup/delivery
  ├─ Set pickup time
  ├─ Add special instructions
  └─ Complete Payment
      ↓
Booking Summary (BookingSummary.tsx)
  ├─ Confirmation details
  ├─ Tracking info
  └─ Driver contact
```

#### Active Bookings
```
Bookings Page (bookings/page.tsx)
  ├─ View all active bookings
  ├─ Track current deliveries
  ├─ View booking history
  ├─ Cancel or modify booking
  └─ Rate driver/service
```

#### Real-time Tracking
```
Tracking Page (tracking/page.tsx)
  ├─ Live GPS tracking
  ├─ Estimated arrival time
  ├─ Driver location & status
  └─ Real-time notifications
```

---

### 2. **DRIVER WORKFLOW**

#### Driver Registration & Login
```
Homepage → "Join as Driver"
        → Driver Register Page (register/page.tsx)
        → Complete driver details
        → Upload documents
        → Wait for approval
```

#### Driver Dashboard
```
Driver Home (driver/page.tsx)
  ├─ Active deliveries count
  ├─ Daily earnings
  ├─ Rating & reviews
  └─ Quick actions
```

#### Assignments Management
```
Assignments Page (driver/assignments/page.tsx)
  ├─ View pending assignments
  ├─ Accept/Reject jobs
  ├─ View job details (pickup, delivery, load)
  └─ Navigate to pickup location
```

#### Trip Execution
```
Trips Page (driver/trips/page.tsx)
  ├─ Active trips
  ├─ Trip history
  ├─ Update trip status
  ├─ Confirm delivery
  └─ Get customer signature/photo
```

#### Earnings & Analytics
```
Earnings Page (driver/earnings/page.tsx)
  ├─ Daily earnings breakdown
  ├─ Weekly/Monthly summary
  ├─ Payment history
  ├─ Withdrawal requests
  └─ Performance metrics
```

#### Driver Profile
```
Profile Page (driver/profile/page.tsx)
  ├─ Personal information
  ├─ Vehicle details
  ├─ Documents & licenses
  ├─ Payment method
  ├─ Ratings & reviews
  └─ Settings
```

---

### 3. **ADMIN WORKFLOW**

#### Admin Dashboard
```
Admin Home (admin/page.tsx)
  ├─ Key metrics (total bookings, revenue, etc.)
  ├─ Active users
  ├─ Pending approvals
  └─ System alerts
```

#### User Management
```
Users Page (admin/users/page.tsx)
  ├─ View all customers
  ├─ Ban/Suspend users
  ├─ View user details & history
  └─ Handle disputes
```

#### Driver Management
```
Drivers Page (admin/drivers/page.tsx)
  ├─ View all drivers
  ├─ Approve/Reject new drivers
  ├─ View driver documents
  ├─ Monitor driver performance
  ├─ Suspend/Remove drivers
  └─ View earnings & payouts
```

#### Truck Management
```
Trucks Page (admin/trucks/page.tsx)
  ├─ Add new trucks
  ├─ Update truck details
  ├─ Manage truck availability
  ├─ View truck utilization
  └─ Remove trucks
```

#### Bookings Management
```
Bookings Page (admin/bookings/page.tsx)
  ├─ View all bookings
  ├─ Filter by status (pending, active, completed, cancelled)
  ├─ Monitor delivery progress
  ├─ Handle disputes & refunds
  └─ View revenue analytics
```

---

## 🔄 Key Features & Components

### Booking System
- **BookingContext.tsx**: Global booking state management
- **BookingForm.tsx**: Reusable form component for creating bookings
- **BookingSummary.tsx**: Display booking confirmation & details

### Tracking System
- **TrackingTimeline.tsx**: Visual timeline of delivery progress
- Real-time GPS tracking integration
- ETA calculations and notifications

### UI Components
- **Navbar.tsx**: Navigation header with role-based menus
- **Footer.tsx**: Site footer
- **TruckCard.tsx**: Reusable truck display component
- **Hero.tsx**: Homepage hero section
- **CanvasCursor.tsx**: Custom cursor animation

### Layout Components
- **AdminSidebar.tsx**: Admin navigation sidebar
- **AdminHeader.tsx**: Admin page header
- **DriverSidebar.tsx**: Driver navigation sidebar
- **DriverHeader.tsx**: Driver page header

---

## 🔌 API Integration Points

The frontend communicates with a backend API for:
- User authentication (login/register)
- Booking creation and management
- Real-time location tracking
- Driver assignment algorithms
- Payment processing
- Rating/review system
- Admin operations

**Expected API Endpoints** (configure in environment variables):
```
/api/auth/login
/api/auth/register
/api/bookings
/api/trucks
/api/drivers
/api/tracking
/api/admin/*
```

---

## 🚀 Development Workflow

### 1. **Setup & Installation**
```bash
cd frontend
npm install
```

### 2. **Start Development Server**
```bash
npm run dev
# Runs on http://localhost:3000
```

### 3. **Build for Production**
```bash
npm run build
npm start
```

### 4. **Linting**
```bash
npm run lint
```

### 5. **File Structure Best Practices**
- Components: `components/[Category]/ComponentName.tsx`
- Pages: `app/[Route]/page.tsx`
- Types: `types/domainName.ts`
- Hooks: `hooks/useHookName.ts`
- Context: `context/ContextName.tsx`

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     Customers                            │
│   (login → book truck → track → rate)                   │
└────────────────┬────────────────────────────────────────┘
                 │
         ┌───────▼────────┐
         │  Next.js App   │
         │  (Frontend)    │
         └───────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼──┐  ┌──────▼────┐  ┌───▼────┐
│Auth  │  │ Bookings  │  │Tracking│
│API   │  │    API    │  │  API   │
└──────┘  └───────────┘  └────────┘
```

---

## 🔐 Authentication Flow

```
User Input (email/password)
    ↓
Login/Register Page
    ↓
Submit to Backend API
    ↓
Verify Credentials
    ↓
Issue JWT Token
    ↓
Store in Local Storage / Cookie
    ↓
Redirect to Dashboard based on Role
    ↓
All subsequent requests include JWT
    ↓
Backend validates token
```

---

## ⚡ Key Workflows Summary

| User Type | Entry Point | Main Actions | Key Pages |
|-----------|------------|--------------|-----------|
| **Customer** | Homepage | Book, Track, Pay | /booking, /trucks, /tracking, /bookings |
| **Driver** | /driver/register | Accept jobs, Complete deliveries | /driver/assignments, /driver/trips, /driver/earnings |
| **Admin** | /admin | Manage users/trucks/disputes | /admin/users, /admin/drivers, /admin/trucks |

---

## 🛠️ Common Development Tasks

### Add a New Customer Feature
1. Create page in `app/[feature]/page.tsx`
2. Create components in `components/`
3. Add types in `types/`
4. Integrate with BookingContext if needed
5. Add navigation in Navbar

### Add Driver Feature
1. Create page in `app/driver/[feature]/page.tsx`
2. Create components in `components/driver/`
3. Update DriverSidebar navigation
4. Implement API calls for driver data

### Add Admin Feature
1. Create page in `app/admin/[feature]/page.tsx`
2. Create components in `components/admin/`
3. Update AdminSidebar navigation
4. Implement admin-specific logic

---

## 🐛 Troubleshooting

### Dev Server Won't Start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build Errors
```bash
# Check TypeScript errors
npx tsc --noEmit

# Clear Next.js cache
rm -rf .next
npm run build
```

### Page Not Found
- Check route exists in `app/` directory
- Verify file is named `page.tsx` (not `index.tsx`)
- Check dynamic route syntax: `[id]/page.tsx` for `/something/123`

---

## 📱 Responsive Design

All pages are built with Tailwind CSS mobile-first approach:
- Mobile breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Use `grid`, `flex` for layouts
- Test on multiple screen sizes during development

---

## 🎯 Next Steps

1. **Setup Backend**: Create Node.js/Express API server
2. **Database**: Set up PostgreSQL/MongoDB
3. **Authentication**: Implement JWT with refresh tokens
4. **Payment**: Integrate Stripe/Razorpay
5. **Real-time**: Add Socket.io for live tracking
6. **Testing**: Add Jest/Playwright tests
7. **Deployment**: Deploy to Vercel/AWS/Azure

