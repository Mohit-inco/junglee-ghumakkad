import { useState, useEffect } from 'react';

// Custom hook to detect scroll direction
const useScrollDirection = (threshold = 10) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [prevScroll, setPrevScroll] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // Check if page is scrolled more than threshold (for background change)
      setIsScrolled(currentScrollPos > 50);
      
      // At the very top of the page, always show the navbar
      if (currentScrollPos <= 0) {
        setVisible(true);
        setPrevScroll(currentScrollPos);
        return;
      }
      
      const isScrollingDown = currentScrollPos > prevScroll;
      const scrollDifference = Math.abs(currentScrollPos - prevScroll);
      
      // Only update if we've scrolled more than the threshold
      if (scrollDifference > threshold) {
        // Update direction
        setScrollDirection(isScrollingDown ? 'down' : 'up');
        
        // Update visibility based on direction
        setVisible(!isScrollingDown);
        
        // Save current position for next comparison
        setPrevScroll(currentScrollPos);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScroll, threshold]);

  return { scrollDirection, visible, isScrolled };
};

export default useScrollDirection;
