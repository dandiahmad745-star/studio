import { cn } from '@/lib/utils';

const LoadingSpinner = () => {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <style>
            {`
              .path {
                stroke-dasharray: 250;
                stroke-dashoffset: 250;
                animation: draw 2s ease-in-out forwards, fade 1s ease-in-out 2s forwards;
                stroke: hsl(var(--primary));
              }
              @keyframes draw {
                to {
                  stroke-dashoffset: 0;
                }
              }
              @keyframes fade {
                to {
                  opacity: 0.3;
                }
              }
            `}
          </style>
          <path
            className="path"
            d="M 50,20 C 65,20 70,30 70,35 C 70,45 60,50 50,60 C 40,50 30,45 30,35 C 30,30 35,20 50,20 Z"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className="path"
            style={{ animationDelay: '0.2s' }}
            d="M 40,65 C 45,75 55,75 60,65"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
           <path
            className="path"
            style={{ animationDelay: '0.4s' }}
            d="M 45,75 C 50,85 50,85 55,75"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="animate-pulse font-headline text-2xl font-bold text-primary opacity-30">
        Kopimi
      </span>
    </div>
  );
};

export default LoadingSpinner;
