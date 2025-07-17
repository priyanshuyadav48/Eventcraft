const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  category: String,
  venue: {
    name: String,
    address: String,
    capacity: Number
  },
  vendors: [
    {
      name: String,
      service: String,
      contact: String
    }
  ],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
