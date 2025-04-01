
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { getImageSrc } from "@/lib/data";
import { AnimatePresence } from 'framer-motion';
import PageTransition from "./components/PageTransition";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

// Pages
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Print from "./pages/Print";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import Blogs from "./pages/Blogs";
import Admin from "./pages/Admin";

// Make getImageSrc available globally for our data
// @ts-ignore - Adding getImageSrc to window
window.getImageSrc = getImageSrc;

const queryClient = new QueryClient();

// Page transitions wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/print" element={<PageTransition><Print /></PageTransition>} />
        <Route path="/print/:id" element={<PageTransition><Print /></PageTransition>} />
        <Route path="/blogs" element={<PageTransition><Blogs /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const SupabaseConfigWarning = () => {
  if (supabase) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-background">
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Supabase Configuration Missing</AlertTitle>
        <AlertDescription>
          Please set up your environment variables. Create a .env file at the project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          See README.md for instructions.
        </AlertDescription>
      </Alert>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Only use SessionContextProvider if supabase is available */}
    {supabase ? (
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SupabaseConfigWarning />
              <AnimatedRoutes />
            </BrowserRouter>
          </CartProvider>
        </TooltipProvider>
      </SessionContextProvider>
    ) : (
      <TooltipProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SupabaseConfigWarning />
            <AnimatedRoutes />
          </BrowserRouter>
        </CartProvider>
      </TooltipProvider>
    )}
  </QueryClientProvider>
);

export default App;
