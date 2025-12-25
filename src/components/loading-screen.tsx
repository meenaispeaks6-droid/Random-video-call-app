"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");

  const boxingMessages = [
    "Mouse is taping up the gloves...",
    "Lion is underestimating the opponent...",
    "Float like a butterfly, sting like a mouse...",
    "Training montage in progress...",
    "Size doesn't matter, speed does...",
    "Setting up the boxing ring...",
    "Mouse: 'You're gonna hear me squeak!'",
  ];

  useEffect(() => {
    setMessage(boxingMessages[Math.floor(Math.random() * boxingMessages.length)]);
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* Spotlight Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
          
          <div className="relative flex flex-col items-center">
            {/* Boxing Arena Floor */}
            <div className="absolute bottom-[-20px] w-[600px] h-[100px] bg-neutral-900/40 rounded-[100%] blur-sm" />
            
            <div className="relative flex items-end justify-center h-64 w-96 mb-8">
              {/* Lion */}
              <motion.div
                initial={{ x: 150, opacity: 0, scale: 1.2 }}
                animate={{ 
                  x: [150, 80, 80, 90, 80, 100, 300],
                  y: [0, 0, -10, 0, -20, -5, -200],
                  rotate: [0, 0, 5, -5, 10, -10, 45],
                  opacity: [0, 1, 1, 1, 1, 1, 0],
                  filter: ["brightness(1)", "brightness(1)", "brightness(1.5)", "brightness(1)", "brightness(1.8)", "brightness(1)", "brightness(1)"]
                }}
                transition={{ 
                  duration: 3.5,
                  times: [0, 0.2, 0.4, 0.5, 0.6, 0.7, 1],
                  ease: "easeInOut"
                }}
                className="text-[120px] select-none z-10"
              >
                🦁
                {/* Dizziness stars */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0, 1, 0],
                    rotate: 360
                  }}
                  transition={{ duration: 3.5, times: [0, 0.6, 0.7, 0.8], repeat: Infinity }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 text-3xl"
                >
                  💫
                </motion.div>
              </motion.div>

              {/* Mouse */}
              <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ 
                  x: [-200, -80, -40, 20, -40, 40, -80],
                  y: [0, 0, -30, 0, -50, 0, 0],
                  opacity: [0, 1, 1, 1, 1, 1, 1]
                }}
                transition={{ 
                  duration: 3.5,
                  times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
                  ease: "backOut"
                }}
                className="relative z-20"
              >
                <div className="text-6xl select-none">🐭</div>
                
                {/* Mouse Punching Arms */}
                <motion.div
                  animate={{ 
                    x: [0, 80, 0],
                    rotate: [0, 20, 0]
                  }}
                  transition={{ 
                    duration: 0.2,
                    repeat: 12,
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                  className="absolute top-2 -right-4 text-4xl"
                >
                  🥊
                </motion.div>
                <motion.div
                  animate={{ 
                    x: [0, 60, 0],
                    rotate: [0, -20, 0]
                  }}
                  transition={{ 
                    duration: 0.15,
                    repeat: 15,
                    repeatType: "reverse",
                    delay: 0.7
                  }}
                  className="absolute top-6 -right-2 text-4xl"
                >
                  🥊
                </motion.div>
              </motion.div>

              {/* Impact Sparks */}
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                    x: [40, 60 + Math.random() * 20],
                    y: [-60, -80 - Math.random() * 40]
                  }}
                  transition={{ 
                    duration: 0.4,
                    delay: 0.5 + (i * 0.3),
                  }}
                  className="absolute text-3xl z-30"
                >
                  ⚡
                </motion.div>
              ))}

              {/* Big Impact */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 0, 0, 4, 0],
                  opacity: [0, 0, 0, 1, 0]
                }}
                transition={{ 
                  duration: 3.5,
                  times: [0, 0.5, 0.65, 0.7, 0.8],
                }}
                className="absolute left-[50%] bottom-32 text-6xl z-40"
              >
                💥
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-white text-lg font-bold tracking-[0.2em] uppercase italic">
                The Main Event
              </h2>
              <div className="mt-2 w-48 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-6 text-[14px] text-white/80 font-mono tracking-wider"
              >
                {message}
              </motion.div>
            </motion.div>
          </div>

          {/* Background Flashes (Camera Flashes) */}
          <motion.div
            animate={{ 
              opacity: [0, 0.3, 0, 0.2, 0, 0.4, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              times: [0, 0.1, 0.2, 0.5, 0.6, 0.9, 1]
            }}
            className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
