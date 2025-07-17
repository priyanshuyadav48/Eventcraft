import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import api from '../utils/api';
import { showError } from '../utils/toast';

function TicketPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    
    const fetchTicket = async () => {
      if (!isMounted) return;
      
      try {
        console.log('Fetching ticket with ID:', ticketId);
        const response = await api.get(`/bookings/${ticketId}`);
        
        if (!isMounted) return;
        
        console.log('Ticket API response:', response.data);
        
        // Check if we got a successful response with data
        if (!response.data.success || !response.data.data) {
          throw new Error('Invalid response format from server');
        }
        
        const ticketData = response.data.data;
        
        if (!isMounted) return;
        
        // Transform the response data to match the expected ticket format
        setTicket({
          _id: ticketData._id,
          ticketId: ticketData.ticketId,
          status: ticketData.status,
          bookedAt: ticketData.bookedAt,
          event: {
            _id: ticketData.eventId?._id,
            title: ticketData.eventId?.title,
            date: ticketData.eventId?.date,
            location: typeof ticketData.eventId?.venue === 'string' 
              ? ticketData.eventId.venue 
              : ticketData.eventId?.venue?.name || 'Venue not specified',
            address: typeof ticketData.eventId?.address === 'string'
              ? ticketData.eventId.address
              : [
                  ticketData.eventId?.address?.street,
                  ticketData.eventId?.address?.city,
                  ticketData.eventId?.address?.state,
                  ticketData.eventId?.address?.country,
                  ticketData.eventId?.address?.zipCode
                ].filter(Boolean).join(', ') || 'Address not specified',
            description: ticketData.eventId?.description,
            image: ticketData.eventId?.image
          },
          user: ticketData.user,
          attendeeName: ticketData.user?.name || 'Guest',
          ticketType: 'General Admission' // Default value if not specified
        });
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error fetching ticket:', {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          config: {
            url: err.config?.url,
            method: err.config?.method,
            headers: err.config?.headers
          }
        });
        
        if (err.response?.status === 401) {
          showError('Please log in to view this ticket');
          navigate('/login', { state: { from: `/ticket/${ticketId}` } });
        } else if (err.response?.status === 404) {
          showError('Ticket not found. Redirecting to events...');
          navigate('/events');
        } else {
          showError(err.response?.data?.message || 'Failed to load ticket. Redirecting to events...');
          navigate('/events');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTicket();
    
    return () => {
      isMounted = false;
    };
  }, [ticketId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ticket Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the ticket you're looking for. It may have been cancelled or you may not have permission to view it.</p>
          <button
            onClick={() => navigate('/my-tickets')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View My Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Your Ticket
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Present this ticket at the event entrance
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row">
              {/* QR Code Section */}
              <div className="flex-shrink-0 p-6 bg-gray-50 rounded-lg flex flex-col items-center">
                <QRCodeSVG
                  value={JSON.stringify({
                    ticketId: ticket._id,
                    eventId: ticket.event?._id,
                    attendee: ticket.attendeeName || 'Guest'
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
                <p className="mt-4 text-sm text-gray-500">Scan for verification</p>
              </div>
              
              {/* Ticket Details */}
              <div className="mt-6 md:mt-0 md:ml-8 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{ticket.event?.title || 'Event'}</h2>
                    <p className="text-indigo-600 font-medium">
                      {ticket.ticketType || 'General Admission'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Ticket #{ticket._id.substring(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">Valid for 1 entry</p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(ticket.event?.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(ticket.event?.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.event?.location || 'Venue not specified'}
                      </p>
                      {ticket.event?.address && (
                        <p className="text-sm text-gray-500">{ticket.event.address}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {ticket.attendeeName || 'Guest'}
                      </p>
                      <p className="text-sm text-gray-500">Ticket Holder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Need help? <a href="#" className="text-indigo-600 hover:text-indigo-500">Contact support</a>
              </p>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Print Ticket
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/my-tickets')}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Back to My Tickets
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketPage;
