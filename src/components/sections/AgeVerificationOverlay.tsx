"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, X, ArrowLeft, Upload } from "lucide-react";

/**
 * AgeVerificationOverlay Component
 * Clones the age verification/appeal modal shown in the Funkey app.
 * Features: Overlay, Camera snap UI placeholders, and Appeal process steps.
 */
export default function AgeVerificationOverlay() {
  const [isOpen, setIsOpen] = useState(true);
  const [isAppealing, setIsAppealing] = useState(false);
  const [images, setImages] = useState<(string | null)[]>([null, null, null]);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isAppealing && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => console.error("Camera access denied:", err));
    }
  }, [isAppealing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-0">
      {!isAppealing ? (
        // Initial Warning Dialog
        <div className="bg-[#634AF1] w-full max-w-[448px] rounded-[32px] p-8 flex flex-col items-center text-center relative animate-in fade-in zoom-in duration-300">
          <div className="w-48 h-48 mb-6 flex items-center justify-center">
             <img 
               src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d-www-archive-monkey-app/assets/images/monkey_loading-12.gif" 
               alt="Underage Warning"
               className="w-full h-full object-contain"
             />
          </div>
          <p className="text-white text-[16px] leading-[1.5] mb-8 px-4 opacity-90">
            Your account is restricted for being underage. Please appeal the case if you have any questions, and we will handle it as soon as possible!
          </p>
          <div className="w-full space-y-3">
            <button 
              onClick={() => setIsAppealing(true)}
              className="w-full bg-[#FFF700] text-[#0A0430] font-bold py-4 rounded-[50px] text-[18px] transition-transform active:scale-95"
            >
              Appeal
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full bg-white/10 text-white font-semibold py-4 rounded-[50px] text-[16px] border border-white/20 transition-colors hover:bg-white/20"
            >
              Log Out
            </button>
          </div>
        </div>
      ) : (
        // Appeal Verification Interface
        <div className="bg-[#634AF1] w-full max-w-[500px] h-[90vh] md:h-auto md:max-h-[850px] rounded-[32px] overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-6 flex items-center justify-between">
            <button 
              onClick={() => setIsAppealing(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
            {/* Title & Icons */}
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-white leading-tight">
                To verify your age, please upload the following
              </h3>
            </div>

            <p className="text-white text-[16px] font-semibold mb-3">
              Picture of yourself holding your ID to confirm your birth date
            </p>

            <div className="bg-white/10 rounded-2xl p-4 mb-6 text-[13px] leading-relaxed text-white/80 space-y-2">
              <p>🎂 The uploaded photo must display the complete date of your birth.</p>
              <p>📷 A clear photo of yourself and your ID will help you pass the review faster.</p>
              <p className="text-[#FF4B4B] font-bold">⚠️ Appeal will fail if photo does not meet requirements, you only have ONE CHANCE to appeal.</p>
              <p>🔏 The Photo is only for platform to review, you can cover your private information.</p>
            </div>

            {/* Camera Preview */}
            <div className="relative aspect-[4/3] bg-black rounded-[24px] overflow-hidden mb-6 border-2 border-white/10">
              <video 
                ref={videoRef} 
                className="w-full h-full object-cover scale-x-[-1]" 
                playsInline
                muted
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[80%] h-[70%] border-2 border-dashed border-white/30 rounded-2xl"></div>
              </div>
            </div>

            {/* Image Upload Slots */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className="aspect-square bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center relative group cursor-pointer hover:bg-white/15 transition-colors"
                >
                  {img ? (
                    <img src={img} alt={`Capture ${idx + 1}`} className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-1">
                        <Upload className="w-5 h-5 text-white/60" />
                      </div>
                    </div>
                  )}
                  {img && (
                    <button 
                      className="absolute -top-2 -right-2 bg-[#FF4B4B] rounded-full p-1 border-2 border-[#634AF1]"
                      onClick={(e) => {
                        e.stopPropagation();
                        const next = [...images];
                        next[idx] = null;
                        setImages(next);
                      }}
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center space-y-6">
              <button 
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
                onClick={() => {
                  /* Mock capture functionality */
                }}
              >
                <div className="w-16 h-16 border-[4px] border-[#634AF1] rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-[#634AF1]" />
                </div>
              </button>

              <button 
                disabled={!images.some(img => img !== null)}
                className={`w-full font-bold py-4 rounded-[50px] text-[18px] transition-all
                  ${images.some(img => img !== null) 
                    ? "bg-[#FFF700] text-[#0A0430] shadow-lg active:scale-[0.98]" 
                    : "bg-white/10 text-white/30 cursor-not-allowed"}`}
              >
                Appeal
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}