import React from 'react';
import Image from 'next/image';

const Introduction = () => {
  return (
    <section className="relative w-full py-20 px-6 overflow-hidden bg-[#634AF1]">
      <div className="container mx-auto max-w-[1280px]">
        {/* Section Heading */}
        <h2 className="mb-12 text-center text-white font-display text-[28px] md:text-[40px] font-extrabold tracking-tight uppercase leading-[1.2]">
          VIDEO CHAT & TALK TO STRANGERS
        </h2>

        {/* Main Glassmorphism Card */}
        <div className="relative w-full bg-white/10 backdrop-blur-[12px] border border-white/20 rounded-[40px] p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-12 lg:gap-24">
          
          {/* Left Side: Content Text */}
          <div className="flex-1 space-y-12">
            {/* Block 1 */}
            <div className="space-y-4">
              <h3 className="text-white font-display text-2xl font-bold leading-tight">
                #1 Random Video Chat Platform
              </h3>
              <p className="text-white/85 text-base md:text-[16px] leading-[1.6] font-normal">
                Funkey is the premier platform for live video chat, seamlessly connecting you with new people both locally and globally. Experience Funkey's real-time surprises, authentic excitement, and meaningful interactions on any device or web browser—enjoy the same exhilarating environment, now with even more ways to engage.
              </p>
            </div>

              {/* Block 2 */}
              <div className="space-y-4">
                <h3 className="text-white font-display text-2xl font-bold leading-tight">
                  Premium Video Chat Experience
                </h3>
                <p className="text-white/85 text-base md:text-[16px] leading-[1.6] font-normal">
                  Funkey lets you experience the thrill of random video chat - connecting with new people worldwide in real time. It&apos;s the perfect platform for those who enjoy spontaneous chats or want to talk to strangers in a safe and engaging environment.
                </p>
              </div>

          </div>

          {/* Right Side: Visual Preview */}
          <div className="relative flex-1 w-full max-w-[440px] aspect-square flex items-center justify-center">
            {/* Background Layered Elements (Blurred cards) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[80%] h-[70%] bg-blue-500/10 rounded-3xl blur-2xl transform -translate-x-12 rotate-[-6deg]"></div>
              <div className="absolute w-[80%] h-[70%] bg-purple-500/10 rounded-3xl blur-2xl transform translate-x-12 rotate-[6deg]"></div>
            </div>

            {/* Main Mockup Image */}
            <div className="relative z-10 w-full animate-float">
              <Image 
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
                alt="Funkey App Video Chat Interface Preview"
                width={440}
                height={420}
                className="object-contain drop-shadow-2xl rounded-3xl"
                priority
              />
            </div>

            {/* Floating Emojis or Icons could go here to match the vibe */}
          </div>
        </div>
      </div>

      {/* Background Watermark Text */}
      <div className="absolute bottom-[-60px] left-0 w-full overflow-hidden pointer-events-none opacity-[0.08] select-none whitespace-nowrap z-0">
        <span className="text-[180px] font-black font-display uppercase tracking-tighter">
          Funkey Funkey Funkey Funkey
        </span>
      </div>
    </section>
  );
};

export default Introduction;