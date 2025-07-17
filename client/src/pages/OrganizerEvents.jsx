import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const OrganizerEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get("http://localhost:5000/api/events/mine", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch organizer events", err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Events</h2>
      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event._id} className="border rounded-lg p-4 bg-white shadow">
              <p><strong>Title:</strong> {event.title}</p>
              <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>

              <div className="mt-2">
                <Link
                  to={`/events/${event._id}/tickets`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View Tickets
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrganizerEvents;
