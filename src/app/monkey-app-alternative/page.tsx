import type { Metadata } from "next";
import Home from "@/app/page";

export const metadata: Metadata = {
  title: "Best Monkey App Alternative | Random Video Chat with Strangers | Funkey",
  description: "Looking for the best Monkey app alternative? Funkey offers instant random video chat, live stranger cam chat, and safe social networking for Gen-Z. Join the #1 Monkey replacement today!",
  keywords: ["Monkey app alternative", "best Monkey alternative", "apps like Monkey", "random video chat", "stranger chat", "Funkey chat"],
};

export default function MonkeyAlternativePage() {
  return (
    <>
      <Home />
      <section className="sr-only">
        <h1>Monkey App Alternative</h1>
        <p>Funkey is the premier platform for those seeking a Monkey app alternative. Our random video chat connects you with strangers worldwide instantly. Whether you're looking for live stranger cam chat or a safe social networking experience, Funkey is the best choice for Gen-Z users.</p>
        <h2>Why choose Funkey as your Monkey alternative?</h2>
        <ul>
          <li>Instant random video matching</li>
          <li>Safe and moderated environment</li>
          <li>Global community of Gen-Z users</li>
          <li>High-quality video and audio</li>
        </ul>
      </section>
    </>
  );
}
