"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Video, Globe, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);
  const springX = useSpring(rotateX, { damping: 25, stiffness: 120 });
  const springY = useSpring(rotateY, { damping: 25, stiffness: 120 });

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.21, 0.47, 0.32, 0.98] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className="group relative bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 transition-colors duration-500 overflow-hidden"
    >
      {/* Subtle Glow */}
      <div className="absolute -inset-24 bg-gradient-to-br from-yellow-400/10 via-transparent to-purple-400/10 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 pointer-events-none" />
      
      {/* Icon Area */}
      <div className="relative w-full aspect-[16/10] mb-10 flex items-center justify-center overflow-visible">
        <motion.div 
          className="relative w-32 h-32 flex items-center justify-center rounded-3xl bg-white/5 border border-white/10 group-hover:bg-yellow-400/10 group-hover:border-yellow-400/30 transition-all duration-500"
          style={{ transform: "translateZ(50px)" }}
          whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
        >
          <div className="text-yellow-400 group-hover:scale-110 transition-transform duration-500">
            {icon}
          </div>
          
          {/* Floating dots decoration */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-400/30"
              animate={{
                y: [0, -20, 0],
                x: [0, i % 2 === 0 ? 15 : -15, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                top: `${20 + i * 20}%`,
                left: `${10 + i * 30}%`
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Text Content */}
      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        <h3 className="text-2xl md:text-3xl font-black mb-4 text-white tracking-tight uppercase group-hover:text-yellow-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-lg leading-relaxed text-white/70 font-medium max-w-[380px] group-hover:text-white/90 transition-colors duration-300">
          {description}
        </p>
      </div>
      
      {/* Corner Detail */}
      <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black shadow-[0_0_20px_rgba(255,255,0,0.3)]">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesGrid = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      title: "Real Conversations",
      description: "Dive into spontaneous video chats that spark genuine connections. Every encounter is a new story waiting to unfold.",
      icon: <Video size={64} strokeWidth={1.5} />
    },
    {
      title: "World Connection",
      description: "Meet people from across the globe instantly. Expand your horizon and discover perspectives that cross every border.",
      icon: <Globe size={64} strokeWidth={1.5} />
    },
    {
      title: "Pure & Secure",
      description: "An intuitive experience designed around your safety. We prioritize privacy so you can focus on making friends.",
      icon: <ShieldCheck size={64} strokeWidth={1.5} />
    },
    {
      title: "Random Vibe",
      description: "Let fate take the lead with our matching algorithm. Unexpected encounters that lead to lasting friendships.",
      icon: <Zap size={64} strokeWidth={1.5} />
    }
  ];

  if (!mounted) return null;

  return (
    <section className="bg-[#634AF1] py-24 md:py-40 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[1000px] h-[1000px] border border-white/[0.05] rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] border border-white/[0.05] rounded-full"
        />
      </div>

      <div className="container px-6 relative z-10 mx-auto">
        <header className="max-w-[800px] mx-auto text-center mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase tracking-[0.2em] rounded-full mb-6 shadow-[0_0_20px_rgba(255,255,0,0.2)]"
          >
            Experience More
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white text-4xl md:text-7xl font-[950] uppercase tracking-tighter leading-none mb-8"
          >
            Vibe with the <span className="text-yellow-400">World</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1.5 w-24 bg-white/20 mx-auto rounded-full"
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-[1200px] mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
