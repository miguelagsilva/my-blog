import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeFigure from './rehype-figure';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

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

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Get image from frontmatter, default to /images/posts/{slug}.svg if not specified
  const coverImage = data.image || `/images/posts/${slug}.svg`;

  return {
    slug,
    title: data.title || '',
    date: data.date || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    excerpt: data.excerpt || '',
    author: data.author || undefined,
    content,
    coverImage,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  
  return posts;
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
