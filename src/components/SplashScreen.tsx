
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'zooming' | 'complete'>('initial');
  
  useEffect(() => {
    // Start with a brief delay for the initial reveal
    const initialTimer = setTimeout(() => {
      setAnimationPhase('zooming');
      
      // Trigger zoom effect after initial reveal
      const zoomTimer = setTimeout(() => {
        setAnimationPhase('complete');
        
        // Allow time for exit animation before completing
        const completeTimer = setTimeout(() => {
          onComplete();
        }, 1000);
        
        return () => clearTimeout(completeTimer);
      }, 2500);
      
      return () => clearTimeout(zoomTimer);
    }, 1200);
    
    return () => clearTimeout(initialTimer);
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {animationPhase !== 'complete' && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-[#4A7A3B] z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0">
            {/* Full screen background image */}
            <img 
              src="/lovable-uploads/5ff23800-6713-4ec4-be4c-da8cdf5ab8ad.png" 
              alt="Junglee Ghumakkad Background" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Logo container with zoom effect */}
            <motion.div
              className="relative z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: animationPhase === 'zooming' ? [1, 1.2, 1.8, 3] : 1,
                opacity: animationPhase === 'zooming' ? [1, 0.8, 0.5, 0] : 1
              }}
              transition={{ 
                duration: 2.5,
                ease: "easeInOut",
                times: [0, 0.3, 0.6, 1]
              }}
            >
              {/* For visual purposes only, empty div that scales */}
              <div className="w-[80vw] max-w-4xl h-auto aspect-[3/1.2]"></div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
