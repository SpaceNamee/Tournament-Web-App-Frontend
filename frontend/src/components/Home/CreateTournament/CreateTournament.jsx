import React, { useState } from "react";
import axios from "axios";
import Footer from "../Footer";

const CreateTournament = () => {
  /* -------------------- BASIC INFORMATION -------------------- */
  const [tournamentName, setTournamentName] = useState("");
  const [format, setFormat] = useState("Double Elimination");
  const [sport, setSport] = useState("Basketball");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");

  /* -------------------- PARTICIPANT DETAILS -------------------- */
  const [participantType, setParticipantType] = useState("Teams"); // Teams / Solo
  const [numberOfTeams, setNumberOfTeams] = useState(""); // Max Teams
  const [numberOfPeoplePerTeam, setNumberOfPeoplePerTeam] = useState(""); // Max Players per Team
  const [ageRequirement, setAgeRequirement] = useState("");
  const [teamNames, setTeamNames] = useState(""); // textarea
  const [joiningType, setJoiningType] = useState("Manual"); // Manual / Link / Password / All Users
  const [password, setPassword] = useState(""); // for Password joining type

  /* -------------------- ADDITIONAL INFORMATION -------------------- */
  const [rules, setRules] = useState("");
  const [location, setLocation] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [organizerPhone, setOrganizerPhone] = useState("");
  const userId = localStorage.getItem("user_id");

  /* -------------------- HANDLERS -------------------- */
  const handleSaveDraft = () => {
    alert("Draft saved! (Not connected to backend yet)");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      setTournamentName("");
      setFormat("Double Elimination");
      setSport("Basketball");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setParticipantType("Teams");
      setNumberOfTeams("");
      setNumberOfPeoplePerTeam("");
      setAgeRequirement("");
      setTeamNames("");
      setJoiningType("Manual");
      setPassword("");
      setRules("");
      setLocation("");
      setOrganizerEmail("");
      setOrganizerPhone("");
    }
  };

