
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

// Update the interface to match how it's used
interface PrintOptionsFormProps {
  options: { size: string; price: number; printType: string }[];
  setOptions: React.Dispatch<React.SetStateAction<{ size: string; price: number; printType: string }[]>>;
}

const PrintOptionsForm: React.FC<PrintOptionsFormProps> = ({ options, setOptions }) => {
  // Add a new print option
  const addPrintOption = () => {
    setOptions([...options, { size: '', price: 0, printType: 'Archival Matte Paper' }]);
  };

  // Remove a print option
  const removePrintOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  // Update a print option
  const updatePrintOption = (index: number, field: keyof (typeof options)[0], value: string | number) => {
    const updatedOptions = [...options];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setOptions(updatedOptions);
  };

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">Print Options</h3>
      
      {options.map((option, index) => (
        <div key={index} className="flex flex-col md:flex-row gap-4 pb-4 border-b last:border-b-0 last:pb-0">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Size</label>
            <Input 
              value={option.size} 
              onChange={(e) => updatePrintOption(index, 'size', e.target.value)}
              placeholder="e.g., 8x10 inches"
            />
          </div>
          
          <div className="w-full md:w-32">
            <label className="text-sm font-medium mb-1 block">Price (₹)</label>
            <Input 
              type="number" 
              value={option.price} 
              onChange={(e) => updatePrintOption(index, 'price', parseFloat(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Print Type</label>
            <Input 
              value={option.printType} 
              onChange={(e) => updatePrintOption(index, 'printType', e.target.value)}
              placeholder="e.g., Archival Matte Paper"
            />
          </div>
          
          <div className="flex items-end">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => removePrintOption(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={addPrintOption}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Print Option
      </Button>
    </div>
  );
};

export default PrintOptionsForm;
