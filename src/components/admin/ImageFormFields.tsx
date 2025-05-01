
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SectionCategorySelector } from './SectionCategorySelector';
import { TagInput } from '@/components/TagInput';

interface ImageFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  photographersNote: string;
  setPhotographersNote: (note: string) => void;
  location: string;
  setLocation: (location: string) => void;
  date: string;
  setDate: (date: string) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  sections: string[];
  setSections: (sections: string[]) => void;
}

export const ImageFormFields: React.FC<ImageFormFieldsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  photographersNote,
  setPhotographersNote,
  location,
  setLocation,
  date,
  setDate,
  categories,
  setCategories,
  tags,
  setTags,
  sections,
  setSections,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="photographersNote" className="block text-sm font-medium text-gray-700">
          Photographer's Note
        </label>
        <Textarea
          id="photographersNote"
          value={photographersNote}
          onChange={(e) => setPhotographersNote(e.target.value)}
          placeholder="Enter photographer's note"
          rows={2}
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
          Tags
        </label>
        <TagInput
          tags={tags} 
          onChange={setTags}
          placeholder="Enter tags (press Enter or use comma to add)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Categories</label>
        <SectionCategorySelector
          selectedItems={categories}
          setSelectedItems={setCategories}
          type="categories"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sections</label>
        <SectionCategorySelector
          selectedItems={sections}
          setSelectedItems={setSections}
          type="sections"
        />
      </div>
    </div>
  );
};
