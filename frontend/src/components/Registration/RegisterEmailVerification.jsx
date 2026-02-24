import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import x11 from "../../assets/1-1.png";
import x21 from "../../assets/2-1.png";
import x31 from "../../assets/3-1.png";
import frame2147220699 from "../../assets/title-logo.png";
import background from "../../assets/background.png";

const RegisterEmailVerification = ({ setIsEmailVerified }) => {
  const [code, setCode] = useState("");
  const [hasError, setHasError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
const email = location.state?.email || localStorage.getItem("email") || "";

  useEffect(() => {
    if (!canResend && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) setCanResend(true);
  }, [countdown, canResend]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (hasError && e.target.value.length > 0) setHasError(false);
  };

const handleNextClick = async () => {
  if (code.trim().length === 0) {
    setHasError(true);
    return;
  }

  try {
    const res = await axios.get(`https://tournament-web-app-backend-1.onrender.com/users/email/${email}`);
    const user = res.data;
    setIsEmailVerified(true);
    localStorage.setItem("email_verified", "true");
    navigate("/verify-age");
  } catch (err) {
    console.error(err.response?.data || err.message);
    setHasError(true);
    setMessage("Invalid verification code or email not found");
  }
};

  const handleResendCode = (e) => {
    e.preventDefault();
    if (!canResend) return;

    setMessage("Verification code resent!");
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <div className="flex w-screen min-h-screen">
      {/* LEFT SIDE */}
      <aside className="hidden md:flex flex-col w-1/2 relative items-center justify-center overflow-hidden">
        <img src={background} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
        <img src={x21} alt="" className="absolute top-1/3 left-0 w-[10rem] h-72 opacity-40 brightness-150" />
        <div className="relative flex flex-col items-center gap-10 z-10">
          <img src={frame2147220699} alt="" className="w-[70rem]" />
          <img src={x11} alt="" className="w-[40rem]" />
          <h2 className="font-zen text-[3.5rem] text-white font-extrabold text-center">
            Create, Join and Play
          </h2>
          <h3 className="font-zen text-[1.75rem] text-white text-center">
            Find team to play in your city and create tournament <br />
            brackets conveniently
          </h3>
          <img src={x31} alt="" className="w-[20rem] opacity-40 brightness-150" />
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <main className="flex-1 flex items-center justify-center px-20 py-40 relative">
        <div className="flex flex-col items-center gap-12 w-full max-w-[950px]">
          <h1 className="font-bold text-8xl text-center text-[#242424]">Email Verification</h1>

          <p className="text-center text-4xl">
            Enter any code to verify your email: <br />
            <span className="font-semibold">{email}</span>
          </p>

          {message && <p className="text-green-500 text-xl mt-2">{message}</p>}

          <div className="w-full">
            <label className="block text-3xl text-gray-600 mb-2">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              className={`w-full border-b-2 py-4 text-3xl focus:outline-none ${
                hasError ? "border-red-500" : "border-gray-300 focus:border-blue-700"
              }`}
            />
            {hasError && <p className="text-red-500 text-xl mt-2">Please enter a code to continue</p>}
          </div>

          <button
            type="button"
            onClick={handleNextClick}
            className="bg-[#1f4068] text-white font-bold py-5 text-4xl rounded-lg w-full"
          >
            NEXT
          </button>

          <div className="flex flex-col items-center gap-3">
            <p className="text-2xl">
              Didn't receive a code?{" "}
              <a
                href="#"
                onClick={handleResendCode}
                className={`underline ${canResend ? "cursor-pointer" : "opacity-50 pointer-events-none"}`}
              >
                {canResend ? "Resend it" : `Resend in ${countdown}s`}
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterEmailVerification;
