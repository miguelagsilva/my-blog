import { Post } from './posts';

export function searchPosts(posts: Post[], query: string): Post[] {
  if (!query.trim()) {
    return posts;
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return posts.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(lowerQuery);
    const excerptMatch = post.excerpt.toLowerCase().includes(lowerQuery);
    const tagMatch = post.tags.some((tag) => 
      tag.toLowerCase().includes(lowerQuery)
    );
    const contentMatch = post.content.toLowerCase().includes(lowerQuery);

    return titleMatch || excerptMatch || tagMatch || contentMatch;
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
