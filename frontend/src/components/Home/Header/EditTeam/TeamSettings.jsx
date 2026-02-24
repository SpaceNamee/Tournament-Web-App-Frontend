import React, { useState } from "react";
import Footer from "../../Footer";
import avatarPlaceholder from "../../../../assets/1-1.png";
import ChangeLogoScreen from "./TeamSettingsLogo";

const TeamSettings = () => {
  const [logo, setLogo] = useState(avatarPlaceholder); 
  const [showChangeLogo, setShowChangeLogo] = useState(false);
  const handleCancel = () => alert("Cancel pressed!");
  const handleSave = () => alert("Save pressed!");
  const handleArchive = () => alert("Archive pressed!");
  const handleDisband = () => alert("Disband pressed!");
  const handleChangeLogo = () => setShowChangeLogo(true); 
  const handleLogoSave = (newLogo) => {
    setLogo(newLogo);      
    setShowChangeLogo(false); 
  };

  const handleLogoCancel = () => setShowChangeLogo(false);
  if (showChangeLogo) {
    return (
      <ChangeLogoScreen
        currentLogo={logo}
        onSave={handleLogoSave}
        onCancel={handleLogoCancel}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0e1a] text-white">

      <main className="flex-1 p-8 flex flex-col items-center gap-8">
        {/* TEAM HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src={logo} 
            alt="Team Logo"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">The Eagles</h1>
            <p className="text-gray-300 text-base">3 Members • Public</p>
          </div>
        </div>

        {/* GENERAL SETTINGS */}
        <div className="bg-[#111827] rounded-xl p-6 w-full max-w-4xl flex flex-col gap-6 border border-gray-800">
          <h2 className="text-xl font-bold mb-4">General Settings</h2>

          {/* TEAM NAME */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-white">Team Name</span>
            <input
              type="text"
              defaultValue="The Eagles"
              className="bg-white text-black px-3 py-2 rounded-lg border border-gray-300 outline-none"
            />
          </div>

          {/* TEAM LOGO */}
          <div className="flex flex-col gap-2">
            <span className="text-sm text-white">Team Logo</span>
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Team Logo"
                className="w-16 h-16 rounded-full object-cover"
              />
              <button
                className="bg-white text-black px-4 py-2 rounded-lg border border-gray-300"
                onClick={handleChangeLogo}
              >
                Change Logo
              </button>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4 w-full max-w-4xl justify-end">
          <button
            className="bg-gray-600 py-2 px-6 rounded-lg hover:bg-gray-500 transition"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-[#1F4068] py-2 px-6 rounded-lg hover:bg-blue-700 transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-[#1F4068] p-6 rounded-xl border border-red-500 w-full max-w-4xl flex flex-col gap-4">
          <h2 className="text-red-600 text-lg font-bold">Danger Zone</h2>
          <p className="text-sm text-gray-300">
            These actions are irreversible. Please proceed with caution.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center bg-[#111827] p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="text-white font-medium">Archive Team</span>
                <span className="text-gray-300 text-sm">
                  Archive the team. It will be hidden but can be restored later.
                </span>
              </div>
              <button
                className="bg-white text-gray-700 px-4 py-2 rounded-lg"
                onClick={handleArchive}
              >
                Archive Team
              </button>
            </div>

            <div className="flex justify-between items-center bg-[#111827] p-4 rounded-lg">
              <div className="flex flex-col">
                <span className="text-red-600 font-medium">Disband Team</span>
                <span className="text-gray-300 text-sm">
                  Permanently delete the team and all of its data.
                </span>
              </div>
              <button
                className="bg-red-600 text-black px-4 py-2 rounded-lg"
                onClick={handleDisband}
              >
                Disband Team
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeamSettings;
