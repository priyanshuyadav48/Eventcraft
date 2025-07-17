import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function OrganizerDashboard() {
  const [stats, setStats] = useState({ totalEvents: 0, totalRSVPs: 0 });
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events/dashboard-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };

    fetchStats();
  }, []);

  const downloadCSV = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events/export', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rsvps.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("❌ Failed to download CSV");
    }
  };

  const chartData = [
    { name: 'Events', value: stats.totalEvents },
    { name: 'RSVPs', value: stats.totalRSVPs }
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-400 to-blue-600 text-white flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl text-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center">📊 Organizer Dashboard</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 text-center">
          <button
            onClick={downloadCSV}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            📤 Export to CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrganizerDashboard;
