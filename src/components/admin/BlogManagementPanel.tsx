
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Blog } from '@/integrations/supabase/api';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Eye, Loader2, Save, Plus, ImageIcon } from 'lucide-react';
import BlogImageUploader from './BlogImageUploader';

interface BlogFormData {
  title: string;
  content: string;
  summary: string;
  tags: string[];
  is_published: boolean;
  cover_image: string;
  author: string;
}

const BlogManagementPanel: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [showImageUploader, setShowImageUploader] = useState(false);

  const form = useForm<BlogFormData>({
    defaultValues: {
      title: '',
      content: '',
      summary: '',
      tags: [],
      is_published: false,
      cover_image: '',
      author: '',
    }
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      toast.error(`Error fetching blogs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setCoverImageFile(null);
      setCoverImagePreview(null);
      return;
    }

    const selectedFile = e.target.files[0];
    setCoverImageFile(selectedFile);

    // Create preview URL
    const objectUrl = URL.createObjectURL(selectedFile);
    setCoverImagePreview(objectUrl);
  };

  const handleSubmit = async (data: BlogFormData) => {
    setSubmitting(true);
    
    try {
      let coverImageUrl = selectedBlog?.cover_image || '';
      
      // If we have a new cover image, upload it
      if (coverImageFile) {
        // Generate a unique filename
        const fileExt = coverImageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `blogs/${fileName}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, coverImageFile);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
          
        coverImageUrl = urlData.publicUrl;
      }
      
      const blogData = {
        title: data.title,
        content: data.content,
        summary: data.summary,
        tags: data.tags,
        is_published: data.is_published,
        author: data.author || 'Admin',
        cover_image: coverImageUrl,
        updated_at: new Date().toISOString()
      };
      
      if (data.is_published && !selectedBlog?.published_at) {
        Object.assign(blogData, { published_at: new Date().toISOString() });
      }
      
      if (selectedBlog) {
        // Update existing blog
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', selectedBlog.id);
          
        if (error) throw error;
        toast.success('Blog updated successfully');
      } else {
        // Create new blog
        const { data: newBlog, error } = await supabase
          .from('blogs')
          .insert({ ...blogData })
          .select()
          .single();
          
        if (error) throw error;
        setSelectedBlog(newBlog);
        toast.success('Blog created successfully');
        
        // Show image uploader if blog was created
        setShowImageUploader(true);
      }
      
      fetchBlogs();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    form.reset({
      title: blog.title,
      content: blog.content,
      summary: blog.summary || '',
      tags: blog.tags || [],
      is_published: blog.is_published || false,
      cover_image: '',
      author: blog.author
    });
    
    if (blog.cover_image) {
      setCoverImagePreview(blog.cover_image);
    } else {
      setCoverImagePreview(null);
    }
    
    setCoverImageFile(null);
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }
    
    try {
      // First delete associated blog images
      const { error: imagesError } = await supabase
        .from('blog_images')
        .delete()
        .eq('blog_id', id);
      
      if (imagesError) throw imagesError;
      
      // Then delete the blog
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Blog deleted successfully');
      fetchBlogs();
      
      if (selectedBlog?.id === id) {
        resetForm();
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const resetForm = () => {
    setSelectedBlog(null);
    setCoverImageFile(null);
    setCoverImagePreview(null);
    form.reset({
      title: '',
      content: '',
      summary: '',
      tags: [],
      is_published: false,
      cover_image: '',
      author: '',
    });
    setShowImageUploader(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{selectedBlog ? 'Edit Blog' : 'Create New Blog'}</CardTitle>
          <CardDescription>
            {selectedBlog ? 'Update your blog post details' : 'Write a new blog post'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Blog post title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Author */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your blog post content" rows={12} {...field} />
                    </FormControl>
                    <FormDescription>
                      You can use markdown formatting in your content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Summary */}
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief summary of your blog post" rows={3} {...field} />
                    </FormControl>
                    <FormDescription>
                      This will be displayed in the blog list view
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter tags separated by commas" 
                        value={field.value?.join(', ') || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                          field.onChange(tags);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Add relevant tags to categorize your blog post
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Cover Image */}
              <div className="space-y-2">
                <FormLabel>Cover Image</FormLabel>
                <div className="flex flex-col items-center gap-4 md:flex-row">
                  {coverImagePreview && (
                    <div className="relative w-40 h-40">
                      <img 
                        src={coverImagePreview} 
                        alt="Cover Preview" 
                        className="w-full h-full object-cover rounded-md"
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => {
                          setCoverImagePreview(null);
                          setCoverImageFile(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <Input
                      id="cover-image"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedBlog && !coverImageFile ? "Leave empty to keep the current cover image" : "Upload a cover image for your blog post"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Published Status */}
              <FormField
                control={form.control}
                name="is_published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Publish Blog</FormLabel>
                      <FormDescription>
                        Make this blog post visible to the public
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1"
                >
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {selectedBlog ? 'Updating...' : 'Creating...'}</>
                  ) : (
                    <>{selectedBlog ? <><Save className="mr-2 h-4 w-4" /> Update Blog</> : <><Plus className="mr-2 h-4 w-4" /> Create Blog</>}</>
                  )}
                </Button>
                
                {selectedBlog && (
                  <>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setShowImageUploader(true)}
                    >
                      <ImageIcon className="mr-2 h-4 w-4" /> Manage Images
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
          
          {showImageUploader && selectedBlog && (
            <div className="mt-8">
              <BlogImageUploader 
                blogId={selectedBlog.id} 
                onClose={() => setShowImageUploader(false)} 
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Blog List */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Blogs</CardTitle>
          <CardDescription>View, edit or delete your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : blogs.length > 0 ? (
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div 
                  key={blog.id} 
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg"
                >
                  {blog.cover_image && (
                    <div className="w-full md:w-32 h-32 shrink-0">
                      <img 
                        src={blog.cover_image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{blog.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${blog.is_published ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {blog.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {blog.summary || blog.content.substring(0, 120) + '...'}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {blog.tags?.map((tag) => (
                        <span 
                          key={tag} 
                          className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditBlog(blog)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          handleEditBlog(blog);
                          setShowImageUploader(true);
                        }}
                      >
                        <ImageIcon className="h-4 w-4 mr-1" /> Images
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(`/blogs/${blog.id}`, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-600 ml-auto"
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't created any blogs yet.</p>
              <Button 
                variant="link" 
                onClick={resetForm} 
                className="mt-2"
              >
                Create your first blog post
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagementPanel;
