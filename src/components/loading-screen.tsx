"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const orbitingElements = [
    { size: 8, radius: 80, duration: 1.5, delay: 0 },
    { size: 6, radius: 60, duration: 2, delay: 0.2 },
    { size: 10, radius: 100, duration: 2.5, delay: 0.4 },
    { size: 4, radius: 40, duration: 1.2, delay: 0.1 },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.5, ease: "easeOut" } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#634AF1]"
        >
          <div className="relative flex items-center justify-center">
            {/* Orbiting Elements */}
            {orbitingElements.map((el, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-brand-yellow/80"
                style={{
                  width: el.size,
                  height: el.size,
                }}
                animate={{
                  rotate: 360,
                  x: [
                    Math.cos(0) * el.radius,
                    Math.cos(Math.PI / 2) * el.radius,
                    Math.cos(Math.PI) * el.radius,
                    Math.cos(3 * Math.PI / 2) * el.radius,
                    Math.cos(2 * Math.PI) * el.radius
                  ],
                  y: [
                    Math.sin(0) * el.radius,
                    Math.sin(Math.PI / 2) * el.radius,
                    Math.sin(Math.PI) * el.radius,
                    Math.sin(3 * Math.PI / 2) * el.radius,
                    Math.sin(2 * Math.PI) * el.radius
                  ],
                }}
                transition={{
                  duration: el.duration,
                  repeat: Infinity,
                  ease: "linear",
                  delay: el.delay,
                }}
              />
            ))}

            {/* Loading Text */}
            <div className="flex flex-col items-center">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-2xl font-black tracking-widest uppercase"
              >
                loading
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 1] }}
                >
                  ....
                </motion.span>
              </motion.h2>
              
              <motion.div 
                className="mt-2 h-1 bg-brand-yellow rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
