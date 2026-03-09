function validateUser(req, res, next) {
  const { name, email, age } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: name is required and must be at least 2 characters',
    });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: a valid email address is required',
    });
  }

  if (!age || isNaN(Number(age)) || Number(age) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: age must be a positive number',
    });
  }

  next();
}

module.exports = validateUser;
