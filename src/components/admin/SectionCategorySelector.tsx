
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface ImageFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  photographers_note: string;
  enable_print: boolean;
  sections: string[];
  categories: string[];
  tags: string[];
}

interface SelectorProps {
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
  type: 'sections' | 'categories';
}

export const SectionCategorySelector: React.FC<SelectorProps> = ({ 
  selectedItems, 
  setSelectedItems, 
  type 
}) => {
  // Sample options - in a real app, these would come from your database
  const options = type === 'sections' 
    ? ['featured', 'wildlife', 'landscape', 'astro', 'portrait', 'street', 'about', 'gallery'] 
    : ['nature', 'wildlife', 'landscape', 'portrait', 'street', 'travel', 'architecture', 'abstract'];

  const placeholder = type === 'sections' ? 'Select sections' : 'Select categories';
  const label = type === 'sections' ? 'Sections' : 'Categories';
  const description = type === 'sections' 
    ? 'Choose which sections this image should appear in' 
    : 'Select appropriate categories for this image';

  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selectedItems.length > 0 
              ? `${selectedItems.length} ${type} selected` 
              : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full">
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option}
              checked={selectedItems.includes(option)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedItems([...selectedItems, option]);
                } else {
                  setSelectedItems(selectedItems.filter((item) => item !== option));
                }
              }}
            >
              {option}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <p className="text-xs text-muted-foreground mt-1">
        {description}
      </p>
    </div>
  );
};
