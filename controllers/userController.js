const User = require('../models/User');

async function getUsers(req, res) {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }

    const page = parseInt(req.query.page) || null;
    const limit = parseInt(req.query.limit) || null;

    if (page && limit) {
      const skip = (page - 1) * limit;
      const totalCount = await User.countDocuments(filter);
      const users = await User.find(filter).skip(skip).limit(limit);

      return res.status(200).json({
        success: true,
        total: totalCount,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalCount / limit),
        count: users.length,
        data: users,
      });
    }

    const users = await User.find(filter);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getUsersSortedByAge(req, res) {
  try {
    const users = await User.find({}).sort({ age: 1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getUserStatsByRole(req, res) {
  try {
    const users = await User.find({});
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: roleCounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


async function addUser(req, res) {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ success: true, message: 'User created', data: newUser });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
}

async function editUser(req, res) {
  try {
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
