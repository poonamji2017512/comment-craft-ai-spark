import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/ui/footer-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Home, User, Briefcase, FileText } from 'lucide-react';
import { sanityClient, queries, urlFor } from '@/lib/sanity';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { Component as EtheralShadow } from '@/components/ui/etheral-shadow';

interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
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
  categories: string[];
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await sanityClient.fetch(queries.allPosts);
        const featured = allPosts.filter((post: BlogPost & { featured: boolean }) => post.featured).slice(0, 2);
        const regular = allPosts.filter((post: BlogPost & { featured: boolean }) => !post.featured);
        setFeaturedPosts(featured);
        setPosts(regular);
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Fallback to mock data for development
        const mockPosts: BlogPost[] = [{
          _id: '1',
          title: 'Character Prefix Conditioning',
          slug: {
            current: 'character-prefix-conditioning'
          },
          excerpt: 'A clever algorithm for more accurate code completion sampling.',
          publishedAt: '2025-01-06',
          author: {
            name: 'Jacob'
          },
          estimatedReadingTime: 2,
          categories: ['AI', 'Algorithm']
        }, {
          _id: '2',
          title: 'Inference Characteristics of Llama',
          slug: {
            current: 'inference-characteristics-llama'
          },
          excerpt: 'A primer on inference math and an examination of the surprising costs of Llama.',
          publishedAt: '2025-01-05',
          author: {
            name: 'Aman'
          },
          estimatedReadingTime: 19,
          categories: ['AI', 'Performance']
        }, {
          _id: '3',
          title: 'Series C and Scale',
          slug: {
            current: 'series-c-scale'
          },
          excerpt: 'We\'ve raised $900m to push the frontier of AI coding research.',
          publishedAt: '2025-01-04',
          author: {
            name: 'Anysphere Team'
          },
          estimatedReadingTime: 1,
          categories: ['Company', 'Funding']
        }, {
          _id: '4',
          title: 'Small Improvements to Pricing',
          slug: {
            current: 'small-improvements-pricing'
          },
          excerpt: 'Two tweaks to improve the simplicity and transparency of our pricing.',
          publishedAt: '2025-01-03',
          author: {
            name: 'Michael'
          },
          estimatedReadingTime: 1,
          categories: ['Product', 'Pricing']
        }, {
          _id: '5',
          title: 'Early Team',
          slug: {
            current: 'early-team'
          },
          excerpt: 'Lots of great people are behind Cursor! Here are some.',
          publishedAt: '2025-01-02',
          author: {
            name: 'Sualeh Asif'
          },
          estimatedReadingTime: 2,
          categories: ['Company', 'Team']
        }, {
          _id: '6',
          title: 'Series B and Automating Code',
          slug: {
            current: 'series-b-automating-code'
          },
          excerpt: 'We\'ve raised $105M to further our mission of automating code.',
          publishedAt: '2025-01-01',
          author: {
            name: 'Anysphere Team'
          },
          estimatedReadingTime: 1,
          categories: ['Company', 'Funding']
        }];
        setFeaturedPosts(mockPosts.slice(0, 2));
        setPosts(mockPosts.slice(2));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const navItems = [
    { name: 'Home', url: '/landing', icon: Home },
    { name: 'Features', url: '#features', icon: Briefcase },
    { name: 'Blog', url: '/blog', icon: FileText },
    { name: 'Pricing', url: '#pricing', icon: User }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar items={navItems} />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
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
        
        <div className="container mx-auto px-4 py-20 max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-left px-[45px]">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Blog
            </h1>
            <p className="text-xl text-muted-foreground">
              Compiled notes from the team
            </p>
          </div>

          {/* Featured Section */}
          {featuredPosts.length > 0 && (
            <div className="mb-20 px-[45px]">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">Featured</h2>
                <p className="text-lg text-muted-foreground">
                  Highlighted articles from our latest research and insights
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Card
                    key={post._id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm border-border h-[450px] flex flex-col"
                    onClick={() => handlePostClick(post.slug.current)}
                  >
                    {post.mainImage && (
                      <div className="w-full h-48 overflow-hidden rounded-t-lg">
                        <img
                          src={urlFor(post.mainImage).width(600).height(300).url()}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-4 flex-shrink-0">
                      <CardTitle className="text-xl font-semibold text-foreground line-clamp-2 mb-3">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground line-clamp-4 text-base leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {getAuthorInitials(post.author.name)}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">By {post.author.name}</span>
                          <span className="text-xs text-muted-foreground">{post.estimatedReadingTime} minutes read</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Posts Section */}
          <div className="px-[45px]">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">All posts</h2>
              <p className="text-lg text-muted-foreground">
                Explore our complete collection of articles and updates
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Card
                  key={post._id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-card/80 backdrop-blur-sm border-border h-[408px] flex flex-col"
                  onClick={() => handlePostClick(post.slug.current)}
                >
                  {post.mainImage && (
                    <div className="w-full h-40 overflow-hidden rounded-t-lg">
                      <img
                        src={urlFor(post.mainImage).width(400).height(200).url()}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-4 flex-shrink-0">
                    <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 mb-3">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-4 leading-relaxed">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary-foreground">
                          {getAuthorInitials(post.author.name)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">By {post.author.name}</span>
                        <span className="text-xs text-muted-foreground">{post.estimatedReadingTime} minutes read</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Blog;
