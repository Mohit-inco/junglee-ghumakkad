
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart, Instagram, BookOpen } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const {
    cartCount
  } = useCart();

  // Check if route is active
  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Navbar text style classes
  const navTextClasses = "text-white drop-shadow-md";
  return <header className={cn("fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ease-in-out", isScrolled ? "py-3 bg-background/80 shadow-sm backdrop-blur-md border-b" : "py-6 bg-background/0")}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex flex-col items-start">
          <Link to="/" className="brand-name text-xl md:text-2xl text-white font-brilliante tracking-wider drop-shadow-md">
            <span className="text-zinc-50">Junglee Ghumakkad</span>
          </Link>
          <span className="text-white text-xs ml-1.5">Photography</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={cn("nav-link glow-hover", isActive("/") && "active", navTextClasses)}>
            Home
          </Link>
          <Link to="/gallery" className={cn("nav-link glow-hover", isActive("/gallery") && "active", navTextClasses)}>
            Gallery
          </Link>
          <Link to="/blogs" className={cn("nav-link glow-hover", isActive("/blogs") && "active", navTextClasses)}>
            Blogs
          </Link>
          <Link to="/print" className={cn("nav-link glow-hover", isActive("/print") && "active", navTextClasses)}>
            Prints
          </Link>
          <Link to="/about" className={cn("nav-link glow-hover", isActive("/about") && "active", navTextClasses)}>
            About
          </Link>
          <a 
            href="https://www.instagram.com/junglee_ghumakkad/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn("p-2 hover:opacity-80 transition-colors duration-200 glow-hover", navTextClasses)}
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <Link to="/cart" className={cn("relative p-2 hover:opacity-80 transition-colors duration-200 glow-hover", navTextClasses)} aria-label="Shopping Cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fade-in">
                {cartCount}
              </span>}
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <a 
            href="https://www.instagram.com/junglee_ghumakkad/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={cn("p-2 mr-2 hover:opacity-80 transition-colors duration-200", navTextClasses)}
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <Link to="/cart" className={cn("relative p-2 mr-2 hover:opacity-80 transition-colors duration-200", navTextClasses)} aria-label="Shopping Cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-fade-in">
                {cartCount}
              </span>}
          </Link>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={cn("p-2 hover:opacity-80 transition-colors duration-200", navTextClasses)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
    {/* md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-sm animate-slide-down*/}
      {/* Mobile Menu */}
      {isMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 h-screen z-50 bg-white/30 dark:bg-black/30 backdrop-blur-md border-b shadow-sm animate-slide-down">
          <nav className="flex flex-col p-6 space-y-4">
            <Link to="/" className={cn("text-lg nav-link", isActive("/") && "active", "text-foreground")}>
              Home
            </Link>
            <Link to="/gallery" className={cn("text-lg nav-link", isActive("/gallery") && "active", "text-foreground")}>
              Gallery
            </Link>
            <Link to="/blogs" className={cn("text-lg nav-link", isActive("/blogs") && "active", "text-foreground")}>
              Blogs
            </Link>
            <Link to="/print" className={cn("text-lg nav-link", isActive("/print") && "active", "text-foreground")}>
              Prints
            </Link>
            <Link to="/about" className={cn("text-lg nav-link", isActive("/about") && "active", "text-foreground")}>
              About
            </Link>
          </nav>
        </div>}
    </header>;
};
export default NavBar;
