// models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // We will NEVER store raw passwords -- only bcrypt hashes
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be greater than 0'],
      max: [120, 'Age must be less than 120'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// ── Pre-save hook: hash password before saving to the database ──
// This runs automatically every time a user document is saved.
// 'isModified' ensures we only re-hash if the password field was changed.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  // Salt rounds = 10 means bcrypt runs the hashing algorithm 2^10 times
  // This makes brute-force attacks very slow and expensive
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create and export the Model
// 'User' becomes the collection name in MongoDB (stored as 'users')
const User = mongoose.model('User', userSchema);

module.exports = User;
