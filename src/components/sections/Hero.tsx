import React from 'react';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col md:flex-row">
      {/* Left Branding Side (Primary Purple #634AF1) */}
      <div className="relative w-full md:w-1/2 h-full bg-[#634AF1] flex flex-col items-center justify-center p-8 overflow-hidden">
        {/* Floating Funkey Icons - Animated with CSS from globals.css */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] left-[15%] animate-float delay-0 text-3xl">🐵</div>
          <div className="absolute top-[25%] right-[20%] animate-float delay-[1s] text-2xl">🐵</div>
          <div className="absolute top-[50%] left-[10%] animate-float delay-[2s] text-4xl">🐵</div>
          <div className="absolute bottom-[20%] right-[25%] animate-float delay-[1.5s] text-3xl">🐵</div>
          <div className="absolute bottom-[10%] left-[30%] animate-float delay-[0.5s] text-2xl">🐵</div>
          <div className="absolute top-[40%] right-[35%] animate-float delay-[3s] text-2xl">🐵</div>
        </div>

        {/* Branding Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1 className="text-white text-[48px] md:text-[64px] font-extrabold uppercase mb-2 tracking-tight">
            Funkey
          </h1>
          <p className="text-white text-[20px] md:text-[24px] font-semibold mb-12 opacity-90 leading-tight">
            Make new friends <div className="hidden md:block"></div>face-to-face
          </p>

          <a 
            href="https://play.google.com/store/apps" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/google-play-badge-us_3x-7.png"
              alt="Get it on Google Play"
              width={220}
              height={64}
              className="h-auto w-[180px] md:w-[220px]"
            />
          </a>
        </div>
      </div>

      {/* Right Video Chat Side (Deep Navy #0A0430) */}
      <div className="relative w-full md:w-1/2 h-full bg-[#0A0430] flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-[480px] flex flex-col items-center">
          {/* Online Counter */}
          <div className="flex items-center gap-2 mb-20 text-white/80 font-medium text-sm md:text-base">
            <span role="img" aria-label="users">👩‍🎨👨‍🎨</span>
            <span>63369 users online</span>
          </div>

          {/* Gender/Mode Toggle Selection */}
          <div className="w-full mb-8">
            <button className="w-full h-[56px] bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center gap-2 text-white font-semibold transition-colors hover:bg-white/15">
              <span role="img" aria-label="both">👫</span>
              <span>Both</span>
            </button>
          </div>

          {/* CTA Button */}
          <button className="w-full h-[64px] bg-[#FFF700] rounded-full flex items-center justify-center gap-3 transition-transform hover:scale-[1.03] active:scale-95 group shadow-lg">
            <div className="w-6 h-6 relative">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/icon-24-start_3x-w-15.png"
                alt="camera"
                fill
                className="object-contain brightness-0"
              />
            </div>
            <span className="text-[#0A0430] text-[18px] md:text-[20px] font-extrabold uppercase">
              Start Video Chat
            </span>
          </button>
        </div>

        {/* Right Corner Menu Links Area Appearance */}
        <div className="absolute right-8 bottom-8 hidden md:flex gap-6 text-white/50 text-xs font-medium">
          <a href="#" className="hover:text-white transition-colors">Start</a>
          <a href="#" className="hover:text-white transition-colors">About Chat</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;