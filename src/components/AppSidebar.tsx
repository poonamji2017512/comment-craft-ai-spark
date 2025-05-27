
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
      className="group/sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out data-[state=collapsed]:hover:w-64"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto' : 'opacity-100'}`}>
            <h1 className="font-semibold text-sidebar-foreground whitespace-nowrap">AI Comment</h1>
            <p className="text-xs text-sidebar-foreground/60 whitespace-nowrap">Generate & Engage</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton 
                asChild 
                isActive={item.isActive}
                className="group/button relative"
              >
                <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto group-hover/sidebar:ml-0' : 'opacity-100'}`}>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        {/* Theme Toggle */}
        <div className="mt-6 px-3">
          <div className="flex items-center gap-3 py-2">
            <div className="h-4 w-4 shrink-0 rounded-sm bg-gradient-to-br from-yellow-400 to-orange-500" />
            <div className={`flex items-center justify-between flex-1 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto' : 'opacity-100'}`}>
              <span className="text-sm font-medium text-sidebar-foreground whitespace-nowrap">Dark Mode</span>
              <Switch
                checked={isDark}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </div>
        </div>

        {/* Upgrade Button */}
        <div className="mt-4 px-3">
          <Button 
            className={`w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-0 ${isCollapsed ? 'px-0 group-hover/sidebar:px-3' : 'px-3'}`}
            size={isCollapsed ? "icon" : "sm"}
          >
            <Crown className="h-4 w-4 shrink-0" />
            <span className={`ml-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto' : 'opacity-100'}`}>
              Upgrade to Pro
            </span>
          </Button>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        {/* User Profile */}
        {user && (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className={`flex-1 min-w-0 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto' : 'opacity-100'}`}>
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.user_metadata?.full_name || user.email}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className={`grid transition-all duration-300 ${isCollapsed ? 'grid-cols-2 gap-1 group-hover/sidebar:grid-cols-3' : 'grid-cols-3 gap-2'}`}>
          {footerLinks.map((link) => (
            <Button
              key={link.title}
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                title={link.title}
              >
                <link.icon className="h-4 w-4" />
              </a>
            </Button>
          ))}
        </div>

        {/* Sign Out */}
        {user && (
          <Button
            variant="ghost"
            onClick={logout}
            className={`w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent ${isCollapsed ? 'px-0 group-hover/sidebar:px-3' : 'px-3'}`}
            size={isCollapsed ? "icon" : "sm"}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className={`ml-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto' : 'opacity-100'}`}>
              Sign Out
            </span>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
