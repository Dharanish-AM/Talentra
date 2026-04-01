# Talentra Backend

Production-grade backend API for Campus Recruitment Management System.

## 🎯 Overview

Talentra is a comprehensive platform that manages campus recruitment workflows between Students, Placement Admins, and Recruiters. This backend provides a robust REST API with role-based access control, eligibility filtering, and complete application lifecycle management.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # MongoDB connection
│   │   └── logger.js            # Winston logger configuration
│   ├── controllers/             # Request handlers
│   │   ├── auth.controller.js
│   │   ├── student.controller.js
│   │   ├── admin.controller.js
│   │   └── recruiter.controller.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js              # JWT authentication & authorization
│   │   ├── errorHandler.js      # Global error handler
│   │   └── upload.js            # File upload configuration
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── StudentProfile.js
│   │   ├── Company.js
│   │   ├── JobDrive.js
│   │   ├── Application.js
│   │   └── Interview.js
│   ├── routes/                  # API routes
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── admin.routes.js
│   │   ├── recruiter.routes.js
│   │   └── index.js
│   ├── services/                # Business logic
│   │   ├── auth.service.js
│   │   ├── student.service.js
│   │   ├── admin.service.js
│   │   ├── recruiter.service.js
│   │   └── eligibility.service.js
│   ├── utils/                   # Utility functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── asyncHandler.js
│   ├── validators/              # Joi validation schemas
│   │   ├── auth.validator.js
│   │   ├── student.validator.js
│   │   └── drive.validator.js
│   ├── seeds/
│   │   └── index.js             # Database seeding script
│   └── index.js                 # Server entry point
├── uploads/                     # Resume uploads directory
├── logs/                        # Application logs
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore
├── package.json
└── README.md
```

## � Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@placements.edu` | `admin123` |
| **Student** | `rahul.sharma@university.edu` | `password123` |
| **Recruiter** | `recruiter@techcorp.com` | `recruiter123` |

## �🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/talentra
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

3. **Start MongoDB**:
```bash
mongod
```

4. **Seed the database** (optional but recommended):
```bash
npm run seed
```

5. **Start the server**:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:8000`

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

### Auth Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@university.edu",
  "password": "password123",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@university.edu",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Student Endpoints

All student endpoints require `student` role.

#### Get Profile
```http
GET /api/student/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/student/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "department": "Computer Science",
  "cgpa": 8.5,
  "backlogs": 0,
  "phone": "+91 98765 43210",
  "graduationYear": 2025,
  "skills": ["React", "Node.js", "Python"]
}
```

#### Upload Resume
```http
POST /api/student/profile/resume
Authorization: Bearer <token>
Content-Type: multipart/form-data

resume: <PDF file>
```

#### Get Eligible Drives
```http
GET /api/student/drives
Authorization: Bearer <token>
```

#### Apply to Drive
```http
POST /api/student/drives/:driveId/apply
Authorization: Bearer <token>
```

#### Get My Applications
```http
GET /api/student/applications
Authorization: Bearer <token>
```

---

### Admin Endpoints

All admin endpoints require `admin` role.

#### Companies

```http
GET    /api/admin/companies
POST   /api/admin/companies
PUT    /api/admin/companies/:id
DELETE /api/admin/companies/:id
```

#### Job Drives

```http
GET    /api/admin/drives
POST   /api/admin/drives
PUT    /api/admin/drives/:id
DELETE /api/admin/drives/:id
```

**Create Drive Example**:
```json
{
  "companyId": "company_id_here",
  "title": "Software Engineer Campus 2025",
  "description": "Full-stack development role",
  "role": "Software Engineer",
  "package": "₹12 LPA",
  "location": "Bangalore",
  "eligibility": {
    "minCgpa": 7.0,
    "allowedDepartments": ["Computer Science", "IT"],
    "maxBacklogs": 0
  },
  "deadline": "2025-03-15",
  "driveDate": "2025-03-25",
  "status": "active"
}
```

#### Applicant Management

```http
GET  /api/admin/drives/:id/applicants
POST /api/admin/applicants/shortlist
POST /api/admin/interviews/schedule
POST /api/admin/offers/release
```

#### Analytics

```http
GET /api/admin/analytics
```

---

### Recruiter Endpoints

All recruiter endpoints require `recruiter` role.

```http
GET  /api/recruiter/candidates
POST /api/recruiter/feedback/:interviewId
PUT  /api/recruiter/candidates/:interviewId/result
```

---

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: Granular permissions
- **Rate Limiting**: 100 requests per 15 minutes
- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Joi schema validation
- **Error Handling**: Centralized error middleware

## 🎓 Test Credentials

After running `npm run seed`, use these credentials:

**Student 1**:
- Email: `rahul.sharma@university.edu`
- Password: `password123`

**Student 2**:
- Email: `priya.patel@university.edu`
- Password: `password123`

**Admin**:
- Email: `admin@placements.edu`
- Password: `admin123`

**Recruiter**:
- Email: `recruiter@techcorp.com`
- Password: `recruiter123`

## 🔄 Application Workflow

```
Applied → Shortlisted → Interview → Selected → Offer
                                  ↓
                              Rejected
```

## 🧪 Eligibility Engine

The system automatically filters job drives based on:
- **CGPA**: Minimum CGPA requirement
- **Department**: Allowed departments list
- **Backlogs**: Maximum backlogs allowed

Students only see drives they're eligible for.

## 📝 Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run seed     # Seed database with test data
npm run lint     # Run ESLint
```

## 🐛 Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Stack trace (development only)"
}
```

## 📊 Logging

Logs are stored in the `logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only

Console output is colorized for development.

## 🌐 CORS Configuration

By default, the API accepts requests from `http://localhost:5173` (Vite default).

Update `CLIENT_URL` in `.env` to change this.

## 📦 Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure MongoDB Atlas or production database
4. Set up proper CORS origins
5. Enable HTTPS
6. Configure proper logging
7. Set up process manager (PM2)

## 🤝 Contributing

This is a production-structured MVP. Follow these guidelines:
- Use layered architecture (routes → controllers → services → models)
- Keep business logic in services
- Use async/await with proper error handling
- Validate all inputs
- Follow existing code style

## 📄 License

MIT

---

**Built with ❤️ for Campus Recruitment Management**
