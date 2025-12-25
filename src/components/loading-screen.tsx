"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [message, setMessage] = useState("");

  const funnyMessages = [
    "Convincing pixels to cooperate...",
    "Feeding the server hamsters...",
    "Searching for the 'Any' key...",
    "Reticulating splines...",
    "Calculating the meaning of life...",
    "Downloading more RAM...",
    "Sharpening the pencils...",
    "Herding cats into the server room...",
  ];

  useEffect(() => {
    setMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000); // Slightly longer to read the message

    return () => clearTimeout(timer);
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
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
            <div className="relative flex flex-col items-center">
              {/* Minimal High-Speed Pulse + Funny Icon */}
              <div className="relative w-16 h-16 mb-6">
                <motion.div
                  initial={{ scale: 0, rotate: -45, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1], 
                    rotate: [0, 45, 0],
                    opacity: 1 
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 border-2 border-brand-purple rounded-xl"
                />
                
                {/* Floating funny emoji */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                  className="absolute -top-8 -right-8 text-2xl"
                >
                  ✨
                </motion.div>

                {/* Inner Core */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="absolute inset-4 bg-brand-purple rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center text-xs"
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    ⚡
                  </motion.span>
                </motion.div>
              </div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <h2 className="text-white text-sm font-medium tracking-[0.4em] uppercase">
                  Funkey
                </h2>
                <div className="mt-2 w-12 h-[1px] bg-gradient-to-r from-transparent via-brand-purple to-transparent" />
                
                {/* Funny Message */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 text-[10px] text-white/50 font-mono tracking-wider italic"
                >
                  {message}
                </motion.p>
              </motion.div>
            </div>

          {/* Ambient Flare */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-purple rounded-full blur-[120px] pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
