
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
import Cart from '@/pages/Cart';
import Print from '@/pages/Print';
import PrintsGallery from '@/pages/PrintsGallery';
import OrderConfirmation from '@/pages/OrderConfirmation';
import TrackOrder from '@/pages/TrackOrder';
import AdminOrders from '@/pages/AdminOrders';
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

  // Handle splash screen completion
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {showSplash ? (
          <SplashScreen onComplete={handleSplashComplete} />
        ) : (
          <>
            <Routes>
              <Route path="/" element={<PageTransition><Index /></PageTransition>} />
              <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
              <Route path="/about" element={<PageTransition><About /></PageTransition>} />
              <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
              <Route path="/blogs/:id" element={<PageTransition><BlogPost /></PageTransition>} />
              <Route path="/print/:id" element={<PageTransition><Print /></PageTransition>} />
              <Route path="/prints" element={<PageTransition><PrintsGallery /></PageTransition>} />
              <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
              <Route path="/order-confirmation" element={<PageTransition><OrderConfirmation /></PageTransition>} />
              <Route path="/track-order" element={<PageTransition><TrackOrder /></PageTransition>} />
              {/* Admin routes without PageTransition */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </>
        )}
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
