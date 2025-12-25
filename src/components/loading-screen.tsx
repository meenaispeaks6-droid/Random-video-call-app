"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");

  const laughingMessages = [
    "Preparing the punchline...",
    "Wait for it...",
    "Injecting humor...",
    "Calibrating laughter levels...",
    "Optimizing chuckles...",
    "Loading funny business...",
    "Warning: Extreme hilarity ahead!",
  ];

  useEffect(() => {
    setMessage(laughingMessages[Math.floor(Math.random() * laughingMessages.length)]);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FFD700] overflow-hidden"
        >
          {/* Confetti-like Background */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 2000 - 1000, 
                y: Math.random() * 2000 - 1000,
                rotate: 0,
                opacity: 0
              }}
              animate={{ 
                y: [null, Math.random() * 2000 - 1000],
                rotate: 360,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute text-2xl select-none pointer-events-none"
            >
              {["😂", "🤣", "✨", "🎈", "🎉"][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
          
          <div className="relative flex flex-col items-center">
            <div className="relative flex items-center justify-center h-64 w-64 mb-8">
              {/* Main Laughing Emoji */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1, 1.3, 1],
                  rotate: [0, -10, 10, -5, 5, 0],
                  y: [0, -20, 0, -30, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-[160px] select-none z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              >
                😂
              </motion.div>

              {/* Tears of Joy Effects */}
              <motion.div
                animate={{ 
                  x: [-40, -100],
                  y: [20, 100],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5]
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.1 }}
                className="absolute left-0 text-5xl"
              >
                💧
              </motion.div>
              <motion.div
                animate={{ 
                  x: [40, 100],
                  y: [20, 100],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5]
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.15 }}
                className="absolute right-0 text-5xl"
              >
                💧
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-black text-2xl font-black tracking-tighter uppercase italic bg-white px-4 py-1 rotate-2">
                LOL LOADING...
              </h2>
              
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="mt-6 text-lg text-black font-bold bg-white/50 backdrop-blur-sm px-6 py-2 rounded-full border-4 border-black"
              >
                {message}
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
