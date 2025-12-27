import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { PresenceTracker } from "@/components/PresenceTracker";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Funkey – Random Video Chat & Live Stranger Calls",
  description: "Free random video chat app to connect with strangers, live 1-on-1 video calls, gender filter rewards, global matching like Monkey and Omegle but smoother and safer.",
  keywords: ["monkey app alternative", "omegle alternative", "random video call", "stranger video chat", "chat with strangers", "random live chat", "video chat no login", "meet strangers online", "random cam chat", "live stranger video call India"],
  openGraph: {
    title: "Funkey – Random Video Chat & Live Stranger Calls",
    description: "Free random video chat app to connect with strangers, live 1-on-1 video calls, gender filter rewards, global matching like Monkey and Omegle but smoother and safer.",
    url: "https://funkey.app",
    siteName: "Funkey",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Funkey – Random Video Chat & Live Stranger Calls",
    description: "Free random video chat app to connect with strangers, live 1-on-1 video calls, gender filter rewards, global matching like Monkey and Omegle but smoother and safer.",
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
    "description": "Funkey is a free random video chat app to connect with strangers, offering live 1-on-1 video calls and gender filter rewards.",
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
