
import React from 'react';
import { Session } from '@supabase/supabase-js';

interface Props {
  session: Session | null;
}

const BlogManagementPanel: React.FC<Props> = ({ session }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Blog Management</h2>
      <p>This feature is coming soon.</p>
    </div>
  );
};

export default BlogManagementPanel;
