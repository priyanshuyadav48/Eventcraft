import { useState } from 'react';
import axios from 'axios';

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'Conference',
    venue: {
      name: '',
      address: ''
    },
    vendor: {
      catering: '',
      entertainment: '' 
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (section, key, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [key]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        'http://localhost:5000/api/events',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Event created successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to create event");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center p-6">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white text-black p-8 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Create New Event</h2>

        {/* Event Title */}
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Date/Time */}
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        {/* Category */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>Conference</option>
          <option>Wedding</option>
          <option>Meetup</option>
          <option>Concert</option>
          <option>Festival</option>
          <option>Other</option>
        </select>

        {/* 🆕 Venue Section */}
        <h3 className="font-semibold mt-4">Venue Details</h3>
        <input
          type="text"
          placeholder="Venue Name"
          value={formData.venue.name}
          onChange={(e) => handleNestedChange('venue', 'name', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Venue Address"
          value={formData.venue.address}
          onChange={(e) => handleNestedChange('venue', 'address', e.target.value)}
          className="w-full p-2 border rounded"
        />

        {/* 🆕 Vendor Section */}
        <h3 className="font-semibold mt-4">Vendor Details</h3>
        <input
          type="text"
          placeholder="Catering Vendor"
          value={formData.vendor.catering}
          onChange={(e) => handleNestedChange('vendor', 'catering', e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Entertainment Vendor"
          value={formData.vendor.entertainment}
          onChange={(e) => handleNestedChange('vendor', 'entertainment', e.target.value)}
          className="w-full p-2 border rounded"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
