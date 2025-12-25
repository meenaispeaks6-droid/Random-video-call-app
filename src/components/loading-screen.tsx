"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const messages = [
  "harmonizing",
  "syncing",
  "elevating",
  "refining",
  "curating",
];

export function LoadingScreen() {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 1000);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => {
      clearInterval(interval);
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
            transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden"
        >
          {/* Animated Gradient Background */}
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.25, 0.15],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7c3aed] rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#f59e0b] rounded-full blur-[150px]"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Morphing Blob */}
            <div className="relative w-32 h-32 mb-12">
              <motion.div
                animate={{
                  borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "50% 50% 20% 80% / 25% 80% 20% 75%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-tr from-[#7c3aed] to-[#f59e0b] blur-sm opacity-80"
              />
              <motion.div
                animate={{
                  borderRadius: ["50% 50% 20% 80% / 25% 80% 20% 75%", "40% 60% 70% 30% / 40% 50% 60% 50%", "50% 50% 20% 80% / 25% 80% 20% 75%"],
                  rotate: [360, 180, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-white/10 backdrop-blur-3xl border border-white/20"
              />
            </div>

            <div className="flex flex-col items-center">
              <motion.h2 
                initial={{ letterSpacing: "0.5em", opacity: 0 }}
                animate={{ letterSpacing: "0.2em", opacity: 1 }}
                className="text-white text-xs font-light uppercase mb-6 tracking-[0.5em]"
              >
                Funkey
              </motion.h2>

              <div className="h-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[#888] text-[10px] uppercase tracking-[0.3em] font-medium"
                  >
                    {messages[index]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Grain */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
          }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
