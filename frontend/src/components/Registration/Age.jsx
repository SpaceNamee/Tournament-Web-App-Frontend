import { useState } from "react";
import { useNavigate } from "react-router-dom";
import x11 from "../../assets/1-1.png";
import x21 from "../../assets/2-1.png";
import x31 from "../../assets/3-1.png";
import frame2147220699 from "../../assets/title-logo.png";
import background from "../../assets/background.png";
import ArrowLeftLight from "../icons/ArrowLeftLight";

const Age = ({ setIsAgeVerified }) => {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const navigate = useNavigate();

  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: String(i + 1),
  }));

  const monthOptions = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const yearOptions = Array.from({ length: 100 }, (_, i) => {
    const currentYear = new Date().getFullYear();
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
  });

  const handleNextClick = () => {
    if (!day || !month || !year) {
      alert("Please select your full birth date");
      return;
    }

    setIsAgeVerified(true);
    localStorage.setItem("age_verified", "true");

    navigate("/tournaments");
  };

  const handleBackClick = () => {
    navigate("/verify-email");
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
      <main className="flex-1 flex flex-col items-center justify-center px-20 py-40 relative">
        <button
          type="button"
          onClick={handleBackClick}
          className="absolute top-6 left-6"
        >
          <ArrowLeftLight className="w-14 h-14 text-gray-500" />
        </button>

        <div className="flex flex-col items-center gap-12 w-full max-w-[800px]">
          <h1 className="font-bold text-6xl md:text-8xl text-center text-[#242424]">
            Enter your age
          </h1>

          <div className="flex gap-4 w-full justify-center">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="border-b-2 border-gray-300 py-4 px-3 text-4xl w-1/3 focus:outline-none focus:border-blue-600"
            >
              <option value="">Day</option>
              {dayOptions.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border-b-2 border-gray-300 py-4 px-3 text-4xl w-1/3 focus:outline-none focus:border-blue-600"
            >
              <option value="">Month</option>
              {monthOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border-b-2 border-gray-300 py-4 px-3 text-4xl w-1/3 focus:outline-none focus:border-blue-600"
            >
              <option value="">Year</option>
              {yearOptions.map((y) => (
                <option key={y.value} value={y.value}>{y.label}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleNextClick}
            className="bg-[#1f4068] text-white font-bold py-5 text-3xl rounded-lg w-full mt-6"
          >
            NEXT
          </button>
        </div>
      </main>
    </div>
  );
};

export default Age;
