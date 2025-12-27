import { blogPosts } from "@/lib/blog-data";
import { notFound } from "next/navigation";
import HeaderNavigation from "@/components/sections/header-navigation";
import FooterDownload from "@/components/sections/footer-download";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | Funkey Blog`,
    description: post.excerpt,
    keywords: post.keywords,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-purple">
      <HeaderNavigation />
      
      <article className="container mx-auto px-6 py-24 md:py-32 max-w-4xl">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Badge className="bg-yellow-400 text-black font-bold uppercase tracking-widest px-3 py-1">
              {post.category}
            </Badge>
            <span className="text-white/40 text-sm font-medium">{post.date}</span>
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-[950] tracking-tighter uppercase mb-8 leading-tight">
            {post.title}
          </h1>
          <p className="text-white/70 text-xl font-medium italic border-l-4 border-yellow-400 pl-6 py-2">
            {post.excerpt}
          </p>
        </header>

        <div 
          className="prose prose-invert prose-yellow max-w-none text-white/80 text-lg leading-relaxed
            prose-headings:text-white prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-p:mb-6
            prose-strong:text-yellow-400 prose-strong:font-bold
            prose-ul:list-disc prose-ul:pl-6
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <section className="mt-20 p-8 md:p-12 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
          <h2 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4">
            Ready to experience <span className="text-yellow-400">Funkey</span>?
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            Join millions of users worldwide and start your first 1-on-1 video call today. It's safe, fast, and free.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-yellow-400 text-black font-black px-8 py-4 rounded-2xl hover:bg-yellow-500 transition-all cursor-pointer uppercase tracking-tighter">
              Start Video Chat
            </div>
          </div>
        </section>
      </article>

      <FooterDownload />
    </main>
  );
}
