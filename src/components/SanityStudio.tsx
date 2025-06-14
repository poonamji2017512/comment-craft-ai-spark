
import React from 'react';
import { Studio } from 'sanity';
import { schemaTypes } from '@/schemas';
import { visionTool } from '@sanity/vision';
import { structureTool } from 'sanity/structure';

const config = {
  name: 'default',
  title: 'Interact Blog CMS',
  projectId: '0h11imc0',
  dataset: 'production',
  plugins: [
    structureTool(),
    visionTool()
  ],
  schema: {
    types: schemaTypes,
  },
};

const SanityStudio = () => {
  return <Studio config={config} />;
};

export default SanityStudio;
