import { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || "",
          avatar: res.data.avatar || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = async () => {
    try {
      const res = await axios.put("/api/user/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated!");
      setUser(res.data);
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await axios.put("/api/user/profile/password", passwords, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Password updated!");
      setPasswords({ currentPassword: "", newPassword: "" });
    } catch (err) {
      alert("Password change failed");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-12 px-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white bg-opacity-90 rounded-2xl shadow-2xl p-8 animate-fade-in-up transition-all duration-500 ease-in-out">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          👤 Your Profile
        </h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
          />
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>

        <button
          onClick={handleProfileUpdate}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow transition transform hover:scale-105 duration-300"
        >
          💾 Update Profile
        </button>

        <hr className="my-8 border-t-2 border-gray-200" />

        <h3 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          🔒 Change Password
        </h3>

        <div className="grid grid-cols-1 gap-4">
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            placeholder="Current Password"
          />
          <input
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            placeholder="New Password"
          />
        </div>

        <button
          onClick={handlePasswordUpdate}
          className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold shadow transition transform hover:scale-105 duration-300"
        >
          🔁 Change Password
        </button>
      </div>
    </div>
  );
}

export default Profile;
