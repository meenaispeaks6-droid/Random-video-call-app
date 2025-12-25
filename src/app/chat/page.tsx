"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import HeaderNavigation from "@/components/sections/header-navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Send, User, Search, MoreVertical, Phone, Video, Smile, Paperclip, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface ChatPartner {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  online?: boolean;
}

function ChatContent() {
  const { user } = useAuth();
  const supabase = createClient();
  const searchParams = useSearchParams();
  const initialPartnerId = searchParams.get("partnerId");

  const [partners, setPartners] = useState<ChatPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<ChatPartner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchPartners();
    }
  }, [user]);

  useEffect(() => {
    if (selectedPartner && user) {
      fetchMessages(selectedPartner.id);

      // Subscribe to new messages
      const channel = supabase
        .channel(`chat:${selectedPartner.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `sender_id=eq.${selectedPartner.id},receiver_id=eq.${user.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `sender_id=eq.${user.id},receiver_id=eq.${selectedPartner.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedPartner, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchPartners = async () => {
    try {
      // 1. Get partners from chat_history
      const { data: historyData, error: historyError } = await supabase
        .from("chat_history")
        .select("partner_id, partner_name, partner_avatar")
        .eq("user_id", user?.id);

      if (historyError) throw historyError;

      // 2. Get partners from friends table
      const { data: friendsRaw, error: fError } = await supabase
        .from('friends')
        .select('*')
        .or(`user_1.eq.${user?.id},user_2.eq.${user?.id}`);

      if (fError) throw fError;

      const friendIds = friendsRaw.map(f => f.user_1 === user?.id ? f.user_2 : f.user_1);
      let friendProfiles: any[] = [];
      
      if (friendIds.length > 0) {
        const { data: profiles, error: pError } = await supabase
          .from('profiles')
          .select('id, name, country')
          .in('id', friendIds);
        if (!pError) friendProfiles = profiles;
      }

      // Group into unique partners
      const uniquePartners: Record<string, ChatPartner> = {};
      
      // Add from history first
      historyData?.forEach((item) => {
        if (item.partner_id && !uniquePartners[item.partner_id]) {
          uniquePartners[item.partner_id] = {
            id: item.partner_id,
            name: item.partner_name || "Unknown User",
            avatar: item.partner_avatar || "",
            online: Math.random() > 0.5,
          };
        }
      });

      // Add from friends (might overwrite or add new ones)
      friendProfiles.forEach((profile) => {
        if (!uniquePartners[profile.id]) {
          uniquePartners[profile.id] = {
            id: profile.id,
            name: profile.name || "Friend",
            avatar: "",
            online: true,
          };
        }
      });

      const partnerList = Object.values(uniquePartners);
      setPartners(partnerList);

      if (initialPartnerId) {
        const partner = partnerList.find((p) => p.id === initialPartnerId);
        if (partner) setSelectedPartner(partner);
      } else if (partnerList.length > 0 && !selectedPartner) {
        setSelectedPartner(partnerList[0]);
      }
    } catch (err) {
      console.error("Error fetching partners:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (partnerId: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user?.id})`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPartner || !user) return;

    const messageContent = newMessage;
    setNewMessage("");

    try {
      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: selectedPartner.id,
        content: messageContent,
      });

      if (error) throw error;
      // Optimistic update is handled by the subscription if it includes our own messages
      // But wait, the subscription filters might need to be adjusted or we just manually add it.
      // Let's manually add it for faster feedback.
      const tempMsg: Message = {
        id: Math.random().toString(),
        sender_id: user.id,
        receiver_id: selectedPartner.id,
        content: messageContent,
        created_at: new Date().toISOString(),
      };
      // setMessages((prev) => [...prev, tempMsg]); // Subscription will handle it if correctly set up
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const filteredPartners = partners.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="h-screen bg-[#0F0F0F] text-white flex flex-col overflow-hidden">
      <HeaderNavigation />

      <div className="flex-1 flex pt-20 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col bg-[#141414] shrink-0">
          <div className="p-6">
            <h1 className="text-3xl font-black uppercase tracking-tighter italic mb-6">
              <span className="bg-[#FFFF00] text-black px-2 py-0.5 -rotate-2 inline-block">Direct</span> Messages
            </h1>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#FFFF00] transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border-2 border-white/5 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#FFFF00] transition-all font-bold"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-[#FFFF00] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-[1.5rem] transition-all duration-300 group text-left",
                    selectedPartner?.id === partner.id
                      ? "bg-[#FFFF00] text-black"
                      : "hover:bg-white/5"
                  )}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-purple shrink-0 border-2 border-white/10">
                      {partner.avatar ? (
                        <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-black">
                          {partner.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    {partner.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-[#141414] rounded-full group-active:border-transparent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-black uppercase truncate text-sm tracking-tight">{partner.name}</h3>
                      <span className={cn("text-[10px] font-bold opacity-40", selectedPartner?.id === partner.id && "text-black opacity-100")}>
                        12:45
                      </span>
                    </div>
                    <p className={cn("text-xs font-bold truncate mt-0.5", selectedPartner?.id === partner.id ? "text-black/60" : "text-white/40")}>
                      Hey! How's it going?
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-10 px-4">
                <p className="text-white/20 font-bold italic">No conversations yet.</p>
                <p className="text-white/10 text-xs mt-2">Chat with people to see them here!</p>
              </div>
            )}
          </div>
        </aside>

        {/* Chat Window */}
        <section className="flex-1 flex flex-col bg-[#0F0F0F] relative">
          {selectedPartner ? (
            <>
              {/* Header */}
              <header className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-[#141414]/50 backdrop-blur-xl z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-brand-purple border-2 border-white/10">
                    {selectedPartner.avatar ? (
                      <img src={selectedPartner.avatar} alt={selectedPartner.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-black">
                        {selectedPartner.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-black uppercase tracking-tight text-sm md:text-base">{selectedPartner.name}</h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Online</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <button className="p-2 md:p-3 rounded-xl hover:bg-white/5 transition-colors"><Phone size={20} /></button>
                  <button className="p-2 md:p-3 rounded-xl hover:bg-white/5 transition-colors"><Video size={20} /></button>
                  <button className="p-2 md:p-3 rounded-xl hover:bg-white/5 transition-colors text-white/20"><MoreVertical size={20} /></button>
                </div>
              </header>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                <div className="flex flex-col items-center mb-12">
                  <div className="w-20 h-20 rounded-[2rem] bg-brand-purple p-1 mb-4 rotate-3">
                    <div className="w-full h-full rounded-[1.8rem] overflow-hidden">
                      {selectedPartner.avatar ? (
                        <img src={selectedPartner.avatar} alt={selectedPartner.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-black">
                          {selectedPartner.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Chatting with {selectedPartner.name}</h3>
                  <p className="text-white/40 text-sm font-bold mt-1 uppercase tracking-widest">You met 2 days ago</p>
                </div>

                {messages.map((msg, idx) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col max-w-[80%] md:max-w-[60%]",
                        isMe ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div
                        className={cn(
                          "px-6 py-4 rounded-[2rem] font-bold relative",
                          isMe
                            ? "bg-[#FFFF00] text-black rounded-tr-none"
                            : "bg-white/5 text-white rounded-tl-none border border-white/5"
                        )}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-20 mt-2 px-2">
                        {format(new Date(msg.created_at), "h:mm a")}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-8 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F] to-transparent">
                <form
                  onSubmit={sendMessage}
                  className="bg-[#1A1A1A] border-2 border-white/5 focus-within:border-[#FFFF00]/50 rounded-[2.5rem] p-2 flex items-center gap-2 transition-all shadow-2xl"
                >
                  <button type="button" className="p-3 md:p-4 text-white/20 hover:text-white transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type something unhinged..."
                    className="flex-1 bg-transparent border-none focus:ring-0 font-bold placeholder:text-white/10"
                  />
                  <button type="button" className="p-3 md:p-4 text-white/20 hover:text-white transition-colors hidden sm:block">
                    <Smile size={20} />
                  </button>
                  <button
                    type="submit"
                    className="bg-[#FFFF00] text-black p-3 md:p-4 rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,0,0.2)]"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-24 h-24 bg-white/5 rounded-[3rem] flex items-center justify-center mb-8 rotate-12">
                <MessageSquare size={48} className="text-white/20" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter italic mb-4">
                Select a <span className="text-[#FFFF00]">Vibe</span>
              </h2>
              <p className="text-white/40 font-bold max-w-sm uppercase tracking-widest text-xs leading-relaxed">
                Choose a conversation from the sidebar or head to history to message someone you've met.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="h-screen bg-[#0F0F0F] text-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFFF00] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
