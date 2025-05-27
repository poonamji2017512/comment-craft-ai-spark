
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, X } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

const FloatingAuthModal = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  // Don't show if user is authenticated or if dismissed
  if (user || !isVisible) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in-0 duration-500">
        <Card className="w-80 shadow-2xl border-2 border-primary/20 bg-gradient-to-br from-background to-muted/50 backdrop-blur-sm">
          <CardHeader className="pb-3 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Welcome to AI Comment!</CardTitle>
                <CardDescription className="text-sm">
                  Sign in to generate unlimited AI comments
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              ✨ Generate smart comments for any platform<br/>
              📊 Track your comment history<br/>
              🎯 Multiple tone options available
            </div>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started - It's Free!
            </Button>
          </CardContent>
        </Card>
      </div>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </>
  );
};

export default FloatingAuthModal;
