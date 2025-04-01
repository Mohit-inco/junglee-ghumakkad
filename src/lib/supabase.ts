
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Custom hook to use Supabase client
export function useSupabaseClient() {
  return supabase;
}

// Types for our database tables
export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  photographer_note: string;
  location: string;
  date: string;
  image_url: string;
  alt: string;
  categories: string[];
  created_at: string;
}

export interface PrintOption {
  id: string;
  size: string;
  price: number;
  in_stock: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image_url: string;
  excerpt: string;
  author: string;
  created_at: string;
  published: boolean;
}

// Database helper functions
export async function fetchGalleryImages() {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function createGalleryImage(image: Omit<GalleryImage, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert([image])
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function updateGalleryImage(id: string, updates: Partial<Omit<GalleryImage, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('gallery_images')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw error;
  }
  
  return true;
}

export async function uploadImage(file: File, folderName: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${folderName}/${fileName}`;
  
  const { data, error } = await supabase.storage
    .from('images')
    .upload(filePath, file);
  
  if (error) {
    throw error;
  }
  
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);
    
  return urlData.publicUrl;
}

// For Print options
export async function fetchPrintOptions() {
  const { data, error } = await supabase
    .from('print_options')
    .select('*')
    .order('price', { ascending: true });
  
  if (error) {
    throw error;
  }
  
  return data;
}

// For Blog posts
export async function fetchBlogPosts(onlyPublished = true) {
  let query = supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (onlyPublished) {
    query = query.eq('published', true);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data;
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
}

// Custom hook to check if a user is authenticated
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setIsLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, isLoading };
}
