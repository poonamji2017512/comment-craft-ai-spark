
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, User, Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">AI Comment Companion</h1>
            <p className="text-xs text-gray-500">Powered by Gemini 2.5 Pro</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          
          <div className="flex items-center gap-2 bg-gray-100 rounded-full py-1 px-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">AI Companion</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
