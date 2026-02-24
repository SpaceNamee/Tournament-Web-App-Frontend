import React, { useState } from "react";

const logos = [
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/40xkFy1bKy/0pmov5km_expires_30_days.png",
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/40xkFy1bKy/s559w4ue_expires_30_days.png",
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/40xkFy1bKy/d9sizxlz_expires_30_days.png",
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/40xkFy1bKy/b5y67m48_expires_30_days.png",
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/40xkFy1bKy/hyd5xgqa_expires_30_days.png",
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/40xkFy1bKy/erdek75f_expires_30_days.png",
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/40xkFy1bKy/sumny9pt_expires_30_days.png",
  "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/40xkFy1bKy/ubf52thc_expires_30_days.png"
];

const TeamSettingsLogo = ({ currentLogo, onSave, onCancel }) => {
  const [selectedLogo, setSelectedLogo] = useState(currentLogo);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] p-8 text-white">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={currentLogo}
          alt="Current Team Logo"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">The Eagles</h1>
          <p className="text-gray-300 text-base">3 Members • Public</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Choose a new logo</h2>

      <div className="grid grid-cols-6 gap-4 mb-6">
        {logos.map((logo, index) => (
          <button
            key={index}
            onClick={() => setSelectedLogo(logo)}
            className={`p-2 rounded-full border-4 ${
              selectedLogo === logo ? "border-blue-500" : "border-transparent"
            }`}
          >
            <img
              src={logo}
              alt={`Logo ${index + 1}`}
              className="w-16 h-16 object-cover rounded-full"
            />
          </button>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-600 py-2 px-6 rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(selectedLogo)}
          className="bg-[#1F4068] py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TeamSettingsLogo;
