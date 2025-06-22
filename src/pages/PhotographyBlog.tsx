import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogTemplate from '../components/BlogTemplate';
import { blog1 } from '../data/BlogData';

// This is a wrapper component to maintain backward compatibility
export default function PhotographyBlog() {
  const navigate = useNavigate();
  
  // This effect redirects to the new blog URL
  useEffect(() => {
    // You can uncomment this to automatically redirect to the new format
    // navigate('/blogs/nelapattu-pulicat-expedition', { replace: true });
    // For now, we'll keep using the existing implementation
  }, [navigate]);

  // Here we're just using our template component with the blog1 data
  // This way the original blog1 still works but uses our new system
  return <BlogTemplate content={blog1} />;
}
