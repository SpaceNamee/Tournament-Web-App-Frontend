import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import x41 from "../../assets/Illustration.png";
import x21 from "../../assets/2-1.png";
import x31 from "../../assets/3-1.png";
import frame2147220699 from "../../assets/title-logo.png";
import icons8Google from "../../assets/google-icon.png";
import background from "../../assets/background.png";
import ArrowLeftLight from "../icons/ArrowLeftLight";

const LoginMain = ({ setIsLoggedIn, setIsEmailVerified }) => {
  const [nickname, setNickname] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Botões
  const handleGoogleSignIn = () => console.log("Google sign in clicked");
  const handleRegister = () => navigate("/register");
  const handleBack = () => console.log("Back clicked");

  const handleSignIn = async () => {
    setError("");

    if (!nickname || !password) {
      setError("Please enter both nickname and password.");
      return;
    }

    try {
      // LOGIN
      const params = new URLSearchParams();
      params.append("username", nickname);
      params.append("password", password);

      const res = await axios.post(
        "https://tournament-web-app-backend-1.onrender.com/auth/token",
        params,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const { access_token, user_id } = res.data;

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user_id", user_id);

      const userRes = await axios.get(
        `https://tournament-web-app-backend-1.onrender.com/users/${user_id}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      localStorage.setItem("nickname", userRes.data.nickname || nickname);

      const emailVerified = userRes.data.email_verified;

      localStorage.setItem("email_verified", emailVerified);
      setIsLoggedIn(true);
      setIsEmailVerified(emailVerified);

      if (!emailVerified) {
        navigate("/login-email-verification");
      } else {
        navigate("/teams");
      }
    } catch (err) {
      console.error(err);
      setError("Nickname or password incorrect");
    }
  };


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
      <main className="flex-1 flex items-center justify-center px-10 md:px-20 py-20 relative overflow-y-auto">
        <div className="flex flex-col items-center gap-20 w-full max-w-[800px]">
          {/* BACK BUTTON */}
          {/*<button type="button" onClick={handleBack} className="absolute top-6 left-6">
            <ArrowLeftLight className="w-12 h-12 text-gray-500" />
          </button>*/}

          {/* TITLE */}
          <h1 className="font-bold text-5xl md:text-8xl text-center text-[#242424]">
            Welcome Back!
          </h1>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center gap-4 bg-gray-50 border border-gray-200 rounded-full py-4 w-full text-xl md:text-3xl"
          >
            <img src={icons8Google} alt="Google" className="w-10 h-10 md:w-12 md:h-12" />
            Sign in with Google
          </button>

          {/* INFO TEXT */}
          <p className="text-center text-lg md:text-4xl text-gray-700">
            Enter your nickname and password to sign in
          </p>

          {/* NICKNAME INPUT */}
          <div className="w-full">
            <label className="block text-lg md:text-4xl text-gray-600 mb-2">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your nickname"
              className="w-full border-b-2 py-3 text-lg md:text-3xl focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="w-full">
            <label className="block text-lg md:text-4xl text-gray-600 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full border-b-2 py-3 text-lg md:text-3xl focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-red-600 text-center text-lg md:text-2xl">{error}</p>
          )}

          {/* SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleSignIn}
            className="bg-[#1f4068] text-white font-bold py-4 text-xl md:text-4xl rounded-lg w-full"
          >
            Sign In
          </button>

          {/* REGISTER TEXT */}
          <p className="text-base md:text-3xl text-gray-700 text-center">
            Don't have an account?{" "}
            <span onClick={handleRegister} className="font-bold underline cursor-pointer">
              Register
            </span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default LoginMain;
