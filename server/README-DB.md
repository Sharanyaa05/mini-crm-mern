# MongoDB connection – fixing "bad auth"

## If you use **MongoDB Atlas** (cloud)

1. **Get the connection string**  
   Atlas → your cluster → **Connect** → **Connect your application** → copy the URI.

2. **Replace placeholders** in the URI:
   - `<password>` → your **database user** password (not your Atlas login).
   - If the password has special characters (`@`, `#`, `:`, `/`, `%`, etc.), **URL-encode** them:
     - `@` → `%40`
     - `#` → `%23`
     - `:` → `%3A`
     - `/` → `%2F`
     - `%` → `%25`
   - Or create a database user with a password that has **no** special characters (e.g. `MyPass123`).

3. **Use the correct format** in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://USERNAME:ENCODED_PASSWORD@cluster0.xxxxx.mongodb.net/mini-crm?retryWrites=true&w=majority
   ```
   - Replace `USERNAME` with your Atlas DB username.
   - Replace `ENCODED_PASSWORD` with the (possibly URL-encoded) password.
   - Replace `cluster0.xxxxx.mongodb.net` with your cluster host from Atlas.
   - Keep or change `mini-crm` as the database name.

4. **Network access**  
   Atlas → **Network Access** → add `0.0.0.0/0` (allow from anywhere) if your app runs outside Atlas.

---

## If you use **local MongoDB** (no username/password)

Use a URI **without** auth:

```env
MONGODB_URI=mongodb://localhost:27017/mini-crm
```

If you **enabled auth** on local MongoDB:

1. Create a user in the `admin` (or your) database and use that username/password in the URI.
2. Format:
   ```env
   MONGODB_URI=mongodb://USERNAME:PASSWORD@localhost:27017/mini-crm?authSource=admin
   ```
   URL-encode the password if it has special characters.

---

## Quick checklist

- [ ] Username and password are for the **database user**, not your Atlas account login.
- [ ] Password in URI is **URL-encoded** if it contains `@`, `#`, `:`, `/`, `%`, etc.
- [ ] No extra spaces or quotes around `MONGODB_URI` in `.env`.
- [ ] Restart the server after changing `.env` (`npm run dev`).
