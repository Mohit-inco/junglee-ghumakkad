
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Save } from 'lucide-react';
import { useSupabaseClient } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface PrintOption {
  id: string;
  size: string;
  price: number;
  in_stock: boolean;
}

const AdminPrints = () => {
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    id: '',
    size: '',
    price: 0,
    in_stock: true,
  });
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Query to fetch print options
  const { data: printOptions = [], isLoading } = useQuery({
    queryKey: ['printOptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('print_options')
        .select('*')
        .order('price', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
  
  // Mutation to create a new print option
  const createPrintOptionMutation = useMutation({
    mutationFn: async (data: Omit<PrintOption, 'id'>) => {
      const { data: result, error } = await supabase
        .from('print_options')
        .insert([data])
        .select();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printOptions'] });
      toast({
        title: "Print option added",
        description: `${formData.size} has been added to print options.`,
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add print option",
        variant: "destructive",
      });
    }
  });
  
  // Mutation to update an existing print option
  const updatePrintOptionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<PrintOption> }) => {
      const { data: result, error } = await supabase
        .from('print_options')
        .update(data)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printOptions'] });
      toast({
        title: "Print option updated",
        description: `${formData.size} has been updated successfully.`,
      });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update print option",
        variant: "destructive",
      });
    }
  });
  
  // Mutation to delete a print option
  const deletePrintOptionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('print_options')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['printOptions'] });
      toast({
        title: "Print option deleted",
        description: "The print option has been removed.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete print option",
        variant: "destructive",
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'number' ? parseFloat(value) : value 
    });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, in_stock: checked });
  };
  
  const handleEdit = (print: PrintOption) => {
    setFormData({
      id: print.id,
      size: print.size,
      price: print.price,
      in_stock: print.in_stock,
    });
    setEditingItemId(print.id);
    setIsDialogOpen(true);
  };
  
  const handleNewPrint = () => {
    setFormData({
      id: '',
      size: '',
      price: 0,
      in_stock: true,
    });
    setEditingItemId(null);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const printData = {
      size: formData.size,
      price: formData.price,
      in_stock: formData.in_stock,
    };
    
    if (editingItemId) {
      // Update existing item
      updatePrintOptionMutation.mutate({ 
        id: editingItemId, 
        data: printData 
      });
    } else {
      // Add new item
      createPrintOptionMutation.mutate(printData as any);
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this print option?')) {
      deletePrintOptionMutation.mutate(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Print Options</h2>
          <p className="text-muted-foreground">Manage available sizes and pricing for prints.</p>
        </div>
        <Button onClick={handleNewPrint}>
          <Plus className="mr-2 h-4 w-4" /> Add Print Option
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {printOptions.map((print: PrintOption) => (
              <TableRow key={print.id}>
                <TableCell>{print.size}</TableCell>
                <TableCell>{formatPrice(print.price)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    print.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {print.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(print)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(print.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {printOptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No print options found. Add your first option.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingItemId ? 'Edit Print Option' : 'Add Print Option'}</DialogTitle>
            <DialogDescription>
              {editingItemId 
                ? 'Make changes to the print option below.' 
                : 'Add a new print size and price option.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label htmlFor="size">Size</Label>
                <Input 
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 8x10 inches"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input 
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="29.99"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="in_stock"
                  checked={formData.in_stock}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="in_stock">In Stock</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createPrintOptionMutation.isPending || updatePrintOptionMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {createPrintOptionMutation.isPending || updatePrintOptionMutation.isPending ? 'Saving...' : 
                  editingItemId ? 'Save Changes' : 'Add Option'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPrints;
