import React, { useState, useEffect } from "react";
import Footer from "../Footer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const ChangeTournamentDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tournamentId = location.state?.tournament?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tournament, setTournament] = useState({
    name: "",
    organizer_contact: "",
    bracket_type: "Single Elimination",
    visibility: "visible",
    sport: "basketball",
    participant_type: "team",
    min_age: "",
    hashed_password: "",
    start_date: "",
    end_date: "",
    start_time: "",
    location: "",
    rules: "",
    team_details: { max_teams: "", players_per_team: "" },
    solo_details: { max_players: "" },
  });

  useEffect(() => {
    if (!tournamentId) return;

    axios
      .get(`http://127.0.0.1:8000/tournaments/${tournamentId}`)
      .then((res) => {
        setTournament({
          ...res.data,
          team_details: res.data.team_details || { max_teams: "", players_per_team: "" },
          solo_details: res.data.solo_details || { max_players: "" },
        });
      })
      .catch(() => alert("Failed to load tournament."))
      .finally(() => setLoading(false));
  }, [tournamentId]);

  const handleChange = (field, value) => setTournament(prev => ({ ...prev, [field]: value }));
  const handleTeamChange = (field, value) => setTournament(prev => ({ ...prev, team_details: { ...prev.team_details, [field]: value } }));
  const handleSoloChange = (field, value) => setTournament(prev => ({ ...prev, solo_details: { ...prev.solo_details, [field]: value } }));
  const handleCancel = () => navigate(-1);

  const handleSave = async () => {
    setSaving(true);

    const payload = {
      name: tournament.name,
      organizer_contact: tournament.organizer_contact,
      bracket_type: tournament.bracket_type,
      visibility: tournament.visibility,
      sport: tournament.sport,
      participant_type: tournament.participant_type,
      min_age: Number(tournament.min_age),
      hashed_password: tournament.visibility === "hidden" ? tournament.hashed_password : null,
      start_date: tournament.start_date,
      end_date: tournament.end_date,
      start_time: tournament.start_time,
      location: tournament.location,
      rules: tournament.rules,
    };

    if (tournament.participant_type === "team") {
      payload.team_details = {
        max_teams: Number(tournament.team_details.max_teams),
        players_per_team: Number(tournament.team_details.players_per_team),
      };
    }

    if (tournament.participant_type === "solo") {
      payload.solo_details = {
        max_players: Number(tournament.solo_details.max_players),
      };
    }

    try {
      await axios.put(`http://127.0.0.1:8000/tournaments/alter/${tournamentId}`, payload);
      alert("Tournament updated successfully!");
      navigate(-1);
    } catch {
      alert("Failed to update tournament.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white p-8">Loading tournament...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white font-['Inter-Regular',_Helvetica]">
      <main className="flex-1 p-8 space-y-10">
        <button onClick={handleCancel} className="px-4 py-2 rounded-lg bg-gray-600 text-white">← Back</button>
        <h1 className="text-4xl font-bold">Edit Tournament</h1>

        {/* Basic Information */}
        <section className="bg-[#000921] p-6 rounded-lg border border-gray-700 space-y-6">
          <h2 className="text-2xl font-bold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div>
              <label className="block mb-1 text-sm font-medium text-white">Tournament Name</label>
              <input type="text" value={tournament.name} onChange={e => handleChange("name", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white">Organizer Contact</label>
              <input type="text" value={tournament.organizer_contact} onChange={e => handleChange("organizer_contact", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white">Bracket Type</label>
              <select value={tournament.bracket_type} onChange={e => handleChange("bracket_type", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black">
                <option value="Single Elimination">Single Elimination</option>
                <option value="Double Elimination">Double Elimination</option>
                <option value="League">League</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white">Visibility</label>
              <select value={tournament.visibility} onChange={e => handleChange("visibility", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black">
                <option value="visible">Public</option>
                <option value="hidden">Private</option>
              </select>
            </div>

            {tournament.visibility === "hidden" && (
              <div>
                <label className="block mb-1 text-sm font-medium text-white">Password</label>
                <input type="password" value={tournament.hashed_password} onChange={e => handleChange("hashed_password", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
              </div>
            )}

            <div>
              <label className="block mb-1 text-sm font-medium text-white">Sport</label>
              <select value={tournament.sport} onChange={e => handleChange("sport", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black">
                <option value="basketball">Basketball</option>
                <option value="football">Football</option>
                <option value="volleyball">Volleyball</option>
                <option value="esports">Esports</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white">Minimum Age</label>
              <input type="number" value={tournament.min_age} onChange={e => handleChange("min_age", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white">Start Date</label>
              <input type="date" value={tournament.start_date} onChange={e => handleChange("start_date", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white">End Date</label>
              <input type="date" value={tournament.end_date} onChange={e => handleChange("end_date", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white">Start Time</label>
              <input type="time" value={tournament.start_time} onChange={e => handleChange("start_time", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white">Location</label>
              <input type="text" value={tournament.location} onChange={e => handleChange("location", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
            </div>

            <div className="col-span-full">
              <label className="block mb-1 text-sm font-medium text-white">Rules</label>
              <textarea value={tournament.rules} onChange={e => handleChange("rules", e.target.value)} rows="4" className="w-full p-3 rounded-lg bg-white text-black"/>
            </div>
          </div>
        </section>

        {/* Participants */}
        <section className="bg-[#000921] p-6 rounded-lg border border-gray-700 space-y-6">
          <h2 className="text-2xl font-bold">Participants</h2>

          <div>
            <label className="block mb-1 text-sm font-medium text-white">Participant Type</label>
            <select value={tournament.participant_type} onChange={e => handleChange("participant_type", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black">
              <option value="team">Team</option>
              <option value="solo">Solo</option>
            </select>
          </div>

          {tournament.participant_type === "team" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-white">Max Teams</label>
                <input type="number" value={tournament.team_details?.max_teams} onChange={e => handleTeamChange("max_teams", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-white">Players per Team</label>
                <input type="number" value={tournament.team_details?.players_per_team} onChange={e => handleTeamChange("players_per_team", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
              </div>
            </div>
          )}

          {tournament.participant_type === "solo" && (
            <div>
              <label className="block mb-1 text-sm font-medium text-white">Max Players</label>
              <input type="number" value={tournament.solo_details?.max_players} onChange={e => handleSoloChange("max_players", e.target.value)} className="w-full p-3 rounded-lg bg-white text-black"/>
            </div>
          )}
        </section>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button onClick={handleCancel} className="px-6 py-2 rounded-lg bg-gray-600 text-white font-bold">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 rounded-lg bg-[#e43f5a] text-white font-bold">{saving ? "Saving..." : "Save"}</button>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ChangeTournamentDetails;
