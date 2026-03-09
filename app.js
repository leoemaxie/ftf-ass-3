/*
 * ============================================================
 * CONCEPTUAL QUESTIONS — ANSWERS
 * ============================================================
 *
 * Q1. What is Mongoose and why do we use it instead of the native MongoDB driver?
 *
 * Mongoose is an Object Document Mapper (ODM) for MongoDB and Node.js.
 * The native MongoDB driver lets you talk directly to MongoDB, but it gives
 * you no structure — you can insert any shape of data, with no validation.
 * Mongoose sits on top of it and adds:
 *   - Schemas: enforce a fixed shape and rules on every document
 *   - Validation: required fields, min/max, enums, custom messages
 *   - Middleware (hooks): run logic before/after save, delete, etc.
 *   - Convenience methods: .find(), .findById(), .findByIdAndUpdate(), etc.
 *   - Automatic type casting: turns "28" into the number 28
 * In short, the native driver gives you raw power; Mongoose gives you
 * structure and safety around that power.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Q2. What is a Mongoose Schema? How does it differ from users.json?
 *
 * A Schema is a blueprint that defines what fields a document must have,
 * what types they are, and what rules they must follow. Mongoose enforces
 * this every time data is read or written.
 * With users.json we had no such enforcement. Anyone could push any object
 * into the array — a missing email, a string where a number was expected,
 * a duplicate entry — nothing would stop it. With a Mongoose Schema, all
 * of that is caught automatically before data ever reaches the database.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Q3. Why do we need both unique:true on the Schema AND the 11000 error handler?
 *
 * unique: true tells MongoDB to create a unique index on the email field.
 * That index is what actually prevents duplicates — MongoDB enforces it at
 * the database level. However, when a duplicate IS attempted, MongoDB throws
 * a low-level error with code 11000. Mongoose does not automatically convert
 * that into a friendly HTTP response. Without the error handler in the
 * controller, the server would respond with a raw 500 error and a confusing
 * message. The error handler catches code 11000 specifically and returns a
 * clean, human-readable 409 Conflict response instead.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Q4. What would happen if you called connectDB() after app.listen()?
 *
 * The server would start accepting requests before the database connection
 * was established. Any request that arrived in that gap — and tried to query
 * MongoDB — would fail with a connection error or return an unexpected result.
 * Calling connectDB() first ensures the database is ready before the server
 * begins accepting traffic, which is the safe and correct order.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Q5. Why store MONGO_URI in .env instead of writing it directly in db.js?
 *
 * Hardcoding the connection string means it lives in source code and gets
 * pushed to GitHub. Anyone who can see the repo — now or in the future —
 * can access your database. A .env file is excluded from version control
 * via .gitignore, so the credentials stay on your machine only. It also
 * makes switching environments easy: different .env files for development,
 * staging, and production, with no code changes required.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Q6 (Auth Q1). Why return the same message for wrong email AND wrong password?
 *
 * Returning specific messages like "User not found" or "Incorrect password"
 * tells an attacker which piece of information is wrong. They can use that
 * to confirm which email addresses are registered (by probing until they
 * stop getting "User not found"), and then focus their attack on just
 * guessing the password. By returning the same vague message in both cases,
 * we give attackers no useful information either way.
 *
 * ─────────────────────────────────────────────────────────────
 *
 * Q7 (Auth Q2). new User() + user.save() vs User.create() — what's the difference?
 *
 * User.create(data) is a shorthand that creates AND saves in one step. It
 * does trigger Mongoose middleware, but the key point is that new User()
 * followed by user.save() makes it explicit that we are constructing the
 * document first, then persisting it. For password hashing this matters:
 * the pre('save') hook fires when .save() is called. Both approaches trigger
 * that hook, so hashing works with either. However, using new User() + .save()
 * in the auth controller makes the two-step process visible and intentional,
 * which is clearer for understanding what is happening to the password before
 * it reaches the database.
 *
 * ============================================================
 */