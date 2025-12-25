"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Are There Any Other Sites Like the New Omegle?",
    answer: "Funkey is the premier platform for live video chat, seamlessly connecting you with new people both locally and globally. Experience Funkey's real-time surprises, authentic excitement, and meaningful interactions on any device or web browser—enjoy the same exhilarating environment, now with even more ways to engage.",
  },
  {
    question: "What Makes Funkey Unique in Social Networking?",
    answer: "Funkey lets you experience the thrill of random video chat - connecting with new people worldwide in real time. It’s a top alternative to the original Omegle or any New Omegle platform, perfect for those who enjoy spontaneous chats or want to talk to strangers.",
  },
  {
    question: "Why Choose Funkey for Engaging with New Connections?",
    answer: "Our platform prioritizes stringent security, ensuring user safety and privacy while fostering cross-cultural interactions that broaden perspectives and spark meaningful exchanges with people worldwide.",
  },
  {
    question: "Can I Use Funkey Anytime and Anywhere?",
    answer: "Yes, Funkey is accessible on any device or web browser, allowing you to connect with a diverse global community whenever you feel like meeting new people.",
  },
  {
    question: "Can I Use Funkey for Free?",
    answer: "Funkey offers a free random video chat experience, making it easy for anyone to dive into real-time conversations without financial barriers.",
  },
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-[80px] md:py-[120px] bg-brand-purple">
      <div className="container max-w-[800px]">
        <h2 className="text-[36px] font-bold text-center text-white mb-12 uppercase tracking-tight">
          FAQs
        </h2>

        <div className="flex flex-col gap-3">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <div 
                key={index} 
                className="overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className={cn(
                    "w-full flex items-center justify-between px-8 py-5 text-left rounded-full transition-all duration-200",
                    "bg-white/10 hover:bg-white/15 border border-white/20",
                    isOpen && "bg-white/20 rounded-[28px]"
                  )}
                  aria-expanded={isOpen}
                >
                  <span className="text-[14px] md:text-[16px] font-semibold text-white">
                    {item.question}
                  </span>
                  <ChevronRight 
                    className={cn(
                      "w-4 h-4 text-white transition-transform duration-300 flex-shrink-0 ml-4",
                      isOpen && "rotate-90"
                    )} 
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="px-10 py-5 bg-white/5 rounded-[24px] border border-white/10">
                      <p className="text-[15px] leading-relaxed text-white/90">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;