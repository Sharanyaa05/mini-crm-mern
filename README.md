# Mini CRM – MERN Stack

A minimal CRM (Customer Relationship Management) application built with the MERN stack: **React** (Vite) frontend and **Node.js / Express** backend, with **MongoDB**.

**Live deployment:**
- **Client (Frontend):** [Vercel](https://vercel.com)
- **Server (Backend API):** [Render](https://render.com)

---

## Features

- **User authentication** – Register / Login with JWT
- **Protected routes & APIs** – Auth middleware and private pages
- **Dashboard** – Stats (leads, qualified leads, pending/completed/due-today tasks for current user)
- **Leads** – CRUD, search, status filter, assign to user/company
- **Companies** – CRUD, search, view company details
- **Tasks** – Create tasks, assign to lead & user, mark done
- **Delete confirmation** – Dialog for lead delete
- **Responsive UI** – Material UI (MUI), expandable search, dialogs for add/edit

---

## Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, Vite, Redux Toolkit, React Router, Axios, Material UI (MUI) |
| Backend  | Node.js, Express, Mongoose |
| Database | MongoDB (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas)) |
| Auth     | JWT, bcryptjs |

---

## Project Structure

```
mini-crm/
├── client/                 # Frontend (React + Vite)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Common + layout
│   │   ├── pages/          # Dashboard, Leads, Companies, Tasks, Login
│   │   ├── routes/
│   │   ├── store/          # Redux slices + actions
│   │   ├── theme.js
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/                 # Backend (Node + Express)
│   └── src/
│       ├── config/         # DB, JWT
│       ├── middlewares/    # Auth, error handler
│       ├── modules/        # auth, companies, dashboard, leads, tasks
│       ├── routes/
│       ├── app.js
│       └── server.js
├── vercel.json             # Vercel build config (client)
└── README.md
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** – [MongoDB Atlas](https://www.mongodb.com/atlas) 
- **Vercel** account – frontend hosting
- **Render** account – backend hosting

---

## Deployment

### 1. Database (MongoDB Atlas)

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.
2. Create a database user and get the **connection string**.
3. In **Network Access**, allow `0.0.0.0/0` (or your Render IP).
4. Use this as `MONGODB_URI` for the server.

### 2. Backend on Render

1. **New → Web Service** and connect your Git repo.
2. **Build & deploy:**
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
3. **Environment variables** (Render → Environment):
   - `MONGODB_URI` – Atlas connection string
   - `JWT_SECRET` – long random string (e.g. 32+ chars)
   - `JWT_EXPIRES_IN` – optional, `1d`
   - `NODE_ENV` – `production`
   - `PORT` – set by Render (optional)
4. Deploy and copy the service URL:`https://mini-crm-mern.onrender.com`.

### 3. Frontend on Vercel

1. **Import** your Git repo in [Vercel](https://vercel.com).
2. The repo includes **`vercel.json`** at the root:
   - Builds the **client** (`cd client && npm install && npm run build`).
   - Output directory: `client/dist`.
   - SPA rewrite: all routes → `/index.html`.
3. **Environment variables** (Vercel → Settings → Environment Variables):
   - **Name:** `VITE_API_URL`
   - **Value:** `https://mini-crm-mern.onrender.com/api`  
     (your Render backend URL **including** `/api`, no trailing slash)
4. **Redeploy** after setting `VITE_API_URL` so the build picks it up.

### 4. CORS (if needed)

If the frontend domain is different from the backend, allow it in CORS. In `server/src/app.js`:

```js
app.use(cors({ origin: 'https://your-app.vercel.app' }));
```

Or use an env variable, e.g. `FRONTEND_URL`, and set `origin: process.env.FRONTEND_URL`.

---

## Local Development

### Backend

```bash
cd server
cp .env   # if present, then edit .env
npm install
npm run dev            # nodemon
```

Server runs at `http://localhost:8000` (or `PORT` from `.env`).

### Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:3000`.  
For local API: either leave `VITE_API_URL` unset (uses `/api`) and proxy in Vite, or set `VITE_API_URL=http://localhost:8000/api` in `.env`.

### Environment variables (local)

**Server (`.env`):**

- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – secret for JWT
- `PORT` – optional, default 8000
- `JWT_EXPIRES_IN` – optional, default `1d`

**Client (`.env`):**

- `VITE_API_URL` – only if API is on another origin (e.g. `http://localhost:8000/api`)

---

## API Overview

| Module    | Base path      | Notes                    |
|-----------|----------------|--------------------------|
| Auth      | `/api/auth`    | register, login, me, users |
| Leads     | `/api/leads`   | CRUD, list, status       |
| Companies | `/api/companies` | CRUD, list, get by id  |
| Tasks     | `/api/tasks`   | CRUD, list, update status |
| Dashboard | `/api/dashboard/stats` | Stats for current user |

All protected routes require header: `Authorization: Bearer <token>`.

---

## First user (registration)

1. Open the deployed frontend (Vercel URL).
2. Click **Register**, enter name, email, password.
3. Submit → you are logged in and can use Dashboard, Leads, Companies, Tasks.

---

## Favicon & attribution

Favicon: CRM-style icon in `client/public/favicon.svg`.  
Attribution (Flaticon): [CRM icons created by Uniconlabs - Flaticon](https://www.flaticon.com/free-icons/crm).

---
