import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '@/components/AuthModal';
const LandingPageNavbar = () => {
  const {
    user,
    logout
  } = useAuth();
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
  return <>
      

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>;
};
export default LandingPageNavbar;