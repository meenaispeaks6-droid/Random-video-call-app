"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, Home, Clock, Heart, MessageSquare, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const HeaderNavigation = () => {
  const [mode, setMode] = useState<"solo" | "duo">("solo");

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 py-3 md:px-6">
      {/* Left Section: Sign In button and Monkey Logo */}
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="h-[34px] flex items-center justify-center px-4 rounded-full border-2 border-white text-white text-[14px] font-bold hover:bg-white/10 transition-colors"
        >
          Sign In
        </a>
        <div className="hidden lg:flex items-center">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/icons/monkey-logo-2.png"
            alt="Monkey logo"
            width={44}
            height={44}
            className="object-contain"
          />
        </div>
      </div>

      {/* Center Section: Navigation Icons */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white/10 backdrop-blur-md rounded-full px-1 py-1 border border-white/20">
        <a
          href="/"
          className="w-10 h-8 md:w-[70px] md:h-10 flex items-center justify-center rounded-full bg-[#FFFF00] text-black transition-all"
        >
          <Home size={20} strokeWidth={2.5} />
        </a>
        <a
          href="/history"
          className="w-10 h-8 md:w-[70px] md:h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all"
        >
          <Clock size={20} strokeWidth={2.5} />
        </a>
        <a
          href="/likes"
          className="w-10 h-8 md:w-[70px] md:h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all"
        >
          <Heart size={20} strokeWidth={2.5} />
        </a>
        <a
          href="/chat"
          className="w-10 h-8 md:w-[70px] md:h-10 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-all"
        >
          <MessageSquare size={20} strokeWidth={2.5} />
        </a>
      </nav>

      {/* Right Section: Crown, Solo/Duo Toggle, Hamburger */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border-2 border-white/30 text-white cursor-pointer hover:bg-white/10">
          <Crown size={20} fill="currentColor" />
        </div>

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
              "flex-1 text-[13px] font-bold z-10 transition-colors duration-300",
              mode === "duo" ? "text-black" : "text-white"
            )}
          >
            DUO
          </button>
          <div
            className={cn(
              "absolute top-1 bottom-1 w-[66px] bg-[#FFFF00] rounded-full transition-all duration-300 ease-in-out",
              mode === "solo" ? "left-1" : "left-[69px]"
            )}
          />
        </div>

        <button className="text-white hover:opacity-80 transition-opacity">
          <Menu size={32} strokeWidth={2.5} />
        </button>
      </div>
    </header>
  );
};

export default HeaderNavigation;