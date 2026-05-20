# 📧 Mail Service Integration Guide - Frontend Implementation

## Overview
The RideOnDemand backend has **Mail Service fully integrated** with the following endpoints. This guide shows where emails are triggered and what parameters the frontend needs to send.

---

## 🔐 Authentication Endpoints (Mail Triggers)

### 1️⃣ **Register User** → Triggers: *Welcome Email + Admin Notification Email* (Vendor only)

**Endpoint:** `POST /api/v1/auth/register`

**Request Body:**
```json
{
  "fullName": "string (required)",
  "mobile": "string (required, 7-20 chars, digits/+/-/space)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars)",
  "city": "string (required)",
  "role": "CUSTOMER | VENDOR | ADMIN (required)",
  "shopName": "string (optional, for vendors)"
}
```

**Response:**
```json
{
  "id": "number",
  "fullName": "string",
  "mobile": "string",
  "email": "string",
  "city": "string",
  "role": "CUSTOMER | VENDOR | ADMIN",
  "shopName": "string or null",
  "vendorApprovalStatus": "PENDING | APPROVED | REJECTED | NOT_REQUIRED"
}
```

**📧 Email Triggered:**
- **When:** User registers as VENDOR with status = PENDING
- **Email Sent To:** All ADMIN users
- **Email Subject:** "New Vendor Pending Approval"
- **Email Contains:** Vendor name, shop name, city, mobile number
- **Backend Method:** `NotificationService.notifyAdminsPendingVendor()`

**Frontend Implementation:**
```typescript
// User registers as VENDOR
const registerVendor = (formData) => {
  return fetch('/api/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: formData.name,
      mobile: formData.phone,
      email: formData.email,
      password: formData.password,
      city: formData.city,
      role: 'VENDOR',
      shopName: formData.shopName
    })
  });
};
```

---

### 2️⃣ **Login** → No Email Triggered

**Endpoint:** `POST /api/v1/auth/login`

**Request Body:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required)",
  "role": "CUSTOMER | VENDOR | ADMIN (required)"
}
```

**Response:**
```json
{
  "accessToken": "jwt-string",
  "refreshToken": "jwt-string",
  "user": {
    "id": "number",
    "fullName": "string",
    "mobile": "string",
    "email": "string",
    "city": "string",
    "role": "string",
    "vendorApprovalStatus": "string"
  }
}
```

**Frontend Implementation:**
```typescript
const login = (email, password, role) => {
  return fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: email,
      password: password,
      role: role  // CUSTOMER, VENDOR, or ADMIN
    })
  }).then(response => response.json());
  // Store accessToken and refreshToken for subsequent API calls
};
```

---

## 🚗 Customer Endpoints (Mail Triggers)

### 3️⃣ **Create Requirement** → Triggers: *Requirement Posted Email to Vendors*

**Endpoint:** `POST /api/v1/customers/requirements`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "vehicleType": "string (required, e.g., 'SUV', 'Sedan', 'Truck')",
  "startDate": "yyyy-MM-dd (required, must be today or future)",
  "endDate": "yyyy-MM-dd (required, must be today or future)",
  "location": "string (required, e.g., 'Delhi')",
  "budgetPerDay": "number (required, > 0)",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "customerId": "number",
  "vehicleType": "string",
  "startDate": "yyyy-MM-dd",
  "endDate": "yyyy-MM-dd",
  "location": "string",
  "budgetPerDay": "number",
  "notes": "string",
  "status": "ACTIVE | COMPLETED | CANCELLED",
  "createdAt": "timestamp"
}
```

**📧 Email Triggered:**
- **When:** Customer creates a new requirement
- **Email Sent To:** All APPROVED vendors
- **Email Subject:** "New Ride Requirement Available"
- **Email Contains:** Vehicle type, location, dates, budget, notes
- **Backend Method:** `CustomerService.createRequirement()` → calls `NotificationService.notifyVendorsForRequirement()`

**Frontend Implementation:**
```typescript
const createRequirement = (token, requirementData) => {
  return fetch('/api/v1/customers/requirements', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vehicleType: requirementData.type,
      startDate: requirementData.from,
      endDate: requirementData.to,
      location: requirementData.location,
      budgetPerDay: requirementData.budget,
      notes: requirementData.notes
    })
  }).then(response => response.json());
  // Vendors automatically receive email with requirement details
};
```

---

### 4️⃣ **Accept Offer** → Triggers: *Offer Accepted Email to Vendor*

**Endpoint:** `POST /api/v1/customers/offers/{offerId}/accept`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Path Parameters:**
```
offerId: number (the ID of the offer to accept)
```

**Response:**
```json
{
  "id": "number",
  "requirementId": "number",
  "vendorId": "number",
  "pricePerDay": "number",
  "vehicleModel": "string",
  "registrationNumber": "string",
  "notes": "string",
  "status": "ACCEPTED | REJECTED | PENDING",
  "createdAt": "timestamp"
}
```

