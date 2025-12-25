import React from 'react';
import Image from 'next/image';

const Introduction = () => {
  return (
    <section className="relative w-full bg-[#634AF1] pt-[80px] pb-[40px] px-6 lg:px-0 overflow-hidden">
      {/* Background Watermark Text */}
      <div className="absolute bottom-[-60px] left-0 w-full overflow-hidden opacity-10 pointer-events-none select-none">
        <h2 className="text-[120px] font-[900] whitespace-nowrap text-black uppercase tracking-tight leading-none">
          Monkey.Monkey.Monkey.Monkey.Monkey.
        </h2>
      </div>

      <div className="container mx-auto max-w-[1200px]">
        {/* Main Section Title */}
        <h2 className="text-white text-[32px] md:text-[36px] font-[800] text-center mb-[60px] uppercase tracking-wide">
          OMEGLE VIDEO CHAT & TALK TO STRANGERS
        </h2>

        {/* Large Rounded Container (Glassmorphism) */}
        <div className="glass-card w-full p-8 md:p-[60px] flex flex-col md:flex-row items-center gap-10 md:gap-16">
          
          {/* Text Content */}
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            <div className="space-y-4">
              <h3 className="text-white text-[22px] md:text-[24px] font-[700] leading-[1.3]">
                #1 Random Video Chat Platform
              </h3>
              <p className="text-white/90 text-base leading-[1.6] font-normal">
                Monkey is the premier platform for live video chat, seamlessly connecting you with new people both locally and globally. Experience Monkey&apos;s real-time surprises, authentic excitement, and meaningful interactions on any device or web browser—enjoy the same exhilarating environment, now with even more ways to engage.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-white text-[22px] md:text-[24px] font-[700] leading-[1.3]">
                New Omegle & OmeTV Alternative
              </h3>
              <p className="text-white/90 text-base leading-[1.6] font-normal">
                Monkey lets you experience the thrill of random video chat - connecting with new people worldwide in real time. It&apos;s a top alternative to the original Omegle or any New Omegle platform, perfect for those who enjoy spontaneous chats or want to talk to strangers.
              </p>
            </div>
          </div>

          {/* Stylized Mockup Image Side */}
          <div className="w-full md:w-1/2 flex justify-center items-center relative">
            <div className="relative w-full max-w-[440px] aspect-[4/3]">
              {/* Main Image with inner content styling to match mockup */}
              <div className="relative w-full h-full z-10 transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/mt_5-2.png"
                  alt="Monkey Video Chat Mockup"
                  width={440}
                  height={330}
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Blurred background elements for depth as seen in screenshot */}
              <div className="absolute top-[10%] left-[-15%] w-[80%] h-[80%] bg-white/5 blur-[40px] rounded-full -z-10" />
              <div className="absolute bottom-[10%] right-[-15%] w-[80%] h-[80%] bg-navy/20 blur-[50px] rounded-full -z-10" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 32px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </section>
  );
};

export default Introduction;