const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Event = require('../models/Event');
const auth = require('../middleware/auth');


const {
  createEvent,
  getAllEvents,
  getMyEvents,
  rsvpEvent,
  getMyRSVPs,
  updateEvent,
  deleteEvent,
  getDashboardStats,
  exportRSVPsToCSV
} = require('../controllers/eventController'); 

router.post('/', authMiddleware, createEvent);
router.get('/', getAllEvents);
router.get('/my-events', authMiddleware, getMyEvents);
router.post('/rsvp/:eventId', authMiddleware, rsvpEvent);
router.get('/my-rsvps', authMiddleware, getMyRSVPs);
router.put('/:id', authMiddleware, updateEvent);  
router.delete('/:id', authMiddleware, deleteEvent); 
router.get('/dashboard-stats', authMiddleware, getDashboardStats);
router.get('/export', authMiddleware, exportRSVPsToCSV);
router.get('/mine', auth, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.json(events);
  } catch (err) {
    console.error("Error fetching organizer's events", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

