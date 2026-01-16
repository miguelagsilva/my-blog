import Link from 'next/link';
import { getRecentPosts, getTrendingTags } from '../lib/posts';
import { format } from 'date-fns';

export default function Sidebar() {
  const recentPosts = getRecentPosts(5);
  const trendingTags = getTrendingTags(10);

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-10">
        <section>
          <h2 className="text-xs font-mono font-normal text-foreground/60 mb-6 pb-2 border-b border-border uppercase tracking-wider">
            Recent Updates
          </h2>
          <ul className="space-y-4">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="block group"
                  >
                    <div className="text-sm font-mono font-normal text-foreground/80 group-hover:text-[#8c6623] transition-colors line-clamp-2">
                      {post.title}
                    </div>
                    {post.date && (
                      <div className="text-xs text-foreground/40 mt-2 font-mono">
                        {format(new Date(post.date), 'MMM d, yyyy')}
                      </div>
                    )}
                  </Link>
                </li>
              ))
            ) : (
              <li className="text-sm text-foreground/40 font-mono">No posts yet</li>
            )}
          </ul>
        </section>

        <section>
          <h2 className="text-xs font-mono font-normal text-foreground/60 mb-6 pb-2 border-b border-border uppercase tracking-wider">
            Trending Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {trendingTags.length > 0 ? (
              trendingTags.map(({ tag, count }) => (
                <Link
                  key={tag}
                  href={`/posts?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center px-2 py-1 text-xs font-mono font-normal bg-transparent hover:bg-accent text-foreground/60 hover:text-[#8c6623] border border-border hover:border-[#8c6623] transition-all"
                >
                  {tag}
                  <span className="ml-1.5 text-foreground/30 text-[10px]">({count})</span>
                </Link>
              ))
            ) : (
              <span className="text-sm text-foreground/40 font-mono">No tags yet</span>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
