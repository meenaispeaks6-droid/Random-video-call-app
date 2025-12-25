"use client";

import HeaderNavigation from "@/components/sections/header-navigation";
import { Settings as SettingsIcon, Bell, Shield, Smartphone } from "lucide-react";

export default function SettingsPage() {
  const sections = [
    { icon: <Bell size={20} />, label: "Notifications", desc: "Manage your alerts" },
    { icon: <Shield size={20} />, label: "Privacy", desc: "Security and data" },
    { icon: <Smartphone size={20} />, label: "Device", desc: "App preferences" },
  ];

  return (
    <main className="min-h-screen bg-brand-purple pt-24 pb-12 px-6">
      <HeaderNavigation />
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-xl rounded-[32px] p-8 border border-white/20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#FFFF00] rounded-2xl flex items-center justify-center text-black">
            <SettingsIcon size={24} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Settings</h1>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <button
              key={idx}
              className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-left group"
            >
              <div className="text-white group-hover:text-[#FFFF00] transition-colors">
                {section.icon}
              </div>
              <div>
                <div className="text-white font-bold">{section.label}</div>
                <div className="text-white/50 text-sm">{section.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
