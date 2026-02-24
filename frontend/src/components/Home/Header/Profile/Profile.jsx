import React, { useState, useEffect } from "react";
import Footer from "../../Footer";
import avatarPlaceholder from "../../../../assets/1-1.png";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const navigate = useNavigate();
  const user_id = parseInt(localStorage.getItem("user_id"), 10);
  const access_token = localStorage.getItem("access_token");

  const [userData, setUserData] = useState(null);
  const [teams, setTeams] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = { headers: { Authorization: `Bearer ${access_token}` } };

  useEffect(() => {
    if (!user_id) return;

    const fetchData = async () => {
      try {
        // Fetch user
        const userRes = await axios.get(`https://tournament-web-app-backend-1.onrender.com/users/${user_id}`, config);
        setUserData(userRes.data);

        // Fetch teams
        const teamsRes = await axios.get(
          `https://tournament-web-app-backend-1.onrender.com/teams/joined_participants/${user_id}`,
          config
        );
        const uniqueTeams = Array.isArray(teamsRes.data)
          ? Array.from(new Map(teamsRes.data.map(team => [team.id, team])).values())
          : [];
        setTeams(uniqueTeams);

        // Fetch tournaments
        const tournamentsRes = await axios.get(
          `https://tournament-web-app-backend-1.onrender.com/tournaments/filter/joined`,
          { headers: { Authorization: `Bearer ${access_token}` }, params: { user_id } }
        );
        console.log("Tournaments response:", tournamentsRes.data); // debug
        const uniqueTournaments = Array.isArray(tournamentsRes.data)
          ? Array.from(new Map(tournamentsRes.data.map(t => [t.id, t])).values())
          : [];
        setTournaments(uniqueTournaments);

        // Mock recent activities
        setActivities([
          { id: 1, description: "Joined the Red Dragons basketball team", date: "2026-01-15" },
          { id: 2, description: "Participated in the Winter Tournament 2026", date: "2026-01-20" },
          { id: 3, description: "Updated profile information", date: "2026-02-05" },
          { id: 4, description: "Invited to join Blue Tigers football team", date: "2026-02-08" },
        ]);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setTeams([]);
        setTournaments([]);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user_id, access_token]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white">
      <main className="flex-1 p-8">
        {/* HEADER */}
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Profile</h1>
            <p className="text-gray-400">Manage your personal information and activity</p>
          </div>
          <button
            onClick={() => navigate("/edit-profile")}
            className="flex items-center gap-2 bg-[#E43F5A] hover:bg-[#c6364c] px-4 py-2 rounded-lg text-white font-bold"
          >
            <FaUserEdit />
            Edit Profile
          </button>
        </header>

        {/* TOP PROFILE CARD */}
        <div className="bg-[#111827] rounded-xl p-6 flex items-center gap-6 border border-gray-800 mb-10">
          <img
            src={userData?.avatar || avatarPlaceholder}
            alt="avatar"
            className="w-32 h-32 rounded-xl object-cover border border-gray-700"
          />
          <div>
            <h2 className="text-2xl font-bold">{userData?.name || "No Name"}</h2>
            <p className="text-[#e43f5a] font-medium">@{userData?.nickname || "unknown"}</p>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              📧 {userData?.email || "No email"} | 📍 {userData?.location || "Unknown"}
            </p>
            <p className="text-gray-400 mt-1">📞 {userData?.phone_number || "No phone"}</p>
            <p className="text-gray-400 mt-1">🎂 {userData?.date_of_birth || "Unknown"} | Age: {userData?.age || "-"}</p>
            <p className="text-gray-400 mt-1">
              Notifications: 
              {userData?.tournament_notif ? " 🏆" : ""} 
              {userData?.match_notif ? " ⚽" : ""} 
              {userData?.general_notif ? " 🔔" : ""}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* ABOUT ME */}
            <div className="bg-[#111827] rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-3">About Me</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {userData?.bio || "No bio provided yet."}
              </p>
            </div>

            {/* TEAMS */}
            <div className="bg-[#111827] rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-4">Teams</h3>
              <div className="space-y-4">
                {teams.length === 0 ? (
                  <p className="text-gray-400 text-sm">You are not in any team yet.</p>
                ) : (
                  teams.map(team => (
                    <div key={team.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center font-bold">
                        {team.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{team.name}</p>
                        <p className="text-gray-400 text-sm">{team.sport} Team</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* TOURNAMENTS JOINED */}
            <div className="bg-[#111827] rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-4">Tournaments Joined</h3>
              <div className="space-y-2">
                {tournaments.length === 0 ? (
                  <p className="text-gray-400 text-sm">You haven't joined any tournaments yet.</p>
                ) : (
                  tournaments.map(t => (
                    <div key={t.id}>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-gray-400 text-sm">{t.sport}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Matches Played", value: "150" },
                { label: "Wins", value: "105" },
                { label: "Win Rate", value: "70%" },
              ].map(stat => (
                <div key={stat.label} className="bg-[#111827] rounded-xl p-6 border border-gray-800">
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-[#111827] rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-3">Recent Activity</h3>
              {activities.length === 0 ? (
                <p className="text-gray-400 text-sm">No recent activity.</p>
              ) : (
                <ul className="space-y-2">
                  {activities.map(a => (
                    <li key={a.id} className="text-gray-400 text-sm">
                      {a.date} - {a.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
