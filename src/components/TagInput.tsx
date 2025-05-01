
import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  onChange, 
  placeholder = "Add tags..." 
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow for comma or Enter to add a tag
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault();
      
      // Remove any trailing comma and trim whitespace
      const tagValue = inputValue.replace(/,+$/, '').trim();
      
      if (tagValue && !tags.includes(tagValue)) {
        onChange([...tags, tagValue]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <Badge key={index} className="px-2 py-1 flex items-center gap-1 bg-slate-200 text-slate-800 hover:bg-slate-300">
            {tag}
            <X 
              size={14} 
              className="cursor-pointer" 
              onClick={() => removeTag(tag)}
            />
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">Press Enter or use comma to add tags</p>
    </div>
  );
};
