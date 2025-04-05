
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
        }, 800);
        
        return () => clearTimeout(completeTimer);
      }, 2000);
      
      return () => clearTimeout(zoomTimer);
    }, 1000);
    
    return () => clearTimeout(initialTimer);
  }, [onComplete]);
  
  return (
    <AnimatePresence>
      {animationPhase !== 'complete' && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-[#4A7A3B] z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Container for the logo image */}
            <motion.div
              className="relative z-10 text-center max-w-3xl w-full px-6"
              initial={{ scale: 1 }}
              animate={{ 
                scale: animationPhase === 'zooming' ? 5 : 1,
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <img 
                  src="/lovable-uploads/ed0ffd24-a3ce-4a40-9a4a-6856a09be0e1.png" 
                  alt="Junglee Ghumakkad Logo" 
                  className="w-full h-auto"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
