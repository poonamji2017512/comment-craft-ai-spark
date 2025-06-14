
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
  token: import.meta.env.VITE_SANITY_TOKEN, // Optional: only needed for authenticated requests
});

// Helper function to generate image URLs
export const urlFor = (source: any) => {
  // This would typically use @sanity/image-url
  // For now, return a placeholder or handle the image URL generation
  if (!source?.asset?._ref) return null;
  
  const ref = source.asset._ref;
  const projectId = sanityClient.config().projectId;
  const dataset = sanityClient.config().dataset;
  
  // Convert Sanity image reference to URL
  const imageUrl = ref
    .replace('image-', '')
    .replace('-jpg', '.jpg')
    .replace('-png', '.png')
    .replace('-webp', '.webp');
  
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageUrl}`;
};
