
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton 
} from "@/components/ui/sidebar";
import { 
  Home, 
  Plus, 
  Search, 
  Globe, 
  User, 
  Download,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PerplexitySidebar = () => {
  const { user } = useAuth();

  return (
    <Sidebar className="border-r-0 bg-[#1a1a1a]" side="left" variant="sidebar">
      <SidebarHeader className="p-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo */}
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          
          {/* New Thread Button */}
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700/50 data-[active=true]:bg-gray-700/50 data-[active=true]:text-blue-400"
              isActive={true}
            >
              <a href="/" className="flex items-center gap-3 p-2">
                <Home className="w-4 h-4" />
                <span className="text-sm">Home</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              <a href="#" className="flex items-center gap-3 p-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Discover</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              <a href="#" className="flex items-center gap-3 p-2">
                <Search className="w-4 h-4" />
                <span className="text-sm">Spaces</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700/50"
              >
                <a href="#" className="flex items-center gap-3 p-2">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="text-sm">Account</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              <a href="#" className="flex items-center gap-3 p-2">
                <div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">↗</span>
                </div>
                <span className="text-sm">Upgrade</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700/50"
            >
              <a href="#" className="flex items-center gap-3 p-2">
                <Download className="w-4 h-4" />
                <span className="text-sm">Install</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default PerplexitySidebar;
