'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { searchPosts } from '../lib/search';
import { Post } from '../lib/posts';
import { format } from 'date-fns';
import { calculateReadingTime, formatReadingTime } from '../lib/reading-time';

export default function PostsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const tagFilter = searchParams.get('tag') || '';
  
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((posts) => setAllPosts(posts))
      .catch(() => setAllPosts([]));
  }, []);

  const filteredPosts = useMemo(() => {
    let posts = allPosts;

    // Apply tag filter
    if (tagFilter) {
      posts = posts.filter((post) =>
        post.tags.some((tag) => tag.toLowerCase() === tagFilter.toLowerCase())
      );
    }

    // Apply search filter
    if (localSearchQuery) {
      posts = searchPosts(posts, localSearchQuery);
    }

    return posts;
  }, [allPosts, tagFilter, localSearchQuery]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allPosts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allPosts]);

  return (
    <div className="flex gap-8 w-full">
      <div className="hidden xl:block w-48 flex-shrink-0"></div>
      <div className="flex-1 max-w-5xl">
      <div className="mb-12 w-full">
        <h1 className="text-3xl font-mono font-normal mb-2">All Posts</h1>
        <p className="text-foreground/60 text-sm font-mono">
          Browse all technical articles and tutorials.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-12 space-y-6 w-full">
        <div>
            <input
              type="text"
              placeholder="Search posts..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full md:w-96 px-0 py-2 bg-transparent border-b border-border text-sm font-mono focus:outline-none focus:border-foreground/30 transition-colors placeholder:text-foreground/40"
            />
        </div>

          {allTags.length > 0 && (
            <div>
              <div className="text-xs font-normal text-foreground/50 mb-4 font-mono uppercase tracking-wider">
                Filter by Tag:
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/posts"
                  className={`text-xs font-mono font-normal px-2 py-1 border transition-all ${
                    !tagFilter
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-transparent hover:bg-accent text-foreground/60 hover:text-[#8c6623] border-border hover:border-[#8c6623]'
                  }`}
                >
                  All
                </Link>
                {allTags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/posts?tag=${encodeURIComponent(tag)}`}
                    className={`text-xs font-mono font-normal px-2 py-1 border transition-all ${
                      tagFilter.toLowerCase() === tag.toLowerCase()
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-transparent hover:bg-accent text-foreground/60 hover:text-[#8c6623] border-border hover:border-[#8c6623]'
                    }`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* Results count */}
      {(tagFilter || localSearchQuery) && (
        <div className="mb-8 text-xs text-foreground/50 font-mono w-full">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
          {tagFilter && ` tagged "${tagFilter}"`}
          {localSearchQuery && ` matching "${localSearchQuery}"`}
        </div>
      )}

      {/* Posts list */}
      {filteredPosts.length > 0 ? (
        <div className="space-y-12 w-full">
          {filteredPosts.map((post) => (
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
                    className="text-xl font-mono font-normal hover:opacity-70 transition-opacity block mb-2"
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
          <p className="text-foreground/60">
            {allPosts.length === 0
              ? 'No posts yet. Check back soon!'
              : 'No posts found matching your criteria.'}
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
