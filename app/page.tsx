import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts } from './lib/posts';
import { format } from 'date-fns';
import { calculateReadingTime, formatReadingTime } from './lib/reading-time';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="flex gap-8 w-full">
      <div className="hidden xl:block w-48 flex-shrink-0"></div>
      <div className="flex-1 max-w-5xl">
      <div className="mb-16 w-full">
        <h1 className="text-3xl font-mono font-normal mb-6">Welcome</h1>
        <p className="text-foreground/70 text-base font-mono mb-8 leading-relaxed text-justify">
          Welcome to my technical blog. Here I share engineering insights, tutorials, 
          and thoughts on cybersecurity, hacking, software development, and technology. Explore 
          the latest posts below or browse all articles to find what interests you.
        </p>
      </div>

      <div className="mb-12 w-full">
        <h2 className="text-xl font-mono font-normal mb-2 text-foreground/60 uppercase tracking-wider text-xs">Latest Posts</h2>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-12 w-full">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border-b border-border pb-12 last:border-b-0 last:pb-0 w-full"
            >
              <div className="flex gap-6 mb-4">
                {post.coverImage && (
                  <Link
                    href={`/posts/${post.slug}`}
                    className="flex-shrink-0"
                  >
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={120}
                      height={80}
                      className="object-cover border border-border"
                    />
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-xl font-mono font-normal hover:text-[#8c6623] transition-colors block mb-2"
                  >
                    {post.title}
                  </Link>
                  
                  {post.date && (
                    <div className="text-xs text-foreground/40 mb-3 font-mono flex items-center gap-2">
                      <time>
                        {format(new Date(post.date), 'MMMM d, yyyy')}
                      </time>
                      <span>•</span>
                      <span>{formatReadingTime(calculateReadingTime(post.content))}</span>
                    </div>
                  )}

                  {post.excerpt && (
                    <p className="text-foreground/60 mb-4 line-clamp-3 leading-relaxed font-mono text-sm">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
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

              <Link
                href={`/posts/${post.slug}`}
                className="text-sm font-mono font-normal text-foreground/60 hover:text-[#8c6623] transition-colors inline-flex items-center"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-foreground/60">No posts yet. Check back soon!</p>
        </div>
      )}
      </div>
    </div>
  );
}
