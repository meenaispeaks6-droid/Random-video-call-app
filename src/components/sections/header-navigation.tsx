"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Home, Clock, Heart, MessageSquare, Crown, LogOut, User, Settings, Mail, X, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderNavigation() {
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
    { href: "/likes", icon: <Heart size={20} strokeWidth={2.5} />, premium: true },
    { href: "/chat", icon: <MessageSquare size={20} strokeWidth={2.5} />, premium: true },
  ];

  const UltraPremiumBadge = () => (
    <div className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 bg-gradient-to-br from-[#FFE07D] via-[#FDB931] to-[#9E7E38] text-black rounded-full p-0.5 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] z-20 scale-[0.6] md:scale-75 animate-bounce-slow">
      <Crown size={12} fill="currentColor" />
    </div>
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-3 py-2 md:px-6 md:py-3">
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {user ? (
          <div className="flex items-center gap-1.5 md:gap-2">
            <Link
              href="/profile"
              className="w-9 h-9 md:w-10 md:h-[34px] flex items-center justify-center rounded-full border-2 border-white/20 text-white hover:bg-white/10 transition-colors"
            >
              <User size={16} className="md:w-[18px]" />
            </Link>
            <button
              onClick={() => signOut()}
              className="h-9 md:h-[34px] flex items-center justify-center px-3 md:px-4 rounded-full border-2 border-white/20 text-white text-[12px] md:text-[14px] font-bold hover:bg-white/10 transition-colors gap-1.5 md:gap-2"
            >
              <LogOut size={12} className="md:w-[14px]" />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <Link
            href="/auth"
            className="h-9 md:h-[34px] flex items-center justify-center px-3 md:px-4 rounded-full border-2 border-white text-white text-[12px] md:text-[14px] font-bold hover:bg-white/10 transition-colors"
          >
            Sign In
          </Link>
        )}
        <div className="hidden sm:flex items-center">
          <Link href="/">
            <span className="text-white font-black text-xl md:text-2xl tracking-tighter uppercase">MojCall</span>
          </Link>
        </div>
      </div>

      <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center bg-white/10 backdrop-blur-md rounded-full px-1 py-1 border border-white/20">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "w-10 h-8 md:w-[70px] md:h-10 flex items-center justify-center rounded-full transition-all relative",
              pathname === link.href 
                ? "bg-[#FFFF00] text-black" 
                : "text-white hover:bg-white/10"
            )}
          >
            {link.icon}
            {link.premium && <UltraPremiumBadge />}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2 md:gap-4 relative shrink-0" ref={menuRef}>
        <Link href="/premium" className="hidden sm:flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#FFE07D]/50 text-[#FFE07D] cursor-pointer hover:bg-white/10 relative group">
          <Crown size={18} fill="currentColor" className="md:w-5 drop-shadow-[0_0_8px_rgba(255,224,125,0.4)] group-hover:scale-110 transition-transform animate-bounce-slow" />
        </Link>



        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white hover:opacity-80 transition-opacity"
        >
          {menuOpen ? <X size={28} className="md:w-8" strokeWidth={2.5} /> : <Menu size={28} className="md:w-8" strokeWidth={2.5} />}
        </button>

        {menuOpen && (
          <div className="absolute top-full right-0 mt-3 md:mt-4 w-56 bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden p-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="md:hidden grid grid-cols-4 gap-1 mb-2 p-1 bg-white/5 rounded-2xl">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-center p-2 rounded-xl transition-all relative",
                    pathname === link.href ? "bg-[#FFFF00] text-black" : "text-white/60 hover:text-white"
                  )}
                >
                  {React.cloneElement(link.icon as React.ReactElement, { size: 18 })}
                  {link.premium && (
                    <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full border border-black" />
                  )}
                </Link>
              ))}
            </div>
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
