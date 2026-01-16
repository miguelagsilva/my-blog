import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getPostWithHtml } from '../../lib/posts';
import { format } from 'date-fns';
import { calculateReadingTime, formatReadingTime } from '../../lib/reading-time';
import TableOfContents from '../../components/TableOfContents';

export default async function Page({ params }: { params: Promise<{ title: string }> }) {
  const { title } = await params;
  const post = await getPostWithHtml(title);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  const readingTimeText = formatReadingTime(readingTime);

  return (
    <div className="flex gap-8 w-full">
      {post.htmlContent && <TableOfContents htmlContent={post.htmlContent} />}
      <article className="flex-1 max-w-5xl">
        <div className="mb-12">
          <Link
            href="/posts"
            className="text-xs text-foreground/50 hover:text-[#8c6623] transition-colors inline-flex items-center mb-8 font-mono uppercase tracking-wider"
          >
            ← Back to posts
          </Link>
          
          <h1 className="text-3xl font-mono font-normal mb-6 pl-0 pr-0">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/40 mb-8 font-mono">
            {post.date && (
              <time>
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </time>
            )}
            {post.author && (
              <span>By {post.author}</span>
            )}
            <span>{readingTimeText}</span>
          </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/posts?tag=${encodeURIComponent(tag)}`}
                className="text-xs font-mono font-normal px-2 py-1 bg-transparent hover:bg-accent text-foreground/50 hover:text-foreground border border-border hover:border-foreground/30 transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {post.coverImage && (
          <div className="mb-6 max-w-2xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover border border-border"
            />
          </div>
        )}
      </div>

      {post.excerpt && (
        <div className="mb-10 pl-4 border-l border-border">
          <p className="text-foreground/60 text-base leading-relaxed font-mono">{post.excerpt}</p>
        </div>
      )}

      {post.htmlContent && (
        <div
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-mono prose-code:font-mono prose-pre:bg-accent prose-pre:border prose-pre:border-border prose-p:text-justify prose-headings:pl-0 prose-p:pl-0 prose-p:pr-0"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />
      )}

      <div className="mt-16 pt-8 border-t border-border">
        <Link
          href="/posts"
          className="text-xs text-foreground/50 hover:text-[#8c6623] transition-colors inline-flex items-center font-mono uppercase tracking-wider"
        >
          ← Back to posts
        </Link>
      </div>
    </article>
    </div>
  );
}