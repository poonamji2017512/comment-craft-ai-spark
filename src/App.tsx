
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import ChangelogNotificationModal from "@/components/ChangelogNotificationModal";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Docs from "./pages/Docs";
import Changelog from "./pages/Changelog";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout component for pages with sidebar
const SidebarLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
    <ChangelogNotificationModal />
  </SidebarProvider>
);

const App = () => {
  console.log("App component is rendering");
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Pages without sidebar */}
                <Route path="/landing" element={<Landing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/onboarding" element={<Onboarding />} />
                
                {/* Pages with sidebar */}
                <Route path="/" element={<SidebarLayout><Index /></SidebarLayout>} />
                <Route path="/dashboard" element={<SidebarLayout><Dashboard /></SidebarLayout>} />
                <Route path="/history" element={<SidebarLayout><History /></SidebarLayout>} />
                <Route path="/settings" element={<SidebarLayout><Settings /></SidebarLayout>} />
                <Route path="/docs" element={<SidebarLayout><Docs /></SidebarLayout>} />
                <Route path="/changelog" element={<SidebarLayout><Changelog /></SidebarLayout>} />
                <Route path="*" element={<SidebarLayout><NotFound /></SidebarLayout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