const handleCreateTournament = async () => {
  try {
    /* ---------- SAFE NUMBERS ---------- */
    const safeTeams = Math.max(2, Number(numberOfTeams) || 2);
    const safePlayers = Math.max(2, Number(numberOfPeoplePerTeam) || 2);

    /* ---------- VALIDATION (FRONTEND) ---------- */
    if (participantType === "Teams") {
      if (safeTeams < 2) {
        alert("Number of teams must be at least 2");
        return;
      }
      if (safePlayers < 2) {
        alert("Players per team must be at least 2");
        return;
      }
      if (joiningType === "Manual" && !teamNames.trim()) {
        alert("Please enter team names separated by commas");
        return;
      }
    }

    /* ---------- TEAM NAMES ARRAY ---------- */
    const teamsArray =
      participantType === "Teams"
        ? joiningType === "Manual"
          ? teamNames.split(",").map((t) => t.trim()).filter(Boolean)
          : Array.from({ length: safeTeams }, (_, i) => `Team ${i + 1}`) 
        : [];

    /* ---------- PAYLOAD ---------- */
    const payload = {
      name: tournamentName,
      sport: sport.toLowerCase(),
      bracket_type: format,
      visibility: "visible",
      participant_type: participantType === "Teams" ? "team" : "solo",

      max_teams: participantType === "Teams" ? safeTeams : null,
      number_of_teams: participantType === "Teams" ? safeTeams : null,
      number_of_player_in_teams: participantType === "Teams" ? safePlayers : null,

      min_age: ageRequirement ? Number(ageRequirement) : null,
      start_date: startDate,

      location: location,

      created_by: Number(userId),
      organizer_contact: organizerEmail,

  ...(participantType === "Teams"
    ? {
        team_details: {
          max_teams: safeTeams,
          players_per_team: safePlayers,
          teams: teamsArray, 
        },
      }
    : {
        solo_details: {
          max_players: safePlayers,
        },
      }),
};

    /* ---------- API CALL ---------- */
    const response = await axios.post(
      "https://tournament-web-app-backend-1.onrender.com/tournaments/create",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    alert("Tournament created successfully!");
    console.log("SUCCESS:", response.data);

  } catch (error) {
    console.error("BACKEND ERROR:", error.response?.data);
    alert(JSON.stringify(error.response?.data, null, 2));
  }
};


  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white font-['Inter-Regular',_Helvetica]">

      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-4xl font-bold mb-4">Create Tournament</h1>

        {/* BASIC INFORMATION */}
        <section className="flex flex-col gap-6 bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Tournament Name"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            />
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            >
              <option>Double Elimination</option>
              <option>Single Elimination</option>
              <option>Group</option>
            </select>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            >
              <option>Basketball</option>
              <option>Football</option>
              <option>Tennis</option>
            </select>
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            />
            <input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            />
            <input
              type="time"
              placeholder="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            />
          </div>
        </section>

        {/* PARTICIPANT DETAILS */}
        <section className="flex flex-col gap-6 bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Participant Details</h2>

          {/* Participant Type */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-gray-400 text-sm">Participant Type</span>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded-lg ${participantType === "Teams" ? "bg-[#1F4068]" : "bg-gray-600"
                    }`}
                  onClick={() => setParticipantType("Teams")}
                >
                  Teams
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${participantType === "Solo" ? "bg-[#1F4068]" : "bg-gray-600"
                    }`}
                  onClick={() => setParticipantType("Solo")}
                >
                  Solo
                </button>
              </div>
            </div>

            {/* Number of Teams */}
            {participantType === "Teams" && (
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-gray-400 text-sm">Number of Teams</span>
                <input
                  type="number"
                  placeholder="Max Teams"
                  value={numberOfTeams}
                  onChange={(e) => setNumberOfTeams(e.target.value)}
                  className="p-3 rounded-lg bg-white text-black w-full"
                />
              </div>
            )}

            {/* Number of People per Team */}
            {participantType === "Teams" && (
              <div className="flex flex-col gap-2 flex-1">
                <span className="text-gray-400 text-sm">Number of People per Team</span>
                <input
                  type="number"
                  placeholder="Max Players per Team"
                  value={numberOfPeoplePerTeam}
                  onChange={(e) => setNumberOfPeoplePerTeam(e.target.value)}
                  className="p-3 rounded-lg bg-white text-black w-full"
                />
              </div>
            )}

            {/* Age Requirement */}
            <div className="flex flex-col gap-2 flex-1">
              <span className="text-gray-400 text-sm">Age Requirement</span>
              <input
                type="text"
                placeholder="e.g. 18+"
                value={ageRequirement}
                onChange={(e) => setAgeRequirement(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
          </div>

          {/* Type of Joining */}
          <div className="flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Type of Joining</span>
            <div className="flex gap-4 flex-wrap">
              {["Manual", "Link", "Password", "All Users"].map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-lg ${joiningType === type ? "bg-[#1F4068]" : "bg-gray-600"
                    }`}
                  onClick={() => setJoiningType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Conditional fields */}
            {joiningType === "Manual" && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-gray-400 text-sm">
                  {participantType === "Teams" ? "Teams Names" : "Participant Names"}
                </span>
                <textarea
                  placeholder={`Enter ${participantType === "Teams" ? "team" : "participant"} names separated by commas`}
                  value={teamNames}
                  onChange={(e) => setTeamNames(e.target.value)}
                  className="p-3 rounded-lg bg-white text-black w-full"
                  rows={3}
                />
              </div>
            )}

            {joiningType === "Link" && (
              <div className="text-gray-300 mt-2">
                The join link is in the tournament details.
              </div>
            )}

            {joiningType === "Password" && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-gray-400 text-sm">Password</span>
                <input
                  type="text"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-3 rounded-lg bg-white text-black w-full"
                />
              </div>
            )}
          </div>
        </section>

        {/* ADDITIONAL INFORMATION */}
        <section className="flex flex-col gap-6 bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Additional Information</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Rules & Regulations</span>
              <textarea
                placeholder="Enter rules & regulations..."
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
                rows={4}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Location</span>
              <input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Organizer Contact Email</span>
              <input
                type="email"
                placeholder="Enter email"
                value={organizerEmail}
                onChange={(e) => setOrganizerEmail(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Organizer Contact Phone Number</span>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={organizerPhone}
                onChange={(e) => setOrganizerPhone(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
          </div>
        </section>

        {/* BUTTONS */}
        <div className="flex gap-4 justify-end mt-4">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-lg bg-gray-600 text-white font-bold"
          >
            Cancel
          </button>
          {/*
          <button
            onClick={handleSaveDraft}
            className="px-6 py-2 rounded-lg bg-yellow-500 text-black font-bold"
          >
            Save as Draft
          </button>*/}
          <button
            onClick={handleCreateTournament}
            className="px-6 py-2 rounded-lg bg-[#e43f5a] text-white font-bold"
          >
            Create Tournament
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateTournament;
