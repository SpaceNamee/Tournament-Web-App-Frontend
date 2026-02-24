import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Footer from "../Footer";

const CreateEditTeamDetails = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const team = routerLocation.state?.team || null; // se existir, é edição

  // -------------------- STATES --------------------
  const [teamName, setTeamName] = useState("");
  const [sport, setSport] = useState("basketball");
  const [numberOfPeopleInTeam, setNumberOfPeopleInTeam] = useState("");
  const [ageRequirement, setAgeRequirement] = useState("");
  const [rules, setRules] = useState("");
  const [location, setLocation] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [organizerPhone, setOrganizerPhone] = useState("");
  const [password, setPassword] = useState("");
  const [openUntil, setOpenUntil] = useState("");
  const [joiningType, setJoiningType] = useState("Manual");
  const [participantNames, setParticipantNames] = useState("");

  // -------------------- LOAD TEAM DATA --------------------
  useEffect(() => {
    if (team) {
      setTeamName(team.name || "");
      setSport(team.sport || "basketball");
      setNumberOfPeopleInTeam(team.max_players || "");
      setAgeRequirement(team.min_age || "");
      setRules(team.rules || "");
      setLocation(team.location || "");
      setOrganizerEmail(team.organizer_contact || "");
      setOrganizerPhone(team.organizer_phone || "");
      setPassword(""); // não popular senha por segurança
      setOpenUntil(team.open_until || "");
      setJoiningType(team.joining_type || "Manual");
      setParticipantNames((team.participantsList || []).join(", "));
    }
  }, [team]);

  // -------------------- HANDLERS --------------------
  const handleSave = async () => {
    try {
      const payload = {
        name: teamName,
        sport: sport.toLowerCase(),
        max_players: parseInt(numberOfPeopleInTeam),
        min_age: parseInt(ageRequirement) || 0,
        rules,
        location,
        organizer_contact: organizerEmail,
        organizer_phone: organizerPhone,
        ...(password && { hashed_password: password }),
        joining_type: joiningType,
        participantsList: participantNames.split(",").map((p) => p.trim()),
      };

      if (team) {
        // editar
        await axios.patch(`http://127.0.0.1:8000/teams/alter/${team.id}`, payload);
        alert("Team updated successfully!");
      } else {
        // criar
        const userId = localStorage.getItem("user_id");
        await axios.post("http://127.0.0.1:8000/teams/create", {
          ...payload,
          created_by: parseInt(userId),
          visibility: "visible",
        });
        alert("Team created successfully!");
      }
      navigate("/teams");
    } catch (err) {
      console.error("Error saving team:", err);
      alert(err.response?.data?.detail || "Failed to save team");
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All changes will be lost.")) {
      navigate("/teams");
    }
  };

  // -------------------- RENDER --------------------
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white font-['Inter-Regular',_Helvetica]">
      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-4xl font-bold mb-4">{team ? "Edit Team" : "Create Team"}</h1>

        {/* BASIC INFORMATION */}
        <section className="flex flex-col gap-6 bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Team Name</span>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Sport</span>
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
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Open Until</span>
              <input
                type="date"
                value={openUntil}
                onChange={(e) => setOpenUntil(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
          </div>
        </section>

        {/* PARTICIPANT DETAILS */}
        <section className="flex flex-col gap-6 bg-[#000921] p-6 rounded-lg border border-gray-400">
          <h2 className="text-xl font-bold text-[#E7E7E7]">Participant Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Age Requirement</span>
              <input
                type="number"
                value={ageRequirement}
                onChange={(e) => setAgeRequirement(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Number of People in Team</span>
              <input
                type="number"
                value={numberOfPeopleInTeam}
                onChange={(e) => setNumberOfPeopleInTeam(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-gray-400 text-sm">Type of Joining</span>
            <div className="flex gap-4 flex-wrap">
              {["Manual", "Link", "Password", "All Users"].map((type) => (
                <button
                  key={type}
                  className={`px-4 py-2 rounded-lg ${joiningType === type ? "bg-[#1F4068]" : "bg-gray-600"}`}
                  onClick={() => setJoiningType(type)}
                >
                  {type}
                </button>
              ))}
            </div>

            {joiningType === "Manual" && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-gray-400 text-sm">Participant Names</span>
                <textarea
                  value={participantNames}
                  onChange={(e) => setParticipantNames(e.target.value)}
                  className="p-3 rounded-lg bg-white text-black w-full"
                  rows={3}
                />
              </div>
            )}

            {joiningType === "Password" && (
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-gray-400 text-sm">Password</span>
                <input
                  type="text"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Rules & Regulations</span>
              <textarea
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Organizer Contact Email</span>
              <input
                type="email"
                value={organizerEmail}
                onChange={(e) => setOrganizerEmail(e.target.value)}
                className="p-3 rounded-lg bg-white text-black w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-sm">Organizer Contact Phone</span>
              <input
                type="tel"
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
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-[#e43f5a] text-white font-bold"
          >
            {team ? "Update Team" : "Create Team"}
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateEditTeamDetails;
