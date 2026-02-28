# Student Result Management System

A **full-stack Node.js + TypeScript + Prisma + PostgreSQL** application to manage institutes, students, courses, and results.  
Includes **authentication, authorization, CRUD operations, and advanced queries**.

---

## Table of Contents

- [Student Result Management System](#student-result-management-system)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Features](#features)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)

---

## Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT (Access & Refresh Tokens)
- **Email:** Nodemailer for OTP and password reset
- **Validation:** Zod
- **File Storage:** AWS S3 (optional for images)

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
- AWS account (optional, for file uploads)
- Postman (for testing APIs)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/student-result-system.git
cd student-result-system

# Install dependencies
npm install
# or
yarn install
```
