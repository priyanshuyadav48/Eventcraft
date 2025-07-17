import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventTickets = () => {
  const { eventId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`http://localhost:5000/api/tickets/event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTickets(res.data);
      } catch (err) {
        console.error("Error fetching event tickets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [eventId]);

  if (loading) return <p className="p-4">Loading tickets...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tickets for Event ID: {eventId}</h2>
      {tickets.length === 0 ? (
        <p>No tickets found for this event.</p>
      ) : (
        <ul className="space-y-4">
          {tickets.map((ticket) => (
            <li key={ticket._id} className="border rounded-lg p-4 bg-white shadow">
              <p><strong>Ticket ID:</strong> {ticket._id}</p>
              <p><strong>User:</strong> {ticket.user?.name || "Unknown"} ({ticket.user?.email})</p>
              <p><strong>Booked At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventTickets;
