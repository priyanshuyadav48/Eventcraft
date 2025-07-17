function Dashboard() {
    const name = localStorage.getItem("name") || "Organizer";
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-900 to-purple-800 text-white p-6">
        <h1 className="text-4xl font-bold mb-4">👩‍💼 Organizer Dashboard</h1>
        <p className="text-xl">Welcome back, {name}!</p>
  
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="/create"
            className="bg-purple-700 hover:bg-purple-600 p-4 rounded shadow text-center"
          >
            ➕ Create New Event
          </a>
          <a
            href="/my-events"
            className="bg-blue-600 hover:bg-blue-500 p-4 rounded shadow text-center"
          >
            📋 View My Events
          </a>
        </div>
      </div>
    );
  }
  
  export default Dashboard;
  