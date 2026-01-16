'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { searchPosts } from '../lib/search';
import { Post } from '../lib/posts';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((posts) => setAllPosts(posts))
      .catch(() => setAllPosts([]));
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchPosts(allPosts, searchQuery);
      setSearchResults(results.slice(0, 5));
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  }, [searchQuery, allPosts]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/posts?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/posts', label: 'Posts' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-12">
            <Link href="/" className="flex items-center gap-3 text-xl font-mono font-normal text-foreground hover:text-[#8c6623] transition-colors">
              <Image
                src="/computer-wizard.png"
                alt="Computer Wizard"
                width={32}
                height={32}
                className="object-contain"
              />
              <span>Miguel's Blog</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-mono font-normal transition-colors ${
                    pathname === link.href
                      ? 'text-foreground opacity-100'
                      : 'text-foreground/60 hover:text-[#8c6623]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex-1 max-w-lg mx-2 md:mx-4 relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-transparent border-b border-border text-sm font-mono focus:outline-none focus:border-foreground/30 transition-colors placeholder:text-foreground/40"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-foreground/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>

            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-background border border-border max-h-96 overflow-y-auto z-50 backdrop-blur-sm">
                {searchResults.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="block px-4 py-3 hover:bg-accent border-b border-border last:border-b-0 transition-colors"
                  >
                    <div className="font-normal text-sm font-mono">{post.title}</div>
                    {post.excerpt && (
                      <div className="text-xs text-foreground/50 mt-1.5 line-clamp-2 font-mono">
                        {post.excerpt}
                      </div>
                    )}
                  </Link>
                ))}
                {searchQuery && searchResults.length >= 5 && (
                  <Link
                    href={`/posts?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="block px-4 py-3 text-sm text-foreground/60 hover:text-[#8c6623] hover:bg-accent text-center border-t border-border font-mono transition-colors"
                  >
                    View all results →
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground/60 hover:text-foreground transition-colors"
              aria-label="Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <nav className="py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-mono font-normal transition-colors ${
                    pathname === link.href
                      ? 'text-foreground opacity-100 bg-accent'
                      : 'text-foreground/60 hover:text-[#8c6623] hover:bg-accent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
