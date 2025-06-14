
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
  token: process.env.VITE_SANITY_TOKEN, // Optional: only needed for authenticated requests
});

// Helper function to generate image URLs
export const urlFor = (source: any) => {
  // This would typically use @sanity/image-url
  // For now, return a placeholder or handle the image URL generation
  return source?.asset?._ref ? `https://cdn.sanity.io/images/${sanityClient.config().projectId}/${sanityClient.config().dataset}/${source.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}` : null;
};
