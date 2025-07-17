import { useEffect, useState } from 'react';
import axios from 'axios';

function MyRSVPs() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRSVPs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events/my-rsvps', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch RSVP events', err);
      }
    };

    fetchRSVPs();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-green-500 to-lime-600 text-white">
      <h2 className="text-3xl font-bold mb-6">✅ My RSVPs</h2>

      {events.length === 0 ? (
        <p>You haven’t RSVP’d to any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white text-black rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
              <p className="mt-2">{event.description}</p>
              <p className="mt-2 text-sm text-purple-700">Category: {event.category}</p>
              <p className="text-sm text-gray-500 mt-1">Organizer: {event.organizer?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRSVPs;
