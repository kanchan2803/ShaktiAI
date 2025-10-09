import React from 'react'
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {

  const { user, isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  }

  // Classes for links in the main navbar (desktop)
  const desktopLinkClasses = ({ isActive }) =>
    "hover:text-purple-400 transition-colors duration-300 " + (isActive ? "text-purple-500 font-bold" : "" );

  // Classes for links inside the dropdown menu (mobile)
  const mobileLinkClasses = "px-3 py-2 rounded hover:bg-gray-700 transition-colors block w-full text-left";

  return (
    <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

        <NavLink to="/" className="flex items-center gap-3">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            ShaktiAI
          </span>
        </NavLink>

        {/* Desktop Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <NavLink to="/" end className={desktopLinkClasses}>Home</NavLink>
          <NavLink to="/about" className={desktopLinkClasses}>About</NavLink>
          <NavLink to="/history" className={desktopLinkClasses}>History</NavLink>
        </div>

        <div className="relative">
          <button
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold transform hover:scale-110 transition-transform duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {/* {isLoggedIn && user? "U":"?"} */}
            {isLoggedIn && user ? user.name.charAt(0).toUpperCase() : "☰"} 
            {/* Initial for logged user, ? if guest */}

          </button>

          {/* Dropdown menu */}
          <div
            className={`absolute right-0 mt-2 w-56 bg-gray-800 text-white rounded-lg shadow-2xl border border-gray-700 p-4 z-10 transition-all duration-200 ease-out transform origin-top-right ${menuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
          >

            {!isLoggedIn ? (
              <>
                {/* --- Mobile-only Navigation Links --- */}
                <div className="md:hidden border-b border-gray-700 mb-2 pb-2">
                  <NavLink to="/" end className={mobileLinkClasses} onClick={() => setMenuOpen(false)}>Home</NavLink>
                  <NavLink to="/about" className={mobileLinkClasses} onClick={() => setMenuOpen(false)}>About</NavLink>
                  <NavLink to="/history" className={mobileLinkClasses} onClick={() => setMenuOpen(false)}>History</NavLink>
                </div>

                <div className="flex flex-col gap-2">
                  <NavLink
                    to="/login"
                    className="px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="px-3 py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 text-center transition-opacity"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="px-3 py-2 border-b border-gray-700 mb-2">
                  <p className="font-semibold">Hello, {user.name}</p>
                </div>
                {/* --- Mobile-only Navigation Links --- */}
                <div className="md:hidden border-b border-gray-700 mb-2 pb-2">
                  <NavLink to="/" end className={mobileLinkClasses} onClick={() => setMenuOpen(false)}>Home</NavLink>
                  <NavLink to="/about" className={mobileLinkClasses} onClick={() => setMenuOpen(false)}>About</NavLink>
                  <NavLink to="/history" className={mobileLinkClasses} onClick={() => setMenuOpen(false)}>History</NavLink>
                </div>
                <NavLink
                  to="/settings"
                  className="px-3 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Settings
                </NavLink>
                <button
                  className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-500 text-left transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav> 
  )
}
