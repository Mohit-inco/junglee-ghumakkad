
import { supabase } from './client';
import { Tables } from './types';

export type GalleryImage = Tables<'gallery_images'>;
export type Blog = Tables<'blogs'>;
export type BlogImage = Tables<'blog_images'>;
export type PrintOption = Tables<'print_options'>;

export async function getGalleryImages(section?: string): Promise<GalleryImage[]> {
  let query = supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (section) {
    query = query.contains('sections', [section]);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }
  
  return data || [];
}

export async function getImagesBySection(section: string): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .contains('sections', [section])
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching ${section} images:`, error);
    return [];
  }
  
  return data || [];
}

export async function getImagesByGenre(genre: string): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .contains('genres', [genre])
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error(`Error fetching ${genre} genre images:`, error);
    return [];
  }
  
  return data || [];
}

export async function getImageById(id: string): Promise<GalleryImage | null> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching image:', error);
    return null;
  }
  
  return data;
}

export async function getBlogs(): Promise<Blog[]> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
  
  return data || [];
}

export async function getBlog(blogId: string): Promise<Blog | null> {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', blogId)
    .single();
  
  if (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
  
  return data;
}

export async function getBlogImages(blogId: string): Promise<BlogImage[]> {
  const { data, error } = await supabase
    .from('blog_images')
    .select('*')
    .eq('blog_id', blogId)
    .order('display_order', { ascending: true });
  
  if (error) {
    console.error('Error fetching blog images:', error);
    return [];
  }
  
  return data || [];
}

// Helper function to get the complete public URL for a stored image
export function getStorageUrl(path: string): string {
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}

// Function to get available website sections
export function getAvailableSections(): string[] {
  // These are the sections currently used in the application
  return ['featured', 'wildlife', 'landscape', 'astro', 'portrait', 'about', 'gallery', 'street'];
}

// Function to create or update an image in the gallery
export async function saveGalleryImage(image: Partial<GalleryImage> & { id?: string }): Promise<GalleryImage | null> {
  try {
    // Make sure categories is an array (not optional)
    if (!image.categories) {
      image.categories = [];
    }
    
    // Ensure sections is an array
    if (!image.sections) {
      image.sections = [];
    }
    
    // Ensure genres is an array
    if (!image.genres) {
      image.genres = [];
    }
    
    if (image.id) {
      // Update existing image
      const { data, error } = await supabase
        .from('gallery_images')
        .update({
          title: image.title,
          description: image.description,
          location: image.location,
          date: image.date,
          photographers_note: image.photographers_note,
          sections: image.sections,
          categories: image.categories,
          genres: image.genres,
          enable_print: image.enable_print,
          image_url: image.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', image.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } else {
      // Create new image
      const { data, error } = await supabase
        .from('gallery_images')
        .insert({
          title: image.title!,
          description: image.description,
          location: image.location,
          date: image.date,
          photographers_note: image.photographers_note,
          sections: image.sections,
          categories: image.categories,
          genres: image.genres,
          enable_print: image.enable_print,
          image_url: image.image_url!
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving gallery image:', error);
    return null;
  }
}

// Print options functions
export async function getPrintOptions(imageId: string): Promise<PrintOption[]> {
  const { data, error } = await supabase
    .from('print_options')
    .select('*')
    .eq('image_id', imageId)
    .order('price', { ascending: true });
  
  if (error) {
    console.error('Error fetching print options:', error);
    return [];
  }
  
  return data || [];
}

export async function savePrintOption(option: Partial<PrintOption> & { image_id: string; size: string; price: number }): Promise<PrintOption | null> {
  try {
    if (option.id) {
      // Update existing print option
      const { data, error } = await supabase
        .from('print_options')
        .update({
          size: option.size,
          price: option.price,
          in_stock: option.in_stock,
          updated_at: new Date().toISOString()
        })
        .eq('id', option.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } else {
      // Create new print option
      const { data, error } = await supabase
        .from('print_options')
        .insert({
          image_id: option.image_id,
          size: option.size,
          price: option.price,
          in_stock: option.in_stock !== undefined ? option.in_stock : true
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving print option:', error);
    return null;
  }
}

export async function deletePrintOption(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('print_options')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting print option:', error);
    return false;
  }
}
