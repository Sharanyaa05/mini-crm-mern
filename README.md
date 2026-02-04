# Mini CRM – MERN Stack

A minimal CRM with **Authentication**, **Dashboard**, **Leads**, **Companies**, and **Tasks** modules.

## Tech Stack

- **Frontend:** React, React Router, Axios, Redux Toolkit, MUI (Material UI)
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT (Access Token), bcryptjs for password hashing

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd server
npm install
cp .env   # with MONGODB_URI, JWT_SECRET, PORT
npm run dev
```

Runs on `http://localhost:8000`. API base: `/api`.

### Frontend

```bash
cd client
npm install
# .env: VITE_API_URL=http://localhost:8000/api 
npm run dev
```

Runs on `http://localhost:3000`. Vite proxies `/api` to backend when using default config.

### First user

1. Open the app and go to Login.
2. Click **Register**, enter Name, Email, Password, then **Register**. You are logged in.
3. Or create a user via API: `POST /api/auth/register` with `{ "name", "email", "password" }`.

## Authorization Logic

See [AUTHORIZATION.md](./AUTHORIZATION.md) for a clear description of how authentication and authorization work (JWT, protected routes, task assignment rules).


