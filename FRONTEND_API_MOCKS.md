# RideOnDemand API Mock Data

Base URL: `http://localhost:8081`

Use this header for protected endpoints:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

## Auth

### POST /api/v1/auth/register
Creates a new user account with password.

Request:
```json
{
  "fullName": "Aarav Sharma",
  "mobile": "+919876543210",
  "email": "aarav@example.com",
  "password": "Secret@123",
  "city": "Pune",
  "role": "CUSTOMER",
  "shopName": null
}
```

Response (201 Created):
```json
{
  "id": 1,
  "fullName": "Aarav Sharma",
  "mobile": "+919876543210",
  "email": "aarav@example.com",
  "city": "Pune",
  "shopName": null,
  "role": "CUSTOMER",
  "vendorApprovalStatus": "NOT_REQUIRED",
  "createdAt": "2026-05-11T15:05:00",
  "updatedAt": "2026-05-11T15:05:00"
}
```

### POST /api/v1/auth/login
Authenticates user with email + password and returns JWT tokens.

Request:
```json
{
  "email": "aarav@example.com",
  "password": "Secret@123",
  "role": "CUSTOMER"
}
```

Response (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "fullName": "Aarav Sharma",
    "mobile": "+919876543210",
    "email": "aarav@example.com",
    "city": "Pune",
    "shopName": null,
    "role": "CUSTOMER",
    "vendorApprovalStatus": "NOT_REQUIRED",
    "createdAt": "2026-05-11T15:05:00",
    "updatedAt": "2026-05-11T15:05:00"
  }
}
```

Error (401 Unauthorized):
```json
{
  "timestamp": "2026-05-11T15:12:00Z",
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid email or password",
  "path": "/api/v1/auth/login"
}
```

### GET /api/v1/auth/me
Returns the current logged-in user.

Response:
```json
{
  "id": 1,
  "fullName": "Aarav Sharma",
  "mobile": "+919876543210",
  "email": "aarav@example.com",
  "city": "Pune",
  "shopName": null,
  "role": "CUSTOMER",
  "vendorApprovalStatus": "NOT_REQUIRED",
  "createdAt": "2026-05-11T15:05:00",
  "updatedAt": "2026-05-11T15:05:00"
}
```

## Customer

### GET /api/v1/customers/requirements
Lists current customer requirements.

Response:
```json
[
  {
    "id": 101,
    "vehicleType": "SUV",
    "startDate": "2026-05-15",
    "endDate": "2026-05-20",
    "location": "Pune",
    "budgetPerDay": 2500.00,
    "notes": "Need for 5 days with AC",
    "status": "OPEN",
    "acceptedOfferId": null,
    "createdAt": "2026-05-11T15:06:00"
  }
]
```

### POST /api/v1/customers/requirements
Creates a new requirement.

Request:
```json
{
  "vehicleType": "Sedan",
  "startDate": "2026-05-16",
  "endDate": "2026-05-18",
  "location": "Mumbai",
  "budgetPerDay": 1800.00,
  "notes": "Airport pickup required"
}
```

Response:
```json
{
  "id": 102,
  "vehicleType": "Sedan",
  "startDate": "2026-05-16",
  "endDate": "2026-05-18",
  "location": "Mumbai",
  "budgetPerDay": 1800.00,
  "notes": "Airport pickup required",
  "status": "OPEN",
  "acceptedOfferId": null,
  "createdAt": "2026-05-11T15:07:00"
}
```

### GET /api/v1/customers/requirements/{requirementId}/offers
Lists offers for one requirement, sorted by price.

Response:
```json
[
  {
    "id": 501,
    "requirementId": 101,
    "vendorId": 21,
    "vendorName": "Ravi Motors",
    "pricePerDay": 2200.00,
    "vehicleModel": "Toyota Innova",
    "registrationNumber": "MH12AB1234",
    "notes": "Well maintained vehicle",
    "status": "PENDING",
    "createdAt": "2026-05-11T15:08:00"
  }
]
```

### POST /api/v1/customers/offers/{offerId}/accept
Accepts an offer and marks the requirement as accepted.

Response:
```json
{
  "id": 101,
  "vehicleType": "SUV",
  "startDate": "2026-05-15",
  "endDate": "2026-05-20",
  "location": "Pune",
  "budgetPerDay": 2500.00,
  "notes": "Need for 5 days with AC",
  "status": "ACCEPTED",
  "acceptedOfferId": 501,
  "createdAt": "2026-05-11T15:06:00"
}
```

### GET /api/v1/customers/notifications
Returns recent customer notifications.

Response:
```json
[
  {
    "id": 9001,
    "type": "OFFER_RECEIVED",
    "title": "New offer received",
    "message": "You received an offer for requirement #101 from Ravi Motors",
    "read": false,
    "createdAt": "2026-05-11T15:08:05"
  }
]
```

### GET /api/v1/customers/profile
Returns profile summary, stats, and account details.

Response:
```json
{
  "profile": {
    "id": 1,
    "fullName": "Aarav Sharma",
    "mobile": "+919876543210",
    "email": "aarav@example.com",
    "city": "Pune",
    "shopName": null,
    "role": "CUSTOMER",
    "vendorApprovalStatus": "NOT_REQUIRED",
    "createdAt": "2026-05-11T15:05:00",
    "updatedAt": "2026-05-11T15:05:00"
  },
  "stats": {
    "totalRequirements": 3,
    "openRequirements": 1,
    "offersReceived": 7,
    "acceptedDeals": 2
  },
  "recentRequirements": [
    {
      "id": 101,
      "vehicleType": "SUV",
      "startDate": "2026-05-15",
      "endDate": "2026-05-20",
      "location": "Pune",
      "budgetPerDay": 2500.00,
      "notes": "Need for 5 days with AC",
      "status": "ACCEPTED",
      "acceptedOfferId": 501,
      "createdAt": "2026-05-11T15:06:00"
    }
  ]
}
```

## Vendor

### GET /api/v1/vendors/demand-feed
Lists live customer requirements visible to vendors.

Query params:
```text
?vehicleType=SUV&location=Pune&page=0&size=20
```

Response:
```json
{
  "content": [
    {
      "id": 101,
      "vehicleType": "SUV",
      "startDate": "2026-05-15",
      "endDate": "2026-05-20",
      "location": "Pune",
      "budgetPerDay": 2500.00,
      "notes": "Need for 5 days with AC",
      "status": "OPEN",
      "acceptedOfferId": null,
      "createdAt": "2026-05-11T15:06:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

### POST /api/v1/vendors/offers
Submits an offer for a requirement.

Request:
```json
{
  "requirementId": 101,
  "pricePerDay": 2200.00,
  "vehicleModel": "Toyota Innova",
  "registrationNumber": "MH12AB1234",
  "notes": "Well maintained vehicle"
}
```

Response:
```json
{
  "id": 501,
  "requirementId": 101,
  "vendorId": 21,
  "vendorName": "Ravi Motors",
  "pricePerDay": 2200.00,
  "vehicleModel": "Toyota Innova",
  "registrationNumber": "MH12AB1234",
  "notes": "Well maintained vehicle",
  "status": "PENDING",
  "createdAt": "2026-05-11T15:08:00"
}
```

### GET /api/v1/vendors/offers
Lists all offers sent by the vendor.

Query params:
```text
?status=PENDING&page=0&size=20
```

Response:
```json
{
  "content": [
    {
      "id": 501,
      "requirementId": 101,
      "vendorId": 21,
      "vendorName": "Ravi Motors",
      "pricePerDay": 2200.00,
      "vehicleModel": "Toyota Innova",
      "registrationNumber": "MH12AB1234",
      "notes": "Well maintained vehicle",
      "status": "PENDING",
      "createdAt": "2026-05-11T15:08:00"
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

### GET /api/v1/vendors/notifications
Returns vendor notifications.

Response:
```json
[
  {
    "id": 9002,
    "type": "REQUIREMENT_POSTED",
    "title": "New requirement available",
    "message": "Pune - SUV within 2500.00",
    "read": false,
    "createdAt": "2026-05-11T15:06:05"
  }
]
```

### GET /api/v1/vendors/profile
Returns vendor profile and approval status.

Response:
```json
{
  "profile": {
    "id": 21,
    "fullName": "Ravi Kumar",
    "mobile": "+919999888777",
    "email": "ravi@example.com",
    "city": "Pune",
    "shopName": "Ravi Motors",
    "role": "VENDOR",
    "vendorApprovalStatus": "APPROVED",
    "createdAt": "2026-05-10T12:00:00",
    "updatedAt": "2026-05-11T10:00:00"
  },
  "stats": {
    "approvalStatus": "APPROVED",
    "offersSent": 18,
    "acceptedDeals": 4,
    "pendingOffers": 6
  },
  "recentOffers": [
    {
      "id": 501,
      "requirementId": 101,
      "vendorId": 21,
      "vendorName": "Ravi Motors",
      "pricePerDay": 2200.00,
      "vehicleModel": "Toyota Innova",
      "registrationNumber": "MH12AB1234",
      "notes": "Well maintained vehicle",
      "status": "PENDING",
      "createdAt": "2026-05-11T15:08:00"
    }
  ]
}
```

## Admin

### GET /api/v1/admin/dashboard/stats
Returns active requirements, offers today, deals this week, verified shops.

Response:
```json
{
  "activeRequirements": 24,
  "offersToday": 13,
  "dealsThisWeek": 7,
  "verifiedShops": 11
}
```

### GET /api/v1/admin/vendors/pending-approvals
Lists vendors awaiting approval.

Response:
```json
[
  {
    "id": 31,
    "fullName": "Suresh Auto",
    "mobile": "+919876650001",
    "email": "suresh@example.com",
    "city": "Mumbai",
    "shopName": "Suresh Auto Rentals",
    "vendorApprovalStatus": "PENDING",
    "createdAt": "2026-05-11T10:20:00"
  }
]
```

### POST /api/v1/admin/vendors/{vendorId}/approve
Approves a vendor.

Response:
```json
{
  "id": 31,
  "fullName": "Suresh Auto",
  "mobile": "+919876650001",
  "email": "suresh@example.com",
  "city": "Mumbai",
  "shopName": "Suresh Auto Rentals",
  "role": "VENDOR",
  "vendorApprovalStatus": "APPROVED",
  "createdAt": "2026-05-11T10:20:00",
  "updatedAt": "2026-05-11T15:10:00"
}
```

### POST /api/v1/admin/vendors/{vendorId}/reject
Rejects a vendor.

Response:
```json
{
  "id": 31,
  "fullName": "Suresh Auto",
  "mobile": "+919876650001",
  "email": "suresh@example.com",
  "city": "Mumbai",
  "shopName": "Suresh Auto Rentals",
  "role": "VENDOR",
  "vendorApprovalStatus": "REJECTED",
  "createdAt": "2026-05-11T10:20:00",
  "updatedAt": "2026-05-11T15:10:00"
}
```

### GET /api/v1/admin/notifications
Returns admin notifications if needed.

Response:
```json
[
  {
    "id": 9003,
    "type": "VENDOR_PENDING_APPROVAL",
    "title": "Vendor pending approval",
    "message": "Suresh Auto is waiting for review.",
    "read": false,
    "createdAt": "2026-05-11T10:20:05"
  }
]
```

## Common Error Shape

```json
{
  "timestamp": "2026-05-11T15:12:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/v1/auth/register",
  "details": [
    "email: must be a valid email address",
    "password: must be at least 8 characters"
  ]
}
```

## Suggested Frontend Mock Entities

```json
{
  "customer": {
    "id": 1,
    "fullName": "Aarav Sharma",
    "mobile": "+919876543210",
    "email": "aarav@example.com",
    "city": "Pune",
    "role": "CUSTOMER"
  },
  "vendor": {
    "id": 21,
    "fullName": "Ravi Kumar",
    "mobile": "+919999888777",
    "email": "ravi@example.com",
    "city": "Pune",
    "shopName": "Ravi Motors",
    "role": "VENDOR",
    "vendorApprovalStatus": "APPROVED"
  },
  "admin": {
    "id": 99,
    "fullName": "Admin User",
    "mobile": "+911111222233",
    "email": "admin@rideondemand.com",
    "city": "HQ",
    "role": "ADMIN"
  }
}
```