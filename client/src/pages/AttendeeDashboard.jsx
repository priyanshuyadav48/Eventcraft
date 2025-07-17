import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AttendeeDashboard() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    upcomingEvents: 0,
    pastEvents: 0,
    totalRSVPs: 0,
    tickets: 0,
    loading: true
  });
  
  const [error, setError] = useState('');
  const [events, setEvents] = useState({
    upcoming: [],
    past: [],
    saved: []
  });
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch RSVP'd events and user profile
        const [rsvpsRes, profileRes] = await Promise.all([
          axios.get('http://localhost:5000/api/events/my-rsvps', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }).catch(error => {
            console.error('Error fetching RSVPs:', error);
            return { data: [] }; // Return empty array if there's an error
          }),
          axios.get('http://localhost:5000/api/user/profile', {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }).catch(error => {
            console.error('Error fetching user profile:', error);
            // Return default user data if the endpoint fails
            return { 
              data: { 
                id: 'default-user',
                name: 'Guest User',
                email: '',
                tickets: [],
                events: []
              } 
            };
          })
        ]);

        // Process events into upcoming and past
        const now = new Date();
        const upcoming = [];
        const past = [];

        rsvpsRes.data.forEach(event => {
          const eventDate = new Date(event.date);
          if (eventDate >= now) {
            upcoming.push(event);
          } else {
            past.push(event);
          }
        });

        setEvents({
          upcoming,
          past,
          saved: [] // You can implement saved events functionality later
        });

        setProfile(profileRes.data);
        
        // Calculate stats with fallbacks in case data is missing
        setStats({
          upcomingEvents: upcoming.length,
          pastEvents: past.length,
          totalRSVPs: rsvpsRes?.data?.length || 0,
          tickets: profileRes?.data?.tickets?.length || 0,
          loading: false
        });

      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError('Failed to load dashboard data. Please try again later.');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, navigate]);

  const renderTabContent = () => {
    if (loading || stats.loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      );
    }

    const currentEvents = events[activeTab] || [];

    if (currentEvents.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {activeTab === 'upcoming' 
              ? "You don't have any upcoming events." 
              : activeTab === 'past' 
                ? "You haven't attended any events yet."
                : "You haven't saved any events yet."}
          </p>
        </div>
      );
    }

    // Format date as 'M/D/YYYY'
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return (
      <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto w-full">
        {currentEvents.map(event => (
          <div key={event._id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(event.date)} • {event.location || 'Online'}
                </p>
                {event.description && (
                  <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                )}
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full whitespace-nowrap">
                {event.category || 'Event'}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">Welcome Back, {profile?.name || 'Attendee'}!</h1>
          <p className="mt-2 text-green-100">Here's what's happening with your events</p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard 
            title="Upcoming Events" 
            value={stats.upcomingEvents} 
            icon="📅"
            color="blue"
          />
          <StatCard 
            title="Past Events" 
            value={stats.pastEvents} 
            icon="✅"
            color="green"
          />
          <StatCard 
            title="Total RSVPs" 
            value={stats.totalRSVPs} 
            icon="✋"
            color="purple"
          />
          <StatCard 
            title="My Tickets" 
            value={stats.tickets} 
            icon="🎫"
            color="yellow"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'upcoming', label: 'Upcoming Events' },
              { id: 'past', label: 'Past Events' },
              { id: 'saved', label: 'Saved Events' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.id === 'upcoming' && stats.upcomingEvents > 0 && (
                  <span className="ml-2 bg-green-100 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {stats.upcomingEvents}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[color]}`}>
            <span className="text-xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendeeDashboard;
