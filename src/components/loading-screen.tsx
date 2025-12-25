"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");

  const funnyMessages = [
    "Political debates in progress...",
    "Donkey's practicing its kick...",
    "Elephant's bracing for impact...",
    "Herding democratic animals...",
    "Loading some heavy kickback...",
    "Donkey: 1, Elephant: 0...",
    "Calculating the force of a hoof...",
  ];

    useEffect(() => {
    setMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.5 } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          <div className="relative flex flex-col items-center">
            <div className="relative flex items-end justify-center h-48 w-80 mb-8">
              {/* Donkey */}
              <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: -40, opacity: 1 }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeOut"
                }}
                className="relative"
              >
                <div className="text-8xl select-none">🫏</div>
                
                {/* Leg Kick Animation */}
                <motion.div
                  initial={{ rotate: 0, originX: "0%", originY: "100%" }}
                  animate={{ 
                    rotate: [0, 0, -80, 20, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    times: [0, 0.4, 0.5, 0.6, 1],
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-6 right-2 text-5xl"
                >
                  🦵
                </motion.div>
              </motion.div>

              {/* Elephant */}
              <motion.div
                initial={{ x: 200, opacity: 0 }}
                animate={{ 
                  x: [200, 60, 60, 500],
                  y: [0, 0, 0, -300],
                  rotate: [0, 0, 0, 360],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{ 
                  duration: 3,
                  times: [0, 0.2, 0.5, 1],
                  ease: "easeInOut"
                }}
                className="text-8xl select-none"
              >
                🐘
              </motion.div>

              {/* Impact Sparkle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 0, 2.5, 0],
                  opacity: [0, 0, 1, 0]
                }}
                transition={{ 
                  duration: 3,
                  times: [0, 0.48, 0.52, 0.6],
                }}
                className="absolute left-[55%] bottom-16 text-4xl"
              >
                💥
              </motion.div>
              
              {/* Dust Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 0, 0.5, 0],
                  scale: [0.5, 0.5, 2, 3],
                  x: [0, 0, 20, 40]
                }}
                transition={{ 
                  duration: 3,
                  times: [0, 0.5, 0.6, 0.8],
                }}
                className="absolute left-[55%] bottom-8 text-2xl"
              >
                💨
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-white text-sm font-medium tracking-[0.4em] uppercase">
                Kicking Off...
              </h2>
              <div className="mt-2 w-24 h-[1px] bg-gradient-to-r from-transparent via-brand-purple to-transparent" />
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-[12px] text-white/70 font-mono tracking-wider italic"
              >
                {message}
              </motion.p>
            </motion.div>
          </div>

          {/* Background Glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple rounded-full blur-[120px] pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
