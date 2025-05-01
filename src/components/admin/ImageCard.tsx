
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ImageCardProps {
  imageUrl: string;
  title: string;
  tags?: string[];
  onClick: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ 
  imageUrl, 
  title, 
  tags = [], 
  onClick 
}) => {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]" 
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
