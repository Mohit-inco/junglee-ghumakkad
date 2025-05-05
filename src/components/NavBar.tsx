
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { count } = useCart();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md py-2 shadow-md' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-bold">Junglee Ghumakkad</span>
        </Link>
        
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm ${isActive('/') ? 'font-semibold text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Home
          </Link>
          <Link 
            to="/gallery?genre=Wildlife" 
            className={`text-sm ${isActive('/gallery') ? 'font-semibold text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Gallery
          </Link>
          <Link 
            to="/prints" 
            className={`text-sm ${isActive('/prints') ? 'font-semibold text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Prints
          </Link>
          <Link 
            to="/blogs" 
            className={`text-sm ${isActive('/blogs') ? 'font-semibold text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            Blog
          </Link>
          <Link 
            to="/about" 
            className={`text-sm ${isActive('/about') ? 'font-semibold text-foreground' : 'text-muted-foreground'} hover:text-foreground transition-colors`}
          >
            About
          </Link>
          <Link to="/cart">
            <Badge variant="outline" className="rounded-full h-8 w-8 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Badge>
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden flex items-center"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 z-50 bg-background transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px' }} // Adjust based on your header height
      >
        <nav className="flex flex-col p-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-lg py-2 border-b border-muted ${isActive('/') ? 'font-semibold' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/gallery?genre=Wildlife"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-lg py-2 border-b border-muted ${isActive('/gallery') ? 'font-semibold' : ''}`}
          >
            Gallery
          </Link>
          <Link
            to="/prints"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-lg py-2 border-b border-muted ${isActive('/prints') ? 'font-semibold' : ''}`}
          >
            Prints
          </Link>
          <Link
            to="/blogs"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-lg py-2 border-b border-muted ${isActive('/blogs') ? 'font-semibold' : ''}`}
          >
            Blog
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-lg py-2 border-b border-muted ${isActive('/about') ? 'font-semibold' : ''}`}
          >
            About
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg py-2 border-b border-muted flex items-center gap-2"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
            {count > 0 && (
              <Badge className="ml-2 bg-primary text-white">{count}</Badge>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
