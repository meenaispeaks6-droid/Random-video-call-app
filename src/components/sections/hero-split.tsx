import React from 'react';
import Image from 'next/image';

const HeroSplit = () => {
  return (
    <section className="flex flex-col md:flex-row min-h-[100vh] w-full relative overflow-hidden">
      {/* Left Column: Purple Branding Area */}
      <div className="flex-1 bg-[#634AF1] relative flex flex-col items-center justify-center py-16 px-6 overflow-hidden">
        {/* Floating Funkey Emojis (Decorative) */}
        <div className="absolute top-10 left-10 text-3xl animate-float opacity-80 select-none pointer-events-none">🐵</div>
        <div className="absolute top-1/4 right-20 text-4xl animate-float opacity-80 select-none pointer-events-none" style={{ animationDelay: '1s' }}>🐒</div>
        <div className="absolute bottom-1/4 left-1/4 text-3xl animate-float opacity-80 select-none pointer-events-none" style={{ animationDelay: '2s' }}>🙊</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-float opacity-80 select-none pointer-events-none" style={{ animationDelay: '1.5s' }}>🙉</div>

        <div className="z-10 text-center flex flex-col items-center">
          <h1 className="text-white text-[48px] md:text-[60px] font-[900] tracking-tight uppercase leading-none mb-4">
            Funkey
          </h1>
          <p className="text-white text-[20px] md:text-[24px] font-[600] mb-12 opacity-90 max-w-[300px] leading-tight">
            Make new friends face-to-face
          </p>

          <a 
            href="#" 
            className="block transition-transform hover:scale-105 active:scale-95 mt-8 border-2 border-white/20 rounded-[20px] p-1 bg-white/5 backdrop-blur-sm"
          >
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/google-play-badge-us_3x-7.png"
              alt="Get it on Google Play"
              width={180}
              height={54}
              className="h-[54px] w-auto"
            />
          </a>
        </div>

        {/* Top Header Placeholder (Nav) */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center w-full">
           <button className="text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
            Sign In
           </button>
           <div className="flex items-center gap-2 bg-[#0B032D]/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              <div className="w-8 h-8 flex items-center justify-center bg-[#FFFF00] rounded-lg text-black">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-white/60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-white/60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-white/60">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
           </div>
           <div className="w-10"></div> {/* Spacer for symmetry */}
        </div>
      </div>

      {/* Right Column: Video Chat Area */}
      <div className="flex-1 bg-[#0B032D] relative flex flex-col items-center justify-center py-16 px-6">
        {/* Toggle (Solo / Duo) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex bg-[#1C1243] rounded-full p-1 border border-white/5">
          <button className="bg-[#FFFF00] text-black px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Solo
          </button>
          <button className="text-white/40 px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            Duo
          </button>
        </div>

        {/* Online Count */}
        <div className="flex flex-col items-center text-center space-y-2 mb-12">
          <div className="flex items-center gap-2 text-white/90 text-[18px] font-semibold">
            <span>👩‍🦳👨‍🦳</span>
            <span>63267 users online</span>
          </div>
        </div>

        {/* Interaction Controls */}
        <div className="w-full max-w-[340px] space-y-6">
          {/* Gender Filter Button */}
          <button className="w-full h-[64px] bg-[#1C1243] hover:bg-[#251955] border border-white/10 rounded-[20px] flex items-center justify-center gap-3 transition-colors active:scale-95 group">
            <span className="text-2xl">👨‍👩‍👦</span>
            <span className="text-white font-bold text-lg">Both</span>
          </button>

          {/* Primary Action Button */}
          <button className="w-full h-[64px] bg-[#FFFF00] hover:bg-[#e6e600] rounded-[20px] flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,0,0.15)]">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/icon-24-start_3x-w-15.png"
              alt=""
              width={24}
              height={24}
              className="invert"
            />
            <span className="text-black font-extrabold text-[18px] uppercase tracking-wide">
              Start Video Chat
            </span>
          </button>
        </div>

        {/* Hamburger Menu (Mobile/Right Top) */}
        <div className="absolute top-4 right-6 cursor-pointer">
          <div className="space-y-1.5">
            <div className="w-8 h-[3px] bg-white rounded-full"></div>
            <div className="w-8 h-[3px] bg-white rounded-full"></div>
            <div className="w-8 h-[3px] bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSplit;