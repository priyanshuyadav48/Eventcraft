const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const {
  getAdminUsers,
  getAdminEvents,
  getAdminStats,
  deleteUsersByEmail,
} = require("../controllers/adminController");

// GET /api/admin/users
router.get("/users", auth, isAdmin, getAdminUsers);

// GET /api/admin/events
router.get("/events", auth, isAdmin, getAdminEvents);

// GET /api/admin/stats
router.get("/stats", auth, isAdmin, getAdminStats);

// DELETE /api/admin/users - Delete users by email
router.delete("/users", auth, isAdmin, deleteUsersByEmail);

module.exports = router;
