import React from "react";
import { FaUser } from "react-icons/fa";

const TeamCard = ({ team, buttons }) => {
  const {
    name,
    sport,
    joining_type,
    current_players,
    max_players,
    min_age,
    location,
    joined,
  } = team;

  const participants =
    current_players != null && max_players != null
      ? `${current_players} / ${max_players}`
      : "N/A";

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white relative">
      {/* Joined badge */}
      {joined && (
        <span className="absolute top-2 right-2 bg-green-500 text-black px-2 py-1 rounded text-xs font-bold">
          Joined
        </span>
      )}

      <h3 className="text-lg font-bold mb-1">{name || "No Name"}</h3>

      <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-2">
        <div>
          <span className="block text-gray-400">Type</span>
          <p>{sport || "N/A"}</p>
        </div>
        <div>
          <span className="block text-gray-400">Joining Type</span>
          <p>{joining_type || "N/A"}</p>
        </div>
        <div>
          <span className="block text-gray-400">Number of Members</span>
          <p>{participants}</p>
        </div>
        <div>
          <span className="block text-gray-400">Age Requirement</span>
          <p>{min_age ?? "N/A"}</p>
        </div>
        <div className="col-span-2">
          <span className="block text-gray-400">Location</span>
          <p>{location || "Unknown"}</p>
        </div>
      </div>

      {/* Buttons */}
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

export default TeamCard;
