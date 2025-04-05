
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/context/CartContext';
import PageTransition from '@/components/PageTransition';
import SplashScreen from '@/components/SplashScreen';
import Index from '@/pages/Index';
import Gallery from '@/pages/Gallery';
import About from '@/pages/About';
import Blogs from '@/pages/Blogs';
import BlogPost from '@/pages/BlogPost';
import Print from '@/pages/Print';
import Cart from '@/pages/Cart';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin';
import AdminLogin from '@/pages/AdminLogin';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });

  // Check if this is the first visit in this session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      setShowSplash(false);
    } else {
      setShowSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasVisited', 'true');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {/* Render both the main app and the splash screen overlay */}
        <div className="relative">
          <Routes>
            <Route path="/" element={<PageTransition><Index /></PageTransition>} />
            <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
            <Route path="/blogs/:id" element={<PageTransition><BlogPost /></PageTransition>} />
            <Route path="/print" element={<PageTransition><Print /></PageTransition>} />
            <Route path="/print/:id" element={<PageTransition><Print /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            {/* Admin routes without PageTransition */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {showSplash && window.location.pathname === '/' && (
            <SplashScreen onComplete={handleSplashComplete} />
          )}
          
          <Toaster />
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
