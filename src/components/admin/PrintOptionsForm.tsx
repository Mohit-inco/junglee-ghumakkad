
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { X, Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { PrintOption } from '@/integrations/supabase/api';

interface PrintOptionsFormProps {
  imageId: string;
  onClose: () => void;
}

interface PrintOptionFormData {
  size: string;
  price: string;
  print_type: string;
  in_stock: boolean;
}

const PrintOptionsForm: React.FC<PrintOptionsFormProps> = ({ imageId, onClose }) => {
  const [options, setOptions] = useState<PrintOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<PrintOptionFormData>({
    defaultValues: {
      size: '',
      price: '',
      print_type: 'Archival Matte Paper',
      in_stock: true
    }
  });

  useEffect(() => {
    fetchPrintOptions();
  }, [imageId]);

  const fetchPrintOptions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('print_options')
        .select('*')
        .eq('image_id', imageId)
        .order('price', { ascending: true });
        
      if (error) throw error;
      setOptions(data || []);
    } catch (error: any) {
      toast.error(`Error fetching print options: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: PrintOptionFormData) => {
    setSubmitting(true);
    
    try {
      const formattedPrice = parseFloat(data.price);
      
      if (isNaN(formattedPrice)) {
        throw new Error('Please enter a valid price');
      }
      
      const printOption = {
        size: data.size,
        price: formattedPrice,
        print_type: data.print_type,
        in_stock: data.in_stock,
        image_id: imageId,
        // Add this to ensure the option is linked to a valid gallery image
        created_at: new Date().toISOString()
      };
      
      if (editingId) {
        // Update existing print option
        const { error } = await supabase
          .from('print_options')
          .update(printOption)
          .eq('id', editingId);
          
        if (error) throw error;
        toast.success('Print option updated successfully');
        setEditingId(null);
      } else {
        // Add new print option
        const { error } = await supabase
          .from('print_options')
          .insert(printOption);
          
        if (error) throw error;
        toast.success('Print option added successfully');
      }
      
      // Reset form and refresh options
      form.reset({
        size: '',
        price: '',
        print_type: 'Archival Matte Paper',
        in_stock: true
      });
      fetchPrintOptions();
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (option: PrintOption) => {
    setEditingId(option.id);
    form.reset({
      size: option.size,
      price: option.price.toString(),
      print_type: option.print_type || 'Archival Matte Paper',
      in_stock: option.in_stock ?? true
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this print option?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('print_options')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Print option deleted successfully');
      fetchPrintOptions();
      
      if (editingId === id) {
        setEditingId(null);
        form.reset({
          size: '',
          price: '',
          print_type: 'Archival Matte Paper',
          in_stock: true
        });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    form.reset({
      size: '',
      price: '',
      print_type: 'Archival Matte Paper',
      in_stock: true
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Print Options</CardTitle>
          <CardDescription>Manage print options for this image</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 8x10 inches" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 29.99" type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="print_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Print Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Archival Matte Paper" {...field} />
                  </FormControl>
                  <FormDescription>
                    The material or finish of the print
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="in_stock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>In Stock</FormLabel>
                    <FormDescription>
                      Mark this print option as available for purchase
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {editingId ? 'Updating...' : 'Adding...'}</>
                ) : (
                  <>{editingId ? <><Save className="mr-2 h-4 w-4" /> Update Option</> : <><Plus className="mr-2 h-4 w-4" /> Add Option</>}</>
                )}
              </Button>
              
              {editingId && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={cancelEdit}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Existing Print Options</h3>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : options.length > 0 ? (
            <div className="space-y-2">
              {options.map((option) => (
                <div 
                  key={option.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{option.size}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>${option.price.toFixed(2)}</span>
                      <span>•</span>
                      <span>{option.print_type}</span>
                      <span>•</span>
                      <span className={option.in_stock ? "text-green-600" : "text-red-600"}>
                        {option.in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEdit(option)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(option.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No print options yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PrintOptionsForm;
