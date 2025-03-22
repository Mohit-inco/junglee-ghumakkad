
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-serif font-semibold mb-6">404</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The page you're looking for couldn't be found.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Return to Home
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
