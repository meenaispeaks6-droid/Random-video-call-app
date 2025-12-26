"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Video, Sparkles, Zap, Shield, MessageSquare } from 'lucide-react';

const Introduction = () => {
  const [mounted, setMounted] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [10, -10]);
  const rotateY = useTransform(x, [-200, 200], [-10, 10]);
  const springX = useSpring(rotateX, { damping: 20, stiffness: 150 });
  const springY = useSpring(rotateY, { damping: 20, stiffness: 150 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!mounted) {
    return (
      <section className="relative w-full py-20 px-6 overflow-hidden bg-[#634AF1]">
        <div className="container mx-auto max-w-[1280px]">
          <h2 className="mb-12 text-center text-white font-display text-[28px] md:text-[40px] font-extrabold tracking-tight uppercase leading-[1.2]">
            VIDEO CHAT & TALK TO STRANGERS
          </h2>
          <div className="relative w-full bg-white/10 backdrop-blur-[12px] border border-white/20 rounded-[40px] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12 lg:gap-24 overflow-hidden">
             <div className="flex-1 space-y-12 relative z-10">
                <div className="space-y-4">
                  <h3 className="text-white font-display text-2xl font-bold leading-tight flex items-center gap-3">
                    <span className="text-[#FFFF00]">#1</span> Random Video Chat Platform
                  </h3>
                  <p className="text-white/85 text-base md:text-[16px] leading-[1.6] font-normal">
                    Funkey is the premier platform for live video chat, seamlessly connecting you with new people both locally and globally.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full py-12 md:py-24 px-4 md:px-6 overflow-hidden bg-[#634AF1]">
      <div className="container mx-auto max-w-[1280px]">
        {/* Section Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-16 text-center text-white font-display text-[24px] md:text-[40px] font-extrabold tracking-tight uppercase leading-tight"
        >
          VIDEO CHAT & TALK TO STRANGERS
        </motion.h2>

        {/* Main Glassmorphism Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full bg-white/10 backdrop-blur-[12px] border border-white/20 rounded-[32px] md:rounded-[40px] p-6 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-10 lg:gap-24 overflow-hidden"
        >
          {/* Animated Background Blobs in Card */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-[-20%] right-[-10%] w-[250px] h-[250px] md:w-[300px] md:h-[300px] bg-blue-400/20 rounded-full blur-[60px] md:blur-[80px] pointer-events-none"
          />

          {/* Left Side: Content Text */}
          <div className="flex-1 space-y-8 md:space-y-12 relative z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-3 md:space-y-4"
            >
              <h3 className="text-white font-display text-xl md:text-2xl font-bold leading-tight flex items-center gap-2 md:gap-3">
                <span className="text-[#FFFF00]">#1</span> Random Video Chat Platform
              </h3>
              <p className="text-white/85 text-[15px] md:text-base leading-relaxed font-normal">
                Funkey is the premier platform for live video chat, seamlessly connecting you with new people both locally and globally. Experience Funkey's real-time surprises, authentic excitement, and meaningful interactions on any device or web browser.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="space-y-3 md:space-y-4"
            >
              <h3 className="text-white font-display text-xl md:text-2xl font-bold leading-tight flex items-center gap-2 md:gap-3">
                <span className="text-[#FFFF00]">✨</span> Premium Video Chat Experience
              </h3>
              <p className="text-white/85 text-[15px] md:text-base leading-relaxed font-normal">
                Funkey lets you experience the thrill of random video chat - connecting with new people worldwide in real time. It&apos;s the perfect platform for those who enjoy spontaneous chats or want to talk to strangers in a safe environment.
              </p>
            </motion.div>
          </div>

            {/* Right Side: Visual Preview */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
              className="relative flex-1 w-full max-w-[340px] md:max-w-[440px] aspect-square flex items-center justify-center"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ 
                rotateX: springX, 
                rotateY: springY, 
                transformStyle: "preserve-3d" 
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute w-[80%] h-[70%] bg-blue-500/10 rounded-3xl blur-2xl transform -translate-x-12 rotate-[-6deg]"></div>
                <div className="absolute w-[80%] h-[70%] bg-purple-500/10 rounded-3xl blur-2xl transform translate-x-12 rotate-[6deg]"></div>
              </div>

              <motion.div 
                className="relative z-10 w-full aspect-[4/5] bg-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] md:rounded-[32px] flex items-center justify-center shadow-2xl overflow-hidden group"
                style={{ transform: "translateZ(50px)" }}
              >
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Gemini_Generated_Image_6fothz6fothz6fot-resized-1766684312919.webp?width=8000&height=8000&resize=contain"
                  alt="Funkey App Preview"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>

                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-3 -right-3 md:-top-4 md:-right-4 text-3xl md:text-5xl z-20"
                  style={{ transform: "translateZ(80px)" }}
                >
                  ✨
                </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 text-3xl md:text-5xl z-20"
                style={{ transform: "translateZ(60px)" }}
              >
                ⚡
              </motion.div>
            </motion.div>

        </motion.div>
      </div>



    </section>
  );
};

export default Introduction;
