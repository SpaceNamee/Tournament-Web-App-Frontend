import React, { useState, useEffect } from "react";
import Footer from "../../Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const user_id = parseInt(localStorage.getItem("user_id"), 10);
  const access_token = localStorage.getItem("access_token");
  const config = { headers: { Authorization: `Bearer ${access_token}` } };

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    nickname: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/users/${user_id}`, config);
        const user = res.data;
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          date_of_birth: user.date_of_birth || "",
          nickname: user.nickname || "",
          current_password: "",
          new_password: "",
          confirm_password: "",
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user_id, access_token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formData.new_password && formData.new_password !== formData.confirm_password) {
      alert("New password and confirm password do not match!");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      date_of_birth: formData.date_of_birth,
      nickname: formData.nickname,
      ...(formData.new_password ? { password: formData.new_password } : {}),
    };

    try {
      await axios.put(`http://127.0.0.1:8000/users/${user_id}`, payload, config);
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile. Check console for details.");
    }
  };

  const handleCancel = () => navigate("/profile");

  if (loading) return <p className="text-white text-center mt-20">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white">
      <main className="flex-1 p-8 flex flex-col items-center">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
          <p className="text-gray-400">
            Update your personal details and preferences
          </p>
        </header>

        <div className="w-full max-w-4xl flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-[#111827] text-white p-4 rounded-lg border border-gray-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-[#111827] text-white p-4 rounded-lg border border-gray-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Phone Number (Optional)</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Optional"
                className="bg-[#111827] text-white p-4 rounded-lg border border-gray-700"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-300">Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="bg-[#111827] text-white p-4 rounded-lg border border-gray-700"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-300">Nickname</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="bg-[#111827] text-white p-4 rounded-lg border border-gray-700"
            />
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <h2 className="text-xl font-bold">Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input
                type="password"
                name="current_password"
                placeholder="Current Password"
                value={formData.current_password}
                onChange={handleChange}
                className="bg-[#111827] text-white p-4 rounded-lg border border-gray-700"
              />
              <input
                type="password"
                name="new_password"
                placeholder="New Password"
                value={formData.new_password}
                onChange={handleChange}
                className="bg-[#111827] text-white p-4 rounded-lg border border-gray-700"
              />
              <input
                type="password"
                name="confirm_password"
                placeholder="Confirm New Password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="bg-[#111827] text-white p-4 rounded-lg border border-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-500 transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-[#E43F5A] text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EditProfile;
