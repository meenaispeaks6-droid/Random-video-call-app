"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm your FUNKEY AI assistant. How can I help you meet new people today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having a bit of trouble right now. Please try again later!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={embedded ? "w-full" : "fixed bottom-6 right-6 z-[100]"}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={embedded ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            animate={embedded ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={embedded ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 20 }}
            className={`${
              embedded
                ? "w-full h-[600px]"
                : "mb-4 w-[350px] sm:w-[400px] h-[500px]"
            } bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-brand-purple/20`}
          >
            {/* Header */}
            <div className="bg-brand-purple p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold leading-none">FUNKEY AI</h3>
                  <span className="text-xs text-white/70">Online & Ready</span>
                </div>
              </div>
              {!embedded && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.role === "user"
                        ? "bg-brand-purple text-white rounded-tr-none"
                        : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {m.role === "assistant" ? (
                        <Bot className="w-3 h-3 text-brand-purple" />
                      ) : (
                        <User className="w-3 h-3 text-white" />
                      )}
                      <span className="text-[10px] opacity-70 uppercase tracking-wider font-bold">
                        {m.role === "assistant" ? "FUNKEY" : "You"}
                      </span>
                    </div>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-brand-purple/40 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-brand-purple/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-brand-purple rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything about FUNKEY..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-purple transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-purple text-white rounded-lg hover:bg-brand-purple-dark disabled:opacity-50 disabled:hover:bg-brand-purple transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      {!embedded && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-brand-purple text-white p-4 rounded-full shadow-2xl flex items-center gap-2 hover:bg-brand-purple-dark transition-colors group relative"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-[100px] transition-all duration-300 font-medium text-sm">
                Chat Help
              </span>
            </>
          )}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </motion.button>
      )}
    </div>
  );
}
