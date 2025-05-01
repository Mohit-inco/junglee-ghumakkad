
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
  form: UseFormReturn<ImageFormData>;
  name: 'sections' | 'categories';
  label: string;
  description: string;
  options: string[];
  placeholder: string;
}

const SectionCategorySelector: React.FC<SelectorProps> = ({ 
  form, 
  name, 
  label, 
  description, 
  options, 
  placeholder 
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
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
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SectionCategorySelector;
