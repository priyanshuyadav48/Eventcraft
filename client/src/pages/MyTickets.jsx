import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import api from '../utils/api';
import { showError, showSuccess } from '../utils/toast';
import { FaDownload, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaExternalLinkAlt } from 'react-icons/fa';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const downloadTicket = async (ticketId) => {
    try {
      const ticketElement = document.getElementById(`ticket-${ticketId}`);
      const canvas = await html2canvas(ticketElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      canvas.toBlob((blob) => {
        saveAs(blob, `ticket-${ticketId}.png`);
        showSuccess('Ticket downloaded successfully!');
      });
    } catch (err) {
      console.error('Error downloading ticket:', err);
      showError('Failed to download ticket');
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // Use the correct endpoint for fetching user's bookings
        const res = await api.get('/bookings/my');
        
        // Transform the data to match the expected format
        const formattedTickets = res.data.map(booking => ({
          _id: booking._id,
          ticketId: booking.ticketId,
          status: booking.status,
          bookedAt: booking.bookedAt,
          event: booking.event || {},
          user: booking.user || {},
          attendeeName: booking.user?.name || 'Guest',
          ticketType: 'General Admission'
        }));
        
        setTickets(formattedTickets);
      } catch (err) {
        console.error('Failed to fetch tickets', err);
        if (err.response?.status === 401) {
          showError('Please log in to view your tickets');
          navigate('/login');
        } else {
          showError(err.response?.data?.message || 'Failed to load tickets. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            My Tickets
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            View and manage all your event tickets in one place
          </p>
        </div>

        {tickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tickets yet</h3>
            <p className="mt-1 text-gray-500">You haven't booked any events yet.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Events
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div
                key={ticket._id}
                id={`ticket-${ticket._id}`}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                {/* QR Code Section */}
                <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
                  <div className="bg-white p-2 rounded-lg inline-block">
                    <QRCodeSVG
                      value={JSON.stringify({
                        ticketId: ticket._id,
                        eventId: ticket.event?._id,
                        attendee: ticket.attendeeName || 'Guest'
                      })}
                      size={140}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium">Scan to verify</p>
                </div>

                {/* Ticket Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {ticket.event?.title || 'Untitled Event'}
                      </h3>
                      <p className="text-sm text-indigo-600 font-medium">
                        {ticket.ticketType || 'General Admission'}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Valid
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-start">
                      <FaCalendarAlt className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                      <div className="ml-3">
                        <p className="text-sm text-gray-900">
                          {ticket.event?.date ? new Date(ticket.event.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'Date not set'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {ticket.event?.date ? new Date(ticket.event.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : ''}
                        </p>
                      </div>
                    </div>

                    {ticket.event?.location && (
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="flex-shrink-0 h-5 w-5 text-gray-400 mt-0.5" />
                        <div className="ml-3">
                          <p className="text-sm text-gray-900">
                            {ticket.event.location}
                          </p>
                          {ticket.event.address && (
                            <p className="text-sm text-gray-500">
                              {ticket.event.address}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/ticket/${ticket._id}`)}
                      className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      View details <FaExternalLinkAlt className="ml-1 h-3 w-3" />
                    </button>
                    <button
                      onClick={() => downloadTicket(ticket._id)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaDownload className="-ml-0.5 mr-2 h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
