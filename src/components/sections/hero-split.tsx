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
          <p className="text-white text-[20px] md:text-[24px] font-[600] mb-8 opacity-90 max-w-[300px] leading-tight">
            Make new friends face-to-face
          </p>
        </div>
      </div>

      {/* Right Column: Video Chat Area */}
      <div className="flex-1 bg-[#0B032D] relative flex flex-col items-center justify-center py-16 px-6">
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
      </div>
    </section>
  );
};

export default HeroSplit;