
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

  const handleBlogClick = () => {
    navigate('/blog');
  };

  return (
    <>
      <nav className="bg-black text-white py-4 px-6 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-semibold">Interact</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('why-choose-interact')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Why choose Interact
            </button>
            <button 
              onClick={handleBlogClick}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Blog
            </button>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={handleGoToDashboard}
                  className="text-white hover:bg-gray-800"
                >
                  Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleAuthAction}
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleAuthAction}
                className="bg-white text-black hover:bg-gray-200"
              >
                Get Started
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4 pt-4">
              <button 
                onClick={() => {
                  scrollToSection('features');
                  setIsMenuOpen(false);
                }}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Features
              </button>
              <button 
                onClick={() => {
                  scrollToSection('testimonials');
                  setIsMenuOpen(false);
                }}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Testimonials
              </button>
              <button 
                onClick={() => {
                  scrollToSection('pricing');
                  setIsMenuOpen(false);
                }}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Pricing
              </button>
              <button 
                onClick={() => {
                  scrollToSection('why-choose-interact');
                  setIsMenuOpen(false);
                }}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Why choose Interact
              </button>
              <button 
                onClick={() => {
                  handleBlogClick();
                  setIsMenuOpen(false);
                }}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Blog
              </button>
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      handleGoToDashboard();
                      setIsMenuOpen(false);
                    }}
                    className="text-white hover:bg-gray-800 justify-start"
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleAuthAction();
                      setIsMenuOpen(false);
                    }}
                    className="border-white text-white hover:bg-white hover:text-black justify-start"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => {
                    handleAuthAction();
                    setIsMenuOpen(false);
                  }}
                  className="bg-white text-black hover:bg-gray-200 justify-start"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default LandingPageNavbar;
