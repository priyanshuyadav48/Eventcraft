const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

// Update profile (name, email, phone, avatar)
router.put('/profile', auth, async (req, res) => {
  const updates = (({ name, email, phone, avatar }) => ({ name, email, phone, avatar }))(req.body);
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
  res.json(user);
});

// Update password
router.put('/profile/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return res.status(400).json({ msg: 'Current password is incorrect' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ msg: 'Password updated successfully' });
});

module.exports = router;
