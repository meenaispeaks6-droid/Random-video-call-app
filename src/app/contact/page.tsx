"use client";

import HeaderNavigation from "@/components/sections/header-navigation";
import { Mail, MessageCircle, Phone, Send, Sparkles } from "lucide-react";
import AIAssistant from "@/components/ai-assistant";

export default function ContactPage() {
  const contactOptions = [
    { icon: <Mail size={24} />, label: "Email", value: "support@funkey.app", color: "bg-blue-500" },
    { icon: <MessageCircle size={24} />, label: "Discord", value: "Join our community", color: "bg-indigo-500" },
    { icon: <Phone size={24} />, label: "Phone", value: "+1 (555) 123-4567", color: "bg-green-500" },
  ];

  return (
    <main className="min-h-screen bg-brand-purple pt-24 pb-12 px-6">
      <HeaderNavigation />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-[40px] p-8 md:p-12 border border-white/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Send size={200} className="rotate-12" />
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
              Get in <span className="text-[#FFFF00]">Touch</span>
            </h1>
            <p className="text-white/70 text-lg max-w-xl mb-12">
              Have questions or feedback? We'd love to hear from you. Our team typically responds within 24 hours.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {contactOptions.map((option, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all group"
                >
                  <div className={`w-12 h-12 ${option.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                    {option.icon}
                  </div>
                  <div className="text-white/50 text-sm font-bold uppercase tracking-wider mb-1">{option.label}</div>
                  <div className="text-white font-bold break-words">{option.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-12 pt-12 border-t border-white/10">
              <form className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-white font-bold text-sm uppercase tracking-wider ml-2">Name</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#FFFF00] transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-white font-bold text-sm uppercase tracking-wider ml-2">Email</label>
                    <input
                      type="email"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#FFFF00] transition-colors"
                      placeholder="Your email"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white font-bold text-sm uppercase tracking-wider ml-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-[#FFFF00] transition-colors resize-none"
                    placeholder="Tell us everything..."
                  />
                </div>
                <button className="bg-[#FFFF00] text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
