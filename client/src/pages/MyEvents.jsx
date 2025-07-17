import { useEffect, useState } from 'react';
import axios from 'axios';
import EditEventModal from '../components/EditEventModal';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch events created by the logged-in user
  const fetchMyEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events/my-events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch your events', err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter(event => event._id !== id));
      alert('Event deleted');
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-indigo-500 to-blue-700 text-white">
      <h2 className="text-3xl font-bold mb-6">📢 My Created Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white text-black rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
              <p className="mt-2">{event.description}</p>
              <p className="mt-2 text-sm text-blue-700">Category: {event.category}</p>

              {/* Venue info */}
              {event.venue && (
                <div className="mt-4 text-sm">
                  <p className="font-semibold text-gray-800">🏛 Venue Info:</p>
                  <p>📍 Name: {event.venue.name || 'N/A'}</p>
                  <p>📌 Address: {event.venue.address || 'N/A'}</p>
                </div>
              )}

              {/* Vendor info */}
              {event.vendor && (
                <div className="mt-4 text-sm">
                  <p className="font-semibold text-gray-800">🧑‍🍳 Vendor Info:</p>
                  <p>🍽️ Catering: {event.vendor.catering || 'N/A'}</p>
                  <p>🎤 Entertainment: {event.vendor.entertainment || 'N/A'}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditClick(event)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event editing modal */}
      <EditEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventData={selectedEvent}
        onEventUpdated={fetchMyEvents}
      />
    </div>
  );
}

export default MyEvents;
