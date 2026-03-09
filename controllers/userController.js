// controllers/userController.js

// Import the User model -- this is how we talk to MongoDB
const User = require('../models/User');

// ── GET /users ─────────────────────────────────────────
// Retrieve all users from the database
// Supports ?role=admin filter (Exercise 1)
// Supports ?page=1&limit=2 pagination (Stretch Exercise)
async function getUsers(req, res) {
  try {
    // Exercise 1: Build filter object conditionally based on req.query.role
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }

    // Stretch Exercise: Pagination with ?page=1&limit=2
    const page  = parseInt(req.query.page)  || null;
    const limit = parseInt(req.query.limit) || null;

    if (page && limit) {
      const skip       = (page - 1) * limit;
      const totalCount = await User.countDocuments(filter);
      const users      = await User.find(filter).skip(skip).limit(limit);

      return res.status(200).json({
        success:      true,
        total:        totalCount,
        page:         page,
        limit:        limit,
        totalPages:   Math.ceil(totalCount / limit),
        count:        users.length,
        data:         users,
      });
    }

    // Normal flow: User.find(filter) returns all matching documents
    const users = await User.find(filter);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ── GET /users/sorted/by-age ───────────────────────────
// Exercise 2: Return all users sorted from youngest to oldest
// IMPORTANT: This route must be defined BEFORE /:id in the routes file
async function getUsersSortedByAge(req, res) {
  try {
    // .sort({ age: 1 }) — 1 = ascending (youngest first), -1 = descending
    const users = await User.find({}).sort({ age: 1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ── GET /users/stats/count ─────────────────────────────
// Exercise 3: Return a count of users per role
// IMPORTANT: This route must also be defined BEFORE /:id in the routes file
async function getUserStatsByRole(req, res) {
  try {
    const users = await User.find({});

    // Use .reduce() to count how many users have each role
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: roleCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ── GET /users/:id ─────────────────────────────────────
// Retrieve a single user by their MongoDB _id
async function getUser(req, res) {
  try {
    // findById() searches by the unique _id MongoDB assigns each document
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ── POST /users ────────────────────────────────────────
// Create a new user document in MongoDB
async function addUser(req, res) {
  try {
    // User.create() runs schema validation AND saves to the database
    const newUser = await User.create(req.body);
    res.status(201).json({ success: true, message: 'User created', data: newUser });
  } catch (error) {
    // Handle duplicate email (MongoDB error code 11000)
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
}

// ── PUT /users/:id ─────────────────────────────────────
// Update an existing user
async function editUser(req, res) {
  try {
    // findByIdAndUpdate finds the document, applies changes, and returns the updated version
    // { new: true } returns the updated document (not the old one)
    // { runValidators: true } ensures schema validation runs on the updated fields
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User updated', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

// ── DELETE /users/:id ──────────────────────────────────
// Remove a user from the database
async function removeUser(req, res) {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getUsers, getUsersSortedByAge, getUserStatsByRole, getUser, addUser, editUser, removeUser };
