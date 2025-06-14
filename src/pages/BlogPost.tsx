
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, User, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { sanityClient, urlFor } from '@/lib/sanity';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { Component as EtheralShadow } from '@/components/ui/etheral-shadow';
import { Footer } from '@/components/ui/footer-section';
import BlogTableOfContents from '@/components/BlogTableOfContents';
import PortableText from '@/components/PortableText';

interface BlogPostData {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  author: {
    name: string;
    image?: {
      asset: {
        _ref: string;
      };
    };
  };
  mainImage?: {
    asset: {
      _ref: string;
    };
    alt?: string;
  };
  estimatedReadingTime: number;
  body: any[];
  categories?: {
    title: string;
    slug: { current: string };
  }[];
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableOfContents, setTableOfContents] = useState<{ id: string; title: string; level: number }[]>([]);

  const navItems = [
    { name: 'Home', url: '/landing', icon: Home },
    { name: 'Features', url: '#features', icon: Briefcase },
    { name: 'Blog', url: '/blog', icon: FileText },
    { name: 'Pricing', url: '#pricing', icon: User }
  ];

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const query = `*[_type == "post" && slug.current == $slug][0] {
          _id,
          title,
          slug,
          excerpt,
          publishedAt,
          author->{
            name, 
            image
          },
          mainImage,
          estimatedReadingTime,
          body,
          categories[]->{
            title,
            slug
          }
        }`;
        
        const postData = await sanityClient.fetch(query, { slug });
        
        if (postData) {
          setPost(postData);
          
          // Generate table of contents from body content
          const toc = postData.body
            ?.filter((block: any) => block.style && ['h1', 'h2', 'h3', 'h4'].includes(block.style))
            .map((block: any) => ({
              id: block.children[0]?.text?.toLowerCase().replace(/\s+/g, '-') || '',
              title: block.children[0]?.text || '',
              level: parseInt(block.style.replace('h', '')) || 1,
            })) || [];
          
          setTableOfContents(toc);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
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

              {/* Categories */}
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.categories.map((category) => (
                    <Badge key={category.slug.current} variant="secondary">
                      {category.title}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Main Image */}
              {post.mainImage && (
                <div className="mb-8">
                  <img
                    src={urlFor(post.mainImage).width(1200).url()}
                    alt={post.mainImage.alt || post.title}
                    className="w-full rounded-lg"
                  />
                </div>
              )}

              {/* Author info */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden">
                  {post.author.image ? (
                    <img
                      src={urlFor(post.author.image).width(40).height(40).url()}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium text-primary-foreground">
                      {getAuthorInitials(post.author.name)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">Posted By {post.author.name}</span>
                  <span className="text-sm text-muted-foreground">{post.estimatedReadingTime} minutes read</span>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            {tableOfContents.length > 0 && (
              <BlogTableOfContents sections={tableOfContents} />
            )}

            {/* Article content */}
            <div className="text-foreground space-y-8">
              {post.body && post.body.length > 0 ? (
                <PortableText value={post.body} />
              ) : (
                <p className="text-lg leading-relaxed text-muted-foreground">
                  No content available for this post.
                </p>
              )}
            </div>
          </article>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default BlogPost;
