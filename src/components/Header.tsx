
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, User, Sparkles, Moon, Sun, LogIn, LogOut, History } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { theme, setTheme, isDark } = useTheme();
  const { user, login, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-base">AI Comment Companion</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleHistoryClick}
            className="text-muted-foreground hover:text-foreground h-8 px-3"
          >
            <History className="w-4 h-4 mr-2" />
            History
          </Button>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSettingsClick}
            className="text-muted-foreground hover:text-foreground h-8 px-3"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-muted rounded-full py-1 px-3 h-8">
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
                  ) : (
                    <User className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={login}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
