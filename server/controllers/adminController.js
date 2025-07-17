// server/controllers/adminController.js
const User = require("../models/User");
const Event = require("../models/Event");
const Ticket = require("../models/Ticket");

// Delete users by email
exports.deleteUsersByEmail = async (req, res) => {
  const { emails } = req.body;
  
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ msg: 'Please provide an array of email addresses' });
  }

  try {
    const result = await User.deleteMany({ email: { $in: emails } });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: 'No users found with the provided emails' });
    }
    
    res.json({
      msg: 'Users deleted successfully',
      deletedCount: result.deletedCount,
      emails: emails
    });
  } catch (err) {
    console.error('Error deleting users:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAdminEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    res.json({ totalUsers, totalEvents, totalTickets });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
