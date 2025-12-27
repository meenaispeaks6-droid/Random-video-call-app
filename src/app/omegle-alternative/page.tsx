import type { Metadata } from "next";
import Home from "@/app/page";

export const metadata: Metadata = {
  title: "Best Omegle Alternative | Random Video Chat with Strangers | MojCall",
  description: "Omegle is gone, but MojCall is here! The best Omegle alternative for live stranger cam chat and random video calls. Connect with new people instantly in a safe environment.",
  keywords: ["Omegle alternative", "best Omegle replacement", "random video chat", "talk to strangers", "MojCall chat", "live stranger cam"],
};

export default function OmegleAlternativePage() {
  return (
    <>
      <Home />
      <section className="sr-only">
        <h1>Omegle Alternative</h1>
        <p>Searching for an Omegle alternative? MojCall is the best way to meet new people through random video chat. Since Omegle shut down, MojCall has become the top destination for live stranger cam chat. Experience safe, fast, and fun connections with our global community.</p>
        <h2>The Ultimate Omegle Replacement</h2>
        <ul>
          <li>Fastest video matching in the world</li>
          <li>Safety-first community guidelines</li>
          <li>No registration required to start</li>
          <li>Available on all devices</li>
        </ul>
      </section>
    </>
  );
}
