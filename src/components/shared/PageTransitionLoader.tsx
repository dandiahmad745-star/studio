// This is a new file
"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransitionLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    // This component only tracks path changes.
    // The initial load has its own spinner via loading.tsx.
    if (key > 0) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 700); // Corresponds to the animation duration

      return () => {
        clearTimeout(timer);
        setLoading(false);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    setKey(prev => prev + 1)
  }, [pathname]);

  if (!loading) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[999] h-[3px] w-full bg-primary/20">
      <div
        key={key}
        className="h-full w-full origin-left-right animate-page-loader bg-primary"
        style={{
            animation: 'page-loader 700ms cubic-bezier(0.5, 0, 0, 1) forwards'
        }}
      />
      <style jsx>{`
        @keyframes page-loader {
          0% {
            transform: scaleX(0);
          }
          50% {
            transform: scaleX(1);
            transform-origin: left;
          }
          50.1% {
            transform-origin: right;
          }
          100% {
            transform: scaleX(0);
            transform-origin: right;
          }
        }
        .animate-page-loader {
          animation-name: page-loader;
        }
      `}</style>
    </div>
  );
}
