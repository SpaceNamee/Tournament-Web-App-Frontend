import React, { useState } from "react";
import axios from "axios";

const LeaveTournamentModal = ({
  isOpen,
  onClose,
  tournament,
  userTeams = [], // lista de equipas do user no torneio
  onLeaveSuccess,
}) => {
  const [step, setStep] = useState("manage");
  const [leaving, setLeaving] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(
    userTeams.length === 1 ? userTeams[0].team_id : null
  );

  if (!isOpen) return null;

  const userId = parseInt(localStorage.getItem("user_id"), 10);

  const handleClose = () => {
    setStep("manage");
    onClose();
  };

  const handleConfirmLeave = async () => {
    if (!tournament || !userId) {
      console.warn("Missing tournament or userId");
      return;
    }

    // Para torneios de equipa, é obrigatório escolher team_id
    if (tournament.participant_type === "team" && !selectedTeamId) {
      alert("Please select a team to leave.");
      return;
    }

    setLeaving(true);

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      };

      const payload =
        tournament.participant_type === "team"
          ? { tournament_id: tournament.id, user_id: userId, team_id: selectedTeamId }
          : { tournament_id: tournament.id, user_id: userId };

      await axios.post("https://tournament-web-app-backend-1.onrender.com/tournaments/leave", payload, config);

      onLeaveSuccess?.(tournament.id);
      handleClose();
    } catch (error) {
      console.error("Failed to leave tournament:", error.response?.data || error);
      alert(error.response?.data?.detail || "Failed to leave the tournament.");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-black text-center">
        {step === "manage" && (
          <>
            <h2 className="text-xl font-bold mb-2">Manage Participation</h2>
            <p className="mb-4">
              You are registered in <br />
              <strong>{tournament?.name}</strong>
            </p>

            {tournament.participant_type === "team" && userTeams.length > 1 && (
              <select
                className="w-full p-2 border rounded mb-4"
                value={selectedTeamId || ""}
                onChange={(e) => setSelectedTeamId(parseInt(e.target.value, 10))}
              >
                <option value="" disabled>
                  Select a team
                </option>
                {userTeams.map((team) => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setStep("confirm")}
              className="w-full py-3 bg-[#e43f5a] text-white rounded-lg font-bold"
            >
              Leave Tournament
            </button>
          </>
        )}

        {step === "confirm" && (
          <>
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-6 text-sm">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("manage")}
                className="flex-1 border py-2 rounded-lg"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmLeave}
                disabled={leaving}
                className="flex-1 bg-[#1f4068] text-white py-2 rounded-lg"
              >
                {leaving ? "Leaving..." : "Yes, Leave"}
              </button>
            </div>
          </>
        )}

        <button
          onClick={handleClose}
          className="mt-6 text-sm underline text-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LeaveTournamentModal;
