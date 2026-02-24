import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";
import TeamCard from "./TeamCard";
import LeaveTeamModal from "./LeaveTeamModal";
import { getCurrentUser } from "../../../services/auth";

const Teams = () => {
  const navigate = useNavigate();
  const { user_id } = getCurrentUser();

  const [teams, setTeams] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);

  /* -------------------- FETCH TEAMS -------------------- */
  const fetchTeams = async () => {
    try {
      const userId = parseInt(user_id, 10);
      if (!userId) return;

      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      };

      const joinedRes = await axios.get(
        `http://127.0.0.1:8000/teams/joined_participants/${userId}`,
        authConfig
      );

      // Filtra apenas joins ativos
      const joinedTeams = (joinedRes.data.data || joinedRes.data || []).filter(j => !j.deleted_at);
      console.log("ACTIVE JOINED TEAMS:", joinedTeams);

      const allRes = await axios.get(
        "http://127.0.0.1:8000/teams/all_active",
        { ...authConfig, params: { page: 1, perPage: 50 } }
      );

      const allTeams = allRes.data.data || [];

      const teamsWithJoined = allTeams.map((team) => {
        const isJoined = joinedTeams.some((jt) => jt.team_id === team.id);
        return { ...team, joined: isJoined };
      });

      setTeams(teamsWithJoined);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setTeams([]);
    }
  };


  const location = useLocation();

  useEffect(() => {
    fetchTeams();
  }, [location.pathname, user_id]);

  /* -------------------- HANDLERS -------------------- */
  const handleJoin = async (teamId) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/teams/join",
        { team_id: teamId, user_id: parseInt(user_id, 10), password: null },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );

      setTeams((prev) =>
        prev.map((t) => (t.id === teamId ? { ...t, joined: true } : t))
      );

    } catch (err) {
      console.error(err);
      alert("Failed to join team.");
    }
  };

  const handleLeave = async (teamId) => {
    if (!teamId) return;
    try {
      await axios.post(
        "http://127.0.0.1:8000/teams/leave",
        { team_id: teamId, user_id: parseInt(user_id, 10) },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );

      setTeams((prev) =>
        prev.map((t) => (t.id === teamId ? { ...t, joined: false } : t))
      );
      setSelectedTeamId(null);
      setIsLeaveModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to leave team.");
    }
  };


  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm("Delete this team?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/teams/delete/${teamId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setTeams((prev) =>
  prev.map((t) => (t.id === teamId ? { ...t, joined: true } : t))
);

    } catch (err) {
      console.error(err);
      alert("Failed to delete team.");
    }
  };

  /* -------------------- BUTTONS -------------------- */
  const getButtons = (team) => {
    const isCreator = team.created_by === parseInt(user_id, 10);
    if (team.joined) {
      const buttons = [
        {
          label: "View / Edit",
          primary: false,
          onClick: () => navigate("/change-team-details", { state: { team } }),
        },
      ];
      if (isCreator) {
        buttons.push({ label: "Delete Team", primary: true, onClick: () => handleDeleteTeam(team.id) });
      } else {
        buttons.push({
          label: "Leave Team",
          primary: true,
          onClick: () => {
            setSelectedTeamId(team.id);
            setIsLeaveModalOpen(true);
          },
        });
      }
      return buttons;
    }
    return [
      { label: "View Details", primary: false, onClick: () => navigate("/team-details", { state: { team } }) },
      { label: "Join", primary: true, onClick: () => handleJoin(team.id) },
    ];
  };

  /* -------------------- FILTERS -------------------- */
  const filteredTeams = teams
    .filter((t) => {
      const now = new Date();
      const startDate = t.start_date ? new Date(t.start_date) : null;

      if (activeFilter === "joined") return t.joined;

      if (activeFilter === "available") {
        return !t.joined && (!startDate || startDate > now);
      }

      return true; // all teams
    })
    .filter((t) => t.name?.toLowerCase().includes(search.toLowerCase()));

  const yourTeams = teams.filter((t) => t.joined);

  /* -------------------- RENDER -------------------- */
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white font-['Inter-Regular',_Helvetica]">
      <main className="flex-1 p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Teams</h1>
          <p className="text-gray-400">Browse and manage your teams</p>
        </header>

        {/* Your Teams */}
        {yourTeams.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6">Your Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yourTeams.map((t) => (
                <TeamCard key={t.id} team={t} buttons={getButtons(t)} />
              ))}
            </div>
          </section>
        )}

        {/* Search bar */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Search Teams</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search by team name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-white text-black outline-none mb-4"
            /> </div>
        </section>

        {/* Filter buttons + 4️⃣ Filtered teams */}
        <section>
          <div className="flex gap-2 mb-6">
            {[
              { key: "all", label: "All Teams" },
              // { key: "joined", label: "Joined Teams" },
              { key: "available", label: "Available Teams" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-6 py-2 rounded-lg font-bold ${activeFilter === filter.key
                  ? "bg-red-500 text-white"
                  : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((t) => (
              <TeamCard key={t.id} team={t} buttons={getButtons(t)} />
            ))}
          </div>
        </section>
      </main>

      <LeaveTeamModal
        isOpen={isLeaveModalOpen}
        teamName={teams.find((t) => t.id === selectedTeamId)?.name}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={() => handleLeave(selectedTeamId)}
      />

      <Footer />
    </div>
  );
};

export default Teams;