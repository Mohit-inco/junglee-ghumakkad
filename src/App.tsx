
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from '@/context/CartContext';
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Print from "./pages/Print";
import PrintsGallery from "./pages/PrintsGallery";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder from "./pages/TrackOrder";
import About from "./pages/About";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminSMSLogin from "./pages/AdminSMSLogin";
import AdminOrders from "./pages/AdminOrders";
import Blogs from "./pages/Blogs";
import BlogPost from "./pages/BlogPost";
import PhotographyBlog from "./pages/PhotographyBlog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/print/:id" element={<Print />} />
            <Route path="/prints" element={<PrintsGallery />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-sms-login" element={<AdminSMSLogin />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogPost />} />
            <Route path="/photography-blog" element={<PhotographyBlog />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
