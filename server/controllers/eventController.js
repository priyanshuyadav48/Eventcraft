const Event = require('../models/Event');
const sendReminderEmail = require('../utils/mailer');

const createEvent = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ msg: 'Only organizers can create events' });
    }

    const newEvent = new Event({
      ...req.body,
      organizer: req.user.id,
    });

    await newEvent.save();
    res.json({ msg: 'Event created successfully', event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name');
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already RSVPed' });
    }

    event.attendees.push(req.user.id);
    await event.save();

    res.json({ msg: 'RSVP successful', event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

const getMyRSVPs = async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user.id }).populate('organizer', 'name email');
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch RSVP events' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.organizer.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    Object.assign(event, req.body);
    await event.save();

    res.json({ msg: "Event updated successfully", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update event" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.organizer.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    await event.deleteOne();
    res.json({ msg: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to delete event" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });

    const totalEvents = events.length;
    const totalRSVPs = events.reduce((acc, event) => acc + event.attendees.length, 0);

    res.json({ totalEvents, totalRSVPs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to fetch stats' });
  }
};

const { Parser } = require('json2csv');

const exportRSVPsToCSV = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .populate('attendees', 'name email');

    const rows = [];

    events.forEach(event => {
      event.attendees.forEach(attendee => {
        rows.push({
          EventTitle: event.title,
          EventDate: event.date.toISOString(),
          AttendeeName: attendee.name,
          AttendeeEmail: attendee.email
        });
      });
    });

    const parser = new Parser();
    const csv = parser.parse(rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('rsvps.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error generating CSV' });
  }
};

const sendEventReminders = async () => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const events = await Event.find({
      date: { $gte: now, $lte: oneHourFromNow }
    });

    for (const event of events) {
      const rsvps = await RSVP.find({ event: event._id }); // Get attendees
      for (const rsvp of rsvps) {
        const message = `Reminder: Your event "${event.title}" starts at ${new Date(event.date).toLocaleString()}`;
        await sendReminderEmail(rsvp.email, '⏰ Event Reminder', message);
      }
    }

    console.log('Reminders sent');
  } catch (err) {
    console.error('Reminder error:', err);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getMyEvents,
  rsvpEvent,
  getMyRSVPs,  
  updateEvent,
  deleteEvent,
  getDashboardStats,
  exportRSVPsToCSV,
  sendEventReminders
};
