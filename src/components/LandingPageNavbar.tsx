
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';

const LandingPageNavbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleGoToDashboard = () => {
    navigate('/');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/landing')}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">▲</span>
                </div>
                <span className="text-xl font-bold text-foreground">Interact</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('features')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('why-choose-interact')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Why choose Interact
              </button>
              <button
                onClick={() => navigate('/blog')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </button>
            </div>

            {/* Desktop Auth Button */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button onClick={handleGoToDashboard} variant="ghost">
                    Dashboard
                  </Button>
                  <Button onClick={handleAuthAction} variant="outline">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={handleAuthAction} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                  Get Started
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
                <button
                  onClick={() => {
                    scrollToSection('features');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    scrollToSection('testimonials');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  Testimonials
                </button>
                <button
                  onClick={() => {
                    scrollToSection('pricing');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  Pricing
                </button>
                <button
                  onClick={() => {
                    scrollToSection('why-choose-interact');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  Why choose Interact
                </button>
                <button
                  onClick={() => {
                    navigate('/blog');
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                >
                  Blog
                </button>
                <div className="pt-2">
                  {user ? (
                    <div className="space-y-2">
                      <Button onClick={handleGoToDashboard} variant="ghost" className="w-full">
                        Dashboard
                      </Button>
                      <Button onClick={handleAuthAction} variant="outline" className="w-full">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={handleAuthAction} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                      Get Started
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default LandingPageNavbar;
