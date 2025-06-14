
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import AuthModal from '@/components/AuthModal';

const BlogNavbar = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const scrollToSection = (sectionId: string) => {
    // If we're not on the landing page, navigate there first
    if (window.location.pathname !== '/landing') {
      navigate(`/landing#${sectionId}`);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return <>
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold text-foreground cursor-pointer hover:text-primary transition-colors" onClick={() => navigate('/landing')}>
                Interact
              </h1>
              <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Testimonials
                </button>
                <button 
                  onClick={() => navigate('/blog')}
                  className="text-sm text-foreground font-medium"
                >
                  Blog
                </button>
                <button 
                  onClick={() => scrollToSection('why-choose-interact')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Why Choose Interact
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => setShowAuthModal(true)} className="text-sm">
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>;
};

export default BlogNavbar;
