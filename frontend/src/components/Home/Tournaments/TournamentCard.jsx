import React from "react";

const TournamentCard = ({ tournament, buttons }) => {
  const {
    name,
    bracket_type,
    participant_type,
    team_details,
    solo_details,
    min_age,
    start_date,
    end_date,
    start_time,
    location,
    joined, 
  } = tournament;

  const status = tournament.status || "Open";
  const format = bracket_type || "Unknown";
  const type = participant_type === "team" ? "Teams" : "Solo";

  let participants = "N/A";
  if (participant_type === "team" && team_details) {
    const currentTeams = team_details.current_teams ?? 0; // nome real da coluna
    const maxTeams = team_details.max_teams ?? 0;
    participants = `${currentTeams}/${maxTeams}`;
  } else if (participant_type === "solo" && solo_details) {
    const currentPlayers = solo_details.current_players ?? 0; // nome real da coluna
    const maxPlayers = solo_details.max_players ?? 0;
    participants = `${currentPlayers}/${maxPlayers}`;
  }

  const displayLocation = location || "Unknown";

  const dates = start_date
    ? end_date && end_date !== start_date
      ? `${start_date} - ${end_date}`
      : `${start_date}`
    : "N/A";

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white relative">
      {/* BADGE JOINED */}
      {joined && (
        <span className="absolute top-2 right-2 bg-green-500 text-black px-2 py-1 rounded text-xs font-bold">
          Joined
        </span>
      )}

      <h3 className="text-lg font-bold mb-1">{name || "No Title"}</h3>
      <p>Status: {status}</p>
      <p>Format: {format}</p>
      <p>Type: {type}</p>
      <p>Location: {displayLocation}</p>
      <p>Number of Teams: {participants}</p>
      <p>Min Age: {min_age ?? "N/A"}</p>
      <p>Dates: {dates}</p>

      <div className="mt-2 flex gap-2 flex-wrap">
        {buttons?.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className={`px-2 py-1 rounded ${
              btn.primary ? "bg-red-500 text-white" : "bg-gray-600 text-white"
            } min-w-[80px]`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TournamentCard;
