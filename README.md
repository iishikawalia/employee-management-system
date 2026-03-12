# Employee Management System Setup Instructions

This document provides instructions on how to install and run the EMS locally.

## Prerequisites
- Node.js (v18+)
- Local MongoDB running on `mongodb://127.0.0.1:27017` 
- (Alternatively, modify `server/.env` with your Mongo URI)

## 1. Backend Setup API

Open a terminal and set up the server:

```bash
cd server
npm install
```

### 1.1 Generate Seed Data
We have provided a seed script to instantly populate the database with dummy employees, timesheets, attendances, projects, and leaves.

```bash
npm run data:import
```

_Note: You can destroy the data anytime using `npm run data:destroy`._

### 1.2 Start Backend Server
```bash
npm run server
```
The Express API will boot up on `http://localhost:5000`.

## 2. Frontend React Application Setup

Open a new, separate terminal and navigate to the frontend directory:

```bash
cd client
npm install
npm start
```

The React app will open on `http://localhost:3000`.

## Default Credentials (from Seed)

Once the app is running, use these credentials to log in and preview the two separate layouts:

**Admin Role:**
- Email: `admin@dev.com`
- Password: `admin123`

**Employee Role:**
- Email: `john@dev.com`
- Password: `emp123`
