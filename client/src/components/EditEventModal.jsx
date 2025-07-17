import { useState, useEffect } from "react";
import axios from "axios";

function EditEventModal({ isOpen, onClose, eventData, onEventUpdated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "Other",
    venue: {
      name: "",
      address: ""
    },
    vendor: {
      catering: "",
      entertainment: ""
    }
  });

  useEffect(() => {
    if (eventData) {
      setFormData({
        title: eventData.title || "",
        description: eventData.description || "",
        date: new Date(eventData.date).toISOString().slice(0, 16),
        category: eventData.category || "Other",
        venue: {
          name: eventData.venue?.name || "",
          address: eventData.venue?.address || ""
        },
        vendor: {
          catering: eventData.vendor?.catering || "",
          entertainment: eventData.vendor?.entertainment || ""
        }
      });
    }
  }, [eventData]);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNestedChange = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/events/${eventData._id}`,
        {
          ...formData,
          date: new Date(formData.date)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Event updated!");
      onClose();
      onEventUpdated(); // Refresh events list
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to update event.");
    }
  };

  if (!isOpen || !eventData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md shadow-md text-black">
        <h3 className="text-2xl font-bold mb-4">Edit Event</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Conference">Conference</option>
            <option value="Wedding">Wedding</option>
            <option value="Meetup">Meetup</option>
            <option value="Concert">Concert</option>
            <option value="Festival">Festival</option>
            <option value="Other">Other</option>
          </select>

          {/* Venue Info */}
          <h4 className="font-semibold mt-4">Venue</h4>
          <input
            type="text"
            value={formData.venue.name}
            onChange={(e) => handleNestedChange("venue", "name", e.target.value)}
            placeholder="Venue Name"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            value={formData.venue.address}
            onChange={(e) => handleNestedChange("venue", "address", e.target.value)}
            placeholder="Venue Address"
            className="w-full border rounded px-3 py-2"
          />

          {/* Vendor Info */}
          <h4 className="font-semibold mt-4">Vendors</h4>
          <input
            type="text"
            value={formData.vendor.catering}
            onChange={(e) => handleNestedChange("vendor", "catering", e.target.value)}
            placeholder="Catering Vendor"
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            value={formData.vendor.entertainment}
            onChange={(e) => handleNestedChange("vendor", "entertainment", e.target.value)}
            placeholder="Entertainment Vendor"
            className="w-full border rounded px-3 py-2"
          />

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEventModal;
