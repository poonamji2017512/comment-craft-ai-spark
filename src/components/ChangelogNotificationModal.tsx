
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Zap, Bug, Sparkles, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const ChangelogNotificationModal = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Latest version info
  const latestVersion = "2.4.0";
  const latestChanges = [
    {
      type: "feature",
      title: "Footer Navigation",
      description: "Added persistent footer with Pro, Ultra, Enterprise, Store, and Careers links"
    },
    {
      type: "improvement", 
      title: "Pricing Plans Update",
      description: "Updated to new PRO ($20/month) and ULTRA ($40/month) plans with enhanced features"
    },
    {
      type: "improvement",
      title: "Enhanced Tone Settings", 
      description: "Reorganized tone selection into categorized 3-column grid layout"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Plus className="w-3 h-3 text-green-600" />;
      case "improvement":
        return <Zap className="w-3 h-3 text-blue-600" />;
      case "bugfix":
        return <Bug className="w-3 h-3 text-red-600" />;
      case "major":
        return <Sparkles className="w-3 h-3 text-purple-600" />;
      default:
        return <Calendar className="w-3 h-3" />;
    }
  };

  useEffect(() => {
    // Only show modal for signed-in users
    if (!user) return;

    // Check if user has seen the latest version
    const seenVersion = localStorage.getItem('changelog_seen_version');
    if (seenVersion !== latestVersion) {
      // Show modal after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, latestVersion]);

  const handleClose = () => {
    setIsOpen(false);
    // Mark this version as seen
    localStorage.setItem('changelog_seen_version', latestVersion);
  };

  const handleViewFullChangelog = () => {
    handleClose();
  };

  // Don't render anything if user is not signed in
  if (!user) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-4 left-4 z-50 w-80 bg-card border border-border rounded-lg shadow-lg animate-slide-in-left">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">What's New</h3>
                <Badge variant="outline" className="text-xs">
                  v{latestVersion}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
                <X className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-2 mb-4">
              {latestChanges.slice(0, 2).map((change, index) => (
                <div key={index} className="flex items-start gap-2">
                  {getTypeIcon(change.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-xs">{change.title}</h4>
                    <p className="text-xs text-muted-foreground">{change.description}</p>
                  </div>
                </div>
              ))}
              {latestChanges.length > 2 && (
                <p className="text-xs text-muted-foreground">+{latestChanges.length - 2} more updates</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1 text-xs">
                <Link to="/changelog" onClick={handleViewFullChangelog}>
                  View All
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleClose} className="text-xs">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangelogNotificationModal;
