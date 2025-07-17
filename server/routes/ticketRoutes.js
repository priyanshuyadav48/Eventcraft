const express = require('express');
const router = express.Router();
const { getTicketById } = require('../controllers/ticketController');
const auth = require('../middleware/auth');

const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');

// ✅ 1. Static route first — GET /api/tickets/my
router.get('/my', auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id })
      .populate('event', 'title date')
      .populate('user', 'name email');

    res.json(tickets);
  } catch (err) {
    console.error("Failed to fetch tickets", err);
    res.status(500).json({ msg: "Server error while fetching tickets" });
  }
});

// ✅ 2. Dynamic route after static — GET /api/tickets/:ticketId
router.get('/:ticketId', auth, getTicketById);

// ✅ 3. TEMP route — POST /api/tickets/create-test
// POST /api/tickets/create-test (updated to use req.user.id)
router.post('/create-test', auth, async (req, res) => {
  const Ticket = require('../models/Ticket');
  const Event = require('../models/Event');

  try {
    const event = await Event.findOne();
    if (!event) return res.status(404).json({ msg: 'No event found' });

    const newTicket = await Ticket.create({
      user: req.user.id, // 🔁 Now uses the logged-in user
      event: event._id,
      qrData: `qr-${Date.now()}`,
    });

    res.json({ msg: 'Test ticket created for current user', ticket: newTicket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error creating ticket' });
  }
});

// GET /api/tickets/event/:eventId — Organizer access
router.get('/event/:eventId', auth, async (req, res) => {
  const Ticket = require('../models/Ticket');
  const Event = require('../models/Event');

  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Only allow access to the organizer who created the event
    if (event.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const tickets = await Ticket.find({ event: event._id })
      .populate('user', 'name email')
      .populate('event', 'title date');

    res.json(tickets);
  } catch (err) {
    console.error('Failed to fetch tickets for event', err);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
