
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageFormFields } from './ImageFormFields';
import { ImageUploadSection } from './ImageUploadSection';
import { supabase } from '@/integrations/supabase/client';
import { PrintOptionsForm } from './PrintOptionsForm';

export const ImageUploadPanel = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photographersNote, setPhotographersNote] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [enablePrint, setEnablePrint] = useState(false);
  const [printOptions, setPrintOptions] = useState<{ size: string; price: number; printType: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPhotographersNote('');
    setLocation('');
    setDate('');
    setCategories([]);
    setTags([]);
    setSections([]);
    setImageFile(null);
    setImagePreview(null);
    setEnablePrint(false);
    setPrintOptions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !title) {
      toast.error('Image and title are required');
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload image file to Supabase Storage
      const fileName = `${Date.now()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(fileName, imageFile);
      
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get the public URL for the uploaded image
      const { data: urlData } = await supabase.storage
        .from('gallery')
        .getPublicUrl(fileName);
      
      const imageUrl = urlData?.publicUrl;
      
      // Insert image metadata into gallery_images table
      const { error: insertError } = await supabase.from('gallery_images').insert({
        title,
        description,
        photographers_note: photographersNote,
        location,
        date: date || null,
        categories,
        tags, // This will be properly handled as an array now
        sections,
        image_url: imageUrl,
        enable_print: enablePrint
      });
      
      if (insertError) {
        throw new Error(insertError.message);
      }

      // If print is enabled, add print options
      if (enablePrint && printOptions.length > 0) {
        // Get the ID of the newly inserted image
        const { data: imageData, error: fetchError } = await supabase
          .from('gallery_images')
          .select('id')
          .eq('image_url', imageUrl)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        const imageId = imageData.id;

        // Insert print options
        const printOptionsData = printOptions.map(option => ({
          image_id: imageId,
          size: option.size,
          price: option.price,
          print_type: option.printType
        }));

        const { error: printError } = await supabase
          .from('print_options')
          .insert(printOptionsData);

        if (printError) {
          throw new Error(printError.message);
        }
      }

      toast.success('Image uploaded successfully!');
      resetForm();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Upload Image</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUploadSection 
          setImageFile={setImageFile} 
          setImagePreview={setImagePreview}
          imagePreview={imagePreview}
        />
        
        <ImageFormFields 
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          photographersNote={photographersNote}
          setPhotographersNote={setPhotographersNote}
          location={location}
          setLocation={setLocation}
          date={date}
          setDate={setDate}
          categories={categories}
          setCategories={setCategories}
          tags={tags}
          setTags={setTags}
          sections={sections}
          setSections={setSections}
        />
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="enablePrint" 
            checked={enablePrint}
            onCheckedChange={(checked) => setEnablePrint(checked === true)}
          />
          <label htmlFor="enablePrint" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Enable Print Sales
          </label>
        </div>
        
        {enablePrint && (
          <PrintOptionsForm 
            printOptions={printOptions}
            setPrintOptions={setPrintOptions}
          />
        )}
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={resetForm}
            disabled={isUploading}
          >
            Reset
          </Button>
          <Button 
            type="submit"
            disabled={isUploading || !imageFile || !title}
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        </div>
      </form>
    </div>
  );
};
