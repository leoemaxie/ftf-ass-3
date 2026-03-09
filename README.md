# User Management REST API

Assignment project for FutureMap Fellowship (Week 3), built with Express.js, MongoDB, and Mongoose.

## Overview

This API provides:

- User CRUD operations
- User registration and login
- Input validation middleware
- Password hashing with bcrypt
- Request logging middleware
- Filtering, sorting, and pagination for user listing
- Role count statistics endpoint

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- dotenv

## Project Structure

```text
.
├── app.js
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── middlewares/
│   ├── logger.js
│   └── validateUser.js
├── models/
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
└── package.json
```

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

## Running the App

Development mode (with nodemon):

```bash
npm run dev
```

Production/start mode:

```bash
npm start
```

Server default URL:

```text
http://localhost:3000
```

## Data Model

User schema fields:

- `name` (String, required, trimmed, min length 2)
- `email` (String, required, unique, lowercase, trimmed)
- `password` (String, required, min length 6, hashed before save)
- `age` (Number, required, 1 to 120)
- `role` (String, enum: `user` or `admin`, default: `user`)
- `createdAt` / `updatedAt` (automatic timestamps)

## Middleware

- `requestLogger`: logs timestamp, HTTP method, and URL for each request.
- `validateUser`: validates `name`, `email`, and `age` before user creation/registration routes.

## API Endpoints

### Auth Routes

Base path: `/auth`

1. `POST /auth/register`

- Creates a user account.
- `validateUser` runs first.

Request body:

```json
{
	"name": "Jane Doe",
	"email": "jane@example.com",
	"password": "secret123",
	"age": 24,
	"role": "user"
}
```

2. `POST /auth/login`

- Logs in with email/password.
- Returns a generic error for invalid email or password.

Request body:

```json
{
	"email": "jane@example.com",
	"password": "secret123"
}
```

### User Routes

Base path: `/users`

1. `GET /users`

- Returns all users.
- Supports optional role filter: `/users?role=admin`
- Supports optional pagination: `/users?page=1&limit=2`

2. `GET /users/sorted/by-age`

- Returns users sorted by ascending age (youngest first).

3. `GET /users/stats/count`

- Returns total users grouped by role.

Example response:

```json
{
	"success": true,
	"data": {
		"user": 8,
		"admin": 2
	}
}
```

4. `GET /users/:id`

- Returns one user by MongoDB `_id`.

5. `POST /users`

- Creates a new user.
- `validateUser` runs first.

6. `PUT /users/:id`

- Updates an existing user.
- Uses schema validators on updated fields.

7. `DELETE /users/:id`

- Deletes a user by `_id`.

## Error Handling Notes

- Duplicate emails are handled with MongoDB error code `11000` and return HTTP `409`.
- Validation failures return HTTP `400`.
- Not found resources return HTTP `404`.
- Generic server/database issues return HTTP `500`.

## Security Notes

- Passwords are hashed with bcrypt in a Mongoose pre-save hook.
- Raw passwords are never returned in API responses.
- Login failures use a generic message to avoid leaking whether an email exists.

## Quick Test Flow

1. Register a user via `POST /auth/register`.
2. Login via `POST /auth/login`.
3. Create more users with `POST /users`.
4. Fetch users with filtering/pagination via `GET /users`.
5. Check sorting and role stats endpoints.

## Author

Emmanuel Lafenwa
