import React from 'react';
import Image from 'next/image';

const Footer = () => {
  const assets = {
    googlePlay: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/google-play-badge-us_3x-7.png",
    instagram: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/icons/instagram-3.png",
  };

  return (
    <footer className="w-full bg-[#634AF1] pt-[80px] pb-[40px] flex flex-col items-center overflow-hidden">
      <div className="container px-6 flex flex-col items-center">
        {/* Download App Section */}
        <h2 className="text-[36px] font-bold text-white text-center uppercase tracking-tight mb-[32px]">
          Download App
        </h2>

        <div className="mb-[64px]">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-transform duration-200 hover:scale-[1.05]"
          >
            <div className="relative w-[180px] h-[54px] border border-white/20 rounded-[12px] bg-white/10 flex items-center justify-center overflow-hidden backdrop-blur-md">
              <Image
                src={assets.googlePlay}
                alt="Get it on Google Play"
                width={154}
                height={46}
                priority
                className="object-contain"
              />
            </div>
          </a>
        </div>

        {/* Bottom Bar Info */}
        <div className="flex flex-col items-center gap-[16px]">
          <p className="text-[14px] font-semibold text-white/90 m-0">
            © 2025 Monkey
          </p>
          
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-200 hover:opacity-80"
          >
            <div className="relative w-[32px] h-[32px]">
              <Image
                src={assets.instagram}
                alt="Follow us on Instagram"
                fill
                className="object-contain"
              />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;