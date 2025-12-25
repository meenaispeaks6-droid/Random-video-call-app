"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1200);

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
            {/* Minimal High-Speed Pulse */}
            <div className="relative w-16 h-16 mb-4">
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
              <motion.div
                initial={{ scale: 0, rotate: 45, opacity: 0 }}
                animate={{ 
                  scale: [0, 1.1, 1], 
                  rotate: [45, -45, 0],
                  opacity: 0.5 
                }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 border border-white/20 rounded-xl"
              />
              
              {/* Inner Core */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute inset-4 bg-brand-purple rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.4)]"
              />
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
