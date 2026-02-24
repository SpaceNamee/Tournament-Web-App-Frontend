import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";

const Menu = ({ setIsLoggedIn, setIsEmailVerified }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const toggleMenu = () => setOpen((prev) => !prev);
  const goTo = (path) => {
    setOpen(false);
    navigate(path);
  };

  const logout = () => {
      setOpen(false);
      localStorage.clear();
      setIsLoggedIn(false);
      setIsEmailVerified(false);
      navigate("/login");
    };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="uppercase text-xs font-bold text-gray-500 hover:text-gray-800 transition"
      >
        Menu
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-white-200 z-50">
          <button
            onClick={() => goTo("/profile")}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-400 rounded-t-xl"
          >
            Profile
          </button>

          <button
            onClick={() => goTo("/team-management")}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-400"
          >
            Team Management
          </button>

          <button
            onClick={() => goTo("/team-settings")}
            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-400"
          >
            Team Settings
          </button>

          <div className="h-px bg-gray-200 my-1" />

          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-300 rounded-b-xl"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
export default Menu;