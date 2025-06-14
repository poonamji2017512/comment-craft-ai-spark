import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/ui/footer-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { sanityClient } from '@/lib/sanity';
import BlogNavbar from '@/components/BlogNavbar';
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
        const query = `*[_type == "post"] | order(publishedAt desc) {
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
        }`;
        const allPosts = await sanityClient.fetch(query);
        const featured = allPosts.filter((post: BlogPost & {
          featured: boolean;
        }) => post.featured).slice(0, 2);
        const regular = allPosts.filter((post: BlogPost & {
          featured: boolean;
        }) => !post.featured);
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
  if (isLoading) {
    return <div className="min-h-screen bg-background">
        <BlogNavbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">Loading...</div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <BlogNavbar />
      
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
        {featuredPosts.length > 0 && <div className="mb-20">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Featured</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {featuredPosts.map(post => <Card key={post._id} className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-card border-border h-80 flex flex-col" onClick={() => handlePostClick(post.slug.current)}>
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
                </Card>)}
            </div>
          </div>}

        {/* All Posts Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">All posts</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map(post => <Card key={post._id} className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-card border-border h-72 flex flex-col" onClick={() => handlePostClick(post.slug.current)}>
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
              </Card>)}
          </div>
        </div>
      </div>

      <Footer />
    </div>;
};
export default Blog;