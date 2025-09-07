# 🏥 Kale Accident Hospital Management System

A modern, full-stack hospital management system built with React and Node.js, designed for **Kale Accident Hospital** located at Opposite market yard, Pathardi Road, Shevgaon, Ahilyanagar.

## 🌟 Features

### 👨‍⚕️ Doctor Dashboard
- View all patients and their details
- Search and filter patients by status
- Access comprehensive patient medical records
- View vital signs and medical history

### 👩‍💼 Receptionist Dashboard
- Patient check-in and registration
- Manage patient information
- Update patient status
- View dashboard statistics

### 🔐 Authentication & Security
- Role-based access control (Doctor/Receptionist)
- JWT token authentication with 1-day expiration
- Secure API endpoints with middleware protection
- Session management with automatic logout

### 🎨 Modern UI/UX
- Beautiful indigo theme with Tailwind CSS
- Responsive design for all devices
- Smooth animations with Framer Motion
- Interactive and intuitive interface

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - Database and authentication
- **JWT** - JSON Web Tokens for auth
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hosp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Backend `.env` file is already configured with:
   ```env
   PORT=5000
   SUPABASE_URL=https://ajpslnftcunwfsittjni.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=kale_hospital_secret_key_2024_secure_token
   JWT_EXPIRES_IN=1d
   ```

   Frontend `.env` file is already configured with:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_HOSPITAL_NAME=Kale Accident Hospital
   VITE_HOSPITAL_ADDRESS=Opposite market yard, Pathardi Road, Shevgaon, Ahilyanagar
   VITE_DOCTOR_NAME=Dr. Vishal Diliprao Kale
   ```

5. **Database Setup**
   
   Execute the SQL schema in `backend/database/setup.sql` in your Supabase SQL editor to create tables and sample data.

6. **Start the Application**
   
   Start backend server:
   ```bash
   cd backend
   npm run dev
   ```
   
   Start frontend server (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 👥 User Management

### Creating Users
- Use the registration API endpoint to create new users
- No default credentials are provided for security reasons
- Create your own users through the `/api/auth/register` endpoint

### User Roles
- **Doctor:** Can view and update patient information
- **Receptionist:** Can create, view, update, and delete patient records

## 📁 Project Structure

```
hosp/
├── backend/                 # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── routes/             # API routes
│   ├── database/           # Database schema
│   ├── .env               # Environment variables
│   └── index.js           # Server entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── utils/         # Utility functions
│   │   └── App.jsx        # Main app component
│   ├── .env              # Environment variables
│   └── vite.config.js    # Vite configuration
└── README.md             # Project documentation
```

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Patients
- `GET /api/patients` - Get all patients (with pagination)
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `PATCH /api/patients/:id/status` - Update patient status
- `DELETE /api/patients/:id` - Delete patient
- `GET /api/patients/stats/dashboard` - Get dashboard statistics

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🎯 Key Features Implemented

### Patient Management
- ✅ Patient check-in with comprehensive form
- ✅ Patient listing with search and filters
- ✅ Patient details view with medical information
- ✅ Vital signs tracking
- ✅ Medical history management

### User Roles & Permissions
- ✅ Doctor: View-only access to patient records
- ✅ Receptionist: Full CRUD operations on patients
- ✅ Role-based navigation and features

### UI/UX Excellence
- ✅ Modern, responsive design
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback
- ✅ Intuitive navigation and layout

### Security & Performance
- ✅ JWT authentication with expiration
- ✅ Protected routes and API endpoints
- ✅ Input validation and sanitization
- ✅ Rate limiting and security headers
- ✅ Optimized database queries

## 🏥 Hospital Information

- **Name:** Kale Accident Hospital
- **Address:** Opposite market yard, Pathardi Road, Shevgaon, Ahilyanagar
- **Primary Doctor:** Dr. Vishal Diliprao Kale

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for Kale Accident Hospital**
