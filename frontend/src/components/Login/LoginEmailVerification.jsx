import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import x41 from "../../assets/Illustration.png";
import x21 from "../../assets/2-1.png";
import x31 from "../../assets/3-1.png";
import frame2147220699 from "../../assets/title-logo.png";
import icons8Google from "../../assets/google-icon.png";
import background from "../../assets/background.png";
import ArrowLeftLight from "../icons/ArrowLeftLight";

const LoginEmailVerification = ({ setIsEmailVerified }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = location.state?.email || "";
  const [email] = useState(userEmail);
  const [code, setCode] = useState("");
  const [hasError, setHasError] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  /* Countdown logic */
  useEffect(() => {
    if (!canResend && countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) setCanResend(true);
  }, [countdown, canResend]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (hasError && e.target.value.length >= 6) setHasError(false);
  };

  const handleNextClick = () => {
    if (code.length < 6) {
      setHasError(true);
      return;
    }

    console.log("Verification code submitted:", code);

    // Fake verification
    localStorage.setItem("email_verified", "true"); 
    setIsEmailVerified(true); 

    navigate("/tournaments"); 
  };

  const handleResendCode = (e) => {
    e.preventDefault();
    if (!canResend) return;

    console.log("Resending verification code...");
    setCountdown(60);
    setCanResend(false);
  };

  const handleGoogleSignUpClick = () =>
    console.log("Sign up with Google clicked");

  const handleChangeEmailClick = (e) => {
    e.preventDefault();
    console.log("Change email clicked");
  };

  const handleJumpRightInClick = (e) => {
    e.preventDefault();
    console.log("Jump right in clicked");
  };

  const handleBackClick = () => navigate(-1); // volta para o login

  return (
    <div className="flex w-screen min-h-screen">
      {/* LEFT SIDE */}
      <aside className="hidden md:flex flex-col w-1/2 relative items-center justify-center overflow-hidden">
        <img
          src={background}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <img
          src={x21}
          alt=""
          className="absolute top-1/3 left-0 w-[10rem] h-72 opacity-40 brightness-150"
        />
        <div className="relative flex flex-col items-center gap-10 z-10">
          <img src={frame2147220699} alt="" className="w-[70rem]" />
          <img src={x41} alt="" className="w-[40rem]" />
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
          <h1 className="font-bold text-8xl text-center text-[#242424]">
            Email Verification
          </h1>

          <button
            type="button"
            onClick={handleGoogleSignUpClick}
            className="flex items-center justify-center gap-5 bg-gray-50 border border-gray-200 rounded-full h-20 w-full text-3xl"
          >
            <img src={icons8Google} alt="Google" className="w-12 h-12" />
            Sign up with Google
          </button>

          <p className="text-center text-4xl">
            The code has been sent to your email address
            <br />
            <span className="font-semibold">{email}</span>
          </p>

          <div className="w-full">
            <label className="block text-3xl text-gray-600 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={handleCodeChange}
              className={`w-full border-b-2 py-4 text-3xl focus:outline-none ${
                hasError
                  ? "border-red-500"
                  : "border-gray-300 focus:border-blue-700"
              }`}
            />
            {hasError && (
              <p className="text-red-500 text-xl mt-2">
                Code must be at least 6 characters
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextClick}
            className="bg-[#1f4068] text-white font-bold py-5 text-4xl rounded-lg w-full"
          >
            NEXT
          </button>

          <div className="flex flex-col items-center gap-3">
            <p className="text-3xl">
              Didn&apos;t receive the code?{" "}
              <a
                href="#"
                onClick={handleResendCode}
                className={`underline ${
                  canResend ? "cursor-pointer" : "opacity-50 pointer-events-none"
                }`}
              >
                {canResend ? "Resend it" : `Resend in ${countdown}s`}
              </a>
            </p>

            <a
              href="#"
              onClick={handleChangeEmailClick}
              className="underline text-3xl"
            >
              Change email
            </a>

            <p className="text-3xl">
              Already have an account?{" "}
              <a
                href="#"
                onClick={handleJumpRightInClick}
                className="font-bold underline"
              >
                JUMP RIGHT IN
              </a>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBackClick}
          className="absolute top-6 left-6"
        >
          <ArrowLeftLight className="w-14 h-14 text-gray-500" />
        </button>
      </main>
    </div>
  );
};

export default LoginEmailVerification;
