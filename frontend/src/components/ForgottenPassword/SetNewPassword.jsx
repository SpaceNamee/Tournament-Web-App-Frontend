import { useState } from "react";
import x41 from "../../assets/Illustration.png";
import x31 from "../../assets/3-1.png";
import frame2147220699 from "../../assets/title-logo.png";
import background from "../../assets/background.png";
import ArrowLeftLight from "../icons/ArrowLeftLight";

export const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = () => {
    if (!password || !confirmPassword) {
      setError("Please fill in both fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    console.log("New password:", password);
    // 🔐 API CALL GOES HERE
  };

  return (
    <div className="flex w-screen min-h-screen">
      {/* LEFT SIDE */}
      <aside className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
        <img
          src={background}
          className="absolute inset-0 w-full h-full object-cover"
          alt="background"
        />

        <div className="relative flex flex-col items-center gap-10 z-10">
          <img src={frame2147220699} className="w-[60rem]" alt="logo" />
          <img src={x41} className="w-[38rem]" alt="illustration" />
          <h2 className="text-white text-6xl font-bold text-center">
            Create, Join and Play
          </h2>
          <img src={x31} className="w-[20rem] opacity-40" alt="decor" />
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <main className="flex-1 flex items-center justify-center px-20 relative">
        <div className="flex flex-col items-center gap-14 w-full max-w-[900px]">
          <h1 className="font-bold text-7xl text-center">
            Set New Password
          </h1>

          <p className="text-center text-3xl text-gray-600">
            You can always change it later.
          </p>

          {/* NEW PASSWORD */}
          <div className="w-full">
            <label className="block text-3xl text-gray-600 mb-3">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 py-4 text-3xl focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="w-full">
            <label className="block text-3xl text-gray-600 mb-3">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-b-2 py-4 text-3xl focus:outline-none focus:border-blue-600"
            />
          </div>

          {error && (
            <p className="text-red-500 text-2xl">{error}</p>
          )}

          <button
            onClick={handleChangePassword}
            className="bg-[#1f4068] text-white font-bold py-5 text-4xl rounded-lg w-full"
          >
            CHANGE PASSWORD
          </button>

          <div className="flex flex-col items-center gap-3">

            <p className="text-3xl">
              Need help? write us.
            </p>
          </div>

        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => console.log("Back")}
          className="absolute top-6 left-6"
        >
          <ArrowLeftLight className="w-14 h-14 text-gray-500" />
        </button>
      </main>
    </div>
  );
};