
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Package } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand and Description */}
          <div className="space-y-4">
            <Link to="/" className="text-xl font-serif font-semibold inline-block">
              JUNGLEE GHUMAKKAD
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Capturing the beauty and drama of wildlife around the world, creating windows into the natural world.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/print" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Prints
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/junglee_ghumakkad/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="mailto:info@wildframephotography.com" aria-label="Email" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for updates on new work and exhibitions.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 text-sm border border-r-0 border-input bg-background rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-r-md hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} Junglee Ghumakkad. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <Link to="/track-order" className="hover:text-foreground transition-colors">Track Your Order</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
