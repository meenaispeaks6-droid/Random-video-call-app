import React from 'react';
import Image from 'next/image';

/**
 * FooterDownload Component
 * 
 * This component clones the "Download App" section of the Funkey website.
 * Features:
 * - H2 title "Download App" in Montserrat Extra Bold/Uppercase
 * - Google Play Store badge with white border stroke
 * - Copyright text "© 2025 Funkey"
 * - Consistent brand purple background (#634AF1)
 */
const FooterDownload: React.FC = () => {
  return (
    <footer className="w-full bg-[#634AF1] py-[80px] md:py-[100px] flex flex-col items-center justify-center text-center">
      <div className="container mx-auto px-6 flex flex-col items-center gap-10">
        {/* Section Title */}
        <h2 
          className="text-white font-display text-[32px] md:text-[40px] font-[800] tracking-tight uppercase m-0 leading-[1.2]"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Download App
        </h2>

        {/* Download Badge */}
        <div className="flex justify-center items-center">
          <a 
            href="#" 
            className="inline-block transition-transform duration-300 hover:scale-[1.05]"
            aria-label="Get it on Google Play"
          >
            <div className="relative border-[1px] border-white rounded-[40px] px-8 py-3 flex items-center justify-center bg-transparent">
              <Image 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/google-play-badge-us_3x-7.png" 
                alt="Get it on Google Play"
                width={160}
                height={48}
                className="h-[38px] w-auto object-contain"
                priority
              />
            </div>
          </a>
        </div>

        {/* Copyright Text */}
        <div className="mt-12">
          <p 
            className="text-white opacity-80 text-[14px] font-sans m-0"
            style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
          >
            © 2025 Funkey
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterDownload;