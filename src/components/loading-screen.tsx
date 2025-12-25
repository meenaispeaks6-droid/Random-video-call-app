"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const funnyMessages = [
  "Calculating the meaning of life...",
  "Feeding the server hamsters...",
  "Brewing coffee for the pixels...",
  "Locating the 'any' key...",
  "Downloading more RAM...",
  "Optimizing the vibes...",
  "Teaching a robot to love...",
  "Convincing the bits to stay in order...",
  "Polishing the buttons...",
  "Untangling the internet wires...",
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % funnyMessages.length);
    }, 2000);

    // Simulate loading time - in a real app, this would be tied to actual loading state
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
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brand-purple overflow-hidden"
        >
          {/* Background shapes for aesthetics */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              rotate: [0, -120, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-20 -right-20 w-80 h-80 bg-brand-dark/20 rounded-full blur-3xl"
          />

          {/* Funny Animation */}
          <div className="relative mb-12">
            <motion.div
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 0.9, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-8xl select-none cursor-default"
            >
              🫠
            </motion.div>
            
            {/* Pulsing ring around the emoji */}
            <motion.div
              animate={{
                scale: [1, 2],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 bg-brand-yellow rounded-full -z-10 blur-xl"
            />
          </div>

          {/* Text content */}
          <div className="text-center px-6 relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black text-brand-yellow uppercase tracking-tighter mb-4"
            >
              Vibing...
            </motion.h2>
            
            <div className="h-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-white/80 font-medium italic"
                >
                  {funnyMessages[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Minimal progress indicator */}
          <div className="mt-12 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="h-full bg-brand-yellow shadow-[0_0_15px_rgba(255,255,0,0.5)]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
