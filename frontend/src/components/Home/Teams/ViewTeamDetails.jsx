import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../Footer";
import { FaUser } from "react-icons/fa";

const ViewTeamDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const teamState = location.state?.team;

  const [team, setTeam] = useState(teamState || {});
  const [creator, setCreator] = useState({ name: "Unknown", email: "Unknown" });
  const [loading, setLoading] = useState(!teamState);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);

        // Se não temos todos os dados da equipa, buscar do backend
        const res = await axios.get(`https://tournament-web-app-backend-1.onrender.com/teams/${teamState?.id || team.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const teamData = res.data;
        setTeam(teamData);

        // Buscar info do criador se não formos membros
        if (!teamData.joined) {
          const creatorRes = await axios.get(
            `https://tournament-web-app-backend-1.onrender.com/users/${teamData.created_by}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );

          setCreator({
            name: creatorRes.data.name || "Unknown",
            email: creatorRes.data.email || "Unknown",
          });
        } else {
          // Se formos membros, podemos mostrar os dados diretamente
          setCreator({
            name: teamData.organizer_name || "Unknown",
            email: teamData.organizer_contact || "Unknown",
          });
        }
      } catch (err) {
        console.error("Failed to fetch team details:", err);
        alert("Failed to fetch team details.");
        navigate("/teams");
      } finally {
        setLoading(false);
      }
    };

    if (!teamState || !teamState.name) {
      fetchTeam();
    } else {
      // Se temos o estado da rota completo, já podemos buscar o criador
      if (!teamState.joined) {
        axios
          .get(`https://tournament-web-app-backend-1.onrender.com/users/${teamState.created_by}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
          .then((res) => setCreator({ name: res.data.name, email: res.data.email }))
          .catch(() => setCreator({ name: "Unknown", email: "Unknown" }));
      } else {
        setCreator({
          name: teamState.organizer_name || "Unknown",
          email: teamState.organizer_contact || "Unknown",
        });
      }
      setTeam(teamState);
      setLoading(false);
    }
  }, [teamState, team.id, navigate]);

  const handleJoin = async () => {
    try {
      const userId = localStorage.getItem("user_id");
      await axios.post(
        "https://tournament-web-app-backend-1.onrender.com/teams/join",
        { team_id: team.id, user_id: parseInt(userId), password: "" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
      alert("Joined successfully!");
      navigate("/teams");
    } catch (err) {
      console.error("Error joining team:", err);
      alert(err.response?.data?.detail || "Failed to join team");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white items-center justify-center">
        <p>Loading team details...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white font-['Inter-Regular',_Helvetica]">
      <main className="flex-1 p-8 space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 rounded-lg bg-gray-600 text-white"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-6">{team.name}</h1>

        {/* Key Details */}
        <section className="bg-[#000921] p-6 rounded-lg border border-gray-400 space-y-3">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Key Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-400 text-sm">Type</span>
              <p>{team.sport}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Joining Type</span>
              <p>{team.joining_type || "Manual"}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Number of Members</span>
              <p>
                {team.current_players || 0} / {team.max_players || 0}
              </p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Age Requirement</span>
              <p>{team.min_age || "N/A"}</p>
            </div>
          </div>
        </section>

        {/* Rules */}
        {team.rules && (
          <section className="bg-[#000921] p-6 rounded-lg border border-gray-400">
            <h2 className="text-xl font-bold text-[#E7E7E7]">Rules & Regulations</h2>
            <p className="text-gray-300 mt-2">{team.rules}</p>
          </section>
        )}

        {/* Join Button */}
        {!team.joined && (
          <section className="bg-[#000921] p-6 rounded-lg border border-gray-400">
            <button
              onClick={handleJoin}
              className="px-6 py-2 rounded-lg bg-[#e43f5a] text-white font-bold"
            >
              Join Team
            </button>
          </section>
        )}

        {/* Location & Map */}
        <section className="bg-[#000921] p-6 rounded-lg border border-gray-400 space-y-3">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Location</h2>
          <p className="text-gray-300 mt-2">{team.location}</p>
          {team.location && (
            <iframe
              title="team-location-map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                team.location
              )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-64 mt-3 rounded-lg border-0"
              allowFullScreen
              loading="lazy"
            ></iframe>
          )}
        </section>

        {/* Participants */}
        {team.participantsList?.length > 0 && (
          <section className="bg-[#000921] p-6 rounded-lg border border-gray-400">
            <h2 className="text-xl font-bold text-[#E7E7E7]">Participants</h2>
            <div className="flex flex-wrap gap-4 mt-3">
              {team.participantsList.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#111827] px-3 py-2 rounded-lg">
                  <FaUser />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Organizer */}
        <section className="bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Organizer</h2>
          <p className="text-gray-300 mt-1">Name: {creator.name}</p>
          <p className="text-gray-300 mt-1">Email: {creator.email}</p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ViewTeamDetails;
