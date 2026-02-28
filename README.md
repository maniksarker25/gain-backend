# Student Result Management System

A **Node.js + TypeScript + Prisma + PostgreSQL** application to manage institutes, students, courses, and results.  
Includes **authentication, authorization, CRUD operations, and advanced queries**.

---

## Table of Contents

- [Student Result Management System](#student-result-management-system)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Postman Documentation](#postman-documentation)
  - [DB Diagram](#db-diagram)

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

DATABASE_URL="postgresql://postgres:postgre123@localhost:5432/gain_db?schema=public"
# Server settings
BASE_URL=10.10.20.9
PORT=9010
SOCKET_PORT=9000
# NODE_ENV=production
NODE_ENV=development

# Bcrypt settings
BCRYPT_SALT_ROUNDS=8

# JWT settings
JWT_ACCESS_SECRET='mongoosetemplate'
JWT_ACCESS_EXPIRES_IN=30d
JWT_REFRESH_SECRET='fghfy64786895703hfgjhjgh76867kfghfghfghfghfg4656hfghfghfgh'
JWT_REFRESH_EXPIRES_IN=365d

# Reset password UI link
RESET_PASSWORD_UI_LINK=http://localhost:3000/?

# Stripe configuration
STRIPE_SECRET_KEY=ncietomeetyou

SMTP_HOST=manik@gmail.com
SMTP_MAIL=manik@gmail.com
SMTP_PASS=pknv
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_PASSWORD="GFDSH#423s"
SERVICE_NAME=Gain Solution

#super admin
SUPER_ADMIN_EMAIL=maniksarker265@gmail.com
SUPER_ADMIN_PASSWORD=admin123

```

---

## Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Apply migrations
npx prisma migrate dev --name init
```

# Seed super admin
npm run seed
```

> After run seed commend that will be create a super admin

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

````

## Postman Documentation

[View Postman Collection](https://documenter.getpostman.com/view/46995587/2sBXcHhyyA)

## DB Diagram

[View Database Diagram](https://dbdiagram.io/d/gain-backend-699e7a01bd82f5fce2bdeecb)
