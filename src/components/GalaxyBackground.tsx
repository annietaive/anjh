import { useEffect, useRef } from 'react';
import '../styles/galaxy.css';

export function GalaxyBackground() {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate stars with random positions and sizes
    if (starsRef.current) {
      const starsContainer = starsRef.current;
      const starCount = 200; // Number of stars

      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size (1-3px)
        const size = Math.random() * 2 + 1;
        
        // Random animation delay and duration
        const delay = Math.random() * 3;
        const duration = Math.random() * 2 + 2;
        
        star.style.cssText = `
          left: ${x}%;
          top: ${y}%;
          width: ${size}px;
          height: ${size}px;
          animation-delay: ${delay}s;
          animation-duration: ${duration}s;
        `;
        
        starsContainer.appendChild(star);
      }
    }

    // Cleanup
    return () => {
      if (starsRef.current) {
        starsRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="galaxy-background">
      {/* Gradient Layer 1 - Deep Space */}
      <div className="galaxy-layer galaxy-gradient-1"></div>
      
      {/* Gradient Layer 2 - Nebula */}
      <div className="galaxy-layer galaxy-gradient-2"></div>
      
      {/* Gradient Layer 3 - Aurora */}
      <div className="galaxy-layer galaxy-gradient-3"></div>
      
      {/* Stars Layer */}
      <div className="galaxy-layer galaxy-stars" ref={starsRef}></div>
      
      {/* Shooting Stars */}
      <div className="galaxy-layer shooting-stars">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="galaxy-content"></div>
    </div>
  );
}