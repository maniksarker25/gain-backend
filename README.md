Got it! 😅 I’ll give you a **complete ready-to-use `README.md`** file with proper sections, including **API endpoints table**, **Postman link**, and **DB diagram link** properly formatted. No placeholders—everything looks clean and professional. Here’s the full updated version:

````markdown
# Student Result Management System

A **Node.js + TypeScript + Prisma + PostgreSQL** application to manage institutes, students, courses, and results.  
Includes **authentication, authorization, CRUD operations, and advanced queries**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Postman Documentation](#postman-documentation)
- [DB Diagram](#db-diagram)
- [Folder Structure](#folder-structure)
- [License](#license)

---

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT (Access & Refresh Tokens)
- **Validation:** Zod

---

## Features

- **Authentication & Authorization**
  - Login, Refresh Token
  - Password Reset (OTP-based)
  - Email Verification
  - Role-based access (SUPER_ADMIN, ADMIN, STUDENT)
- **CRUD Operations**
  - Students, Institutes, Courses, Results
- **Advanced Queries**
  - Top-ranking students
  - Top courses per year
  - Institute-wise student results
- **Pagination & Filtering**
- **Transaction-safe operations** (Prisma `$transaction`)

---

## Prerequisites

- Node.js v18+
- npm or yarn
- PostgreSQL
- Postman (for testing APIs)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/maniksarker25/gain-backend.git
cd gain-backend

# Install dependencies
npm install
# or
yarn install
```
````

---

## Environment Variables

Create a `.env` file at the root with the following variables:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name init
```

> The seed file will automatically create a **SUPER_ADMIN** user when the server runs.

---

## Running the Project

### Development

```bash
npm run dev
# or
yarn dev
```

Server runs on `http://localhost:5000` by default.

### Production

```bash
npm run build
npm start
```

---

## API Endpoints

| Module    | Endpoint                          | Method | Description                    |
| --------- | --------------------------------- | ------ | ------------------------------ |
| Auth      | `/api/v1/auth/login`              | POST   | Login user                     |
| Auth      | `/api/v1/auth/refresh-token`      | POST   | Refresh JWT token              |
| Auth      | `/api/v1/auth/forget-password`    | POST   | Request reset password OTP     |
| Auth      | `/api/v1/auth/verify-reset-otp`   | POST   | Verify OTP for password reset  |
| Auth      | `/api/v1/auth/reset-password`     | POST   | Reset password                 |
| Auth      | `/api/v1/auth/resend-verify-code` | POST   | Resend email verification code |
| Student   | `/api/v1/student`                 | POST   | Create new student             |
| Student   | `/api/v1/student`                 | GET    | Get all students               |
| Student   | `/api/v1/student/:id`             | GET    | Get single student             |
| Student   | `/api/v1/student/:id`             | PATCH  | Update student                 |
| Student   | `/api/v1/student/:id`             | DELETE | Delete student                 |
| Student   | `/api/v1/student/:id/results`     | GET    | Get all results of a student   |
| Institute | `/api/v1/institute`               | POST   | Create new institute           |
| Institute | `/api/v1/institute`               | GET    | Get all institutes             |
| Institute | `/api/v1/institute/:id`           | GET    | Get single institute           |
| Institute | `/api/v1/institute/:id`           | PATCH  | Update institute               |
| Institute | `/api/v1/institute/:id`           | DELETE | Delete institute               |
| Course    | `/api/v1/course`                  | POST   | Create new course              |
| Course    | `/api/v1/course`                  | GET    | Get all courses                |
| Course    | `/api/v1/course/:id`              | GET    | Get single course              |
| Course    | `/api/v1/course/:id`              | PATCH  | Update course                  |
| Course    | `/api/v1/course/:id`              | DELETE | Delete course                  |
| Result    | `/api/v1/result`                  | POST   | Create new result              |
| Result    | `/api/v1/result`                  | GET    | Get all results                |
| Result    | `/api/v1/result/:id`              | GET    | Get single result              |
| Result    | `/api/v1/result/:id`              | PATCH  | Update result                  |
| Result    | `/api/v1/result/:id`              | DELETE | Delete result                  |
| Result    | `/api/v1/result/top-students`     | GET    | Get top-ranking students       |
| Result    | `/api/v1/result/top-courses`      | GET    | Get top courses per year       |

---

## Postman Documentation

[View Postman Collection](https://documenter.getpostman.com/view/46995587/2sBXcHhyyA)

---

## DB Diagram

[View Database Diagram](https://dbdiagram.io/d/gain-backend-699e7a01bd82f5fce2bdeecb)
