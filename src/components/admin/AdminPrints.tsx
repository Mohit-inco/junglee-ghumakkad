
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash, Save } from 'lucide-react';
import { printOptions } from '@/lib/data';

const AdminPrints = () => {
  const { toast } = useToast();
  const [prints, setPrints] = useState(printOptions);
  const [formData, setFormData] = useState({
    id: 0,
    size: '',
    price: 0,
    inStock: true,
  });
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'number' ? parseFloat(value) : value 
    });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, inStock: checked });
  };
  
  const handleEdit = (print: any) => {
    setFormData({
      id: print.id,
      size: print.size,
      price: print.price,
      inStock: print.inStock,
    });
    setEditingItemId(print.id);
    setIsDialogOpen(true);
  };
  
  const handleNewPrint = () => {
    setFormData({
      id: prints.length + 1,
      size: '',
      price: 0,
      inStock: true,
    });
    setEditingItemId(null);
    setIsDialogOpen(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPrintData = {
      id: formData.id,
      size: formData.size,
      price: formData.price,
      inStock: formData.inStock,
    };
    
    if (editingItemId) {
      // Update existing item
      setPrints(prints.map(item => 
        item.id === editingItemId ? newPrintData : item
      ));
      toast({
        title: "Print option updated",
        description: `${formData.size} has been updated successfully.`,
      });
    } else {
      // Add new item
      setPrints([...prints, newPrintData]);
      toast({
        title: "Print option added",
        description: `${formData.size} has been added to print options.`,
      });
    }
    
    setIsDialogOpen(false);
    
    // In a real app, you would update your database here
    console.log('Updated print options:', [...prints, newPrintData]);
  };
  
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this print option?')) {
      setPrints(prints.filter(item => item.id !== id));
      
      toast({
        title: "Print option deleted",
        description: "The print option has been removed.",
      });
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
          {prints.map((print) => (
            <TableRow key={print.id}>
              <TableCell>{print.size}</TableCell>
              <TableCell>{formatPrice(print.price)}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  print.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {print.inStock ? 'In Stock' : 'Out of Stock'}
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
        </TableBody>
      </Table>
      
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
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {editingItemId ? 'Save Changes' : 'Add Option'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPrints;
