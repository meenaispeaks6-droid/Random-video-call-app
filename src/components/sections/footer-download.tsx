import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#634AF1] py-[40px] flex flex-col items-center justify-center text-center">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <p 
          className="text-white opacity-80 text-[14px] font-sans m-0"
          style={{ fontFamily: 'Montserrat, Inter, sans-serif' }}
        >
          © 2025 MojCall
        </p>
      </div>
    </footer>
  );
};

export default Footer;
