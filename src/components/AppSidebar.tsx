
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, User, Sparkles, Moon, Sun, LogOut, History, LogIn, Crown, Heart } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { theme, setTheme, isDark } = useTheme();
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  const handleUpgradeClick = () => {
    console.log('Upgrade clicked');
  };

  const navigationItems = [
    {
      title: "Dashboard",
      icon: User,
      onClick: handleDashboardClick,
      show: !!user,
    },
    {
      title: "History",
      icon: History,
      onClick: handleHistoryClick,
      show: !!user,
    },
    {
      title: "Settings",
      icon: Settings,
      onClick: handleSettingsClick,
      show: true,
    },
  ];

  const footerLinks = [
    { title: "Features", href: "#" },
    { title: "Pricing", href: "#" },
    { title: "API", href: "#" },
    { title: "Documentation", href: "#" },
    { title: "Help Center", href: "#" },
    { title: "Contact Us", href: "#" },
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
  ];

  return (
    <>
      <Sidebar collapsible="icon" className="group-data-[state=collapsed]:hover:w-64 transition-all duration-300">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
              <h1 className="font-semibold text-foreground text-base">AI Comment Companion</h1>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.filter(item => item.show).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={item.onClick}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleUpgradeClick} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600">
                    <Crown className="w-4 h-4" />
                    <span>Upgrade</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton onClick={toggleTheme}>
                    {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Links</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {footerLinks.map((link) => (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild>
                      <a href={link.href} className="text-sm">
                        <span>{link.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-muted rounded-full py-2 px-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt={userProfile.full_name || 'User'} className="w-6 h-6 rounded-full" />
                  ) : (
                    <User className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
                  {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">Sign Out</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleSignInClick}
              className="w-full justify-start"
            >
              <LogIn className="w-4 h-4 mr-2" />
              <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">Sign In</span>
            </Button>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 group-data-[collapsible=icon]:group-data-[state=collapsed]:hidden">
            <span>© 2024 Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current" />
          </div>
        </SidebarFooter>
      </Sidebar>

      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
      />
    </>
  );
};

export default AppSidebar;
