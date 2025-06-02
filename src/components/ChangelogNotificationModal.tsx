
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
  const [hasSeenLatest, setHasSeenLatest] = useState(false);

  // Latest version info
  const latestVersion = "2.3.0";
  const latestChanges = [
    {
      type: "feature",
      title: "Improved AI Model Selection",
      description: "Reorganized AI models into a 3-column grid layout with clearer categorization"
    },
    {
      type: "bugfix", 
      title: "Settings Save Fix",
      description: "Fixed duplicate key constraint error when saving user settings"
    },
    {
      type: "improvement",
      title: "Enhanced User Experience", 
      description: "Improved settings save error handling with better feedback"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Plus className="w-4 h-4 text-green-600" />;
      case "improvement":
        return <Zap className="w-4 h-4 text-blue-600" />;
      case "bugfix":
        return <Bug className="w-4 h-4 text-red-600" />;
      case "major":
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      default:
        return <Calendar className="w-4 h-4" />;
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <DialogTitle className="text-xl">What's New</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <Badge variant="outline" className="text-sm mb-2">
              v{latestVersion}
            </Badge>
            <h3 className="font-semibold text-lg">Enhanced Settings & UI Improvements</h3>
            <p className="text-sm text-muted-foreground">Check out the latest updates to your AI Comment Companion</p>
          </div>

          <div className="space-y-3">
            {latestChanges.map((change, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                {getTypeIcon(change.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{change.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{change.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link to="/changelog" onClick={handleViewFullChangelog}>
                View Full Changelog
              </Link>
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangelogNotificationModal;
