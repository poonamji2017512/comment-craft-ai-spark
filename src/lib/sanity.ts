
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: '0h11imc0',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
  token: import.meta.env.VITE_SANITY_TOKEN, // Optional: only needed for authenticated requests
});

// Set up the image URL builder
const builder = imageUrlBuilder(sanityClient);

// Helper function to generate image URLs
export const urlFor = (source: any) => {
  return builder.image(source);
};
