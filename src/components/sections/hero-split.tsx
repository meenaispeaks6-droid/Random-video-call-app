'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useVideoChat } from '@/hooks/useVideoChat';
import { ref, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    mouseX.set(x * 0.4);
    mouseY.set(y * 0.4);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

const CursorTrail = () => {
  const [dots, setDots] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newDot = { x: e.clientX, y: e.clientY, id: Date.now() };
      setDots((prev) => [...prev.slice(-15), newDot]);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {dots.map((dot, i) => (
        <motion.div
          key={dot.id}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{ left: dot.x, top: dot.y, transform: 'translate(-50%, -50%)' }}
        />
      ))}
    </div>
  );
};

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
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isBananaRainEffect, setIsBananaRainEffect] = useState(false);
  
    // 3D Tilt Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-300, 300], [15, -15]);
    const rotateY = useTransform(x, [-300, 300], [-15, 15]);
    const springConfig = { damping: 20, stiffness: 150 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);
  
    const triggerBananaRain = () => {
      setIsBananaRainEffect(true);
      setTimeout(() => setIsBananaRainEffect(false), 3000);
    };

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement)?.getBoundingClientRect?.() || { left: 0, top: 0, width: typeof window !== 'undefined' ? window.innerWidth : 1000, height: typeof window !== 'undefined' ? window.innerHeight : 1000 };
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX);
    y.set(mouseY);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove as any);
    return () => window.removeEventListener('mousemove', handleMouseMove as any);
  }, []);

  useEffect(() => {
    if (!db) {
      console.warn("Firebase Database not initialized. Using static online count.");
      return;
    }
    const onlineUsersRef = ref(db, 'onlineUsers');
    const unsubscribe = onValue(onlineUsersRef, (snapshot) => {
      const users = snapshot.val();
      if (users) {
        setOnlineCount(Object.keys(users).length + 60000); // Baseline + real
      }
    });
    return () => unsubscribe();
  }, [db]);

  return (
    <section className="flex flex-col md:flex-row min-h-[100vh] w-full relative overflow-hidden">
      <CursorTrail />
      {/* Left Column: Purple Branding Area */}
        <div className="flex-1 bg-[#634AF1] relative flex flex-col items-center justify-center py-16 px-6 overflow-hidden">
          {/* Grain Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
          
          {/* Morphing Aesthetic Blobs */}
          <motion.div
            className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#7B61FF] rounded-full blur-[80px] opacity-40 z-0"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#4E31AA] rounded-full blur-[100px] opacity-50 z-0"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -40, 0],
              y: [0, -60, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          {/* Banana Rain Effect */}
          <AnimatePresence>
            {isBananaRainEffect && Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -100, x: Math.random() * 400 - 200, rotate: 0, opacity: 1 }}
                animate={{ 
                  y: 1000, 
                  rotate: 360,
                  opacity: [1, 1, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, delay: Math.random() * 0.5, ease: "easeIn" }}
                className="absolute text-4xl pointer-events-none z-50"
              >
                🍌
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Animated Background Dashed Circle */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-[600px] h-[600px] border-[2px] border-dashed border-white rounded-full" />
          </motion.div>

          {/* Floating Emojis with depth */}
          <motion.div 
            className="absolute top-[15%] left-[10%] text-5xl select-none pointer-events-none z-10 filter drop-shadow-2xl"
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            🌍
          </motion.div>

          <motion.div 
            className="absolute top-[40%] right-[10%] text-6xl select-none pointer-events-none z-10 filter drop-shadow-2xl"
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -25, 25, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            🍌
          </motion.div>

          <motion.div 
            className="absolute bottom-[20%] left-[15%] text-5xl select-none pointer-events-none z-10 filter drop-shadow-2xl"
            animate={{ 
              x: [0, 40, 0],
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            🙊
          </motion.div>

          {/* Peeking Monkey - Click me! */}
          <motion.div
            className="absolute -left-4 bottom-1/3 text-7xl select-none cursor-pointer z-40 active:scale-90"
            initial={{ x: -60 }}
            whileHover={{ x: 20, rotate: 10, scale: 1.1 }}
            onClick={triggerBananaRain}
            title="Click for surprise!"
          >
            🐒
          </motion.div>

          <motion.div 
            className="z-20 text-center flex flex-col items-center"
            style={{ 
              rotateX: springRotateX, 
              rotateY: springRotateY, 
              transformStyle: "preserve-3d",
              perspective: 1000 
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ transform: "translateZ(50px)" }}
            >
              <h1 className="text-white text-[64px] md:text-[80px] font-[950] tracking-tighter uppercase leading-[0.9] mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] select-none bg-gradient-to-r from-white via-yellow-200 to-white bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent">
                Funkey<span className="text-[#FFFF00]">.</span>
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-white text-[22px] md:text-[26px] font-[600] mb-10 opacity-90 max-w-[320px] leading-tight tracking-tight select-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ transform: "translateZ(30px)" }}
            >
              Vibe with strangers, make real <span className="underline decoration-[#FFFF00] decoration-4 underline-offset-4">connections</span>.
            </motion.p>

            {/* Aesthetic Badge */}
            <motion.div
              className="px-8 py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/30 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl cursor-pointer hover:bg-white/20 transition-colors"
              animate={{ 
                scale: [1, 1.05, 1],
                boxShadow: ["0 0 20px rgba(255,255,0,0)", "0 0 20px rgba(255,255,0,0.2)", "0 0 20px rgba(255,255,0,0)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ transform: "translateZ(40px)" }}
            >
              <motion.span 
                className="w-2.5 h-2.5 bg-yellow-400 rounded-full" 
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Live & Global
            </motion.div>
          </motion.div>

          {/* Mouse Following Funkey */}
          <motion.div
            className="absolute text-3xl pointer-events-none z-30 opacity-30 hidden lg:block"
            animate={{ 
              x: mousePos.x / 12 - 60, 
              y: mousePos.y / 12 - 60,
              rotate: (mousePos.x - (typeof window !== 'undefined' ? window.innerWidth : 0) / 2) / 40
            }}
            transition={{ type: "spring", stiffness: 40, damping: 25 }}
          >
            🐵
          </motion.div>
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
                    Searching for a match...
                  </div>
                )}
                
                {/* Gender Filter Button */}
                <Magnetic>
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
                </Magnetic>

                {/* Primary Action Button */}
                <Magnetic>
                  <button 
                    id="startBtn"
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
                      {status === 'waiting' ? 'Matching...' : 'Start'}
                    </span>
                  </button>
                </Magnetic>
              </div>

          </>
        ) : (
            <div className="absolute inset-0 w-full h-full bg-black flex flex-col">
              {/* Remote Video - 50% */}
              <div className="flex-1 relative overflow-hidden border-b border-white/10 bg-[#0B032D]">
                <video 
                  id="remoteVideo"
                  ref={remoteVideoRef}
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                
                {/* Connecting Overlay */}
                <AnimatePresence>
                  {!remoteStream && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0B032D]"
                    >
                      <div className="relative w-20 h-20 mb-4">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                          🐵
                        </div>
                      </div>
                      <p className="text-white/60 font-medium animate-pulse">Connecting to partner...</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Partner Location Label */}
                <div className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <span className="text-white text-xs font-medium">
                    🌍 {partnerLocation || "Detecting..."}
                  </span>
                </div>
              </div>

              {/* Local Video - 50% */}
              <div className="flex-1 relative overflow-hidden bg-[#0B032D]">
                <video 
                  id="localVideo"
                  ref={localVideoRef}
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-full object-cover mirror"
                />
                <div className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <span className="text-white text-xs font-medium">You</span>
                </div>
              </div>


            {/* Call Controls Overlay - Floating over the split */}
            <div className="absolute bottom-6 inset-x-0 px-4 flex justify-center gap-3 z-30">
              <button 
                id="nextBtn"
                onClick={nextMatch}
                className="flex-1 max-w-[120px] h-[50px] bg-[#FFFF00] hover:bg-[#e6e600] rounded-[16px] flex items-center justify-center text-black font-black text-[14px] uppercase transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Next
              </button>
              <button 
                id="blockBtn"
                onClick={blockUser}
                className="w-[50px] h-[50px] bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-[16px] flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
                title="Block User"
              >
                🚫
              </button>
              <button 
                id="reportBtn"
                onClick={reportUser}
                className="w-[50px] h-[50px] bg-red-600/20 hover:bg-red-600/40 backdrop-blur-md rounded-[16px] flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 border border-red-600/20"
                title="Report User"
              >
                🚩
              </button>
            </div>
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
