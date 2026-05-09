"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Crown, Check, Sparkles, ArrowLeft, Shield, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const features = [
  {
    icon: <Shield size={20} />,
    title: "Gender Filters",
    description: "Filter by Male, Female, or Trans to find exactly who you want to connect with",
  },
  {
    icon: <Zap size={20} />,
    title: "Direct Call & DM",
    description: "Call or message anyone directly without waiting in queue",
  },
  {
    icon: <Crown size={20} />,
    title: "Premium Badge",
    description: "Stand out with an exclusive premium badge on your profile",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Early Access",
    description: "Be the first to try upcoming features before everyone else",
  },
];

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "Payment failed. Please try again.");
      setIsLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-bold py-4 px-6 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          "Complete Payment - $5.00"
        )}
      </button>
      <p className="text-center text-white/50 text-xs">
        Secure payment powered by Stripe
      </p>
    </form>
  );
}

function SuccessMessage() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
      >
        <Check size={48} className="text-white" />
      </motion.div>
      <h3 className="text-2xl font-bold text-white mb-3">Welcome to Premium!</h3>
      <p className="text-white/70 mb-8 max-w-sm mx-auto">
        Your premium features are now active. Enjoy the full Funkey experience!
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-yellow text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
      >
        Start Exploring
      </Link>
    </motion.div>
  );
}

export default function PremiumPage() {
  const { user, getIdToken } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingIntent, setIsLoadingIntent] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleUpgradeClick = async () => {
    setCheckoutError(null);

    if (!user) {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 5000);
      return;
    }

    if (!stripePromise) {
      setCheckoutError("Stripe is not configured yet. Please try again later.");
      return;
    }

    setIsLoadingIntent(true);
    try {
      const idToken = await getIdToken();
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setShowCheckout(true);
      } else {
        throw new Error("Checkout did not return a client secret.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create payment intent.";
      setCheckoutError(message);
      console.error("Failed to create payment intent:", err);
    } finally {
      setIsLoadingIntent(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B032D] via-[#1a0a4a] to-[#2d1b69] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px]" />
      
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <Crown size={24} className="text-amber-400" fill="currentColor" />
          <span className="text-white font-black text-xl tracking-tight">PREMIUM</span>
        </div>
        <div className="w-20" />
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        <AnimatePresence mode="wait">
          {paymentSuccess ? (
            <SuccessMessage key="success" />
          ) : !showCheckout ? (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
                <div className="text-center mb-12">
                  <AnimatePresence>
                    {authError && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 flex items-center justify-center gap-2 bg-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-semibold border border-red-500/30"
                      >
                        <AlertCircle size={18} />
                        Please login to upgrade to Premium
                        <Link href="/auth" className="underline ml-2">Login here</Link>
                      </motion.div>
                    )}
                    {checkoutError && (
                      <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6 flex items-center justify-center gap-2 bg-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-semibold border border-red-500/30"
                      >
                        <AlertCircle size={18} />
                        {checkoutError}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                >
                  <Sparkles size={16} />
                  UNLOCK ALL FEATURES
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                  Go <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500">Premium</span>
                </h1>
                <p className="text-white/60 text-lg max-w-lg mx-auto">
                  Take your Funkey experience to the next level with exclusive features
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 hover:border-amber-500/30"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                          <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:sticky lg:top-8"
                >
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl" />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="text-white/50 text-sm font-medium mb-1">PREMIUM PLAN</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-white">$5</span>
                            <span className="text-white/50 text-lg">/month</span>
                          </div>
                          <p className="text-amber-400 text-sm font-medium mt-1">
                            Approx. ₹420 INR
                          </p>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                          <Crown size={32} className="text-black" fill="currentColor" />
                        </div>
                      </div>

                      <div className="space-y-3 mb-8">
                        {["Gender Filters", "Direct Call & DM", "Premium Badge", "Early Access"].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check size={12} className="text-green-400" />
                            </div>
                            <span className="text-white/80 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleUpgradeClick}
                        disabled={isLoadingIntent}
                        className="w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-bold py-4 px-6 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoadingIntent ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading...
                          </span>
                        ) : (
                          "Upgrade Now"
                        )}
                      </button>

                      <p className="text-center text-white/40 text-xs mt-4">
                        Cancel anytime. No hidden fees.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="checkout"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <button
                onClick={() => setShowCheckout(false)}
                className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft size={18} />
                Back to plan
              </button>

              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">Funkey Premium</h2>
                    <p className="text-white/50 text-sm">Monthly subscription</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-white">$5.00</p>
                    <p className="text-amber-400 text-xs">≈ ₹420 INR</p>
                  </div>
                </div>
              </div>

              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "night",
                      variables: {
                        colorPrimary: "#fbbf24",
                        colorBackground: "#1a0a4a",
                        colorText: "#ffffff",
                        colorTextSecondary: "#9ca3af",
                        colorDanger: "#ef4444",
                        borderRadius: "12px",
                        fontFamily: "Montserrat, sans-serif",
                      },
                      rules: {
                        ".Input": {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        },
                        ".Input:focus": {
                          border: "1px solid #fbbf24",
                          boxShadow: "0 0 0 1px #fbbf24",
                        },
                        ".Tab": {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        },
                        ".Tab--selected": {
                          backgroundColor: "rgba(251, 191, 36, 0.2)",
                          border: "1px solid #fbbf24",
                        },
                      },
                    },
                  }}
                >
                  <CheckoutForm onSuccess={() => setPaymentSuccess(true)} />
                </Elements>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
