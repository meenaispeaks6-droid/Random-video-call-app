"use client";

import HeaderNavigation from "@/components/sections/header-navigation";
import HeroSplit from "@/components/sections/hero-split";
import Introduction from "@/components/sections/introduction";
import FeaturesGrid from "@/components/sections/features-grid";
import FAQAccordion from "@/components/sections/faq-accordion";
import FooterDownload from "@/components/sections/footer-download";
import { AuthModal } from "@/components/auth-modal";
import { LoadingScreen } from "@/components/loading-screen";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-purple">
      <LoadingScreen />
      <AuthModal />
      <HeaderNavigation />
      <HeroSplit />
      <Introduction />
      <FeaturesGrid />
      <FAQAccordion />
      <FooterDownload />
    </main>
  );
}
