
import React from 'react';
import { Link } from 'react-router-dom';

const FooterNavigation = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
      <div className="flex items-center justify-center py-3 px-6">
        <nav className="flex items-center gap-8">
          <Link 
            to="#" 
            className="bg-yellow-500 text-gray-900 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-400 transition-colors"
          >
            Pro
          </Link>
          <Link 
            to="#" 
            className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Ultra
          </Link>
          <Link 
            to="#" 
            className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Enterprise
          </Link>
          <Link 
            to="#" 
            className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Store
          </Link>
          <Link 
            to="#" 
            className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Careers
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default FooterNavigation;
