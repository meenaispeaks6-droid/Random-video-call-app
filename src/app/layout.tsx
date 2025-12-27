import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { PresenceTracker } from "@/components/PresenceTracker";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Funkey | #1 Monkey App & Omegle Alternative | Random Video Chat",
  description: "Experience the best random video chat on Funkey. The ultimate Monkey app alternative and Omegle replacement for live stranger cam chat. Safe, fast, and Gen-Z friendly.",
  keywords: ["Monkey app alternative", "Omegle alternative", "Random video call with strangers", "Live stranger cam chat", "best random video chat", "talk to strangers", "Funkey chat"],
  openGraph: {
    title: "Funkey | Best Monkey App & Omegle Alternative",
    description: "Instant random video chat with people around the world. Safe, fast, and fun.",
    url: "https://funkey.chat",
    siteName: "Funkey",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Funkey | Random Video Chat with Strangers",
    description: "The best Monkey app alternative for live stranger cam chat.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Funkey",
    "applicationCategory": "SocialNetworking",
    "operatingSystem": "Web",
    "description": "Funkey is the premier random video chat platform and the best alternative to Monkey app and Omegle. Connect with strangers globally in seconds.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  return (
    <html lang="en">
        <body className="antialiased">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <PresenceTracker />
          <Script

          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="610e6ab9-8fc7-4045-aecf-ae5bd0f9a94d"
        />
        <ErrorReporter />
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
