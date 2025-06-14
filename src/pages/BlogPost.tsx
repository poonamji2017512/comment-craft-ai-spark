import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, User, Briefcase, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sanityClient } from '@/lib/sanity';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { Component as EtheralShadow } from '@/components/ui/etheral-shadow';
import BlogTableOfContents from '@/components/BlogTableOfContents';
import Footer from '@/components/Footer';

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
        const query = `*[_type == "post" && slug.current == $slug][0] {
          _id,
          title,
          slug,
          excerpt,
          publishedAt,
          author->{name, image},
          mainImage,
          estimatedReadingTime,
          body,
          categories
        }`;
        
        const postData = await sanityClient.fetch(query, { slug });
        setPost(postData);
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
          <NavBar items={navItems} />
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
          <NavBar items={navItems} />
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
        <NavBar items={navItems} />
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO THE MAIN BLOG
          </Button>

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
              <p className="text-lg leading-relaxed">
                The first in a series of problems that give a glimpse into the work we do at Cursor.
              </p>

              {/* Setup section */}
              <div id="setup">
                <h2 className="text-2xl font-bold text-foreground mb-4">Setup</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    When using a language model for code completion, we typically want the model to produce a completion that 
                    begins with what the user has typed.
                  </p>
                  <p>
                    However, modern language models operate on sequences of tokens, not characters, so naively tokenizing the 
                    user's input and sending it to the model produces wrong results if the user's cursor doesn't happen to lie on a 
                    token boundary.
                  </p>
                  <p>
                    Instead, we need an algorithm that samples a sequence of tokens conditional on a prefix of characters, rather than 
                    the more typical case of sampling conditional on a prefix of tokens.
                  </p>
                  <p>
                    We call this <strong>character prefix conditioning</strong>, an algorithm for sampling a sequence of tokens conditioned on a 
                    character prefix.
                  </p>
                  <p>
                    We want to sample a sequence of tokens s = t₁, t₂, ..., tₙ from a distribution specified by an autoregressive model 
                    p(s) given by
                  </p>
                  <div className="bg-muted p-4 rounded-lg font-mono text-center">
                    p(s) = p(t₁, t₂, ..., tₙ) = ∏ᵢ₌₁ⁿ p(tᵢ|t₁, ..., tᵢ₋₁)
                  </div>
                  <p>
                    subject to the constraint that s starts with a character prefix P, i.e. P is a prefix of repr(s₁) + repr(s₂) + ⋯ + repr(sₙ) 
                    where + means string concatenation and repr maps a token to the character it represents.
                  </p>
                  <p>
                    We define q(s) = p(s | s starts with P). It's sufficient to find a way to sample autoregressively from q(s), that is, to 
                    sample from q(tₖ|t₁, ..., tₖ₋₁) for each k.
                  </p>
                </div>
              </div>

              {/* Problem section */}
              <div id="problem">
                <h2 className="text-2xl font-bold text-foreground mb-4">Problem</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Can you construct an efficient algorithm for sampling from q(tₖ|t₁, ..., tₖ₋₁), that minimizes calls to the original 
                    language model? A description of the algorithm is great. An actual implementation is excellent.
                  </p>
                  <p>
                    Feel free to email me your solutions at <a href="mailto:problems@cursor.com" className="text-primary hover:underline">problems@cursor.com</a>.
                  </p>
                </div>
              </div>
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
