"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Ghost, Cat, Zap, Terminal, Coffee, Sparkles, Rocket, Brain, Music, Gamepad2 } from "lucide-react";

const funnyMessages = [
  "Bribing the pixels to stay in line...",
  "Searching for the 'any' key (it's hiding)...",
  "Feeding the server hamsters (they're hungry)...",
  "Downloading more RAM... or maybe just a sandwich...",
  "Teaching the CSS to behave itself...",
  "Checking if you're actually a robot... 🤖",
  "Optimizing the vibes to 110%...",
  "Borrowing some of your internet for a party...",
  "Convincing the buttons they are beautiful...",
  "Untangling the digital spaghetti...",
  "Syncing with the moon phases...",
  "Loading... but in a cool way...",
  "Wait, did I leave the oven on?",
  "Calculating the velocity of an unladen swallow...",
  "Converting coffee into code...",
  "Recombobulating the discombobulated...",
];

const icons = [Ghost, Cat, Zap, Terminal, Coffee, Sparkles, Rocket, Brain, Music, Gamepad2];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % funnyMessages.length);
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-purple overflow-hidden font-mono"
        >
          {/* Brutalist Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Floating Geometric Chaos */}
          {[...Array(5)].map((_, i) => (
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
              className="absolute w-24 h-24 border-2 border-brand-yellow/10"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
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
                className="bg-brand-yellow p-8 rounded-lg shadow-[12px_12px_0px_0px_rgba(11,3,45,1)] border-4 border-brand-dark text-brand-dark"
              >
                <ActiveIcon size={64} strokeWidth={3} />
              </motion.div>
              
              {/* Particle trail effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(8)].map((_, i) => (
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
                    className="absolute h-[2px] bg-white/30 rounded-full"
                    style={{ 
                      width: Math.random() * 80 + 40,
                      top: `${Math.random() * 100}%`,
                      left: '-20%'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Retro OS Style Window */}
            <div className="bg-brand-dark border-4 border-brand-yellow w-full shadow-[16px_16px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden">
              {/* Window Header */}
              <div className="flex items-center gap-2 bg-brand-yellow px-3 py-1.5 border-b-4 border-brand-dark">
                <div className="w-3 h-3 border-2 border-brand-dark bg-red-400" />
                <div className="w-3 h-3 border-2 border-brand-dark bg-yellow-400" />
                <div className="w-3 h-3 border-2 border-brand-dark bg-green-400" />
                <span className="text-[10px] text-brand-dark font-black ml-auto uppercase tracking-tighter">
                  LOADING_VIBES.SH
                </span>
              </div>
              
              {/* Message Terminal */}
              <div className="p-5 min-h-[100px] flex flex-col justify-center bg-brand-dark">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={messageIndex}
                    initial={{ opacity: 0, y: 10, skewX: 10 }}
                    animate={{ opacity: 1, y: 0, skewX: 0 }}
                    exit={{ opacity: 0, y: -10, skewX: -10 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-brand-yellow font-black">$</span>
                    <p className="text-brand-yellow text-xs font-bold leading-relaxed tracking-tight">
                      {funnyMessages[messageIndex]}
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-brand-yellow ml-1 align-middle"
                      />
                    </p>
                  </motion.div>
                </AnimatePresence>
                
                {/* Progress Visual */}
                <div className="mt-6">
                  <div className="flex justify-between text-[9px] text-brand-yellow/50 font-black mb-1 uppercase">
                    <span>Transmission</span>
                    <span>{(Math.min(100, (messageIndex + 1) * 7))}%</span>
                  </div>
                  <div className="h-6 border-2 border-brand-yellow/30 p-1 bg-brand-purple/20">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="h-full bg-brand-yellow relative overflow-hidden"
                    >
                      {/* Animated stripes on the progress bar */}
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)',
                        backgroundSize: '20px 20px',
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
              className="mt-10 flex flex-col items-center gap-1"
            >
              <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] font-black">
                Est. 2025 // Hyper-Reality
              </p>
              <div className="w-1 h-8 bg-brand-yellow/20" />
            </motion.div>
          </div>

          {/* CRIT Style Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay" style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '4px 4px'
          }} />
          
          <style jsx>{`
            @keyframes move-stripes {
              from { background-position: 0 0; }
              to { background-position: 40px 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
