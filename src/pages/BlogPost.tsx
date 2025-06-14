import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, User, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sanityClient, queries, urlFor } from '@/lib/sanity';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { Component as EtheralShadow } from '@/components/ui/etheral-shadow';
import { Footer } from '@/components/ui/footer-section';
import PortableText from '@/components/PortableText';
import BlogTableOfContents from '@/components/BlogTableOfContents';

interface BlogPostData {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  author: {
    name: string;
    image?: string;
  };
  mainImage?: {
    asset: {
      _ref: string;
    };
  };
  estimatedReadingTime: number;
  body: any[];
  categories: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Table of contents data
  const tableOfContents = [
    { id: 'setup', title: 'Setup', level: 1 },
    { id: 'problem', title: 'Problem', level: 1 },
  ];

  const navItems = [
    { name: 'Home', url: '/landing', icon: Home },
    { name: 'Features', url: '#features', icon: Briefcase },
    { name: 'Blog', url: '/blog', icon: FileText },
    { name: 'Pricing', url: '#pricing', icon: User }
  ];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await sanityClient.fetch(queries.postBySlug, { slug });
        setPost(postData);
        
        // Update page title and meta tags if SEO data is available
        if (postData?.seo?.metaTitle) {
          document.title = postData.seo.metaTitle;
        } else if (postData?.title) {
          document.title = postData.title;
        }
        
        if (postData?.seo?.metaDescription) {
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', postData.seo.metaDescription);
          }
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        // Fallback to mock data for development
        const mockPost: BlogPostData = {
          _id: '1',
          title: 'Character Prefix Conditioning',
          slug: { current: 'character-prefix-conditioning' },
          excerpt: 'A clever algorithm for more accurate code completion sampling.',
          publishedAt: '2025-01-06',
          author: { name: 'Jacob' },
          estimatedReadingTime: 2,
          body: [],
          categories: ['Setup', 'Problem']
        };
        setPost(mockPost);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).toUpperCase();
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Background Component */}
        <div className="fixed inset-0 z-0">
          <EtheralShadow
            color="#209aab"
            animation={{ scale: 80, speed: 70 }}
            noise={{ opacity: 0.8, scale: 1.1 }}
            sizing="fill"
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between p-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO THE MAIN BLOG
            </Button>
            <NavBar items={navItems} />
          </div>
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background relative">
        {/* Background Component */}
        <div className="fixed inset-0 z-0">
          <EtheralShadow
            color="#209aab"
            animation={{ scale: 80, speed: 70 }}
            noise={{ opacity: 0.8, scale: 1.1 }}
            sizing="fill"
            className="w-full h-full"
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between p-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO THE MAIN BLOG
            </Button>
            <NavBar items={navItems} />
          </div>
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">Post not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Component */}
      <div className="fixed inset-0 z-0">
        <EtheralShadow
          color="#209aab"
          animation={{ scale: 80, speed: 70 }}
          noise={{ opacity: 0.8, scale: 1.1 }}
          sizing="fill"
          className="w-full h-full"
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO THE MAIN BLOG
          </Button>
          <NavBar items={navItems} />
        </div>
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Article header */}
          <article className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-4">
                {formatDate(post.publishedAt)}
              </p>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>

              {/* Main image */}
              {post.mainImage && (
                <div className="mb-8">
                  <img
                    src={urlFor(post.mainImage).width(1200).height(600).url()}
                    alt={post.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Author info */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">
                    {getAuthorInitials(post.author.name)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Posted By {post.author.name}</span>
                  <span className="text-sm text-muted-foreground">{post.estimatedReadingTime} minutes read</span>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <BlogTableOfContents sections={tableOfContents} />

            {/* Article content */}
            <div className="text-foreground space-y-8">
              {post.body && post.body.length > 0 ? (
                <PortableText value={post.body} />
              ) : (
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Content coming soon...
                </p>
              )}
            </div>
          </article>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default BlogPost;
