import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeFigure from './rehype-figure';
import postsData from './posts-data.json';

export interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  author?: string;
  content: string;
  htmlContent?: string;
  coverImage?: string;
}

// Load pre-processed posts data
const allPostsData: Post[] = postsData as Post[];

export function getPostSlugs(): string[] {
  return allPostsData.map(post => post.slug);
}

export function getPostBySlug(slug: string): Post | null {
  return allPostsData.find(post => post.slug === slug) || null;
}

export function getAllPosts(): Post[] {
  return [...allPostsData]; // Return a copy to avoid mutations
}

export function getRecentPosts(limit: number = 10): Post[] {
  return getAllPosts().slice(0, limit);
}

export function getTrendingTags(recentPostCount: number = 10): { tag: string; count: number }[] {
  const recentPosts = getRecentPosts(recentPostCount);
  const tagCounts: Record<string, number> = {};

  recentPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

export async function getPostWithHtml(slug: string): Promise<Post | null> {
  const post = getPostBySlug(slug);
  if (!post) {
    return null;
  }

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeFigure)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(post.content);
  
  return {
    ...post,
    htmlContent: processedContent.toString(),
  };
}
