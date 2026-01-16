'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      
      // Article position relative to viewport
      const articleTop = rect.top + scrollTop;
      const articleHeight = article.scrollHeight;
      const articleBottom = articleTop + articleHeight;

      // Current scroll position (bottom of viewport)
      const viewportBottom = scrollTop + windowHeight;

      // Calculate progress: how much of the article has been scrolled past
      // Start tracking when article enters viewport
      if (viewportBottom < articleTop) {
        setProgress(0);
        return;
      }

      // Finish when article bottom passes viewport top
      if (scrollTop > articleBottom - windowHeight) {
        setProgress(100);
        return;
      }

      // Calculate percentage scrolled
      const scrolled = viewportBottom - articleTop;
      const total = articleHeight + windowHeight;
      const percentage = (scrolled / total) * 100;
      
      setProgress(Math.min(100, Math.max(0, percentage)));
    };

    // Use requestAnimationFrame for smoother updates
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateProgress();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  if (progress === 0) return null;

  return (
    <div className="fixed left-0 top-0 h-screen w-1 z-40 pointer-events-none">
      <div
        className="w-full bg-primary/60 transition-all duration-150 ease-out origin-top"
        style={{
          height: `${progress}%`,
        }}
      />
    </div>
  );
}
