const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const authMiddleware = require('../middleware/auth');
const crypto = require('crypto');

// Get all bookings for the current user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('event', 'title date venue address image')
      .sort({ bookedAt: -1 });

    // Format the response to match frontend expectations
    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      ticketId: booking.ticketId,
      status: booking.status,
      bookedAt: booking.bookedAt,
      event: booking.event ? {
        _id: booking.event._id,
        title: booking.event.title,
        date: booking.event.date,
        venue: booking.event.venue || 'TBD',
        address: booking.event.address || 'Address not specified',
        image: booking.event.image
      } : null,
      user: req.user._id,
      attendeeName: req.user.name || 'Guest',
      ticketType: 'General Admission'
    }));

    res.json(formattedBookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch bookings',
      error: 'BOOKINGS_FETCH_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.post('/book/:eventId', authMiddleware, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user.id;

    // Validate event ID format
    if (!eventId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid event ID format',
        error: 'INVALID_EVENT_ID'
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ 
        success: false,
        message: 'Event not found',
        error: 'EVENT_NOT_FOUND'
      });
    }

    // Check if event is in the past
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot book past events',
        error: 'EVENT_EXPIRED'
      });
    }

    // Prevent duplicate booking
    const existing = await Booking.findOne({ user: userId, event: eventId });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: 'You have already booked this event',
        error: 'DUPLICATE_BOOKING',
        ticketId: existing.ticketId
      });
    }

    // Generate ticket ID
    const ticketId = crypto.randomBytes(8).toString('hex');

    // Create and save booking
    const booking = new Booking({
      user: userId,
      event: eventId,
      ticketId,
      status: 'confirmed',
      bookedAt: new Date()
    });

    await booking.save();
    
    // Update event's booked count
    await Event.findByIdAndUpdate(eventId, { $inc: { bookedCount: 1 } });

    res.json({ 
      success: true,
      message: 'Ticket booked successfully', 
      ticketId,
      booking: {
        id: booking._id,
        event: event.title,
        date: event.date,
        location: event.venue?.name || 'TBD'
      }
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to process booking',
      error: 'BOOKING_FAILED',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ticketId first, then by _id
    const ticket = await Booking.findOne({
      $or: [
        { ticketId: id },
        { _id: id }
      ]
    })
    .populate('event')
    .populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        message: 'Ticket not found',
        error: 'TICKET_NOT_FOUND'
      });
    }

    // Format the response to match frontend expectations
    const formattedTicket = {
      _id: ticket._id,
      ticketId: ticket.ticketId,
      status: ticket.status,
      bookedAt: ticket.bookedAt,
      eventId: {
        _id: ticket.event._id,
        title: ticket.event.title,
        date: ticket.event.date,
        venue: ticket.event.venue || 'TBD',
        address: ticket.event.address || 'Address not specified',
        description: ticket.event.description,
        image: ticket.event.image
      },
      user: {
        _id: ticket.user._id,
        name: ticket.user.name,
        email: ticket.user.email
      }
    };

    res.json({
      success: true,
      data: formattedTicket
    });
  } catch (err) {
    console.error('Error fetching ticket:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to load ticket',
      error: 'TICKET_FETCH_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});


module.exports = router;
