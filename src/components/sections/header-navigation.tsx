"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Home, Clock, Heart, MessageSquare, Crown, LogOut, User, Settings, Mail, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNavigation() {
  const [mode, setMode] = useState<"solo" | "duo">("solo");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: "Profile", icon: <User size={18} />, href: "/profile" },
    { label: "Settings", icon: <Settings size={18} />, href: "/settings" },
    { label: "Contact", icon: <Mail size={18} />, href: "/contact" },
  ];

  const navLinks = [
    { href: "/", icon: <Home size={20} strokeWidth={2.5} /> },
    { href: "/history", icon: <Clock size={20} strokeWidth={2.5} /> },
    { href: "/likes", icon: <Heart size={20} strokeWidth={2.5} /> },
    { href: "/chat", icon: <MessageSquare size={20} strokeWidth={2.5} /> },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 md:px-6">
      {/* Left Section: Auth button and Funkey Logo */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="w-10 h-[34px] flex items-center justify-center rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              <User size={18} />
            </Link>
            <button
              onClick={() => signOut()}
              className="h-[34px] flex items-center justify-center px-4 rounded-full border-2 border-white/20 text-white text-[14px] font-bold hover:bg-white/10 transition-colors gap-2"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="h-[34px] flex items-center justify-center px-4 rounded-full border-2 border-white text-white text-[14px] font-bold hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
        )}
        <div className="hidden lg:flex items-center">
          <Link href="/">
            <span className="text-white font-black text-2xl tracking-tighter uppercase">Funkey</span>
          </Link>
        </div>
      </div>

      {/* Center Section: Navigation Icons */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white/10 backdrop-blur-md rounded-full px-1 py-1 border border-white/20">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "w-10 h-8 md:w-[70px] md:h-10 flex items-center justify-center rounded-full transition-all",
              pathname === link.href 
                ? "bg-[#FFFF00] text-black" 
                : "text-white hover:bg-white/10"
            )}
          >
            {link.icon}
          </Link>
        ))}
      </nav>

      {/* Right Section: Crown, Solo/Duo Toggle, Hamburger */}
      <div className="flex items-center gap-3 md:gap-4 relative" ref={menuRef}>
        <Link href="/premium" className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/30 text-white cursor-pointer hover:bg-white/10">
          <Crown size={20} fill="currentColor" />
        </Link>

        {/* Solo/Duo Toggle Switch */}
        <div className="flex bg-black/40 backdrop-blur-sm rounded-full p-1 border border-white/20 h-10 w-[140px] relative">
          <button
            onClick={() => setMode("solo")}
            className={cn(
              "flex-1 text-[13px] font-bold z-10 transition-colors duration-300",
              mode === "solo" ? "text-black" : "text-white"
            )}
          >
            SOLO
          </button>
            <button
              onClick={() => setMode("duo")}
              className={cn(
                "flex-1 text-[13px] font-bold z-10 transition-colors duration-300 relative",
                mode === "duo" ? "text-black" : "text-white"
              )}
            >
              DUO
              <span className="absolute -top-3 -right-2 bg-[#FFFF00] text-black text-[9px] px-1.5 py-0.5 rounded-full border border-black font-black uppercase tracking-tighter shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-0.5 whitespace-nowrap">
                Not yet
              </span>
            </button>
          <div
            className={cn(
              "absolute top-1 bottom-1 w-[66px] bg-[#FFFF00] rounded-full transition-all duration-300 ease-in-out",
              mode === "solo" ? "left-1" : "left-[69px]"
            )}
          />
        </div>

        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white hover:opacity-80 transition-opacity"
        >
          {menuOpen ? <X size={32} strokeWidth={2.5} /> : <Menu size={32} strokeWidth={2.5} />}
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-full right-0 mt-4 w-56 bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden p-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-[#FFFF00] hover:text-black rounded-2xl transition-all font-bold group"
              >
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2 mx-2" />
            <button
              onClick={() => {
                signOut();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all font-bold group"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
