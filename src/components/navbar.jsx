import { useEffect, useRef, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import Login from "./login";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = ({ username, role }) => {
    const newUser = { username, role };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <>
      <div className="w-full bg-gray-800 text-white py-4 shadow-md relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold">News Portal</h2>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
           
            {user?.role === "admin" && (
              <Link href="/admin" className="text-white hover:underline">
                Admin Panel
              </Link>
            )}

            {user ? (
              <>
                <span className="text-white">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-white hover:underline"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="text-white hover:underline"
              >
                Login
              </button>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <FaSun className="text-yellow-300" />
              ) : (
                <FaMoon className="text-gray-300" />
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center justify-end w-full">
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <ul
            ref={dropdownRef}
            className="lg:hidden absolute left-0 w-full bg-gray-700 text-white z-10"
          >
            {user?.role === "admin" && (
              <li className="border-b border-gray-600">
                <Link
                  href="/admin"
                  className="block px-4 py-3 hover:bg-gray-600"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Panel
                </Link>
              </li>
            )}

            <li className="border-b border-gray-600">
              <Link
                href="/dashboard"
                className="block px-4 py-3 hover:bg-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            </li>

            <li className="border-b border-gray-600">
              <Link
                href="/analytics"
                className="block px-4 py-3 hover:bg-gray-600"
                onClick={() => setIsOpen(false)}
              >
                Analytics
              </Link>
            </li>

            <li className="border-b border-gray-600">
              {user ? (
                <div className="flex justify-between items-center px-4 py-3">
                  <span>Hello, {user.username}</span>
                  <button onClick={handleLogout} className="underline">
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-600"
                >
                  Login
                </button>
              )}
            </li>

            <li>
              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-3 hover:bg-gray-600"
              >
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          </ul>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative p-6 rounded-lg shadow-lg bg-white">
            <Login onLogin={handleLogin} />
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
