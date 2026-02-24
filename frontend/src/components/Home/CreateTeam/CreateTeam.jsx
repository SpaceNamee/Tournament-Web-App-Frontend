import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer";

const CreateTeam = () => {
  const navigate = useNavigate();
  /* -------------------- BASIC INFORMATION -------------------- */
  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("Basketball");
  const [openUntil, setOpenUntil] = useState("");

  /* -------------------- PARTICIPANT DETAILS -------------------- */
  const [ageRequirement, setAgeRequirement] = useState("");
  const [numberOfPeopleInTeam, setNumberOfPeopleInTeam] = useState("");
  const [joiningType, setJoiningType] = useState("Manual");
  const [password, setPassword] = useState("");
  const [participantNames, setParticipantNames] = useState(""); // For Manual joining

  /* -------------------- ADDITIONAL INFORMATION -------------------- */
  const [rules, setRules] = useState("");
  const [location, setLocation] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [organizerPhone, setOrganizerPhone] = useState("");

  /* -------------------- HANDLERS -------------------- */
  const handleSaveDraft = () => {
    alert("Draft saved! (Not connected to backend yet)");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      setTeamName("");
      setSport("Basketball");
      setOpenUntil("");
      setAgeRequirement("");
      setNumberOfPeopleInTeam("");
      setJoiningType("Manual");
      setPassword("");
      setParticipantNames("");
      setRules("");
      setLocation("");
      setOrganizerEmail("");
      setOrganizerPhone("");
    }
  };

const handleCreateTeam = async () => {
  const teamData = {
    name: teamName,
    sport: sport.toLowerCase(), 
    visibility: "visible", 
    max_players: parseInt(numberOfPeopleInTeam),
    min_age: parseInt(ageRequirement) || 0,
    location: "Portugal", 
    created_by: parseInt(localStorage.getItem("user_id")), 
    max_players_in_team: parseInt(numberOfPeopleInTeam),
    organizer_contact: organizerEmail,
    hashed_password: password || null
  };

  try {
    await axios.post("https://tournament-web-app-backend-1.onrender.com/teams/create", teamData);
    alert("Team successfully created!");
    navigate("/teams"); 
  } catch (err) {
    console.error("Error in creating Team!", err);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white font-['Inter-Regular',_Helvetica]">

      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-4xl font-bold mb-4">Create Team</h1>

        {/* BASIC INFORMATION */}
        <section className="flex flex-col gap-6 bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            />
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            >
              <option>Basketball</option>
              <option>Football</option>
              <option>Volleyball</option>
              <option>Esports</option>
            </select>
            <input
              type="date"
              placeholder="Open Until"
              value={openUntil}
              onChange={(e) => setOpenUntil(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            />
          </div>
        </section>

        {/* PARTICIPANT DETAILS */}
        <section className="flex flex-col gap-6 bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Participant Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Age Requirement (e.g., 18+)"
              value={ageRequirement}
              onChange={(e) => setAgeRequirement(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            />
            <input
              type="number"
              placeholder="Number of People in Team"
              value={numberOfPeopleInTeam}
              onChange={(e) => setNumberOfPeopleInTeam(e.target.value)}
              className="p-3 rounded-lg bg-white text-black w-full"
            />
          </div>

          {/* Type of Joining */}
          <div className="flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Type of Joining</span>
            <div className="flex gap-4 flex-wrap">
              {["Manual", "Link", "Password", "All Users"].map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-lg ${
                    joiningType === type ? "bg-[#1F4068]" : "bg-gray-600"
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
                <span className="text-gray-400 text-sm">Participant Names</span>
                <textarea
                  placeholder="Enter participant names separated by commas"
                  value={participantNames}
                  onChange={(e) => setParticipantNames(e.target.value)}
                  className="p-3 rounded-lg bg-white text-black w-full"
                  rows={3}
                />
              </div>
            )}
            {joiningType === "Link" && (
              <div className="text-gray-300 mt-2">
                The join link is in the team details.
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
            {/* All Users: nothing extra */}
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
            onClick={handleCreateTeam}
            className="px-6 py-2 rounded-lg bg-[#e43f5a] text-white font-bold"
          >
            Create Team
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateTeam;
