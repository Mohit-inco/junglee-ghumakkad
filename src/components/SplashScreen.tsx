
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
          className="fixed inset-0 flex items-center justify-center bg-black z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background content that will be visible through the text */}
            <div className="absolute inset-0 bg-black opacity-90">
              {/* This is where the background of the website would show through */}
            </div>
            
            {/* Text with transparent cutout effect */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ scale: 1 }}
              animate={{ 
                scale: animationPhase === 'zooming' ? 5 : 1,
              }}
              transition={{ 
                duration: 2,
                ease: "easeInOut"
              }}
            >
              <motion.h1 
                className="font-brilliante text-7xl md:text-8xl lg:text-9xl splash-text-cutout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Junglee Ghumakkad
              </motion.h1>
              
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="inline-block h-[1px] w-16 bg-white/60"></span>
                <p className="text-white/70 mt-3 font-nature text-xl tracking-wide">Capturing moments, one click at a time</p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
