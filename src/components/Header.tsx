
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, User, LogIn, LogOut, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, login, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <header className="border-b border-gray-700 bg-[#1a1a1a] sticky top-0 z-50">
      <div className="container mx-auto px-4 h-12 flex items-center justify-end">
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSettingsClick}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 px-2"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-2 bg-gray-800/50 rounded-full py-1 px-2">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
                  ) : (
                    <User className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-xs font-medium text-white">{user.name}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 px-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={login}
              disabled={isLoading}
              className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 px-3 text-xs"
            >
              <LogIn className="w-4 h-4 mr-1" />
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-700/50 h-8 px-2"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
