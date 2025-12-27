"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useVideoChat } from '@/hooks/useVideoChat';
import { createClient } from '@/lib/supabase/client';
import { Video, Zap, Shield, Globe, Flag, Ban, Sparkles, Heart, MessageSquare, Maximize, Minimize, Timer } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AdsModal } from '@/components/ads-modal';

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
      {dots.map((dot, i) => (dot && (
        <motion.div
          key={dot.id}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{ left: dot.x, top: dot.y, transform: 'translate(-50%, -50%)' }}
        />
      )))}
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
        partnerLocation,
        userLocation,
        likePartner,
        isLiked,
        isMutualMatch,
        partnerId,
        hasFilterAccess,
        filterExpiry,
        userId
      } = useVideoChat();
    
      const [onlineCount, setOnlineCount] = useState(0);
      const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
      const [isSparkleRain, setIsSparkleRain] = useState(false);
      const [isFullscreen, setIsFullscreen] = useState(false);
      const [isAdsModalOpen, setIsAdsModalOpen] = useState(false);
      const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

      useEffect(() => {
        if (filterExpiry) {
          const updateTimer = () => {
            const now = Date.now();
            const expiry = new Date(filterExpiry).getTime();
            const diff = expiry - now;
            if (diff > 0) {
              const mins = Math.floor(diff / 60000);
              const secs = Math.floor((diff % 60000) / 1000);
              setTimeRemaining(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
            } else {
              setTimeRemaining(null);
            }
          };
          updateTimer();
          const interval = setInterval(updateTimer, 1000);
          return () => clearInterval(interval);
        } else {
          setTimeRemaining(null);
        }
      }, [filterExpiry]);

  
    // 3D Tilt Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-300, 300], [15, -15]);
    const rotateY = useTransform(x, [-300, 300], [-15, 15]);
    const springConfig = { damping: 20, stiffness: 150 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);
  
    const triggerSparkleRain = () => {
      setIsSparkleRain(true);
      setTimeout(() => setIsSparkleRain(false), 3000);
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
    const supabase = createClient();
    const fetchCount = async () => {
      const { count } = await supabase
        .from('online_users')
        .select('*', { count: 'exact', head: true });
      if (count !== null) {
        setOnlineCount(count);
      }
    };
    
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col md:flex-row min-h-[100vh] w-full relative overflow-hidden">
      <CursorTrail />
      {/* Left Column: Purple Branding Area */}
      <div className={cn(
        "flex-[0.6] md:flex-1 bg-[#634AF1] relative flex flex-col items-center justify-center py-12 md:py-16 px-6 overflow-hidden transition-all duration-300",
        status === 'in-call' && "hidden md:flex"
      )}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-10" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        
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

        <AnimatePresence>
          {isSparkleRain && Array.from({ length: 15 }).map((_, i) => (
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
              ✨
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] border-[2px] border-dashed border-white rounded-full" />
        </motion.div>

        {/* Emojis - Hidden on mobile for less clutter */}
        <motion.div 
          className="absolute top-[10%] left-[10%] text-4xl md:text-5xl select-none pointer-events-none z-10 filter drop-shadow-2xl hidden xs:block"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          🌍
        </motion.div>

        <motion.div 
          className="absolute top-[30%] right-[10%] text-5xl md:text-6xl select-none pointer-events-none z-10 filter drop-shadow-2xl hidden sm:block"
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -25, 25, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          ⚡
        </motion.div>

        <motion.div 
          className="absolute bottom-[15%] left-[10%] text-4xl md:text-5xl select-none pointer-events-none z-10 filter drop-shadow-2xl hidden sm:block"
          animate={{ 
            x: [0, 40, 0],
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          ✨
        </motion.div>

        <motion.div
          className="absolute -left-4 bottom-1/4 text-5xl md:text-7xl select-none cursor-pointer z-40 active:scale-90"
          initial={{ x: -60 }}
          whileHover={{ x: 20, rotate: 10, scale: 1.1 }}
          onClick={triggerSparkleRain}
          title="Click for surprise!"
        >
          ✨
        </motion.div>

        <motion.div 
          className="z-20 text-center flex flex-col items-center pt-8 md:pt-0"
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
            <h1 className="text-white text-[48px] md:text-[80px] font-[950] tracking-tighter uppercase leading-[0.9] mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] select-none bg-gradient-to-r from-white via-yellow-200 to-white bg-[length:200%_auto] animate-gradient-text bg-clip-text text-transparent">
              Funkey<span className="text-[#FFFF00]">.</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-white text-[18px] md:text-[26px] font-[600] mb-8 md:mb-10 opacity-90 max-w-[280px] md:max-w-[320px] leading-tight tracking-tight select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ transform: "translateZ(30px)" }}
          >
            Vibe with strangers, make real <span className="underline decoration-[#FFFF00] decoration-2 md:decoration-4 underline-offset-4">connections</span>.
          </motion.p>

          <motion.div
            className="px-6 py-2 md:px-8 md:py-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/30 text-white font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl cursor-pointer hover:bg-white/20 transition-colors"
            animate={{ 
              scale: [1, 1.05, 1],
              boxShadow: ["0 0 20px rgba(255,255,0,0)", "0 0 20px rgba(255,255,0,0.2)", "0 0 20px rgba(255,255,0,0)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ transform: "translateZ(40px)" }}
          >
            <motion.span 
              className="w-2 h-2 md:w-2.5 md:h-2.5 bg-yellow-400 rounded-full" 
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            Live & Global
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute text-3xl pointer-events-none z-30 opacity-30 hidden lg:block"
          animate={{ 
            x: mousePos.x / 12 - 60, 
            y: mousePos.y / 12 - 60,
            rotate: (mousePos.x - (typeof window !== 'undefined' ? window.innerWidth : 0) / 2) / 40
          }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
        >
          ✨
        </motion.div>
      </div>

      {/* Right Column: Video Chat Area */}
        <div className={cn(
          "flex-1 bg-[#0B032D] relative flex flex-col items-center justify-center py-12 md:py-16 px-6",
          isFullscreen && status === 'in-call' && "fixed inset-0 z-[100] p-0"
        )}>
          {status === 'idle' || status === 'waiting' ? (

          <>
              <div className="flex flex-col items-center text-center space-y-2 mb-8 md:mb-12">
                <div className="flex items-center gap-2 text-white/90 text-[16px] md:text-[18px] font-semibold">
                  <span>👩‍🦳👨‍🦳</span>
                  <span>{onlineCount.toLocaleString()} users online</span>
                </div>
                <div id="locationLabel" className="text-white/60 text-xs md:text-sm font-medium">
                  {userLocation || "🌍 Detecting location..."}
                </div>
              </div>

            <div className="w-full max-w-[340px] space-y-4 md:space-y-6">
              {status === 'waiting' && (
                <div className="text-white text-center mb-4 animate-pulse text-sm md:text-base">
                  Searching for a match...
                </div>
              )}
              
                <Magnetic>
                  <div className="relative group/filter">
                    <button 
                      onClick={() => {
                        if (hasFilterAccess) {
                          const next = genderFilter === 'Both' ? 'Male' : genderFilter === 'Male' ? 'Female' : 'Both';
                          setGenderFilter(next);
                        } else {
                          setIsAdsModalOpen(true);
                        }
                      }}
                      className={cn(
                        "w-full h-[56px] md:h-[64px] rounded-[16px] md:rounded-[20px] flex items-center justify-center gap-3 transition-all active:scale-95 border",
                        hasFilterAccess 
                          ? "bg-[#1C1243] border-yellow-400/50 hover:bg-[#251955]" 
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      )}
                    >
                      <span className="text-xl md:text-2xl">
                        {genderFilter === 'Both' ? '👨‍👩‍👦' : genderFilter === 'Male' ? '👨' : '👩'}
                      </span>
                      <div className="flex flex-col items-start">
                        <span className="text-white font-bold text-base md:text-lg">{genderFilter}</span>
                        {!hasFilterAccess && (
                          <span className="text-yellow-400 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                            <Zap size={8} className="fill-yellow-400" /> Unlock with Ads
                          </span>
                        )}
                        {timeRemaining && (
                          <span className="text-green-400 text-[10px] font-black uppercase tracking-tighter flex items-center gap-1">
                            <Timer size={8} /> {timeRemaining} left
                          </span>
                        )}
                      </div>
                    </button>
                    
                    {!hasFilterAccess && (
                      <div className="absolute -top-3 -right-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-full rotate-12 shadow-xl border-2 border-[#0B032D]">
                        ADS
                      </div>
                    )}
                  </div>
                </Magnetic>


              <Magnetic>
                  <button 
                    id="startBtn"
                    onClick={startMatchmaking}
                    disabled={status === 'waiting'}
                    className="w-full h-[56px] md:h-[64px] bg-[#FFFF00] hover:bg-[#e6e600] rounded-[16px] md:rounded-[20px] flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,0,0.15)] disabled:opacity-50"
                  >
                    <Video className="w-5 h-5 md:w-6 md:h-6 text-black" />
                    <span className="text-black font-extrabold text-[16px] md:text-[18px] uppercase tracking-wide">
                      {status === 'waiting' ? 'Matching...' : 'Start'}
                    </span>
                  </button>

              </Magnetic>
            </div>
          </>
        ) : (
          <div className={cn(
            "absolute inset-0 w-full h-full bg-black flex flex-col",
            isFullscreen && "md:flex-row"
          )}>
            <div className={cn(
              "flex-1 relative overflow-hidden bg-[#0B032D]",
              isFullscreen ? "border-b md:border-b-0 md:border-r border-white/10" : "border-b border-white/10"
            )}>
              <video 
                id="remoteVideo"
                ref={remoteVideoRef}
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              <AnimatePresence>
                {!remoteStream && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0B032D]"
                  >
                    <div className="relative w-16 h-16 md:w-20 md:h-20 mb-4">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full"
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl">
                        ⚡
                      </div>
                    </div>
                    <p className="text-white/60 text-sm md:text-base font-medium animate-pulse">Connecting...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isMutualMatch && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-brand-purple/80 backdrop-blur-xl p-6"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-6xl md:text-8xl mb-6 md:mb-8"
                    >
                      ❤️
                    </motion.div>
                    <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-3 md:mb-4 text-center">It's a Match!</h2>
                    <p className="text-white/80 font-bold mb-6 md:mb-8 uppercase tracking-widest text-[10px] md:text-sm text-center">You are now friends</p>
                    <Link
                      href={`/chat?partnerId=${partnerId}`}
                      className="bg-[#FFFF00] text-black px-6 py-3 md:px-8 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] font-black uppercase tracking-tighter flex items-center gap-3 hover:scale-105 transition-transform text-sm md:text-base"
                    >
                      <MessageSquare size={18} className="md:w-5" />
                      Send Message
                    </Link>
                    <button
                      onClick={nextMatch}
                      className="mt-6 text-white/40 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:text-white transition-colors"
                    >
                      Or keep vibing
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

                <div className="absolute top-4 left-4 z-30 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                  <span className="text-white text-[10px] md:text-xs font-medium">
                    {partnerLocation || "🌍 Detecting..."}
                  </span>
                </div>
            </div>

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
                <span className="text-white text-[10px] md:text-xs font-medium">You</span>
              </div>
            </div>

              <div className="absolute bottom-6 inset-x-0 px-4 flex justify-center gap-2 md:gap-3 z-30">
                <button 
                  id="nextBtn"
                  onClick={nextMatch}
                  className="flex-[2] max-w-[140px] h-[48px] md:h-[50px] bg-[#FFFF00] hover:bg-[#e6e600] rounded-[14px] md:rounded-[16px] flex items-center justify-center text-black font-black text-[13px] md:text-[14px] uppercase transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Next
                </button>
                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="w-[48px] h-[48px] md:w-[50px] md:h-[50px] bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-[14px] md:rounded-[16px] flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? <Minimize size={20} className="md:w-6" /> : <Maximize size={20} className="md:w-6" />}
                </button>
                <button 
                  onClick={likePartner}

                disabled={isLiked}
                className={cn(
                  "w-[48px] h-[48px] md:w-[50px] md:h-[50px] backdrop-blur-md rounded-[14px] md:rounded-[16px] flex items-center justify-center transition-all hover:scale-110 active:scale-90 border",
                  isLiked 
                    ? "bg-red-500 text-white border-red-500" 
                    : "bg-white/10 text-white/40 hover:text-red-500 border-white/10"
                )}
                title="Like Partner"
              >
                <Heart size={20} className="md:w-6" fill={isLiked ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>
              <button 
                id="blockBtn"
                onClick={blockUser}
                className="w-[48px] h-[48px] md:w-[50px] md:h-[50px] bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-[14px] md:rounded-[16px] flex items-center justify-center text-[18px] md:text-[20px] transition-all hover:scale-105 active:scale-95 border border-white/10"
                title="Block User"
              >
                🚫
              </button>
              <button 
                id="reportBtn"
                onClick={reportUser}
                className="w-[48px] h-[48px] md:w-[50px] md:h-[50px] bg-red-600/20 hover:bg-red-600/40 backdrop-blur-md rounded-[14px] md:rounded-[16px] flex items-center justify-center text-[18px] md:text-[20px] transition-all hover:scale-105 active:scale-95 border border-red-600/20"
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

      <AdsModal 
        isOpen={isAdsModalOpen} 
        onClose={() => setIsAdsModalOpen(false)} 
        userId={userId} 
        onSuccess={() => {
          setIsAdsModalOpen(false);
          // The hook will pick up the change automatically
        }}
      />
    </section>
  );
};

export default HeroSplit;
