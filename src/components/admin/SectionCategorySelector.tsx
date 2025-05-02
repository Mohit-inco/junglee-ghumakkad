
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ImageFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  photographers_note: string;
  enable_print: boolean;
  sections: string[];
  categories: string[];
  genres: string[];
}

interface SelectorProps {
  form: UseFormReturn<ImageFormData>;
  name: 'sections' | 'categories' | 'genres';
  label: string;
  description: string;
  options: string[];
  placeholder: string;
  onAddNew?: (value: string) => void;
}

const SectionCategorySelector: React.FC<SelectorProps> = ({ 
  form, 
  name, 
  label, 
  description, 
  options, 
  placeholder,
  onAddNew
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleAddNew = () => {
    if (newValue.trim() && onAddNew) {
      onAddNew(newValue.trim());
      setNewValue('');
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {field.value.length > 0 
                      ? `${field.value.length} ${name} selected` 
                      : placeholder}
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  {options.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option}
                      checked={field.value.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, option]);
                        } else {
                          field.onChange(field.value.filter((val) => val !== option));
                        }
                      }}
                    >
                      {option}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {onAddNew && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIsDialogOpen(true)}
                  title={`Add new ${name.slice(0, -1)}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <FormDescription>
              {description}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Dialog for adding a new value */}
      {onAddNew && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New {name.slice(0, -1).charAt(0).toUpperCase() + name.slice(0, -1).slice(1)}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="newValue"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder={`Enter new ${name.slice(0, -1)} name`}
                  className="col-span-4"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleAddNew}>
                Add {name.slice(0, -1).charAt(0).toUpperCase() + name.slice(0, -1).slice(1)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default SectionCategorySelector;
