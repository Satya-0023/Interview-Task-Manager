# Interview Task Manager (Full-Stack Assessment)

A professional, production-ready MERN stack application built for the Technical Developer Assessment.

## 🚀 Project Overview

This application allows users to securely track their interview preparation tasks. It focuses on clean architecture, security, and a premium user experience.

### Key Engineering Decisions
- **Clean Architecture**: Separated logic into Controllers, Routes, Models, and Middleware.
- **Security First**: 
    - Password hashing using `bcryptjs`.
    - JWT-based session management with automatic expiry.
    - Rate limiting on authentication routes to prevent brute-force attacks.
    - Owner-verification on all Task CRUD operations to prevent unauthorized data access.
- **Robust Validation**: Input validation at both model and controller levels.
- **UI/UX Excellence**: 
    - **Optimistic Updates**: Backend actions update the UI immediately for a "zero-latency" feel.
    - **Analytics Dashboard**: Real-time cards summarize user productivity.
    - **Smart Empty States**: Engaging feedback for empty lists or zero search results.
- **Centralized Handling**: Global error handling middleware and specialized JWT authorization middleware.

### Features
- ✅ **Full Authentication**: User signup, login, and protected routing.
- ✅ **Task Management**: Create, Read, Update, and Delete tasks.
- ✅ **Real-time UX**: Filter tasks by status, search by title/description.
- ✅ **Dashboard Analytics**: Instant summary cards for Total, Pending, and Completed tasks.
- ✅ **Optimistic Updates**: Zero-latency UI updates for status toggling and deletions.
- ✅ **Responsive Design**: Mobile-friendly, sleek UI built with Tailwind CSS.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), React Router, Axios, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Security**: JWT, Bcryptjs, Express-Rate-Limit

## 📦 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Atlas cluster (connection string required)

### Backend Setup
1. Navigate to `backend/`
2. Create `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```
3. Run `npm install`
4. Run `npm run dev`

### Frontend Setup
1. Navigate to `frontend/`
2. Run `npm install`
3. Run `npm run dev`
4. Access at `http://localhost:5173`

- **Clean Architecture**: Follows a layered architecture (Routes → Controllers → Services → Models) to maintain a strict separation of concerns.
...
## 📂 Architecture Detail (Layered Pattern)
This project follows a professional directory structure:
- `backend/controllers`: Thin controllers that handle HTTP requests and orchestrate services.
- `backend/services`: Contains the core business logic and direct database interactions.
- `backend/middleware`: Contains bouncers like `authMiddleware` and `errorHandler`.
- `backend/utils`: Reusable logic and constants (e.g., `generateToken`, `constants.js`).
- `frontend/src/context`: Centralized state management using React Context API.
- `frontend/src/services`: Standardized API service using Axios Interceptors.
