import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../Footer";
import avatarPlaceholder from "../../../../assets/1-1.png";

const TeamManagement = () => {
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("user_id"); // ID do user ao login

  useEffect(() => {
    const fetchTeamsAndMembers = async () => {
      try {
        // 1️⃣ Buscar teams do user
        const res = await axios.get(
          `http://127.0.0.1:8000/teams/joined_participants/${userId}`
        );
        const teams = res.data;

        console.log("Fetched teams:", teams);

        // 2️⃣ Buscar membros de cada team
        const teamsWithMembers = await Promise.all(
          teams.map(async (team) => {
            const teamRes = await axios.get(
              `http://127.0.0.1:8000/teams/${team.id}`
            );

            console.log(`Team ${team.id} data:`, teamRes.data);

            // fallback: API pode retornar membros em "members" ou "participants"
            const members = teamRes.data.members || teamRes.data.participants || [];

            return {
              ...team,
              members: members,
            };
          })
        );

        setUserTeams(teamsWithMembers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching teams or members:", error);
        setLoading(false);
      }
    };

    fetchTeamsAndMembers();
  }, [userId]);

  const handleCancel = () => alert("Cancel pressed!");
  const handleSave = () => alert("Save pressed!");
  const handleSendInvite = (teamId) => alert(`Send Invite for team ${teamId} pressed!`);

  if (loading)
    return <p className="text-white text-2xl text-center mt-20">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white">
      <main className="flex-1 p-8 flex flex-col items-center gap-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={avatarPlaceholder}
            alt="Team Icon"
            className="w-12 h-12 rounded-full object-cover"
          />
          <h1 className="text-4xl font-bold">Team Management</h1>
        </div>

        {/* Teams List */}
        <div className="flex flex-col gap-6 w-full max-w-4xl">
          {userTeams.length === 0 && (
            <p className="text-gray-400 text-xl">You are not in any teams yet.</p>
          )}

          {userTeams.map((team) => (
            <div
              key={team.id}
              className="bg-[#111827] rounded-xl p-6 border border-gray-800"
            >
              {/* Team Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">{team.name}</h2>
                  <p className="text-gray-400">
                    {team.members ? team.members.length : 0} Members •{" "}
                    {team.visibility || "Private"}
                  </p>
                </div>
                <button
                  className="bg-[#1F4068] py-2 px-4 rounded-lg"
                  onClick={() => handleSendInvite(team.id)}
                >
                  Send Invite
                </button>
              </div>

              {/* Members List */}
              {team.members && team.members.length > 0 ? (
                <div className="bg-[#1B1B2F] rounded-lg p-4 flex flex-col gap-2">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between bg-[#24243a] p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar || avatarPlaceholder}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span>{member.name}</span>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          member.role === "Captain"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-[#5311EE]"
                        }`}
                      >
                        {member.role || "Member"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 mt-2">No members yet.</p>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            className="bg-gray-600 py-2 px-6 rounded-lg hover:bg-gray-500 transition"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[#1F4068] py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeamManagement;
