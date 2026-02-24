import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";
import TournamentCard from "./TournamentCard";
import JoinTournamentModal from "./JoinTournamentModal";
import LeaveTournamentModal from "./LeaveTournamentModal";
import { useNavigate } from "react-router-dom";

const Tournaments = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTournaments = async () => {
    try {
      const userId = parseInt(localStorage.getItem("user_id"), 10);
      if (!userId) return;

      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      };

      let joinedTournaments = [];
      try {
        const joinedRes = await axios.get(
          `https://tournament-web-app-backend-1.onrender.com/tournaments/filter/joined`,
          { headers: config.headers, params: { user_id: userId } }
        );
        joinedTournaments = joinedRes.data.data || joinedRes.data || [];
      } catch (err) {
        if (err.response?.status !== 404) console.error(err);
      }

      const allRes = await axios.get("https://tournament-web-app-backend-1.onrender.com/tournaments/all_active", config);
      const allTournaments = allRes.data.data || [];

      const tournamentsWithJoined = allTournaments.map((t) => ({
        ...t,
        title: t.name,
        joined: joinedTournaments.some((jt) => jt.id === t.id),
      }));

      setTournaments(tournamentsWithJoined);
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
      setTournaments([]);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [location.pathname]);

  const filteredTournaments = tournaments
    .filter((t) => {
      if (activeFilter === "joined") return t.joined;
      if (activeFilter === "open") {
        const now = new Date();
        const startDate = new Date(t.start_date);
        return !t.joined && startDate > now;
      }
      return true;
    })
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));


  const yourTournaments = tournaments.filter((t) => t.joined);

  const openJoinModal = (tournament) => {
    setSelectedTournament(tournament);
    setIsJoinModalOpen(true);
  };

  const openLeaveModal = (tournament) => {
    setSelectedTournament(tournament);
    setIsLeaveModalOpen(true);
  };

  const handleJoin = async (teamId = null) => {
    if (!selectedTournament) return;

    const userId = parseInt(localStorage.getItem("user_id"), 10);
    if (!userId) {
      alert("User ID not found.");
      return;
    }

    if (selectedTournament.participant_type === "team" && !teamId) {
      alert("Please select a team to join.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      };

      // O backend exige ambos para torneios de equipa
      const payload = selectedTournament.participant_type === "team"
        ? {
          tournament_id: selectedTournament.id,
          team_id: teamId,
          user_id: userId,
        }
        : {
          tournament_id: selectedTournament.id,
          user_id: userId,
        };

      console.log("JOIN PAYLOAD:", payload);

      await axios.post("https://tournament-web-app-backend-1.onrender.com/tournaments/join", payload, config);

      setTournaments(prev =>
        prev.map(t =>
          t.id === selectedTournament.id ? { ...t, joined: true } : t
        )
      );

      setIsJoinModalOpen(false);
      setSelectedTournament(null);
    } catch (error) {
      console.error("Error joining tournament:", error.response?.data || error);
      alert(error.response?.data?.detail || "Failed to join the tournament.");
    }
  };

  const handleLeave = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      };
      await axios.post(`https://tournament-web-app-backend-1.onrender.com/tournaments/${id}/leave`, {}, config);

      setTournaments((prev) =>
        prev.map((t) => (t.id === id ? { ...t, joined: false } : t))
      );
      setIsLeaveModalOpen(false);
    } catch (error) {
      console.error("Error leaving tournament:", error);
      alert("Failed to leave the tournament. Try again later.");
    }
  };

  const getButtons = (tournament) => {
    if (tournament.joined) {
      return [
        { label: "View / Edit", primary: false, onClick: () => navigate("/change-tournament-details", { state: { tournament } }) },
        //{ label: "Leave", primary: true, onClick: () => openLeaveModal(tournament) },
      ];
    } else {
      return [
        { label: "View details", primary: false, onClick: () => navigate("/tournament-details", { state: { tournament } }) },
        { label: "Join", primary: true, onClick: () => openJoinModal(tournament) },
      ];
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white font-['Inter-Regular',_Helvetica]">
      <main className="flex-1 p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Tournaments</h1>
          <p className="text-gray-400">Create, browse and register for tournaments</p>
        </header>

        {/* YOUR TOURNAMENTS */}
        {yourTournaments.length > 0 && (
          <section className="mb-14">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Your Tournaments</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yourTournaments.map((t) => (
                <TournamentCard key={t.id} tournament={t} buttons={getButtons(t, true)} />
              ))}
            </div>
          </section>
        )}

        {/* SEARCH & FILTER */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Search Tournament</h2>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-white text-black outline-none"
              />
            </div>

            <div className="flex gap-2">
              {[
                { key: "all", label: "All tournaments" },
                //{ key: "joined", label: "Joined tournaments" },
                { key: "open", label: "Open tournaments" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-6 py-2 rounded-lg font-bold text-sm ${activeFilter === filter.key
                    ? "bg-[#e43f5a] text-white"
                    : "bg-[#111827] text-gray-400 border border-gray-800"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* TOURNAMENT RESULTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} buttons={getButtons(t, t.joined)} />
            ))}
          </div>
        </section>
      </main>

      {/* MODALS */}
      <JoinTournamentModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoin}
        tournament={selectedTournament}
      />
      <LeaveTournamentModal
        isOpen={isLeaveModalOpen}
        tournament={selectedTournament}
        tournamentName={selectedTournament?.title}
        onClose={() => setIsLeaveModalOpen(false)}
        onLeaveSuccess={(id) =>
          setTournaments(prev =>
            prev.map(t => t.id === id ? { ...t, joined: false } : t)
          )
        }
      />


      <Footer />
    </div>
  );
};

export default Tournaments;
