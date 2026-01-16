'use client';

import { useEffect, useState, useRef } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  htmlContent: string;
}

export default function TableOfContents({ htmlContent }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Wait for content to be rendered, then extract headings
    const extractHeadings = () => {
      const articleContent = document.querySelector('article .prose');
      if (!articleContent) return;

      const headingElements = articleContent.querySelectorAll('h2, h3');
      if (headingElements.length === 0) return;

      const extractedHeadings: Heading[] = [];
      
      headingElements.forEach((heading) => {
        const text = heading.textContent || '';
        if (!text.trim()) return;
        
        const level = parseInt(heading.tagName.charAt(1));
        
        // Generate ID from text (slugify)
        let id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        
        if (!id) return;
        
        // Ensure unique IDs
        let uniqueId = id;
        let counter = 1;
        while (document.getElementById(uniqueId) && document.getElementById(uniqueId) !== heading) {
          uniqueId = `${id}-${counter}`;
          counter++;
        }
        
        // Set the ID on the heading element
        heading.id = uniqueId;
        
        extractedHeadings.push({
          id: uniqueId,
          text,
          level,
        });
      });

      if (extractedHeadings.length > 0) {
        setHeadings(extractedHeadings);
      }
    };

    // Try immediately, then with delays to ensure content is rendered
    extractHeadings();
    const timeout1 = setTimeout(extractHeadings, 100);
    const timeout2 = setTimeout(extractHeadings, 500);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [htmlContent]);

  useEffect(() => {
    // Set up Intersection Observer to track active heading
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe all headings
    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset from top
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-48 flex-shrink-0">
      <div className="sticky top-24">
        <h2 className="text-xs font-mono font-normal text-foreground/60 mb-6 pb-2 border-b border-border uppercase tracking-wider">
          Table of Contents
        </h2>
        <nav className="space-y-2">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHeading(heading.id);
              }}
              className={`block text-xs font-mono font-normal transition-colors py-1 ${
                heading.level === 3 ? 'pl-4' : ''
              } ${
                activeId === heading.id
                  ? 'text-foreground opacity-100'
                  : 'text-foreground/60 hover:text-[#8c6623]'
              }`}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
