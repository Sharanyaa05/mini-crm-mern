# Authorization Logic – Mini CRM

## 1. Authentication

- **Registration:** `POST /api/auth/register` with `name`, `email`, `password`. Passwords are hashed with **bcryptjs** before storing. Response includes a **JWT** and user object.
- **Login:** `POST /api/auth/login` with `email`, `password`. Server compares password with bcrypt; on success returns a **JWT** and user object.
- **JWT:** Signed with `JWT_SECRET`, contains user `id`. Used as **Bearer** token in `Authorization` header for protected routes.

## 2. Protected Routes (Backend)

- All routes under `/api/leads`, `/api/companies`, `/api/tasks`, `/api/dashboard`, and `GET /api/auth/me`, `GET /api/auth/users` require a valid JWT.
- **Middleware:** `protect` in `auth.middleware.js`:
  - Reads `Authorization: Bearer <token>`.
  - Verifies JWT and loads user from DB.
  - Sets `req.user = { id, email, name }` for downstream use.
  - Returns 401 if token is missing or invalid.

## 3. Frontend Protection

- **ProtectedRoute:** Wraps app layout (Dashboard, Leads, Companies, Tasks). If there is no `token` in Redux (and thus usually in `localStorage`), user is redirected to `/login`.
- **Axios:** Request interceptor adds `Authorization: Bearer <token>` to every API call. Response interceptor on 401 clears token and redirects to `/login`.

## 4. Task Status Update – “Only Assigned User”

- **Rule:** Only the user **assigned to** a task may change its status (e.g. mark as Done).
- **Backend:** `PATCH /api/tasks/:id/status` checks `task.assignedTo` vs `req.user.id`. If they differ, the API returns an error (e.g. “Only the assigned user can update this task status”).
- **Frontend:** Tasks list shows a “Done” (or status update) button only when the current user is the assigned user; otherwise it shows a message that only the assigned user can update. This avoids unnecessary API calls and makes the rule clear in the UI.

## 5. Leads – Soft Delete

- Leads are never physically deleted. They have an `isDeleted` flag.
- **List:** All lead list APIs filter with `isDeleted: false`, so soft-deleted leads never appear in normal queries.
- **Delete action:** “Delete” in the UI calls the backend, which sets `isDeleted: true` for that lead.

## 6. Summary

| Area              | Mechanism |
|-------------------|-----------|
| Auth              | JWT (Bearer) + bcryptjs |
| Protected API     | `protect` middleware; 401 if no/invalid token |
| Protected UI      | `ProtectedRoute` + token in Redux/localStorage |
| Task status       | Backend and UI enforce: only `assignedTo` user can update status |
| Leads visibility | Soft delete; list APIs exclude `isDeleted: true` |
