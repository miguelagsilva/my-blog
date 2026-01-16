export function calculateReadingTime(content: string): number {
  // Average reading speed: ~200 words per minute
  // Average word length: ~5 characters
  // So roughly 1000 characters per minute
  const charactersPerMinute = 1000;
  const characterCount = content.length;
  const minutes = Math.ceil(characterCount / charactersPerMinute);
  return Math.max(1, minutes); // At least 1 minute
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) {
    return '1 min read';
  }
  return `${minutes} min read`;
}
