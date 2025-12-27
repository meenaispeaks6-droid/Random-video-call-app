import type { Metadata } from "next";
import HeaderNavigation from "@/components/sections/header-navigation";
import FooterDownload from "@/components/sections/footer-download";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Funkey Blog | Random Video Call, Live Stranger Chat & Omegle Alternatives",
  description: "Explore India ka fastest random video chat experience. Monkey app jaisa experience with stranger video calls, safety tips, and meeting new people online.",
  keywords: [
    "random video call",
    "live stranger chat",
    "meet new people online",
    "monkey app jaisa experience",
    "omegle ka best alternative",
    "India ka fastest random video chat",
    "monkey app alternative",
    "stranger video chat"
  ],
};

export default function BlogPage() {
  return (

    <main className="min-h-screen bg-brand-purple">
      <HeaderNavigation />
      
      <div className="container mx-auto px-6 py-24 md:py-32">
          <header className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-400 text-black hover:bg-yellow-500 font-bold px-4 py-1">FUNKEY INSIGHTS</Badge>
            <h1 className="text-white text-4xl md:text-6xl font-[950] tracking-tighter uppercase mb-6">
            The Future of <span className="text-yellow-400 italic">Connection</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Exploring the world of random video chat, social discovery, and the next generation of online interactions.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <Link key={index} href={`/blog/${post.slug}`}>
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group h-full">
                <CardHeader>
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="text-white/60 border-white/20 uppercase tracking-widest text-[10px]">
                      {post.category}
                    </Badge>
                    <span className="text-white/40 text-xs font-medium">{post.date}</span>
                  </div>
                  <CardTitle className="text-white text-xl md:text-2xl font-bold group-hover:text-yellow-400 transition-colors leading-tight">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* 50/50 SEO Hook Section */}
        <section className="mt-24 p-8 md:p-12 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
                Funkey <span className="text-yellow-400">vs</span> The Rest
              </h2>
              <p className="text-white/70 mb-8 leading-relaxed">
                Why settle for outdated platforms? Funkey balances speed, safety, and engagement to provide a 50/50 split of thrill and security that other alternatives simply can't match.
              </p>
              <div className="space-y-4">
                {[
                  "AI-Powered Real-time Moderation",
                  "Instant Global Matching (< 1s)",
                  "High-Definition Video Infrastructure",
                  "No Data Selling Privacy Policy"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white font-bold italic">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0B032D] p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 blur-3xl rounded-full" />
               <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6 opacity-40">SEO Comparison Meta</h3>
               <ul className="space-y-4 text-sm">
                 <li className="text-white/80"><span className="text-yellow-400 font-bold">Monkey App Alternative:</span> Best for Gen-Z vibe</li>
                 <li className="text-white/80"><span className="text-yellow-400 font-bold">Omegle Alternative:</span> Most stable video calls</li>
                 <li className="text-white/80"><span className="text-yellow-400 font-bold">Stranger Cam:</span> Highest safety rating</li>
                 <li className="text-white/80"><span className="text-yellow-400 font-bold">Random Chat:</span> 190+ Countries active</li>
               </ul>
            </div>
          </div>
        </section>
      </div>

      <FooterDownload />
    </main>
  );
}
