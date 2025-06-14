
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BlogNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 
              className="text-xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => navigate('/blog')}
            >
              Blog
            </h1>
            <div className="hidden md:flex items-center space-x-6">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/blog')}
                className="text-muted-foreground hover:text-foreground"
              >
                All Posts
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="text-sm"
            >
              Back to App
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BlogNavbar;
