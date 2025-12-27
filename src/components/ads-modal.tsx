"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Shield, Timer, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

export const AdsModal = ({ isOpen, onClose, userId, onSuccess }: AdsModalProps) => {
  const [adCount, setAdCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      fetchAdCount();
    }
  }, [isOpen]);

  const fetchAdCount = async () => {
    const { data } = await supabase
      .from('online_users')
      .select('ad_views')
      .eq('id', userId)
      .single();
    if (data) setAdCount(data.ad_views || 0);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      handleAdComplete();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleAdComplete = async () => {
    setIsPlaying(false);
    setTimeLeft(15);
    
    const newCount = adCount + 1;
    
    if (newCount >= 5) {
      const expiry = new Date(Date.now() + 2 * 60 * 1000).toISOString();
      await supabase
        .from('online_users')
        .update({ ad_views: 0, filter_expiry: expiry })
        .eq('id', userId);
      setAdCount(0);
      onSuccess();
      onClose();
    } else {
      await supabase
        .from('online_users')
        .update({ ad_views: newCount })
        .eq('id', userId);
      setAdCount(newCount);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-[#1C1243] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        {!isPlaying ? (
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-black">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="text-white text-xl font-black uppercase tracking-tighter">Unlock Filters</h3>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Watch ads to vibe</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-white/60 font-bold uppercase tracking-wider">Progress</span>
                  <span className="text-yellow-400 font-black">{adCount}/5 Ads</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-yellow-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(adCount / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 text-white/40 text-sm italic">
                <Timer size={16} />
                <span>Watching 5 ads gives 2 minutes of filter access</span>
              </div>

              <button
                onClick={() => setIsPlaying(true)}
                className="w-full h-16 bg-[#FFFF00] hover:bg-[#e6e600] rounded-2xl flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95 shadow-xl group"
              >
                <Play className="w-6 h-6 text-black fill-black" />
                <span className="text-black font-black text-lg uppercase tracking-tight">Watch Video Ad</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video bg-black flex flex-col items-center justify-center">
            <div className="absolute top-4 right-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="text-white font-mono text-sm">{timeLeft}s</span>
            </div>
            
            {/* Simulation of a video ad */}
            <div className="flex flex-col items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="text-6xl"
              >
                🎥
              </motion.div>
              <div className="text-center">
                <h4 className="text-white text-2xl font-black uppercase italic tracking-tighter mb-2">Cool App Ad</h4>
                <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Don't close this window</p>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
              <motion.div
                className="h-full bg-yellow-400"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 15, ease: "linear" }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
