"use client";

import React, { useEffect, useState } from "react";
import HeaderNavigation from "@/components/sections/header-navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Heart, User, MessageSquare, Trash2, Search, Sparkles, Globe } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  name: string;
  country: string;
}

interface Friend {
  id: string;
  friend_id: string;
  friend_name: string;
  friend_country: string;
  created_at: string;
}

interface Liker {
  id: string;
  liker_id: string;
  liker_name: string;
  liker_country: string;
  created_at: string;
}

export default function LikesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [likers, setLikers] = useState<Liker[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"friends" | "likers">("friends");

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Friends
      const { data: friendsData, error: friendsError } = await supabase.rpc('get_friends_with_profiles', { uid: user?.id });
      
      // Since RPC might not be set up, I'll fallback to manual query if needed, 
      // but RPC is cleaner for this complex join. 
      // Actually, I'll just do it manually here to avoid needing to create a function first.
      
      const { data: friendsRaw, error: fError } = await supabase
        .from('friends')
        .select('*')
        .or(`user_1.eq.${user?.id},user_2.eq.${user?.id}`);

      if (fError) throw fError;

      const friendIds = friendsRaw.map(f => f.user_1 === user?.id ? f.user_2 : f.user_1);
      
      if (friendIds.length > 0) {
        const { data: profiles, error: pError } = await supabase
          .from('profiles')
          .select('id, name, country')
          .in('id', friendIds);
          
        if (pError) throw pError;
        
        const friendsList = friendsRaw.map(f => {
          const friendId = f.user_1 === user?.id ? f.user_2 : f.user_1;
          const profile = profiles.find(p => p.id === friendId);
          return {
            id: f.id,
            friend_id: friendId,
            friend_name: profile?.name || "Unknown User",
            friend_country: profile?.country || "Global",
            created_at: f.created_at
          };
        });
        setFriends(friendsList);
      }

      // 2. Fetch Likers (who haven't become friends yet)
      const { data: likesRaw, error: lError } = await supabase
        .from('likes')
        .select('*, profiles!likes_user_id_fkey(id, name, country)')
        .eq('target_id', user?.id);
        
      if (lError) {
          // Fallback if relationship is not detected by Supabase
          const { data: likesOnly, error: loError } = await supabase
            .from('likes')
            .select('*')
            .eq('target_id', user?.id);
            
          if (loError) throw loError;
          
          const likerIds = likesOnly.map(l => l.user_id);
          if (likerIds.length > 0) {
              const { data: likerProfiles, error: lpError } = await supabase
                .from('profiles')
                .select('id, name, country')
                .in('id', likerIds);
              
              if (lpError) throw lpError;
              
              const likersList = likesOnly
                .filter(l => !friendIds.includes(l.user_id))
                .map(l => {
                  const profile = likerProfiles.find(p => p.id === l.user_id);
                  return {
                    id: l.id,
                    liker_id: l.user_id,
                    liker_name: profile?.name || "Someone",
                    liker_country: profile?.country || "Earth",
                    created_at: l.created_at
                  };
                });
              setLikers(likersList);
          }
      } else {
          const likersList = likesRaw
            .filter(l => !friendIds.includes(l.user_id))
            .map(l => ({
                id: l.id,
                liker_id: l.user_id,
                liker_name: (l.profiles as any)?.name || "Someone",
                liker_country: (l.profiles as any)?.country || "Earth",
                created_at: l.created_at
            }));
          setLikers(likersList);
      }

    } catch (err) {
      console.error("Error fetching likes data:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFriend = async (id: string) => {
    try {
      const { error } = await supabase.from("friends").delete().eq("id", id);
      if (error) throw error;
      setFriends(friends.filter((f) => f.id !== id));
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-white pt-24 pb-12 px-4 md:px-8">
      <HeaderNavigation />

      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic flex flex-wrap items-center gap-4">
            <span className="bg-[#FFFF00] text-black px-4 py-1 -rotate-2">Likes</span>
            <span className="text-white">& Matches</span>
          </h1>
          <p className="mt-4 text-white/40 font-bold uppercase tracking-widest text-xs">
            See who's vibing with you
          </p>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/5 p-2 rounded-[2rem] w-fit">
          <button
            onClick={() => setActiveTab("friends")}
            className={cn(
              "px-8 py-3 rounded-[1.5rem] font-black uppercase tracking-tight transition-all",
              activeTab === "friends" ? "bg-[#FFFF00] text-black scale-105 shadow-xl" : "text-white/40 hover:text-white"
            )}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("likers")}
            className={cn(
              "px-8 py-3 rounded-[1.5rem] font-black uppercase tracking-tight transition-all",
              activeTab === "likers" ? "bg-[#FFFF00] text-black scale-105 shadow-xl" : "text-white/40 hover:text-white"
            )}
          >
            Likes ({likers.length})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-[#FFFF00] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/20 font-black uppercase tracking-widest text-xs animate-pulse">Scanning vibes...</p>
          </div>
        ) : activeTab === "friends" ? (
          friends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  className="group bg-[#141414] hover:bg-[#1A1A1A] border-2 border-white/5 hover:border-[#FFFF00]/30 rounded-[2.5rem] p-6 flex items-center gap-5 transition-all duration-300"
                >
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-[1.8rem] bg-brand-purple flex items-center justify-center text-3xl font-black border-4 border-white/5 group-hover:rotate-6 transition-transform">
                      {friend.friend_name.charAt(0)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#FFFF00] text-black rounded-full flex items-center justify-center border-4 border-[#141414] group-hover:scale-110 transition-transform">
                      <Sparkles size={12} fill="currentColor" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black uppercase tracking-tight truncate">{friend.friend_name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-white/40 font-bold uppercase tracking-widest text-[10px]">
                      <Globe size={10} />
                      {friend.friend_country}
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <Link 
                        href={`/chat?partnerId=${friend.friend_id}`}
                        className="bg-white/5 hover:bg-[#FFFF00] hover:text-black p-3 rounded-2xl transition-all"
                      >
                        <MessageSquare size={18} />
                      </Link>
                      <button 
                        onClick={() => removeFriend(friend.id)}
                        className="bg-white/5 hover:bg-red-500/20 hover:text-red-500 p-3 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-8 bg-white/5 border-4 border-dashed border-white/10 rounded-[3rem]">
              <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 rotate-12">
                <Heart className="text-white/10" size={48} />
              </div>
              <h2 className="text-3xl font-black uppercase mb-2 italic">Lonely in here?</h2>
              <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-8 max-w-sm mx-auto">
                No mutual matches yet. Keep vibing in the video chat and hit that heart button!
              </p>
              <Link href="/" className="inline-block bg-[#FFFF00] text-black font-black px-10 py-5 rounded-[2rem] hover:scale-105 transition-transform active:scale-95 shadow-2xl">
                START MATCHING
              </Link>
            </div>
          )
        ) : likers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {likers.map((liker) => (
              <div
                key={liker.id}
                className="bg-[#141414] border-2 border-white/5 rounded-[2.5rem] p-6 flex items-center gap-5"
              >
                <div className="w-20 h-20 rounded-[1.8rem] bg-pink-500/20 flex items-center justify-center text-3xl font-black border-4 border-white/5 text-pink-500">
                  ?
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-black uppercase tracking-tight blur-sm select-none">{liker.liker_name}</h3>
                  <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-1">Liked you {format(new Date(liker.created_at), "MMM d")}</p>
                  <Link 
                    href="/"
                    className="mt-4 inline-flex items-center gap-2 text-[#FFFF00] font-black uppercase tracking-tighter text-sm hover:underline"
                  >
                    Match to unlock <Sparkles size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-8 bg-white/5 border-4 border-dashed border-white/10 rounded-[3rem]">
            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 -rotate-12">
              <Sparkles className="text-white/10" size={48} />
            </div>
            <h2 className="text-3xl font-black uppercase mb-2 italic">Silence is golden?</h2>
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs mb-8 max-w-sm mx-auto">
              Nobody has liked you yet. Maybe try a different filter or just be more unhinged!
            </p>
            <Link href="/" className="inline-block bg-white text-black font-black px-10 py-5 rounded-[2rem] hover:scale-105 transition-transform">
              GO LIVE NOW
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
