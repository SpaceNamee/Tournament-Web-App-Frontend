import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../Footer";

const ViewTournamentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tournamentId = location.state?.tournament?.id;

  const [tournament, setTournament] = useState(null);
  const [organizer, setOrganizer] = useState({});
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = parseInt(localStorage.getItem("user_id"), 10);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        };

        // ✅ Buscar detalhes corretos
        const { data: tournamentRes } = await axios.get(
          `https://tournament-web-app-backend-1.onrender.com/tournaments/${tournamentId}`,
          config
        );

        setTournament(tournamentRes);

        // Buscar organizer
        if (tournamentRes.created_by) {
          const { data: organizerRes } = await axios.get(
            `https://tournament-web-app-backend-1.onrender.com/users/${tournamentRes.created_by}`,
            config
          );
          setOrganizer(organizerRes);
        }

        setJoined(tournamentRes.joined ?? false);
      } catch (err) {
        console.error("Failed to fetch tournament details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (tournamentId) fetchTournament();
  }, [tournamentId]);

  if (loading)
    return <p className="p-8 text-white">Loading tournament details...</p>;

  if (!tournament)
    return <p className="p-8 text-white">Tournament not found</p>;

  // 🔹 Normalização
  const type = tournament.participant_type || "-";
  const startDate = tournament.start_date ?? "-";
  const endDate = tournament.end_date ?? "-";
  const dates =
    startDate && endDate ? `${startDate} - ${endDate}` : "-";
  const minAge = tournament.min_age ?? "-";

  const participants =
    tournament.participant_type === "team"
      ? `${tournament.current_teams ?? 0}/${tournament.max_teams ?? 0}`
      : `${tournament.current_players ?? 0}/${tournament.max_players ?? 0}`;

  const rules = tournament.rules ?? "No rules specified.";
  const locationName = tournament.location ?? "-";

  const organizerName = organizer.name ?? "-";
  const organizerEmail = organizer.email ?? "-";

  const handleBack = () => navigate(-1);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white font-['Inter-Regular',_Helvetica]">
      <main className="flex-1 p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-lg bg-gray-600 text-white"
          >
            ← Back
          </button>
          <h1 className="text-5xl font-bold">
            {tournament.name}
          </h1>
        </div>

        {/* Key Details */}
        <section className="bg-[#000921] p-6 rounded-lg border border-gray-400 space-y-4">
          <h2 className="text-2xl font-bold">Key Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-400 text-sm">Type</span>
              <p>{type}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Match Schedule</span>
              <p>{dates}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Start Date</span>
              <p>{startDate}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">End Date</span>
              <p>{endDate}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Age Requirement</span>
              <p>{minAge}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">
                Number of Players / Teams
              </span>
              <p>{participants}</p>
            </div>
          </div>
        </section>

        {/* Rules */}
        <section className="bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-2xl font-bold mb-2">
            Rules & Regulations
          </h2>
          <p>{rules}</p>
        </section>

        {/* Location */}
        <section className="bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-2xl font-bold mb-2">Location</h2>
          <p>{locationName}</p>

          {locationName !== "-" && (
            <iframe
              title="map"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                locationName
              )}&output=embed`}
              className="w-full h-48 rounded-lg border-0 mt-4"
              allowFullScreen
            />
          )}
        </section>

        {/* Organizer */}
        <section className="bg-[#000921] p-6 rounded-lg border border-gray-400 space-y-2">
          <h2 className="text-2xl font-bold">Organizer</h2>
          <p>
            <span className="text-gray-400">Name:</span>{" "}
            {organizerName}
          </p>
          <p>
            <span className="text-gray-400">Email:</span>{" "}
            {organizerEmail}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ViewTournamentDetails;
