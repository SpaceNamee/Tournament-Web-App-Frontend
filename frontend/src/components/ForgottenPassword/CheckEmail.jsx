import { useState, useEffect, useRef } from "react";
import x41 from "../../assets/Illustration.png";
import x21 from "../../assets/2-1.png";
import x31 from "../../assets/3-1.png";
import frame2147220699 from "../../assets/title-logo.png";
import background from "../../assets/background.png";
import ArrowLeftLight from "../icons/ArrowLeftLight";

export const CheckEmail = () => {
  const [securityCode, setSecurityCode] = useState(["", "", "", "", "", ""]);
  const [hasError, setHasError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  /* Countdown */
  useEffect(() => {
    if (!canResend && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) setCanResend(true);
  }, [countdown, canResend]);

  /* OTP logic */
  const handleInputChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...securityCode];
    newCode[index] = value;
    setSecurityCode(newCode);
    setHasError(false);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !securityCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleNextClick = () => {
    const finalCode = securityCode.join("");
    if (finalCode.length < 6) {
      setHasError(true);
      return;
    }
    console.log("Verification code:", finalCode);
  };

  return (
    <div className="flex w-screen min-h-screen">
      {/* LEFT SIDE */}
      <aside className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
        <img src={background} className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative flex flex-col items-center gap-10 z-10">
          <img src={frame2147220699} className="w-[70rem]" />
          <img src={x41} className="w-[40rem]" />
          <h2 className="text-white text-6xl font-bold text-center">
            Create, Join and Play
          </h2>
          <img src={x31} className="w-[20rem] opacity-40" />
        </div>
      </aside>

      {/* RIGHT SIDE */}
      <main className="flex-1 flex items-center justify-center px-20 py-40 relative">
        <div className="flex flex-col items-center gap-12 w-full max-w-[950px]">
          <h1 className="font-bold text-7xl text-center">Check your Email</h1>

          <p className="text-center text-3xl">
            And write down the 6-Digit Security Code we send you.
          </p>

          {/* OTP INPUTS */}
          <div className="flex gap-6">
            {securityCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-20 h-20 text-center text-4xl font-bold border-2 rounded-lg focus:outline-none ${
                  hasError
                    ? "border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                }`}
              />
            ))}
          </div>

          {hasError && (
            <p className="text-red-500 text-xl">
              Please enter all 6 digits
            </p>
          )}

          <button
            onClick={handleNextClick}
            className="bg-[#1f4068] text-white font-bold py-5 text-4xl rounded-lg w-full"
          >
            VERIFY CODE
          </button>

          <p className="text-2xl">
            Didn’t receive the code?{" "}
            <button
              className={`underline ${
                canResend ? "" : "opacity-50 pointer-events-none"
              }`}
            >
              {canResend ? "Resend" : `Resend in ${countdown}s`}
            </button>
          </p>
        </div>

        <button onClick={() => console.log("Back")} className="absolute top-6 left-6">
          <ArrowLeftLight className="w-14 h-14 text-gray-500" />
        </button>
      </main>
    </div>
  );
};