
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Sparkles, 
  BarChart3, 
  History, 
  Settings, 
  LogOut, 
  Crown,
  Home,
  Github,
  Twitter,
  Mail,
  MessageCircle,
  HelpCircle,
  FileText
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const AppSidebar = () => {
  const location = useLocation();
  const { isDark, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { state } = useSidebar();

  const navigationItems = [
    { 
      title: "Home", 
      url: "/", 
      icon: Home,
      isActive: location.pathname === "/"
    },
    { 
      title: "Dashboard", 
      url: "/dashboard", 
      icon: BarChart3,
      isActive: location.pathname === "/dashboard"
    },
    { 
      title: "History", 
      url: "/history", 
      icon: History,
      isActive: location.pathname === "/history"
    },
    { 
      title: "Settings", 
      url: "/settings", 
      icon: Settings,
      isActive: location.pathname === "/settings"
    },
  ];

  const footerLinks = [
    { title: "GitHub", url: "https://github.com", icon: Github },
    { title: "Twitter", url: "https://twitter.com", icon: Twitter },
    { title: "Discord", url: "https://discord.com", icon: MessageCircle },
    { title: "Help", url: "https://help.example.com", icon: HelpCircle },
    { title: "Docs", url: "https://docs.example.com", icon: FileText },
    { title: "Contact", url: "mailto:contact@example.com", icon: Mail },
  ];

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      collapsible="icon" 
      className="group/sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out"
      style={{
        '--sidebar-width-icon': isCollapsed ? '92px' : '3rem'
      } as React.CSSProperties}
    >
      <SidebarHeader className={`transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-4'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className={`flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 ${isCollapsed ? 'h-10 w-10' : 'h-8 w-8'}`}>
            <Sparkles className={`text-white ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
          </div>
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto' : 'opacity-100'}`}>
            <h1 className="font-semibold text-sidebar-foreground whitespace-nowrap">AI Comment</h1>
            <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">Generate & Engage</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className={`transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-2'}`}>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton 
                asChild 
                isActive={item.isActive}
                className="group/button relative"
                tooltip={isCollapsed ? item.title : undefined}
              >
                <Link to={item.url} className={`flex items-center transition-all duration-300 ${isCollapsed ? 'px-3 py-4 justify-center' : 'px-3 py-2 gap-3'}`}>
                  <item.icon className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
                  <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto group-hover/sidebar:ml-0' : 'opacity-100'}`}>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Theme Toggle */}
        <div className={`mt-6 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          <div className={`flex items-center py-3 transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className={`shrink-0 rounded-sm bg-gradient-to-br from-yellow-400 to-orange-500 ${isCollapsed ? 'h-6 w-6' : 'h-4 w-4'}`} />
            {!isCollapsed && (
              <div className="flex items-center justify-between flex-1">
                <span className="text-sm font-medium text-sidebar-foreground whitespace-nowrap">Dark Mode</span>
                <Switch
                  checked={isDark}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Button */}
        <div className={`mt-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-3'}`}>
          <Button 
            className={`w-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${
              isCollapsed ? 'p-3 aspect-square h-12 w-12' : 'px-4 py-3 h-12'
            } ${
              isDark 
                ? 'bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-600 hover:via-gray-700 hover:to-gray-800 text-white border border-gray-600'
                : 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:from-gray-200 hover:via-gray-300 hover:to-gray-400 text-gray-800 border border-gray-300'
            }`}
            size={isCollapsed ? "icon" : "default"}
            title={isCollapsed ? "Upgrade" : undefined}
          >
            <Crown className={`shrink-0 ${isCollapsed ? 'h-6 w-6' : 'h-5 w-5'}`} />
            {!isCollapsed && (
              <span className="ml-2 font-semibold">Upgrade</span>
            )}
          </Button>
        </div>
      </SidebarContent>

      <SidebarFooter className={`space-y-4 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-4'}`}>
        {/* User Profile */}
        {user && (
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <Avatar className={`shrink-0 ${isCollapsed ? 'h-10 w-10' : 'h-8 w-8'}`}>
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer Links */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'flex flex-col gap-3' : 'grid grid-cols-3 gap-2'}`}>
          {footerLinks.map((link) => (
            <Button
              key={link.title}
              variant="ghost"
              size="icon"
              asChild
              className={`text-sidebar-foreground/60 hover:text-sidebar-foreground ${isCollapsed ? 'h-10 w-10' : 'h-8 w-8'}`}
              title={link.title}
            >
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <link.icon className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`} />
              </a>
            </Button>
          ))}
        </div>

        {/* Sign Out */}
        {user && (
          <Button
            variant="ghost"
            onClick={logout}
            className={`w-full text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-300 ${
              isCollapsed ? 'px-3 justify-center h-10' : 'justify-start px-3 h-8'
            }`}
            size={isCollapsed ? "default" : "sm"}
            title={isCollapsed ? "Sign Out" : undefined}
          >
            <LogOut className={`shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`} />
            {!isCollapsed && (
              <span className="ml-2">Sign Out</span>
            )}
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
