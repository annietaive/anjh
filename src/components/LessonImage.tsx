import { useState } from 'react';

interface LessonImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function LessonImage({ src, alt, className = '' }: LessonImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  console.log('LessonImage rendering:', { src, loaded, error });

  return (
    <div className="relative w-full h-full">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 animate-pulse flex items-center justify-center z-10">
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      )}
      {error ? (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center z-10">
          <div className="text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs">Image unavailable</p>
            <p className="text-xs mt-1">{src}</p>
          </div>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={() => {
            console.log('Image loaded:', src);
            setLoaded(true);
          }}
          onError={(e) => {
            console.error('Image error:', src, e);
            setError(true);
          }}
        />
      )}
    </div>
  );
}
