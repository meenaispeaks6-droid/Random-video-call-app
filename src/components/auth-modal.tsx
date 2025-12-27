"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user, authLoading]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome to MojCall!");
    } catch (error: any) {
      toast.error("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={setIsOpen}
    >
      <DialogContent 
        className="sm:max-w-[425px] bg-brand-purple border-white/20 text-white backdrop-blur-xl rounded-3xl p-8"
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-4xl font-black tracking-tighter uppercase mb-2">
            MojCall
          </DialogTitle>
          <DialogDescription className="text-white/70 text-lg">
            Connect instantly with people around the world.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-6">
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 px-6 rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-6 h-6" alt="Google" />
                  Continue with Google
                </>
              )}
            </button>
            <p className="text-center text-xs text-white/40 px-4">
              By continuing, you agree to MojCall's Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
