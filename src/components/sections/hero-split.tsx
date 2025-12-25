'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useVideoChat } from '@/hooks/useVideoChat';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

const HeroSplit = () => {
    const {
      status,
      localStream,
      remoteStream,
      startMatchmaking,
      nextMatch,
      blockUser,
      reportUser,
      genderFilter,
      setGenderFilter,
      localVideoRef,
      remoteVideoRef,
      partnerLocation
    } = useVideoChat();

  const [onlineCount, setOnlineCount] = useState(63267);

  useEffect(() => {
    const onlineUsersRef = ref(db, 'onlineUsers');
    const unsubscribe = onValue(onlineUsersRef, (snapshot) => {
      const users = snapshot.val();
      if (users) {
        setOnlineCount(Object.keys(users).length + 60000); // Baseline + real
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef]);

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
        {status === 'idle' || status === 'waiting' ? (
          <>
            {/* Online Count */}
            <div className="flex flex-col items-center text-center space-y-2 mb-12">
              <div className="flex items-center gap-2 text-white/90 text-[18px] font-semibold">
                <span>👩‍🦳👨‍🦳</span>
                <span>{onlineCount.toLocaleString()} users online</span>
              </div>
            </div>

            {/* Interaction Controls */}
            <div className="w-full max-w-[340px] space-y-6">
              {status === 'waiting' && (
                <div className="text-white text-center mb-4 animate-pulse">
                  Banda dhoondh rahe hain… vibe match ho to baat hogi!
                </div>
              )}
              
              {/* Gender Filter Button */}
              <button 
                onClick={() => {
                  const next = genderFilter === 'Both' ? 'Male' : genderFilter === 'Male' ? 'Female' : 'Both';
                  setGenderFilter(next);
                }}
                className="w-full h-[64px] bg-[#1C1243] hover:bg-[#251955] border border-white/10 rounded-[20px] flex items-center justify-center gap-3 transition-colors active:scale-95 group"
              >
                <span className="text-2xl">
                  {genderFilter === 'Both' ? '👨‍👩‍👦' : genderFilter === 'Male' ? '👨' : '👩'}
                </span>
                <span className="text-white font-bold text-lg">{genderFilter}</span>
              </button>

              {/* Primary Action Button */}
              <button 
                onClick={startMatchmaking}
                disabled={status === 'waiting'}
                className="w-full h-[64px] bg-[#FFFF00] hover:bg-[#e6e600] rounded-[20px] flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,0,0.15)] disabled:opacity-50"
              >
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/icon-24-start_3x-w-15.png"
                  alt=""
                  width={24}
                  height={24}
                  className="invert"
                />
                <span className="text-black font-extrabold text-[18px] uppercase tracking-wide">
                  {status === 'waiting' ? 'Matching...' : 'Start Video Chat'}
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black flex flex-col">
            {/* Remote Video - Fullscreen */}
            <video 
              id="remoteVideo"
              ref={remoteVideoRef}
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />

            {/* Local Video - Floating */}
            <div className="absolute bottom-24 right-4 w-32 h-44 rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl z-20">
              <video 
                id="localVideo"
                ref={localVideoRef}
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover mirror"
              />
            </div>

            {/* Call Controls Overlay */}
            <div className="absolute bottom-6 inset-x-0 px-4 flex justify-center gap-2 z-30">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 max-w-[100px] h-[54px] bg-white/10 hover:bg-white/20 rounded-[16px] flex items-center justify-center text-white font-extrabold text-[12px] uppercase transition-colors"
              >
                Home
              </button>
              <button 
                onClick={nextMatch}
                className="flex-1 max-w-[100px] h-[54px] bg-[#FFFF00] hover:bg-[#e6e600] rounded-[16px] flex items-center justify-center text-black font-extrabold text-[12px] uppercase transition-colors"
              >
                Next
              </button>
                <button 
                  onClick={reportUser}
                  className="flex-1 max-w-[100px] h-[54px] bg-red-600 hover:bg-red-700 rounded-[16px] flex items-center justify-center text-white font-extrabold text-[12px] uppercase transition-colors"
                >
                  Report
                </button>
              <button 
                onClick={blockUser}
                className="flex-1 max-w-[100px] h-[54px] bg-gray-800 hover:bg-gray-900 rounded-[16px] flex items-center justify-center text-white font-extrabold text-[12px] uppercase transition-colors"
              >
                Block
              </button>
            </div>

              {/* Location Label */}
              {partnerLocation ? (
                <div className="absolute top-6 left-6 z-30 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <label id="locationLabel" className="text-white text-sm font-medium">🌍 {partnerLocation}</label>
                </div>
              ) : (
                <div className="absolute top-6 left-6 z-30 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <label id="locationLabel" className="text-white text-sm font-medium">🌍 Detecting location...</label>
                </div>
              )}

          </div>
        )}
      </div>
      <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
    </section>
  );
};

export default HeroSplit;
