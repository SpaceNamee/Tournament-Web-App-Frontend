import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import x11 from "../../assets/1-1.png";
import x21 from "../../assets/2-1.png";
import x31 from "../../assets/3-1.png";
import frame2147220699 from "../../assets/title-logo.png";
import icons8Google from "../../assets/google-icon.png";
import background from "../../assets/background.png";
import ArrowLeftLight from "../icons/ArrowLeftLight";

const Register = ({ setIsLoggedIn, setIsEmailVerified }) => {
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    phone_number: "",
    date_of_birth: "",
    tournament_notif: true,
    match_notif: true,
    general_notif: true,
    is_admin: false,
  });
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const passwordRequirements = [
    "At least 14 characters long",
    "One lowercase letter",
    "One uppercase letter",
    "One number",
    "One special character (!@#$%^&*()_+-=[]{}|;:,.<>?)",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleGoogleSignUp = () => console.log("Sign up with Google");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) return alert("Accept terms");
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/register", formData);
      localStorage.setItem("user_email", res.data.email);
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="flex w-screen h-screen">
      {/* LEFT */}
      <aside className="hidden md:flex flex-col w-1/2 min-h-[90vh] relative items-center justify-center overflow-hidden">
        <img src={background} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
        <img src={x21} alt="" className="absolute top-1/3 left-0 w-[10rem] h-72 object-cover z-10 opacity-40 filter brightness-150" />
        <div className="relative flex flex-col items-center justify-center py-10 space-y-10 z-10">
          <img src={frame2147220699} alt="" className="w-[70rem] h-auto" />
          <img src={x11} alt="" className="w-[40rem] h-auto object-cover" />
          <h2 className="font-zen text-[3rem] text-white font-extrabold text-center">Create, Join and Play</h2>
          <h3 className="font-zen text-[1.5rem] text-white text-center">
            Find a team to play in your city and create tournament brackets conveniently
          </h3>
          <img src={x31} alt="" className="w-[20rem] object-cover mt-4 z-10 opacity-40 filter brightness-150" />
        </div>
      </aside>

      {/* RIGHT */}
      <main className="flex-1 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-4xl flex flex-col gap-6 text-2xl md:text-3xl">
          <button type="button" onClick={() => navigate(-1)} className="absolute top-5 left-5 w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <ArrowLeftLight className="w-10 h-10 md:w-12 md:h-12" />
          </button>

          <h1 className="text-6xl md:text-7xl font-bold text-center text-gray-800">Join Us</h1>

          <button type="button" onClick={handleGoogleSignUp} className="flex items-center justify-center gap-4 bg-gray-50 border border-gray-200 rounded-full h-20 md:h-24 w-full">
            <img src={icons8Google} alt="" className="w-12 h-12 md:w-16 md:h-16" />
            <span className="text-2xl md:text-3xl text-gray-700">Sign up with Google</span>
          </button>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-6">
            <div className="flex flex-col">
              <label className="text-gray-500">Name</label>
              <input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="border-b border-gray-300 py-2" />
              {errors.name && <span className="text-red-500">{errors.name}</span>}
            </div>

            <label className="text-gray-500">Nickname</label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => handleInputChange("nickname", e.target.value)}
              className="border-b border-gray-300 py-2"
            />

            <div className="flex flex-col">
              <label className="text-gray-500">Email</label>
              <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="border-b border-gray-300 py-2" />
              {errors.email && <span className="text-red-500">{errors.email}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500">Password</label>
              <input type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} className="border-b border-gray-300 py-2" />
              <ul className="list-disc pl-6">
                {passwordRequirements.map((req, idx) => <li key={idx}>{req}</li>)}
              </ul>
              {errors.password && <span className="text-red-500">{errors.password}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500">Phone Number</label>
              <input type="text" value={formData.phone_number} onChange={(e) => handleInputChange("phone_number", e.target.value)} className="border-b border-gray-300 py-2" />
              {errors.phone_number && <span className="text-red-500">{errors.phone_number}</span>}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-500">Date of Birth</label>
              <input type="date" value={formData.date_of_birth} onChange={(e) => handleInputChange("date_of_birth", e.target.value)} className="border-b border-gray-300 py-2" />
              {errors.date_of_birth && <span className="text-red-500">{errors.date_of_birth}</span>}
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-6 gap-6">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mr-3 w-7 h-7" />
                I accept the terms & Conditions
              </label>
              <button type="submit" disabled={!termsAccepted || loading} className="bg-blue-700 text-white px-8 py-4 rounded-lg disabled:opacity-50">
                {loading ? "Sending..." : "Send verification code"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;