**📧 Email Triggered:**
- **When:** Customer accepts an offer from a vendor
- **Email Sent To:** Vendor's registered email
- **Email Subject:** "Your Offer Has Been Accepted!"
- **Email Contains:** Customer name, requirement location, vehicle type, dates, accepted price
- **Backend Method:** `CustomerService.acceptOffer()` → calls `NotificationService.notifyVendorForAcceptance()`

**Frontend Implementation:**
```typescript
const acceptOffer = (token, offerId) => {
  return fetch(`/api/v1/customers/offers/${offerId}/accept`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());
  // Vendor automatically receives acceptance email
};
```

---

## 🚕 Vendor Endpoints (Mail Triggers)

### 5️⃣ **Submit Offer** → Triggers: *Offer Received Email to Customer*

**Endpoint:** `POST /api/v1/vendors/offers`

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "requirementId": "number (required, ID of requirement to bid on)",
  "pricePerDay": "number (required, > 0)",
  "vehicleModel": "string (required, e.g., 'Honda City')",
  "registrationNumber": "string (required, e.g., 'DL01AB1234')",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "id": "number",
  "requirementId": "number",
  "vendorId": "number",
  "pricePerDay": "number",
  "vehicleModel": "string",
  "registrationNumber": "string",
  "notes": "string",
  "status": "PENDING",
  "createdAt": "timestamp"
}
```

**📧 Email Triggered:**
- **When:** Vendor submits an offer for a requirement
- **Email Sent To:** Customer's registered email
- **Email Subject:** "New Offer Received for Your Requirement"
- **Email Contains:** Vendor name, price per day, vehicle model, registration number, notes
- **Backend Method:** `VendorService.submitOffer()` → calls `NotificationService.notifyCustomerForOffer()`

**Frontend Implementation:**
```typescript
const submitOffer = (token, offerData) => {
  return fetch('/api/v1/vendors/offers', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requirementId: offerData.requirementId,
      pricePerDay: offerData.price,
      vehicleModel: offerData.model,
      registrationNumber: offerData.regNo,
      notes: offerData.message
    })
  }).then(response => response.json());
  // Customer automatically receives offer email
};
```

---

## ⚙️ Admin Endpoints (Mail Triggers)

### 6️⃣ **Approve Vendor** → Triggers: *Vendor Approved Email*

**Endpoint:** `POST /api/v1/admin/vendors/{vendorId}/approve`

**Headers:**
```
Authorization: Bearer {adminToken}
```

**Path Parameters:**
```
vendorId: number (the ID of vendor to approve)
```

**Response:**
```json
{
  "id": "number",
  "fullName": "string",
  "mobile": "string",
  "email": "string",
  "city": "string",
  "role": "VENDOR",
  "shopName": "string",
  "vendorApprovalStatus": "APPROVED"
}
```

**📧 Email Triggered:**
- **When:** Admin approves a pending vendor
- **Email Sent To:** Vendor's registered email
- **Email Subject:** "Your Vendor Profile Has Been Approved!"
- **Email Contains:** Welcome message, available features (browse requirements, submit offers, etc.)
- **Backend Method:** `AdminService.approveVendor()` → calls `NotificationService.notifyVendorApprovalDecision(true)`

**Frontend Implementation:**
```typescript
const approveVendor = (token, vendorId) => {
  return fetch(`/api/v1/admin/vendors/${vendorId}/approve`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());
  // Vendor automatically receives approval email
};
```

---

### 7️⃣ **Reject Vendor** → Triggers: *Vendor Rejected Email*

**Endpoint:** `POST /api/v1/admin/vendors/{vendorId}/reject`

**Headers:**
```
Authorization: Bearer {adminToken}
```

**Path Parameters:**
```
vendorId: number (the ID of vendor to reject)
```

**Response:**
```json
{
  "id": "number",
  "fullName": "string",
  "mobile": "string",
  "email": "string",
  "city": "string",
  "role": "VENDOR",
  "shopName": "string",
  "vendorApprovalStatus": "REJECTED"
}
```

**📧 Email Triggered:**
- **When:** Admin rejects a pending vendor
- **Email Sent To:** Vendor's registered email
- **Email Subject:** "Vendor Profile Status Update"
- **Email Contains:** Rejection message, instruction to contact support for reapplication
- **Backend Method:** `AdminService.rejectVendor()` → calls `NotificationService.notifyVendorApprovalDecision(false)`

**Frontend Implementation:**
```typescript
const rejectVendor = (token, vendorId) => {
  return fetch(`/api/v1/admin/vendors/${vendorId}/reject`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(response => response.json());
  // Vendor automatically receives rejection email
};
```

---

## 📨 Email Summary Table

| # | Event | Endpoint | Triggered By | Email Sent To | Subject |
|---|-------|----------|--------------|---------------|---------|
| 1 | Vendor Registration | `POST /auth/register` | Vendor | Admins | New Vendor Pending Approval |
| 2 | Create Requirement | `POST /customers/requirements` | Customer | Approved Vendors | New Ride Requirement Available |
| 3 | Accept Offer | `POST /customers/offers/{id}/accept` | Customer | Vendor | Your Offer Has Been Accepted! |
| 4 | Submit Offer | `POST /vendors/offers` | Vendor | Customer | New Offer Received for Your Requirement |
| 5 | Approve Vendor | `POST /admin/vendors/{id}/approve` | Admin | Vendor | Your Vendor Profile Has Been Approved! |
| 6 | Reject Vendor | `POST /admin/vendors/{id}/reject` | Admin | Vendor | Vendor Profile Status Update |

---

## 🔄 Frontend Flow - Complete Journey

### **Customer Journey:**
1. **Register** (email + password) → Account created
2. **Login** (email + password) → Receive JWT tokens
3. **Create Requirement** → Emails sent to all approved vendors
4. **View Offers** → Offers received from vendors (with email notifications)
5. **Accept Offer** → Email sent to vendor

### **Vendor Journey:**
1. **Register** (email + password + shopName) → Email sent to admins (pending approval)
2. **Login** (email + password) → Login as vendor (PENDING status)
3. **Admin approves** → Email sent: "Vendor Approved"
4. **Browse Demand Feed** → See customer requirements (that triggered emails)
5. **Submit Offer** → Email sent to customer

### **Admin Journey:**
1. **Register as Admin** (email + password) → Account created
2. **Login** (email + password) → Receive JWT tokens
3. **View Pending Vendors** → `GET /admin/vendors/pending-approvals`
4. **Approve Vendor** → `POST /admin/vendors/{id}/approve` → Email sent to vendor
5. **Or Reject Vendor** → `POST /admin/vendors/{id}/reject` → Email sent to vendor

---

## 🎯 Where to Modify in Frontend

### **1. Authentication Module**
- **File:** `auth.service.ts` or `AuthService.js`
- **Modify:**
  - `register()` - Collect fullName, email, password, mobile, city, role, shopName (if vendor)
  - `login()` - Collect email, password, role → Store tokens in localStorage/sessionStorage
  - Add email field on registration form
  - Add password field on registration & login forms

### **2. Customer Dashboard**
- **File:** `customer.service.ts` or `CustomerService.js`
- **Modify:**
  - `createRequirement()` - Show toast: "Requirement posted! Vendors will receive email notification"
  - `acceptOffer()` - Show toast: "Vendor has been notified via email about your acceptance"

### **3. Vendor Dashboard**
- **File:** `vendor.service.ts` or `VendorService.js`
- **Modify:**
  - `submitOffer()` - Show toast: "Offer submitted! Customer will receive email notification"
  - Show vendor approval status (PENDING/APPROVED/REJECTED)

### **4. Admin Dashboard**
- **File:** `admin.service.ts` or `AdminService.js`
- **Modify:**
  - `approveVendor()` - Show toast: "Vendor approved! Confirmation email sent"
  - `rejectVendor()` - Show toast: "Vendor rejected. Rejection email sent"

---

## ⚠️ Important Notes

✅ **All emails are automatic** - No manual configuration needed in frontend
✅ **Emails configured with Gmail SMTP** - Credentials in `application.yaml`
✅ **Password-based authentication** - No OTP required, simple email + password login
✅ **HTML template emails** - Professional styled emails with colors and formatting
✅ **Exception handling** - Errors are logged, emails fail gracefully

---

## 📧 Email Configuration

**Location:** `application.yaml`

```yaml
spring:
  mail:
    host: smtp.gmail.com
    port: 587
    username: rideondemandofficial@gmail.com
    password: Ride@12345          # Use environment variable for production
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true

app:
  mail:
    from: rideondemandofficial@gmail.com
    sender-name: RideOnDemand
```

---

## 🧪 Testing Authentication & Mail Service

```bash
# Register a new customer
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName": "Aarav Sharma", "mobile": "+919876543210", "email": "aarav@example.com", "password": "Secret@123", "city": "Pune", "role": "CUSTOMER"}'

# Login
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "aarav@example.com", "password": "Secret@123", "role": "CUSTOMER"}'

# Test Requirement email (after login)
curl -X POST http://localhost:8081/api/v1/customers/requirements \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "vehicleType": "SUV",
    "startDate": "2026-05-15",
    "endDate": "2026-05-20",
    "location": "Delhi",
    "budgetPerDay": 5000,
    "notes": "Need AC SUV"
  }'

# All vendors receive email notification
```

---

## ✨ Summary

The **Mail Service is fully implemented and integrated** with all endpoints. Your frontend just needs to:

1. ✅ Send the correct request body to endpoints
2. ✅ Display appropriate UI messages to users
3. ✅ Show loading/success states
4. ✅ Emails are sent automatically in background
5. ✅ Use email + password for authentication (no OTP flow needed)

**No additional API calls needed for emails** - they're triggered automatically by the backend! 🎉
