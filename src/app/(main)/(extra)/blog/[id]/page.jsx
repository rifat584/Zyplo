import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, CalendarDays, User2 } from "lucide-react";
import posts from "@/lib/blog/posts.json";

export function generateStaticParams() {
  return posts.map((post) => ({ id: String(post.id) }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const post = posts.find((item) => String(item.id) === String(resolvedParams?.id || ""));
  if (!post) {
    return {
      title: "Article Not Found | Zyplo Blog",
    };
  }
  return {
    title: `${post.title} | Zyplo Blog`,
    description: post.excerpt,
  };
}

export default async function BlogArticlePage({ params }) {
  const resolvedParams = await params;
  const post = posts.find((item) => String(item.id) === String(resolvedParams?.id || ""));
  if (!post) notFound();

  return (
    <main className="bg-base text-foreground">
      <article className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-secondary dark:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <header className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary">
              {post.category}
            </span>
            {Array.isArray(post.tags)
              ? post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    #{tag}
                  </span>
                ))
              : null}
          </div>

          <h1 className="text-4xl font-heading font-bold leading-tight sm:text-5xl md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 md:text-lg">{post.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <User2 className="h-4 w-4" />
              {post.author?.name || "Zyplo Team"}
              {post.author?.role ? `, ${post.author.role}` : ""}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              {post.readingTime || "5 min read"}
            </span>
          </div>
        </header>

        <figure className="mb-10 overflow-hidden rounded-2xl border border-border">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        </figure>

        <section className="prose max-w-none dark:prose-invert">
          <p className="text-lg leading-relaxed">{post.intro}</p>

          {Array.isArray(post.sections)
            ? post.sections.map((section) => (
                <div key={section.heading} className="mt-10">
                  <h2 className="mb-4 text-2xl font-semibold leading-snug md:text-3xl">{section.heading}</h2>
                  {Array.isArray(section.paragraphs)
                    ? section.paragraphs.map((paragraph, index) => <p key={`${section.heading}-p-${index}`}>{paragraph}</p>)
                    : null}
                  {Array.isArray(section.bullets) && section.bullets.length > 0 ? (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))
            : null}

          <div className="mt-12 rounded-2xl border border-secondary/30 bg-secondary/10 p-6">
            <h3 className="mt-0 text-xl font-semibold md:text-2xl">Key takeaway</h3>
            <p className="mb-0">{post.conclusion}</p>
          </div>
        </section>
      </article>
    </main>
  );
}
