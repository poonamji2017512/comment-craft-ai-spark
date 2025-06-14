
import React from 'react';
import { Studio } from 'sanity';
import { schemaTypes } from '@/schemas';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';

const config = {
  name: 'default',
  title: 'Blog CMS',
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
};

const SanityStudio = () => {
  return <Studio config={config} />;
};

export default SanityStudio;
