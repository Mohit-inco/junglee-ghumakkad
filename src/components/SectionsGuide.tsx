
import React from 'react';
import { getAvailableSections } from '@/integrations/supabase/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Info } from 'lucide-react';

const SectionsGuide: React.FC = () => {
  const sections = getAvailableSections();
  
  // Define section descriptions for better clarity
  const sectionDescriptions: Record<string, string> = {
    'featured': 'Featured images appear on the homepage hero section',
    'wildlife': 'Wildlife photography category',
    'landscape': 'Landscape photography category', 
    'astro': 'Astrophotography images',
    'portrait': 'Portrait photography',
    'about': 'Images that appear on the about page',
    'gallery': 'Main gallery page display',
    'street': 'Street photography category'
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="mr-2 h-5 w-5 text-primary" />
          Available Image Sections
        </CardTitle>
        <CardDescription>
          Use these section names when categorizing images to ensure they appear in the correct places on the website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sections.map((section) => (
            <div key={section} className="flex items-center p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 mr-3">
                <Check className="h-4 w-4 text-primary" />
              </span>
              <div>
                <div className="font-mono text-sm font-medium">{section}</div>
                <div className="text-xs text-muted-foreground">
                  {sectionDescriptions[section] || `Used for ${section} section of the site`}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 border rounded-md bg-amber-50 border-amber-200">
          <h3 className="text-sm font-medium text-amber-800">How to use sections</h3>
          <p className="mt-1 text-sm text-amber-700">
            When uploading images in the admin panel, add these section names to display images in specific areas of your website.
            You can assign multiple sections to a single image if you want it to appear in multiple places.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SectionsGuide;
