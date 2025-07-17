import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { saveAs } from 'file-saver';
import { FaDownload, FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from 'react-icons/fa';

const TicketCard = ({ ticket }) => {
  if (!ticket || !ticket.event) {
    return <div className="text-center p-4 text-gray-500">Loading ticket information...</div>;
  }

  const { event } = ticket;
  const ticketData = {
    id: ticket._id,
    eventId: event._id,
    eventName: event.title,
    attendeeName: ticket.attendeeName || 'Guest',
    date: new Date(event.date).toLocaleDateString(),
    time: new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    venue: event.location || 'Venue not specified',
    type: ticket.ticketType || 'General Admission'
  };

  const downloadTicket = () => {
    const canvas = document.createElement('canvas');
    const ticketElement = document.getElementById(`ticket-${ticket._id}`);
    
    html2canvas(ticketElement, {
      backgroundColor: null,
      scale: 2 // Higher scale for better quality
    }).then(canvas => {
      canvas.toBlob((blob) => {
        saveAs(blob, `ticket-${ticket._id}.png`);
      });
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row">
          {/* QR Code Section */}
          <div className="flex-shrink-0 p-4 bg-gray-50 rounded-lg flex flex-col items-center">
            <div className="mb-4">
              <QRCodeSVG
                value={JSON.stringify({
                  ticketId: ticket._id,
                  eventId: event._id,
                  attendee: ticket.attendeeName || 'Guest'
                })}
                size={180}
                level="H"
                includeMargin={true}
              />
            </div>
            <span className="text-xs text-gray-500">Scan for verification</span>
          </div>
          
          {/* Ticket Details */}
          <div className="mt-4 md:mt-0 md:ml-6 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
                <p className="text-sm text-indigo-600 font-medium">
                  <FaTicketAlt className="inline mr-1" /> {ticket.ticketType || 'General Admission'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Ticket #{ticket._id.substring(0, 8).toUpperCase()}</p>
                <p className="text-xs text-gray-400">Valid for 1 entry</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600">{new Date(event.date).toDateString()}</p>
                  <p className="text-xs text-gray-500">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">{event.location || 'Venue not specified'}</p>
                  {event.address && (
                    <p className="text-xs text-gray-500">{event.address}</p>
                  )}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Attendee</p>
                    <p className="text-sm text-gray-600">{ticket.attendeeName || 'Guest'}</p>
                  </div>
                  <button
                    onClick={downloadTicket}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
