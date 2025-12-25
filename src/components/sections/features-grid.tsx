"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, imageSrc, imageAlt, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  const springX = useSpring(rotateX, { damping: 20, stiffness: 150 });
  const springY = useSpring(rotateY, { damping: 20, stiffness: 150 });

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
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 relative flex flex-col items-center p-8 md:p-10 transition-shadow duration-300 hover:shadow-2xl overflow-hidden group rounded-[32px]"
    >
      {/* Background Watermark */}
      <div 
        className="absolute top-8 left-8 text-[48px] font-black opacity-[0.05] uppercase select-none pointer-events-none"
        style={{ transform: "translateZ(20px)" }}
      >
        Funkey
      </div>
      
      {/* Illustration Area */}
      <div className="relative w-full aspect-[4/3] mb-8 flex items-center justify-center">
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <motion.div 
          className="relative w-[280px] h-full"
          style={{ transform: "translateZ(60px)" }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-contain drop-shadow-2xl"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </motion.div>
      </div>

      {/* Text Content */}
      <div className="text-center" style={{ transform: "translateZ(40px)" }}>
        <h3 className="text-[24px] font-bold mb-4 leading-tight uppercase tracking-tight text-white">
          {title}
        </h3>
        <p className="text-[16px] leading-[1.6] text-white/85 font-medium max-w-[340px] mx-auto">
          {description}
        </p>
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
      title: "Dynamic Video Chats",
      description: "Dive into real-time, personal video conversations that redefine human connections. Funkey's lightning-fast and spontaneous video interactions create exhilarating encounters, making every conversation feel fresh and authentic.",
      imageSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/mt_1-3.png",
      imageAlt: "Dynamic Video Chats Illustration"
    },
    {
      title: "Global Reach",
      description: "Break through geographical barriers and engage with a diverse global community. Funkey's platform fosters cross-cultural interactions that broaden perspectives and spark meaningful exchanges with people worldwide.",
      imageSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/mt_2-4.png",
      imageAlt: "Global Reach Illustration"
    },
    {
      title: "Simplicity and Security",
      description: "Experience Funkey's intuitive interface, enabling seamless video chats. Our platform prioritizes stringent security, ensuring user safety and privacy.",
      imageSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/mt_3-5.png",
      imageAlt: "Simplicity and Security Illustration"
    },
    {
      title: "Random Matching",
      description: "Explore Funkey's random matching feature for unexpected encounters. Discover new connections and engage in genuine conversations that go beyond the ordinary, enhancing your social experience online.",
      imageSrc: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/mt_4-6.png",
      imageAlt: "Random Matching Illustration"
    }
  ];

  if (!mounted) {
    return (
      <section className="bg-brand-purple py-[100px] md:py-[120px] relative overflow-hidden">
        <div className="container px-6 relative z-10">
          <h2 className="text-white text-center text-[32px] md:text-[40px] font-black uppercase mb-[60px] tracking-tight">
            MEET PEOPLE LIKE NEVER BEFORE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-[1100px] mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[32px] text-center">
                <h3 className="text-white text-2xl font-bold mb-4 uppercase">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-purple py-[100px] md:py-[120px] relative overflow-hidden">
        {/* Background Section Title Watermark */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.03 }}
          viewport={{ once: true }}
          className="absolute top-[20%] left-[-5%] text-[120px] md:text-[180px] font-black uppercase text-white select-none pointer-events-none whitespace-nowrap"
        >
          FUNKEY FUNKEY
        </motion.div>

      <div className="container px-6 relative z-10 mx-auto">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-white text-center text-[32px] md:text-[40px] font-black uppercase mb-[60px] tracking-tight"
        >
          Vibe with Strangers
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-[1100px] mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              title={feature.title}
              description={feature.description}
              imageSrc={feature.imageSrc}
              imageAlt={feature.imageAlt}
            />
          ))}
        </div>
      </div>

      {/* Decorative Assets */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 0.03 }}
        viewport={{ once: true }}
        className="absolute bottom-[10%] right-0 text-[120px] md:text-[180px] font-black uppercase text-white select-none pointer-events-none whitespace-nowrap"
      >
        FUNKEY FUNKEY
      </motion.div>
    </section>
  );
};

export default FeaturesGrid;
