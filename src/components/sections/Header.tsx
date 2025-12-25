"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [toggleMode, setToggleMode] = useState("SOLO");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: "home", icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/iconhome01-9.png" },
    { id: "history", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm1-8.414V7h-2v6h5v-2h-3z'/%3E%3C/svg%3E" },
    { id: "message", icon: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/message-10.png" },
    { id: "cloud", icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 24 24'%3E%3Cpath d='M17.5 19c-3.037 0-5.5-2.463-5.5-5.5 0-3.037 2.463-5.5 5.5-5.5s5.5 2.463 5.5 5.5c0 3.037-2.463 5.5-5.5 5.5zm-11 0C3.463 19 1 16.537 1 13.5 1 10.463 3.463 8 6.5 8c.553 0 1.077.086 1.57.235C8.75 6.36 10.51 5 12.5 5c1.802 0 3.407 1.117 4.102 2.765.418-.173.873-.265 1.348-.265 1.705 0 3.125 1.258 3.456 2.89C22.25 10.84 23 12.08 23 13.5c0 1.933-1.567 3.5-3.5 3.5-.17 0-.335-.015-.5-.04V19H6.5z'/%3E%3C/svg%3E" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex flex-col items-center">
      {/* Top Promotional Banner */}
      <div className="w-full bg-[#FFFFFF]/10 backdrop-blur-md h-[40px] flex items-center justify-center border-b border-white/5">
        <a 
          href="#" 
          className="flex items-center gap-2 text-white text-[13px] font-semibold hover:opacity-80 transition-opacity"
        >
          <span className="text-[16px]">👑</span>
          <span>Try the New Funkey Now &gt;</span>
        </a>
      </div>

      {/* Main Navigation Row */}
      <div className="w-full px-6 py-4 flex items-center justify-between">
        {/* Left: Sign In & Logo (Mobile Toggle Context) */}
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center justify-center px-6 h-[38px] border border-white rounded-full text-white text-sm font-semibold hover:bg-white/10 transition-all">
            Sign In
          </button>
          <div className="md:hidden flex items-center h-[38px]">
             <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/icons/monkey-logo-2.png"
                alt="Funkey Logo"
                width={32}
                height={32}
                className="w-8 h-8"
             />
          </div>
        </div>

        {/* Center: Main Nav Capsule */}
        <nav className="flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1 h-[48px] shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-center w-[48px] md:w-[60px] h-full rounded-full transition-all duration-300 ${
                activeTab === item.id ? "bg-[#FFF700] shadow-sm" : "hover:bg-white/5"
              }`}
            >
              <div className="relative w-6 h-6">
                <img
                  src={item.icon}
                  alt={item.id}
                  className={`w-full h-full object-contain ${
                    activeTab === item.id ? "brightness-0" : "brightness-100"
                  }`}
                />
              </div>
            </button>
          ))}
          <div className="w-[1px] h-6 bg-white/20 mx-1" />
          <button className="flex items-center justify-center w-[48px] md:w-[60px] h-full rounded-full hover:bg-white/5 transition-all">
            <span className="text-lg">👑</span>
          </button>
        </nav>

        {/* Right: Toggle & Menu */}
        <div className="flex items-center gap-6">
          {/* Solo/Duo Toggle */}
          <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-[2px] w-[140px] h-[38px] relative overflow-hidden">
            <div 
              className={`absolute top-[2px] bottom-[2px] w-[68px] bg-[#FFF700] rounded-full transition-transform duration-300 ease-in-out ${
                toggleMode === "DUO" ? "translate-x-[68px]" : "translate-x-0"
              }`}
            />
            <button 
              onClick={() => setToggleMode("SOLO")}
              className={`flex-1 text-[13px] font-bold z-10 transition-colors ${
                toggleMode === "SOLO" ? "text-[#0A0430]" : "text-white"
              }`}
            >
              SOLO
            </button>
            <button 
              onClick={() => setToggleMode("DUO")}
              className={`flex-1 text-[13px] font-bold z-10 transition-colors ${
                toggleMode === "DUO" ? "text-[#0A0430]" : "text-white"
              }`}
            >
              DUO
            </button>
          </div>

          {/* Hamburger Menu Icon */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white hover:opacity-80 transition-opacity p-1"
          >
            {isMenuOpen ? (
                <X className="w-8 h-8 stroke-[2.5]" />
            ) : (
                <Menu className="w-8 h-8 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[100px] left-0 w-full bg-[#634AF1] border-t border-white/10 px-6 py-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between">
            <span className="text-white font-bold">Mode</span>
            <div className="flex items-center bg-white/10 border border-white/20 rounded-full p-[2px] w-[140px] h-[38px] relative">
              <div 
                className={`absolute top-[2px] bottom-[2px] w-[68px] bg-[#FFF700] rounded-full transition-transform duration-300 ease-in-out ${
                  toggleMode === "DUO" ? "translate-x-[68px]" : "translate-x-0"
                }`}
              />
              <button onClick={() => setToggleMode("SOLO")} className={`flex-1 text-[13px] font-bold z-10 ${toggleMode === "SOLO" ? "text-[#0A0430]" : "text-white"}`}>SOLO</button>
              <button onClick={() => setToggleMode("DUO")} className={`flex-1 text-[13px] font-bold z-10 ${toggleMode === "DUO" ? "text-[#0A0430]" : "text-white"}`}>DUO</button>
            </div>
          </div>
          <button className="w-full h-[50px] border border-white rounded-full text-white font-bold flex items-center justify-center">
            Sign In
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;