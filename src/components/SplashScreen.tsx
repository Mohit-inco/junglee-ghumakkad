
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
          <motion.div
            className="text-center"
            initial={{ scale: 1 }}
            animate={{ 
              scale: animationPhase === 'zooming' ? 1.8 : 1,
              opacity: animationPhase === 'zooming' ? 0 : 1
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut"
            }}
          >
            <motion.h1 
              className="font-brilliante text-5xl md:text-7xl lg:text-8xl text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
