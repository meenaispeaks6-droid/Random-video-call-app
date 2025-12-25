"use client";

import React, { useEffect, useState } from "react";
import HeaderNavigation from "@/components/sections/header-navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Clock, User, MessageSquare, Trash2, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ChatHistoryItem {
  id: string;
  partner_name: string;
  partner_avatar: string;
  duration: string;
  created_at: string;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_history")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase.from("chat_history").delete().eq("id", id);
      if (error) throw error;
      setHistory(history.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting history item:", err);
    }
  };

  const filteredHistory = history.filter((item) =>
    item.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#1A1A1A] text-white pt-24 pb-12 px-4 md:px-8">
      <HeaderNavigation />

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic flex items-center gap-4">
              <span className="bg-[#FFFF00] text-black px-4 py-1 -rotate-2">Chat</span>
              <span className="text-white">History</span>
            </h1>
            <p className="mt-4 text-white/60 font-medium">
              Relive your best moments and see who you've met.
            </p>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#FFFF00] transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-2 border-white/10 rounded-full py-3 pl-12 pr-6 w-full md:w-64 focus:outline-none focus:border-[#FFFF00] transition-all font-bold placeholder:text-white/20"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#FFFF00] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 font-bold animate-pulse">Loading history...</p>
          </div>
        ) : filteredHistory.length > 0 ? (
          <div className="grid gap-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="group relative bg-white/5 hover:bg-white/10 border-2 border-white/5 hover:border-[#FFFF00]/30 rounded-[2rem] p-4 flex items-center gap-4 transition-all duration-300"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-brand-purple to-pink-500 border-2 border-white/10">
                  {item.partner_avatar ? (
                    <img src={item.partner_avatar} alt={item.partner_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white/40">
                      {item.partner_name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-black uppercase tracking-tight">{item.partner_name}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm font-bold text-white/40">
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {item.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="opacity-50" />
                      {format(new Date(item.created_at), "MMM d, h:mm a")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-3 rounded-xl bg-white/10 hover:bg-[#FFFF00] hover:text-black transition-all">
                    <MessageSquare size={20} />
                  </button>
                  <button 
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-3 rounded-xl bg-white/10 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-6 bg-white/5 border-4 border-dashed border-white/10 rounded-[3rem]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="text-white/20" size={40} />
            </div>
            <h2 className="text-2xl font-black uppercase mb-2">No history yet</h2>
            <p className="text-white/40 font-medium mb-8 max-w-sm mx-auto">
              You haven't had any chats yet. Start exploring and meet new people!
            </p>
            <button className="bg-[#FFFF00] text-black font-black px-8 py-4 rounded-full hover:scale-105 transition-transform active:scale-95">
              START CHATTING
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

function Calendar({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
