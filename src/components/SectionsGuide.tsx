
import React from 'react';
import { getAvailableSections } from '@/integrations/supabase/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SectionsGuide: React.FC = () => {
  const sections = getAvailableSections();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Image Sections</CardTitle>
        <CardDescription>
          Use these section names when categorizing images to ensure they appear in the correct places on the website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section} className="flex items-center">
              <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
              <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{section}</span>
              {section === 'featured' && (
                <span className="ml-2 text-xs text-muted-foreground">(For homepage hero)</span>
              )}
              {section === 'about' && (
                <span className="ml-2 text-xs text-muted-foreground">(For about page)</span>
              )}
              {section === 'gallery' && (
                <span className="ml-2 text-xs text-muted-foreground">(For main gallery page)</span>
              )}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          When uploading images, add these section names to the 'sections' field as an array.
          For example: ["wildlife", "gallery"] to make an image appear in both wildlife and gallery sections.
        </p>
      </CardContent>
    </Card>
  );
};

export default SectionsGuide;
