import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
      <p className="text-foreground/60 mb-6">
        The post you're looking for doesn't exist.
      </p>
      <Link
        href="/posts"
        className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors inline-flex items-center"
      >
        ← Back to posts
      </Link>
    </div>
  );
}
