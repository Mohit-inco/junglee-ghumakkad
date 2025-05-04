
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { getPrintOptions, savePrintOption, deletePrintOption, PrintOption } from '@/integrations/supabase/api';

interface PrintOptionsProps {
  imageId: string;
}

interface PrintOptionFormData {
  id?: string;
  size: string;
  price: number;
  in_stock: boolean;
}

const PrintOptions: React.FC<PrintOptionsProps> = ({ imageId }) => {
  const [printOptions, setPrintOptions] = useState<PrintOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [newOption, setNewOption] = useState<PrintOptionFormData>({
    size: '',
    price: 0,
    in_stock: true
  });

  // Fetch print options
  useEffect(() => {
    if (!imageId) return;
    
    const fetchPrintOptions = async () => {
      setLoading(true);
      const options = await getPrintOptions(imageId);
      setPrintOptions(options);
      setLoading(false);
    };
    
    fetchPrintOptions();
  }, [imageId]);

  const handleAddOption = async () => {
    if (!newOption.size || newOption.price <= 0) {
      toast.error('Please enter a valid size and price');
      return;
    }
    
    setLoading(true);
    const savedOption = await savePrintOption({
      ...newOption,
      image_id: imageId
    });
    
    if (savedOption) {
      setPrintOptions([...printOptions, savedOption]);
      setNewOption({
        size: '',
        price: 0,
        in_stock: true
      });
      toast.success('Print option added');
    }
    setLoading(false);
  };

  const handleDeleteOption = async (id: string) => {
    setLoading(true);
    const success = await deletePrintOption(id);
    
    if (success) {
      setPrintOptions(printOptions.filter(option => option.id !== id));
      toast.success('Print option deleted');
    }
    setLoading(false);
  };

  const handleToggleInStock = async (option: PrintOption) => {
    setLoading(true);
    const updatedOption = await savePrintOption({
      ...option,
      in_stock: !option.in_stock
    });
    
    if (updatedOption) {
      setPrintOptions(printOptions.map(opt => 
        opt.id === updatedOption.id ? updatedOption : opt
      ));
      toast.success('Print option updated');
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Print Options</CardTitle>
        <CardDescription>Manage available print sizes and prices</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {printOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No print options available. Add some below.</p>
              ) : (
                <div className="grid gap-4">
                  {printOptions.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-3 rounded-md border">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={option.in_stock || false}
                          onCheckedChange={() => handleToggleInStock(option)}
                          disabled={loading}
                        />
                        <div>
                          <p className="font-medium">{option.size}</p>
                          <p className="text-sm text-muted-foreground">
                            ${Number(option.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteOption(option.id)}
                        disabled={loading}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Add New Print Option</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      placeholder="e.g. 8x10"
                      value={newOption.size}
                      onChange={(e) => setNewOption({...newOption, size: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={newOption.price}
                      onChange={(e) => setNewOption({...newOption, price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="in-stock"
                    checked={newOption.in_stock}
                    onCheckedChange={(checked) => setNewOption({...newOption, in_stock: checked})}
                  />
                  <Label htmlFor="in-stock">Available in stock</Label>
                </div>
                <Button
                  onClick={handleAddOption}
                  disabled={loading || !newOption.size || newOption.price <= 0}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Print Option
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PrintOptions;
