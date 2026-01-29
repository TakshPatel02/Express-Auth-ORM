# Express Authentication with ORM

A robust backend authentication system built with Express.js and Drizzle ORM for PostgreSQL. This project demonstrates secure user registration with password hashing and database integration.

## Features

- **User Registration** - Create new user accounts with email validation
- **Password Security** - HMAC-SHA256 hashing with salt for password protection
- **Database Integration** - PostgreSQL with Drizzle ORM for type-safe queries
- **Express Server** - RESTful API with proper error handling
- **Environment Configuration** - Secure configuration using environment variables

## Tech Stack

- **Backend**: Express.js v5.2.1
- **ORM**: Drizzle ORM v0.45.1
- **Database**: PostgreSQL
- **Crypto**: Node.js built-in crypto module
- **Environment**: dotenv for configuration

## Project Structure

```
├── index.js                    # Express server entry point
├── controller/
│   └── user.controller.js      # User registration logic
├── routes/
│   └── users.routes.js         # User API routes
├── db/
│   ├── index.js                # Database connection setup
│   └── schema.js               # Drizzle ORM schema definitions
├── drizzle/                    # Migration files
├── docker-compose.yml          # PostgreSQL container setup
├── drizzle.config.js           # Drizzle Kit configuration
└── package.json                # Project dependencies
```

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:

   ```
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
   ```

4. Start PostgreSQL (using Docker Compose):

   ```bash
   docker-compose up -d
   ```

5. Run the server:
   ```bash
   npm start
   ```

## API Endpoints

### User Routes `/users`

- **POST** `/users/signup` - Register a new user
  - Request body: `{ name, email, password }`
  - Response: User ID and success message

- **POST** `/users/login` - User login (in progress)
  - Request body: `{ email, password }`

- **GET** `/users/` - Get current user info (in progress)

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