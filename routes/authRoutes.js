// routes/authRoutes.js
const express             = require('express');
const router              = express.Router();
const { register, login } = require('../controllers/authController');
const validateUser        = require('../middlewares/validateUser');

// validateUser runs before register to check fields before we touch the DB
router.post('/register', validateUser, register);
router.post('/login',    login);

module.exports = router;
