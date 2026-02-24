import React from 'react';
import { Link } from "react-router-dom";
import teamicon from "../../assets/Footer-logo.png";
<img src={teamicon} alt="Team Icon" />

export const Footer = () => {
  return (
    <footer className="bg-white py-10 px-10 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start">
        <div className="flex flex-col items-center gap-2 mb-6 md:mb-0">
          <img src={teamicon} alt="Logo" className="w-[200px] h-[150px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-gray-600">
          <div className="flex flex-col gap-2">
            <Link to="/create-tournament" className="hover:text-black">
              Create a tournament
            </Link>
            <Link to="/create-brackets" className="hover:text-black">
              Create brackets
            </Link>
            <Link to="/create-team" className="hover:text-black">
              Create a team
            </Link>
            <Link to="/teams" className="hover:text-black">
              Find a team
            </Link>
            <Link to="/tournaments" className="hover:text-black">
              Find a tournament
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-bold text-black">Contacts</span>
            <span>tournaments@gmail.com</span>
            <span>+48 012345678</span>
          </div>
          <div className="flex flex-col gap-2">
            <a href="#" className="hover:text-black">Terms & Conditions</a>
            <a href="#" className="hover:text-black">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;