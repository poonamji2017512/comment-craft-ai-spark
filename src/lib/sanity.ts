
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || 'your-project-id',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
  token: import.meta.env.VITE_SANITY_TOKEN, // Optional: only needed for authenticated requests
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: any) => {
  return builder.image(source);
};

// Common queries
export const queries = {
  allPosts: `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author->{name, image},
    mainImage,
    estimatedReadingTime,
    categories,
    featured
  }`,
  
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author->{name, image},
    mainImage,
    estimatedReadingTime,
    body,
    categories,
    seo
  }`,
  
  featuredPosts: `*[_type == "post" && featured == true] | order(publishedAt desc) [0...2] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author->{name, image},
    mainImage,
    estimatedReadingTime,
    categories
  }`
};
