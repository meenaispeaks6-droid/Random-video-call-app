"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const funkeyMessages = [
  "Matching your vibe",
  "Connecting to the world",
  "Initializing streams",
  "Preparing your space",
  "Ready to go",
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % funkeyMessages.length);
    }, 1200);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4500);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.1,
            filter: "blur(20px)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-purple overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-[120px]" 
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Minimal Logo / Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <motion.h1 
                animate={{ 
                  textShadow: [
                    "0 0 20px rgba(255,255,255,0)",
                    "0 0 40px rgba(255,220,100,0.4)",
                    "0 0 20px rgba(255,255,255,0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl font-black tracking-tighter text-white uppercase mb-4"
              >
                Funkey
              </motion.h1>
              
              <div className="h-6 overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={messageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white/40 text-sm font-medium tracking-widest uppercase"
                  >
                    {funkeyMessages[messageIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Simple Progress Line */}
            <div className="mt-12 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%", x: "-100%" }}
                animate={{ width: "100%", x: "0%" }}
                transition={{ duration: 4, ease: "easeInOut" }}
                className="h-full bg-brand-yellow"
              />
            </div>
          </div>

          {/* Grain Overlay for Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] contrast-150 brightness-150" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
