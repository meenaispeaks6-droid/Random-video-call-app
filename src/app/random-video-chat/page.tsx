import type { Metadata } from "next";
import Home from "@/app/page";

export const metadata: Metadata = {
  title: "Random Video Chat with Strangers | Instant Matching | MojCall",
  description: "Start a random video chat with strangers instantly on MojCall. The fastest way to meet new people globally through live video calls. Safe, fun, and free to use.",
  keywords: ["random video chat", "talk to strangers", "video chat with strangers", "live video call", "MojCall chat", "instant video match"],
};

export default function RandomChatPage() {
  return (
    <>
      <Home />
      <section className="sr-only">
        <h1>Random Video Chat with Strangers</h1>
        <p>Experience the thrill of random video chat with strangers on MojCall. Our platform is designed to connect you with interesting people from around the globe in real-time. Whether you're looking for new friends or just a fun conversation, MojCall's random video call feature is the perfect solution.</p>
        <h2>Instant Live Video Connections</h2>
        <ul>
          <li>Connect with a single click</li>
          <li>Filter by interest or gender</li>
          <li>Encrypted and private video calls</li>
          <li>Global reach spanning 190+ countries</li>
        </ul>
      </section>
    </>
  );
}
