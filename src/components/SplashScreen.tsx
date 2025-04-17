
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after a short delay
    const animationDelay = setTimeout(() => {
      setIsAnimating(true);
    }, 600); // 0.6 seconds delay before starting zoom animation
    
    // Complete animation and transition to main page
    const completeTimer = setTimeout(() => {
      setTimeout(onComplete, 500); // Allow time for exit animation
    }, 1800); // Total animation time

    return () => {
      clearTimeout(animationDelay);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isAnimating ? 'zoom-active' : ''}`}>
      <div className="splash-content">
        <img 
          src="/lovable-uploads/79dc3092-5eaf-49f0-9fbb-5445cafebe74.png" 
          alt="Junglee Ghumakkad" 
          className="splash-logo-fullscreen"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
