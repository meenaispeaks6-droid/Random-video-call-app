import React from 'react';
import Image from 'next/image';

const FeaturesGrid = () => {
  const features = [
    {
      title: "Dynamic Video Chats",
      description: "Dive into real-time, personal video conversations that redefine human connections. Funkey's lightning-fast and spontaneous video interactions create exhilarating encounters, making every conversation feel fresh and authentic.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/mt_1-3.png",
      alt: "Dynamic Video Chats icon"
    },
    {
      title: "Global Reach",
      description: "Break through geographical barriers and engage with a diverse global community. Funkey's platform fosters cross-cultural interactions that broaden perspectives and spark meaningful exchanges with people worldwide.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/mt_2-4.png",
      alt: "Global Reach icon"
    },
    {
      title: "Simplicity and Security",
      description: "Experience Funkey's intuitive interface, enabling seamless video chats. Our platform prioritizes stringent security, ensuring user safety and privacy.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/mt_3-5.png",
      alt: "Simplicity and Security icon"
    },
    {
      title: "Random Matching",
      description: "Explore Funkey's random matching feature for unexpected encounters. Discover new connections and engage in genuine conversations that go beyond the ordinary, enhancing your social experience online.",
      image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/mt_4-6.png",
      alt: "Random Matching icon"
    }
  ];

  return (
    <section className="py-[80px] md:py-[120px] bg-[#634AF1]">
      <div className="container max-w-[1200px] mx-auto px-6">
        <h2 className="text-[36px] font-bold text-center text-white mb-[60px] uppercase tracking-wide">
          MEET PEOPLE LIKE NEVER BEFORE
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card p-10 flex flex-col items-center text-center transition-transform hover:scale-[1.02] duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "32px"
              }}
            >
              {/* Feature Image Wrapper */}
              <div className="relative w-[300px] h-[160px] mb-8 flex items-center justify-center">
                <Image
                  src={feature.image}
                  alt={feature.alt}
                  fill
                  className="object-contain"
                  style={{ 
                    maxHeight: '140px',
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                  }}
                />
              </div>

              {/* Text Content */}
              <h3 className="text-[22px] font-semibold text-white mb-4 leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-[16px] leading-[1.5] text-white/90 max-w-[420px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;