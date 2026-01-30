# Express Authentication System with Drizzle ORM

A production-ready full-stack authentication system with a Node.js/Express backend and modern frontend. Features secure user authentication, session management, and password hashing with PostgreSQL database integration using Drizzle ORM.

## ✨ Features

- **User Authentication** - Secure signup, login, and logout functionality
- **Session Management** - Cookie-based session handling with session database persistence
- **Password Security** - HMAC-SHA256 encryption with per-user salt for robust password protection
- **User Profiles** - Create and update user information
- **Protected Routes** - Middleware-based authentication for secure endpoints
- **Database Integration** - PostgreSQL with Drizzle ORM for type-safe queries
- **CORS Support** - Configured for frontend-backend communication
- **Error Handling** - Comprehensive error handling and validation

## 🛠️ Tech Stack

**Backend:**

- Express.js v5.2.1 - Web framework
- Drizzle ORM v0.45.1 - Type-safe ORM for PostgreSQL
- PostgreSQL - Relational database
- Node.js Crypto - Password hashing (HMAC-SHA256)
- Cookie Parser - Session cookie management

**Database:**

- PostgreSQL - Production database
- Drizzle Kit - ORM migrations and schema management

**Frontend:**

- React/Vite (configured at `http://localhost:5173`)

## 📁 Project Structure

```
├── index.js                         # Express server & CORS setup
├── package.json                     # Dependencies & scripts
├── drizzle.config.js                # Drizzle Kit configuration
├── docker-compose.yml               # PostgreSQL container setup
│
├── controller/
│   └── user.controller.js           # User business logic (signup, login, logout, etc.)
│
├── routes/
│   └── users.routes.js              # User API endpoints
│
├── middlewares/
│   └── auth.middleware.js           # Session authentication middleware
│
├── db/
│   ├── index.js                     # PostgreSQL connection pool
│   └── schema.js                    # Drizzle table schemas (users, userSessions)
│
└── drizzle/                         # Migration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js v16+
- PostgreSQL (or Docker)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd 17_authentication_ORM
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL:**

   Using Docker Compose (recommended):

   ```bash
   docker-compose up -d
   ```

   Or use your existing PostgreSQL instance.

4. **Configure environment variables:**

   Create a `.env` file in the root directory:

   ```

   ```

5. **Run database migrations:**

   ```bash
   npx drizzle-kit push
   ```

6. **Start the development server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:3000` with auto-reload enabled.

## 📚 API Endpoints

All endpoints are prefixed with `/users`.

### Authentication Endpoints

#### **POST** `/signup` - User Registration

Register a new user account.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "message": "User registered successfully"
  }
}
```

- Sets `sessionId` cookie automatically
- Email must be unique
- Password is hashed with HMAC-SHA256 and unique salt

---

#### **POST** `/login` - User Login

Authenticate user with email and password.

**Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged in successfully"
}
```

- Sets `sessionId` cookie for session management
- Creates new session entry in database
- Returns error if credentials are invalid

---

#### **DELETE** `/logout` - User Logout

Terminate the current user session.

**Request:**

- Cookie: `sessionId` (required)

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

- Deletes session from database
- Clears `sessionId` cookie

---

### Protected User Endpoints

_Requires valid `sessionId` cookie (authentication middleware)_

#### **GET** `/me` - Get Current User Info

Retrieve authenticated user's information.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "userId": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

#### **PATCH** `/` - Update User Profile

Update authenticated user's name.

**Request:**

```json
{
  "name": "Jane Doe"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User information updated successfully"
}
```

---

## 🔐 Security Features

### Password Hashing

- **Algorithm**: HMAC-SHA256
- **Salt**: 256-byte random salt per user, stored separately
- **Storage**: Hashed password stored in database, original password never logged

### Session Management

- **Cookie**: `sessionId` (HTTP-only, SameSite: Lax)
- **Persistence**: Sessions stored in `userSessions` table linked to users
- **Validation**: Auth middleware validates session on protected routes
- **Cleanup**: Sessions deleted on logout

