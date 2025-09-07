# 🏥 Kale Accident Hospital Management System - API Collection for Postman

## Base URL
```
http://localhost:5001/api
```

## Authentication
Most endpoints require a JWT token. Include it in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Login
**POST** `/auth/login`
```json
{
  "username": "your_username",
  "password": "your_password",
  "role": "doctor"
}
```

**Example for receptionist:**
```json
{
  "username": "your_username",
  "password": "your_password",
  "role": "receptionist"
}
```

### 2. Register New User
**POST** `/auth/register`
```json
{
  "username": "newuser",
  "password": "newpassword123",
  "role": "doctor",
  "full_name": "Dr. New User",
  "email": "newuser@kalehospital.com"
}
```

### 3. Get Current User Profile
**GET** `/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None

### 4. Logout
**POST** `/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None

---

## 👥 User Management Endpoints

### 5. Get All Users
**GET** `/users`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None

### 6. Get User Profile
**GET** `/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None

### 7. Update User Profile
**PUT** `/users/profile`
- **Headers:** `Authorization: Bearer <token>`
```json
{
  "full_name": "Dr. Updated Name",
  "email": "updated@kalehospital.com"
}
```

---

## 🏥 Patient Management Endpoints

### 8. Get All Patients (with pagination and search)
**GET** `/patients`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `page=1` (optional, default: 1)
  - `limit=10` (optional, default: 10)
  - `search=john` (optional, search by name, phone, or patient_id)
  - `status=checked_in` (optional, filter by status)
  - `sortBy=created_at` (optional, default: created_at)
  - `sortOrder=desc` (optional, default: desc)

**Example:** `GET /patients?page=1&limit=5&search=john&status=checked_in`

### 9. Get Single Patient
**GET** `/patients/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None
- **Replace `:id` with actual patient UUID**

### 10. Create New Patient (Check-in)
**POST** `/patients`
- **Headers:** `Authorization: Bearer <token>`
- **Required Role:** Receptionist
```json
{
  "full_name": "Rajesh Kumar Sharma",
  "age": 45,
  "gender": "male",
  "phone": "+91-9876543210",
  "address": "Village Pathardi, Shevgaon, Ahilyanagar",
  "emergency_contact": "Sunita Sharma (Wife)",
  "emergency_phone": "+91-9876543211",
  "blood_group": "B+",
  "height": 175.5,
  "weight": 70.2,
  "chief_complaint": "Chest pain and shortness of breath",
  "symptoms": "Sharp chest pain, difficulty breathing, sweating",
  "medical_history": "Hypertension for 5 years, Diabetes Type 2",
  "allergies": "None known",
  "current_medications": "Metformin 500mg twice daily, Amlodipine 5mg once daily",
  "vital_signs": {
    "bp": "140/90",
    "pulse": "88",
    "temp": "98.4",
    "resp": "20",
    "spo2": "96"
  }
}
```

### 11. Update Patient Information
**PUT** `/patients/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Replace `:id` with actual patient UUID**
```json
{
  "full_name": "Updated Patient Name",
  "age": 46,
  "phone": "+91-9876543212",
  "address": "Updated Address",
  "symptoms": "Updated symptoms description",
  "vital_signs": {
    "bp": "130/85",
    "pulse": "75",
    "temp": "98.2",
    "resp": "18",
    "spo2": "98"
  }
}
```

### 12. Update Patient Status
**PATCH** `/patients/:id/status`
- **Headers:** `Authorization: Bearer <token>`
- **Replace `:id` with actual patient UUID**
```json
{
  "status": "in_consultation",
  "notes": "Patient moved to consultation room"
}
```

**Valid statuses:**
- `checked_in`
- `in_consultation`
- `completed`
- `discharged`

### 13. Delete Patient (Soft Delete)
**DELETE** `/patients/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Required Role:** Receptionist
- **Replace `:id` with actual patient UUID**
- **Body:** None

### 14. Get Dashboard Statistics
**GET** `/patients/stats/dashboard`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None

---

## 🏥 System Endpoints

### 15. Health Check
**GET** `/health`
- **Body:** None
- **No authentication required**

---

## 📋 Postman Collection Setup

### Environment Variables
Create a Postman environment with these variables:

```
base_url: http://localhost:5001/api
token: (will be set after login)
```

### Pre-request Script for Authenticated Endpoints
Add this to your collection's pre-request script:
```javascript
if (pm.environment.get("token")) {
    pm.request.headers.add({
        key: 'Authorization',
        value: 'Bearer ' + pm.environment.get("token")
    });
}
```

### Test Script for Login
Add this to your login request's test script:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.data.token) {
        pm.environment.set("token", response.data.token);
        console.log("Token saved to environment");
    }
}
```

---

## 🔑 User Authentication

### Creating Users
- Use the registration endpoint to create new users
- No default credentials are provided for security reasons
- Create your own users through the `/api/auth/register` endpoint

---

## 📝 Testing Workflow

1. **Start with Health Check** - Verify API is running
2. **Register User** - Create a new user account
3. **Login** - Use your registered credentials
4. **Get Profile** - Verify authentication works
5. **Create Patient** - Test patient check-in (receptionist only)
6. **Get Patients** - Test patient listing with pagination
7. **Update Patient** - Test patient information updates
8. **Update Status** - Test patient status changes
9. **Get Dashboard Stats** - Test statistics endpoint

---

## ⚠️ Important Notes

1. **Role-based Access:**
   - Receptionists can create and delete patients
   - Both doctors and receptionists can view and update patients
   - All authenticated users can view their profile

2. **Patient ID Generation:**
   - Patient IDs are auto-generated as `KAH{timestamp}`
   - Use the UUID from the response for subsequent operations

3. **Pagination:**
   - Default page size is 10
   - Use query parameters for filtering and sorting

4. **Error Handling:**
   - All endpoints return consistent error format
   - Check `success` field in response
   - Error messages are in the `message` field

5. **Token Expiry:**
   - JWT tokens expire in 7 days
   - Re-login if you get 401 Unauthorized errors

---

## 🚀 Quick Start Commands

### Test API Health
```bash
curl http://localhost:5001/api/health
```

### Login and Get Token
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_password", "role": "doctor"}'
```

### Get Patients (with token)
```bash
curl -X GET http://localhost:5001/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🔧 Troubleshooting

1. **401 Unauthorized:** Check if token is valid and included in Authorization header
2. **403 Forbidden:** Check if user has required role for the operation
3. **404 Not Found:** Check if the resource ID exists
4. **500 Server Error:** Check server logs and database connection

---

*This collection covers all available endpoints in the Kale Accident Hospital Management System API.*
