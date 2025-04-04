
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import SectionCategorySelector from './SectionCategorySelector';

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

interface ImageFormFieldsProps {
  form: UseFormReturn<ImageFormData>;
  availableSections: string[];
}

const ImageFormFields: React.FC<ImageFormFieldsProps> = ({ form, availableSections }) => {
  return (
    <>
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter image title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter image description" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Location and Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Where was this photo taken?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Taken</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Photographer's Note */}
      <FormField
        control={form.control}
        name="photographers_note"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Photographer's Note</FormLabel>
            <FormControl>
              <Textarea placeholder="Any special notes about this image?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Categories */}
      <SectionCategorySelector
        form={form}
        name="categories"
        label="Categories"
        description="Select one or more categories for this image"
        options={['wildlife', 'landscape', 'portrait', 'street', 'astro', 'macro']}
        placeholder="Select categories"
      />
      
      {/* Sections */}
      <SectionCategorySelector
        form={form}
        name="sections"
        label="Display Sections"
        description="Choose which sections this image should appear in"
        options={availableSections}
        placeholder="Select sections"
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
                className="w-full"
              />
            </FormControl>
            <FormDescription>
              Add relevant tags to help with searching and filtering
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Enable Print */}
      <FormField
        control={form.control}
        name="enable_print"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Available for Print</FormLabel>
              <FormDescription>
                Make this image available for purchase as a print
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default ImageFormFields;
