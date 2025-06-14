
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

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-foreground">
                Interact
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Pricing
                </a>
                <a href="#why-choose-interact" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Why choose Interact
                </a>
                <a href="#contact" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Contact
                </a>
              </div>
            </div>

            {/* Desktop Auth Button */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" onClick={handleGoToDashboard}>
                      Go to App
                    </Button>
                    <Button variant="outline" onClick={handleAuthAction}>
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" onClick={handleAuthAction}>
                      Sign In
                    </Button>
                    <Button onClick={handleAuthAction}>
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
                <a href="#features" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Pricing
                </a>
                <a href="#why-choose-interact" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Why choose Interact
                </a>
                <a href="#contact" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Contact
                </a>
                {user ? (
                  <div className="border-t border-border pt-4">
                    <Button variant="ghost" onClick={handleGoToDashboard} className="w-full mb-2">
                      Go to App
                    </Button>
                    <Button variant="outline" onClick={handleAuthAction} className="w-full">
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="border-t border-border pt-4 space-y-2">
                    <Button variant="ghost" onClick={handleAuthAction} className="w-full">
                      Sign In
                    </Button>
                    <Button onClick={handleAuthAction} className="w-full">
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </>
  );
};

export default LandingPageNavbar;
