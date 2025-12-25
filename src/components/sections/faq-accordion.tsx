"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={cn(
        "faq-item w-full overflow-hidden transition-all duration-300 ease-in-out cursor-pointer",
        isOpen ? "bg-[rgba(255,255,255,0.15)]" : "bg-[rgba(255,255,255,0.08)]"
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between px-6 py-4 md:py-5 min-h-[64px]">
        <h3 className="text-white text-[16px] md:text-[18px] font-bold leading-tight tracking-normal">
          {question}
        </h3>
        <ChevronRight
          className={cn(
            "w-5 h-5 text-white/50 transition-transform duration-300",
            isOpen ? "rotate-90" : "rotate-0"
          )}
        />
      </div>
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out px-6",
          isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden text-[rgba(255,255,255,0.85)] text-sm md:text-base leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQAccordion = () => {
  const faqs = [
    {
      question: "Are There Any Other Sites Like the New Omegle?",
      answer:
        "Yes, while the original Omegle has closed, platforms like Funkey have emerged as the premier alternative. Funkey offers a safer, more modern experience for random video chat, connecting users worldwide with advanced features like 2P mode and interest-based matching.",
    },
    {
      question: "What Makes Funkey Unique in Social Networking?",
      answer:
        "Funkey focuses on 'Social Entertainment.' Unlike traditional social media, it's designed for spontaneous, real-time interactions. With a high-energy vibe, Gen-Z focused design, and lightning-fast video matching, it creates authentic human connections that are rare on static platforms.",
    },
    {
      question: "Why Choose Funkey for Engaging with New Connections?",
      answer:
        "Funkey prioritizes speed and security. Our proprietary matching algorithm connects you with relevant peers almost instantly, while our stringent moderation system ensures a safer environment for talking to strangers compared to older platforms.",
    },
      {
        question: "Can I Use Funkey Anytime and Anywhere?",
        answer:
          "Absolutely. Funkey is built to be cross-platform. Whether you're at home on a desktop browser or on the go using your mobile device, you can jump into a video chat whenever you want to meet someone new.",
      },

    {
      question: "Can I Use Funkey for Free?",
      answer:
        "Yes, the core video chat experience on Funkey is free. We believe in making global human connection accessible to everyone. Some premium features or filters may be available to enhance your experience, but you can start talking to strangers at no cost.",
    },
  ];

  return (
    <section className="bg-[#634AF1] py-20 px-4 md:py-32">
      <div className="container max-w-[1000px] mx-auto">
        <h2 className="text-white text-[32px] md:text-[40px] font-extrabold uppercase text-center mb-12 tracking-tight">
          FAQs
        </h2>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index} 
              question={faq.question} 
              answer={faq.answer} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;