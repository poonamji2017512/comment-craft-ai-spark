
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

const AutoAuthModal = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Only show modal if user is not authenticated
    if (!user) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Don't show modal if user is already authenticated
  if (user) {
    return null;
  }

  return (
    <AuthModal 
      open={showModal} 
      onOpenChange={setShowModal}
    />
  );
};

export default AutoAuthModal;
