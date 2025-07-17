import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './pages/Home';
import CreateEvent from './pages/CreateEvent';
import AllEvents from './pages/AllEvents';
import MyRSVPs from './pages/MyRSVPs';
import MyEvents from './pages/MyEvents';
import Dashboard from "./pages/Dashboard";
import OrganizerDashboard from './pages/OrganizerDashboard';
import TicketPage from "./pages/TicketPage";
import MyTickets from './pages/MyTickets';
import OrganizerEvents from './pages/OrganizerEvents';
import EventTickets from './pages/EventTickets';
import AdminDashboard from './pages/AdminDashboard';
import Profile from "./pages/Profile";
import Navigation from './components/Navigation';
import AttendeeDashboard from './pages/AttendeeDashboard';

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create" element={<CreateEvent />} />
              <Route path="/events" element={<AllEvents />} />
              <Route path="/my-rsvps" element={<MyRSVPs />} />
              <Route path="/my-events" element={<MyEvents />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
              <Route path="/ticket/:ticketId" element={<TicketPage />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/organizer/events" element={<OrganizerEvents />} />
              <Route path="/event/:eventId/tickets" element={<EventTickets />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/attendee-dashboard" element={<AttendeeDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </>
  );
}

export default App;
