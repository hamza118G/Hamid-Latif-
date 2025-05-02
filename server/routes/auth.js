const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// Middleware to verify token (same as in patient.js)
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    // Send back the token and the user object (including email)
    res.json({ token, user: { email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to check if the user is the admin (based on email)
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.email !== 'Dr.ZebaAziz@admin.com') { // Replace with the desired admin email
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
  } catch (error) {
    console.error('Error in admin middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (for "All Accounts" feature) - Now protected by adminMiddleware
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/:id', authMiddleware, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;

    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// backend/routes/auth.js

// Get a single user by ID
router.get('/users/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a user - Still protected by basic authMiddleware (you might want to add adminMiddleware here as well)
router.delete('/users/:id', authMiddleware, async (req, res) => {
  try {
    const userIdToDelete = req.params.id;

    const userToDelete = await User.findById(userIdToDelete);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requestingUser = await User.findById(req.userId);

    if (userToDelete.email === 'Dr.ZebaAziz@admin.com') {
      return res.status(403).json({ message: 'Cannot delete the admin user' });
    }

    //  Admin can delete any user, and the user can delete themselves
    if (
      requestingUser.email === 'Dr.ZebaAziz@admin.com' ||
      requestingUser.id === userIdToDelete
    ) {
      await User.deleteOne({ _id: userIdToDelete });
      return res.json({ message: 'User deleted successfully' });
    } else {
      return res.status(403).json({ message: 'Unauthorized to delete this user' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});




module.exports = router;