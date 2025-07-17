import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4">
      <h1 className="text-5xl font-bold mb-4 text-center">EventCraft</h1>
      <p className="text-lg mb-8 text-center">Seamless Planning. Flawless Execution.</p>

      {user ? (
        <>
          <h2 className="text-xl mb-4">Welcome, <strong>{user.name}</strong> ({user.role})</h2>

          <div className="flex flex-col gap-4 mb-6">
            {user.role === 'admin' && (
              <Link to="/admin" className="bg-white text-purple-600 px-6 py-2 rounded shadow hover:bg-gray-100 text-center">
                Go to Admin Dashboard
              </Link>
            )}
            {user.role === 'organizer' && (
              <>
                <Link to="/organizer/events" className="bg-white text-purple-600 px-6 py-2 rounded shadow hover:bg-gray-100 text-center">
                  Manage My Events
                </Link>
                <Link to="/create-event" className="bg-white text-purple-600 px-6 py-2 rounded shadow hover:bg-gray-100 text-center">
                  Create New Event
                </Link>
              </>
            )}
            {user.role === 'attendee' && (
              <>
                <Link to="/events" className="bg-white text-purple-600 px-6 py-2 rounded shadow hover:bg-gray-100 text-center">
                  Browse Events
                </Link>
                <Link to="/my-tickets" className="bg-white text-purple-600 px-6 py-2 rounded shadow hover:bg-gray-100 text-center">
                  My Tickets
                </Link>
              </>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <div className="flex gap-6">
          <Link to="/login" className="bg-white text-purple-600 px-6 py-2 rounded shadow hover:bg-gray-100">
            Login
          </Link>
          <Link to="/register" className="bg-white text-purple-600 px-6 py-2 rounded shadow hover:bg-gray-100">
            Register
          </Link>
        </div>
      )}
    </div>
  );
}

export default Home;
