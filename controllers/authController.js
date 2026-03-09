// controllers/authController.js
const bcrypt = require('bcryptjs');
const User   = require('../models/User');

// ── POST /auth/register ────────────────────────────────────────
// Creates a new user account. Password is hashed automatically by
// the pre-save hook in User.js before the document hits the database.
async function register(req, res) {
  try {
    const { name, email, password, age, role } = req.body;

    // new User() creates the document in memory but does NOT save it yet
    // .save() triggers the pre-save hook which hashes the password first
    const user = new User({ name, email, password, age, role });
    await user.save();

    // Never send the password field back in the response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
}

// ── POST /auth/login ────────────────────────────────────────────
// Finds the user by email, then uses bcrypt.compare() to check
// whether the submitted password matches the stored hash.
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Step 1: find the user -- if not found, don't say "user not found"
    // (vague messages prevent attackers learning which emails are registered)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Step 2: compare the submitted password with the stored hash
    // bcrypt.compare() returns true if they match, false if they don't
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Step 3: credentials are valid -- send back user info (never the password)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { register, login };
