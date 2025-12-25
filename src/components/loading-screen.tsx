"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Video, MessageCircle, Heart, Users, Zap, Sparkles, Globe, Camera, Smile, PartyPopper } from "lucide-react";

const funkeyMessages = [
  "Finding your next best friend...",
  "Connecting to the global funkey community...",
  "Polishing the camera lens...",
  "Warming up the video streams...",
  "Matching vibes across the globe...",
  "Searching for mutual hearts...",
  "Preparing the chat bubbles...",
  "Readying the funkey filters...",
  "Connecting hearts in real-time...",
  "Calibrating the 'Hey!' button...",
  "Staging the digital meeting room...",
  "Unleashing the funkey energy...",
  "Gathering the coolest people online...",
  "Optimizing for maximum friendship...",
  "Verifying your awesome vibes...",
];

const icons = [Video, MessageCircle, Heart, Users, Zap, Sparkles, Globe, Camera, Smile, PartyPopper];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % funkeyMessages.length);
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 1800);

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  }, []);

  const ActiveIcon = icons[iconIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-purple overflow-hidden font-sans"
        >
          {/* Brutalist Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Floating Geometric Chaos */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                rotate: [0, 360],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute w-24 h-24 border-2 border-brand-yellow/15 rounded-full flex items-center justify-center"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
               <div className="w-2 h-2 bg-brand-yellow/20 rounded-full" />
            </motion.div>
          ))}

          {/* Main Content Container */}
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6">
            
            {/* The Character / Icon Box */}
            <div className="relative mb-10 h-40 w-full flex items-center justify-center">
              <motion.div
                key={iconIndex}
                initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 1.5, opacity: 0, rotate: 45 }}
                className="bg-brand-yellow p-8 rounded-[2rem] shadow-[12px_12px_0px_0px_rgba(11,3,45,1)] border-4 border-brand-dark text-brand-dark"
              >
                <ActiveIcon size={64} strokeWidth={3} />
              </motion.div>
              
              {/* Particle trail effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      x: [-200, 400],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 0.4 + Math.random() * 0.6,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                    className="absolute h-[3px] bg-brand-yellow/40 rounded-full"
                    style={{ 
                      width: Math.random() * 80 + 40,
                      top: `${Math.random() * 100}%`,
                      left: '-20%'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Funkey OS Style Window */}
            <div className="bg-brand-dark border-4 border-brand-yellow w-full shadow-[16px_16px_0px_0px_rgba(0,0,0,0.3)] rounded-[2rem] overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center gap-2 bg-brand-yellow px-5 py-3 border-b-4 border-brand-dark">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full border-2 border-brand-dark bg-red-400" />
                  <div className="w-3 h-3 rounded-full border-2 border-brand-dark bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full border-2 border-brand-dark bg-green-400" />
                </div>
                <span className="text-[10px] text-brand-dark font-black ml-auto uppercase tracking-widest">
                  FUNKEY_CORE_v2.0
                </span>
              </div>
              
              {/* Message Terminal */}
              <div className="p-6 min-h-[140px] flex flex-col justify-center bg-brand-dark">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={messageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col gap-2"
                  >
                    <p className="text-brand-yellow text-sm font-extrabold leading-tight tracking-tight uppercase italic">
                      {funkeyMessages[messageIndex]}
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-brand-yellow ml-1 align-middle not-italic"
                      />
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                {/* Progress Visual */}
                <div className="mt-8">
                  <div className="flex justify-between text-[10px] text-brand-yellow/60 font-black mb-2 uppercase tracking-tighter">
                    <span>Initializing Connection</span>
                    <span>{(Math.min(100, (messageIndex + 1) * 7))}%</span>
                  </div>
                  <div className="h-8 border-4 border-brand-yellow/20 p-1 bg-brand-purple/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-brand-yellow rounded-full relative overflow-hidden"
                    >
                      {/* Animated stripes on the progress bar */}
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)',
                        backgroundSize: '24px 24px',
                        animation: 'move-stripes 1s linear infinite'
                      }} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-12 flex flex-col items-center gap-3"
            >
              <div className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-yellow" />
                <div className="w-2 h-2 rounded-full bg-brand-yellow/40" />
                <div className="w-2 h-2 rounded-full bg-brand-yellow/20" />
              </div>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.5em] font-black">
                Funkey // Match Your Vibe
              </p>
            </motion.div>
          </div>

          {/* CRIT Style Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '4px 4px'
          }} />
          
          <style jsx>{`
            @keyframes move-stripes {
              from { background-position: 0 0; }
              to { background-position: 48px 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
