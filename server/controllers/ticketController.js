// controllers/ticketController.js
const Ticket = require('../models/Ticket');

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate('user', 'name email')
      .populate('event', 'title date venue');

    if (!ticket) {
      return res.status(404).json({ msg: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
