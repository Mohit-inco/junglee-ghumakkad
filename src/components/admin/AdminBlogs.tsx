
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash, File, Save, Image } from 'lucide-react';

// Sample blog data - in a real app, this would come from your database
const sampleBlogs = [
  {
    id: 1,
    title: "Wildlife Photography Tips for Beginners",
    summary: "Essential tips and gear recommendations to get started in wildlife photography.",
    content: "Full content would go here...",
    image: "/lovable-uploads/78c195fe-7a73-4a8a-9544-b17bff810417.png",
    date: "2024-03-15",
    author: "Mohit Kumar",
    tags: ["tips", "beginners", "gear"]
  },
  {
    id: 2,
    title: "My Journey Through the Western Ghats",
    summary: "A photo essay documenting a week-long trip through India's biodiversity hotspot.",
    content: "Full content would go here...",
    image: "/lovable-uploads/4b557edc-218f-4fe4-84ab-4a45cc24b0bc.png",
    date: "2024-02-20",
    author: "Junglee Ghumakkad",
    tags: ["travel", "photo essay", "western ghats"]
  }
];

const AdminBlogs = () => {
  const { toast } = useToast();
  const [blogs, setBlogs] = useState(sampleBlogs);
  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    summary: '',
    content: '',
    image: '',
    date: '',
    author: 'Junglee Ghumakkad', // default author
    tags: '',
  });
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleEdit = (blog: any) => {
    setFormData({
      id: blog.id,
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      image: blog.image,
      date: blog.date,
      author: blog.author,
      tags: blog.tags.join(', '),
    });
    setEditingItemId(blog.id);
    setImagePreview(blog.image);
    setIsDialogOpen(true);
  };
  
  const handleNewBlog = () => {
    // Format today's date as YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    setFormData({
      id: blogs.length + 1,
      title: '',
      summary: '',
      content: '',
      image: '',
      date: today,
      author: 'Junglee Ghumakkad',
      tags: '',
    });
    setEditingItemId(null);
    setImagePreview(null);
    setIsDialogOpen(true);
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real implementation, you would upload this file to your server or cloud storage
    // and get back a URL to use. For this demo, we'll create a temporary object URL.
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setFormData({ ...formData, image: `[Uploaded file: ${file.name}]` });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert tags string to array
    const tagsArray = formData.tags.split(',').map(tag => tag.trim());
    
    // Create new blog object
    const newBlogData = {
      id: formData.id,
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      image: formData.image,
      date: formData.date,
      author: formData.author,
      tags: tagsArray,
    };
    
    if (editingItemId) {
      // Update existing item
      setBlogs(blogs.map(item => 
        item.id === editingItemId ? newBlogData : item
      ));
      toast({
        title: "Blog post updated",
        description: `"${formData.title}" has been updated successfully.`,
      });
    } else {
      // Add new item
      setBlogs([...blogs, newBlogData]);
      toast({
        title: "Blog post created",
        description: `"${formData.title}" has been added to your blog.`,
      });
    }
    
    setIsDialogOpen(false);
    
    // In a real app, you would update your database here
    console.log('Updated blog posts:', [...blogs, newBlogData]);
  };
  
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter(item => item.id !== id));
      
      toast({
        title: "Blog post deleted",
        description: "The blog post has been removed.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-muted-foreground">Create, edit, and manage blog posts.</p>
        </div>
        <Button onClick={handleNewBlog}>
          <Plus className="mr-2 h-4 w-4" /> New Blog Post
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>
                <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }} 
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{blog.title}</TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(blog.date)}</TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-wrap gap-1">
                  {blog.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(blog.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItemId ? 'Edit Blog Post' : 'Create Blog Post'}</DialogTitle>
            <DialogDescription>
              {editingItemId 
                ? 'Make changes to your blog post below.' 
                : 'Fill in the details to create a new blog post.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Blog post title"
                  required
                />
              </div>
              
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div>
                  <Label htmlFor="date">Publish Date</Label>
                  <Input 
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input 
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea 
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="Brief summary of your blog post"
                  rows={2}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="featuredImage">Featured Image</Label>
                <div className="mt-1 flex items-center space-x-4">
                  {imagePreview && (
                    <div className="h-24 w-24 bg-muted rounded overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      id="featuredImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea 
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your blog post content here..."
                  rows={10}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  In a full implementation, this would be a rich text editor.
                </p>
              </div>
              
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="wildlife, photography, tips (comma separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate tags with commas
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {editingItemId ? 'Update Post' : 'Publish Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogs;
