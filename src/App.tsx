
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { getImageSrc } from "@/lib/data";
import { AnimatePresence } from 'framer-motion';
import PageTransition from "./components/PageTransition";

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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