### Protected Routes

Authentication middleware validates session before allowing access:

```javascript
// Usage in routes
router.get("/me", auth, getUserData);
router.patch("/", auth, updateUserData);
```

## 📊 Database Schema

### `users` Table

| Column   | Type         | Constraints                 |
| -------- | ------------ | --------------------------- |
| id       | UUID         | Primary Key, Default Random |
| name     | VARCHAR(255) | Not Null                    |
| email    | VARCHAR(255) | Not Null, Unique            |
| password | TEXT         | Not Null (hashed)           |
| salt     | TEXT         | Not Null                    |

### `userSessions` Table

| Column    | Type      | Constraints                      |
| --------- | --------- | -------------------------------- |
| id        | UUID      | Primary Key, Default Random      |
| userId    | UUID      | Foreign Key → users.id, Not Null |
| createdAt | TIMESTAMP | Default Now, Not Null            |

## 🎯 Controller Functions

### `signup(req, res)`

- Validates email uniqueness
- Generates random salt
- Hashes password with salt using HMAC-SHA256
- Creates user and session
- Sets session cookie

### `login(req, res)`

- Finds user by email
- Validates password against stored hash
- Creates new session on successful authentication
- Sets session cookie

### `logout(req, res)`

- Retrieves session ID from cookie
- Deletes session from database
- Clears session cookie
- Validates session exists before deletion

### `getUserData(req, res)`

- Protected route - requires valid session
- Returns current authenticated user info

### `updateUserData(req, res)`

- Protected route - requires valid session
- Updates user's name in database

## 🧪 Testing the API

### Using cURL

**Signup:**

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
```

**Login:**

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}' \
  -c cookies.txt
```

**Get User (with cookie):**

```bash
curl -X GET http://localhost:3000/users/me \
  -b cookies.txt
```

### Using Postman

1. Create new request for each endpoint
2. Set method (POST/GET/PATCH/DELETE)
3. Add JSON body where required
4. Enable "Cookies" in Postman to auto-manage session cookies
5. Test protected routes after login

## 🎨 Frontend Integration

The frontend is configured to run on `http://localhost:5173` and communicates with this backend at `http://localhost:3000`.

**CORS Configuration:**

- Origin: `http://localhost:5173`
- Credentials: Enabled (for cookie-based sessions)

**Cookie Handling:**
Ensure your frontend requests include credentials:

```javascript
fetch("http://localhost:3000/users/me", {
  credentials: "include",
});
```

## 📝 Environment Variables

Create a `.env` file:

```
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
```

## 🚀 Running the Project

### Development Mode

```bash
npm start
```

Auto-reloads on file changes using `--watch` flag.

### Database Management

```bash
# Push schema changes to database
npx drizzle-kit push

# View database in studio
npx drizzle-kit studio
```

## ✅ Verification Checklist

- [x] Backend API fully implemented with all controllers
- [x] User signup with password hashing
- [x] User login with session management
- [x] Protected routes with authentication middleware
- [x] User profile retrieval and updates
- [x] User logout with session cleanup
- [x] Database schema with users and sessions
- [x] CORS configured for frontend
- [x] Cookie-based session handling
- [x] Frontend integration ready

## Database Schema

```javascript
users {
  id: uuid (primary key, auto-generated)
  name: varchar(255) - User's full name
  email: varchar(255) - User's email (unique)
  password: text - Hashed password
  salt: text - Salt for hashing
}
```

## Password Hashing

The project uses HMAC-SHA256 with a random salt for password hashing:

1. Generate 256-byte random salt
2. Create HMAC-SHA256 hash using the salt
3. Store both hash and salt in database

## Usage Example

### Register a User

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

## Improvements in Progress

- [ ] Replace HMAC with pbkdf2 / bcrypt
- [x] Add auth middleware
- [x] Protect routes
- [x] Improve session handling
