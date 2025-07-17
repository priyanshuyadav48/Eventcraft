import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, eventsRes] = await Promise.all([
          axios.get("/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/admin/events", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setStats(statsRes.data || {});
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
      } catch (err) {
        console.error("Admin fetch failed", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-10">
        <div className="bg-blue-200 p-6 rounded-lg shadow-md text-xl font-semibold">
          Total Users: <span className="font-bold">{stats.totalUsers ?? 0}</span>
        </div>
        <div className="bg-green-200 p-6 rounded-lg shadow-md text-xl font-semibold">
          Total Events: <span className="font-bold">{stats.totalEvents ?? 0}</span>
        </div>
        <div className="bg-yellow-200 p-6 rounded-lg shadow-md text-xl font-semibold">
          Total Tickets: <span className="font-bold">{stats.totalTickets ?? 0}</span>
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-2xl font-bold mb-4">Users</h3>
        {users.length > 0 ? (
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u._id} className="bg-white p-4 rounded shadow">
                <strong>{u.name}</strong> — {u.email} <span className="italic text-gray-600">({u.role})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No users found.</p>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-4">Events</h3>
        {events.length > 0 ? (
          <ul className="space-y-2">
            {events.map((e) => (
              <li key={e._id} className="bg-white p-4 rounded shadow">
                <strong>{e.title}</strong> — {new Date(e.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No events found.</p>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
