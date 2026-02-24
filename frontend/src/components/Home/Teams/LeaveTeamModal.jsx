import React, { useState } from "react";

const LeaveTeamModal = ({ isOpen, onClose, onConfirm, teamName }) => {
  const [step, setStep] = useState("manage");

  if (!isOpen) return null;

  const handleClose = () => {
    setStep("manage");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-black text-center">
        {step === "manage" && (
          <>
            <h2 className="text-xl font-bold mb-2">Manage Team</h2>
            <p className="mb-6">
              You are a member of <br />
              <strong>{teamName}</strong>
            </p>

            <button
              onClick={() => setStep("confirm")}
              className="w-full py-3 bg-[#e43f5a] text-white rounded-lg font-bold"
            >
              Leave Team
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
                onClick={onConfirm}
                className="flex-1 bg-[#1f4068] text-white py-2 rounded-lg"
              >
                Yes, Leave
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

export default LeaveTeamModal;
