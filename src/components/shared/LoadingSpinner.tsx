import { cn } from '@/lib/utils';
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <div className="absolute h-full w-full animate-spin rounded-full border-4 border-dashed border-primary"></div>
      <span className="font-headline text-2xl font-bold text-primary">Kopimi</span>
    </div>
  );
};

export default LoadingSpinner;
