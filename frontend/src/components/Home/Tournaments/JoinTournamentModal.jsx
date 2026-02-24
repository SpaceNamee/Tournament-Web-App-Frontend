import React, { useState, useEffect } from "react";
import axios from "axios";
import teamicon from "../../../assets/1-1.png";

const JoinTournamentModal = ({ isOpen, onClose, tournament, onJoin }) => {
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [joining, setJoining] = useState(false);

  const userId = parseInt(localStorage.getItem("user_id"), 10);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTeams = async () => {
      try {
        setLoadingTeams(true);

        const res = await axios.get(
          `http://127.0.0.1:8000/teams/joined_participants/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
          }
        );

        const teamsData = res.data.data || res.data || [];
        setTeams(Array.isArray(teamsData) ? teamsData : []);
      } catch (err) {
        console.error("Failed to fetch teams:", err.response?.data);
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };

    if (userId) fetchTeams();
  }, [isOpen, userId]);


  /*
  axios.get(`http://127.0.0.1:8000/teams/joined_participants/${userId}`)
    .then(res => setTeams(res.data))
    .catch(err => console.error("Failed to fetch teams:", err))
    .finally(() => setLoadingTeams(false));*/


if (!isOpen) return null;

const handleJoinTeam = (teamId) => {
  if (onJoin) onJoin(teamId);
  console.log("Selected teamId:", teamId);

};

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="bg-white rounded-lg p-6 w-full max-w-md text-black">
      <h2 className="text-xl font-bold mb-4">Join Tournament</h2>

      {loadingTeams ? (
        <p>Loading your teams...</p>
      ) : (
        <div className="space-y-3">
          {teams.map(team => (
            <button
              key={team.id}
              onClick={() => handleJoinTeam(team.id)}
              disabled={joining}
              className="w-full flex items-center justify-between p-3 border rounded-lg hover:border-[#e43f5a]"
            >
              <div className="flex items-center gap-3">
                <img src={teamicon} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <div className="font-bold">{team.name}</div>
                  <div className="text-xs text-gray-500">
                    {team.members?.length || 0}/{team.max_players} members
                  </div>
                </div>
              </div>
              <span className="text-[#e43f5a] text-xs font-bold">Select</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 text-right">
        <button onClick={onClose} className="font-bold">Cancel</button>
      </div>
    </div>
  </div>
);
};

export default JoinTournamentModal;