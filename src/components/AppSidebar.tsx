
import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, User, Sparkles, Moon, Sun, LogOut, History, LogIn, Crown, Heart, Star, HelpCircle, FileText, Shield, Cookie, Globe, Twitter, Linkedin, Github, MessageCircle, Phone, BookOpen, Code } from "lucide-react";
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

  const productLinks = [
    { title: "Features", href: "#", icon: Star },
    { title: "Pricing", href: "#", icon: Crown },
    { title: "API", href: "#", icon: Code },
    { title: "Documentation", href: "#", icon: BookOpen },
  ];

  const supportLinks = [
    { title: "Help Center", href: "#", icon: HelpCircle },
    { title: "Contact Us", href: "#", icon: Phone },
  ];

  const legalLinks = [
    { title: "Privacy Policy", href: "#", icon: Shield },
    { title: "Terms of Service", href: "#", icon: FileText },
  ];

  const socialLinks = [
    { title: "Twitter", href: "#", icon: Twitter },
    { title: "LinkedIn", href: "#", icon: Linkedin },
    { title: "GitHub", href: "#", icon: Github },
    { title: "Discord", href: "#", icon: MessageCircle },
  ];

  return (
    <>
      <Sidebar collapsible="icon" className="group-data-[state=collapsed]:hover:w-64 transition-all duration-300 ease-in-out border-r">
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300">
              <h1 className="font-bold text-foreground text-base truncate">AI Comment Companion</h1>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.filter(item => item.show).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={item.onClick} className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleUpgradeClick} className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-md transition-all duration-200 hover:shadow-lg">
                    <Crown className="w-4 h-4 flex-shrink-0" />
                    <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate font-medium">
                      Upgrade
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton onClick={toggleTheme} className="hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                    {isDark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
                    <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate">
                      {isDark ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300">
              Product
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {productLinks.map((link) => (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild>
                      <a href={link.href} className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                        <link.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate">
                          {link.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300">
              Support
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {supportLinks.map((link) => (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild>
                      <a href={link.href} className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                        <link.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate">
                          {link.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300">
              Legal
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {legalLinks.map((link) => (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild>
                      <a href={link.href} className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                        <link.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate">
                          {link.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300">
              Social
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {socialLinks.map((link) => (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild>
                      <a href={link.href} className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                        <link.icon className="w-4 h-4 flex-shrink-0" />
                        <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate">
                          {link.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg py-2 px-3 transition-colors duration-200">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  {userProfile?.avatar_url ? (
                    <img src={userProfile.avatar_url} alt={userProfile.full_name || 'User'} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm font-medium text-foreground group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate">
                  {userProfile?.full_name || user.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate">
                  Sign Out
                </span>
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={handleSignInClick}
              className="w-full justify-start"
            >
              <LogIn className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300 truncate">
                Sign In
              </span>
            </Button>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4 group-data-[collapsible=icon]:group-data-[state=collapsed]:opacity-0 group-data-[collapsible=icon]:group-data-[state=collapsed]:hover:opacity-100 transition-opacity duration-300">
            <span>© 2024 Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-current flex-shrink-0" />
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
