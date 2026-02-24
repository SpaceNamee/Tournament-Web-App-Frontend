import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import avatarPlaceholder from "../../../assets/1-1.png";
import teamicon from "../../../assets/header-logo.png";
import Menu from "./Menu";

const Header = ({ setIsLoggedIn, setIsEmailVerified }) => {
  const location = useLocation();
  const [nickname, setNickname] = useState("User");

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (storedNickname) setNickname(storedNickname);
  }, []);

  const navigationItems = [
    { id: "tournaments", label: "Tournaments", path: "/tournaments" },
    { id: "teams", label: "Teams", path: "/teams" },
    { id: "create-tournament", label: "Create Tournament", path: "/create-tournament" },
    { id: "create-team", label: "Create Team", path: "/create-team" },
  ];

  return (
    <header className="flex items-center justify-between p-4 bg-[#0a0e1a] border-b border-gray-800">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <img className="w-18 h-18" src={teamicon} alt="logo" />
        <span className="text-white font-bold text-lg">
          Tournaments Organizer
        </span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex gap-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${isActive
                ? "bg-[#e43f5a] text-white"
                : "bg-white text-[#2c2c2c]"
                }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* USER + MENU */}
      <div className="flex items-center gap-3 bg-white rounded-full px-4 py-1">
        <img
          className="w-8 h-8 rounded-full"
          src={avatarPlaceholder}
          alt="Avatar"
        />
        <div className="text-left">
          <p className="text-sm font-bold text-gray-700">{nickname}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>

        {/* MENU COMPONENT */}
        <Menu
          setIsLoggedIn={setIsLoggedIn}
          setIsEmailVerified={setIsEmailVerified}
        />
      </div>
    </header>
  );
};
export default Header;