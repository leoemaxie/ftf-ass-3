// routes/userRoutes.js
const express      = require('express');
const router       = express.Router();
const {
  getUsers,
  getUsersSortedByAge,
  getUserStatsByRole,
  getUser,
  addUser,
  editUser,
  removeUser,
} = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');

// ── Exercise routes must come BEFORE /:id ──────────────────────
// If they were after, Express would treat 'sorted' and 'stats' as :id values
router.get('/sorted/by-age',  getUsersSortedByAge);  // Exercise 2
router.get('/stats/count',    getUserStatsByRole);   // Exercise 3

// ── Standard CRUD routes ───────────────────────────────────────
router.get('/',       getUsers);                     // GET all users (+ ?role= filter & ?page= ?limit= pagination)
router.get('/:id',    getUser);                      // GET single user
router.post('/',      validateUser, addUser);         // POST create user (validateUser runs first)
router.put('/:id',    editUser);                     // PUT update user
router.delete('/:id', removeUser);                   // DELETE user

module.exports = router;
