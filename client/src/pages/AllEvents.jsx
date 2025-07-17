import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { showSuccess, showError } from '../utils/toast';

function AllEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events", err);
        showError('Failed to load events. Please try again later.');
        
        if (err.response?.status === 401) {
          navigate('/login', { state: { from: '/events' } });
        }
      }
    };

    fetchEvents();
  }, [navigate]);

  const handleRSVP = async (eventId) => {
    try {
      const res = await api.post(`/events/rsvp/${eventId}`, {});
      showSuccess(res.data.msg || "RSVP successful");
    } catch (err) {
      showError(err.response?.data?.msg || "RSVP failed");
      if (err.response?.status === 401) {
        showError('Please log in to RSVP');
        navigate('/login', { state: { from: '/events' } });
      }
    }
  };

  const handleBooking = async (eventId) => {
    // Find the event in the local state
    const event = events.find(e => e._id === eventId);
    if (!event) {
      showError('Event not found. Please refresh the page and try again.');
      return;
    }

    // Show loading state
    const loadingToast = showSuccess('Processing your booking...', { autoClose: false });

    try {
      // Make the booking request with empty body as per server route
      const res = await api.post(`/bookings/book/${eventId}`, {});

      // Close loading toast
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }

      if (res.data.success && res.data.ticketId) {
        showSuccess(res.data.message || '🎫 Ticket booked successfully!');
        // Redirect to the ticket page with the correct path
        navigate(`/ticket/${res.data.ticketId}`);
      } else {
        // Handle unexpected response format
        showError('Received an unexpected response from the server');
        console.error('Unexpected response format:', res.data);
      }
    } catch (err) {
      // Close loading toast if it exists
      if (loadingToast) {
        toast.dismiss(loadingToast);
      }

      // Handle specific error cases
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 400) {
          if (data.error === 'DUPLICATE_BOOKING' && data.ticketId) {
            showError('You have already booked this event');
            navigate(`/ticket/${data.ticketId}`);
            return;
          }
          showError(data.message || 'Invalid request. Please check your input.');
        } else if (status === 401) {
          showError('Please log in to book tickets');
          navigate('/login', { state: { from: '/events' } });
          return;
        } else if (status === 404) {
          showError('Event not found or no longer available');
          // Optionally refresh the events list
          const res = await api.get('/events');
          setEvents(res.data);
        } else {
          showError(data?.message || 'Failed to book ticket. Please try again.');
        }
      } else {
        // Network or other errors
        showError('Failed to connect to the server. Please check your connection.');
      }
      
      console.error('Booking error:', err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h2 className="text-3xl font-bold mb-6">📅 All Events</h2>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-white text-black rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{new Date(event.date).toLocaleString()}</p>
              <p className="mt-2">{event.description}</p>
              <p className="mt-2 text-sm text-purple-700">Category: {event.category}</p>
              <p className="text-sm text-gray-500 mt-1">Organizer: {event.organizer?.name}</p>

              {/* ✅ Venue Info */}
              {event.venue?.name && (
                <div className="mt-2 text-sm text-green-700">
                  <p className="font-semibold">📍 Venue:</p>
                  <p>{event.venue.name}</p>
                  <p>{event.venue.address}</p>
                  <p>Capacity: {event.venue.capacity}</p>
                </div>
              )}

              {/* ✅ Vendor Info */}
              {event.vendors?.length > 0 && (
                <div className="mt-2 text-sm text-blue-700">
                  <p className="font-semibold">🎤 Vendors:</p>
                  <ul className="list-disc list-inside">
                    {event.vendors.map((vendor, index) => (
                      <li key={index}>
                        {vendor.name} - {vendor.service} ({vendor.contact})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ✅ RSVP Button */}
              <button
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => handleRSVP(event._id)}
              >
                📬 RSVP
              </button>

              {/* ✅ Book Now Button */}
              <button
                className="mt-2 ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => handleBooking(event._id)}
              >
                🎟️ Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllEvents;
