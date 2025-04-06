
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      
      // Allow time for the exit animation to complete
      setTimeout(onComplete, 500);
    }, 2500); // Total animation duration

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-screen ${!isAnimating ? 'splash-exit' : ''}`}>
      <div className="splash-content">
        <img 
          src="/lovable-uploads/79dc3092-5eaf-49f0-9fbb-5445cafebe74.png" 
          alt="Junglee Ghumakkad" 
          className="splash-logo"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
