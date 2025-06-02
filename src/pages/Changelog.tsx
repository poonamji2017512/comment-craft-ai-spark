
import React from "react";
import { ArrowLeft, Calendar, Plus, Zap, Bug, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const Changelog = () => {
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

  const changelogEntries = [
    {
      version: "2.3.0",
      date: "December 2, 2024",
      title: "Enhanced Settings & UI Improvements",
      changes: [
        {
          type: "feature",
          title: "Footer Navigation Bar",
          description: "Added persistent footer navigation with quick access to Pro, Ultra, Enterprise, Store, and Careers pages"
        },
        {
          type: "improvement", 
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
      ]
    },
    {
      version: "2.2.0",
      date: "November 28, 2024", 
      title: "Pricing Plan Updates & Notifications",
      changes: [
        {
          type: "feature",
          title: "New Pricing Plans",
          description: "Updated pricing modal with new PRO ($20/month) and ULTRA ($40/month) plans"
        },
        {
          type: "feature",
          title: "Changelog Notifications",
          description: "Added popup notifications for signed-in users when new updates are available"
        },
        {
          type: "improvement",
          title: "Plan Feature Clarity",
          description: "Enhanced plan descriptions with detailed feature breakdowns and icons"
        }
      ]
    },
    {
      version: "2.1.0",
      date: "November 20, 2024",
      title: "Authentication & Security Enhancements",
      changes: [
        {
          type: "feature",
          title: "Auto-Authentication Modal",
          description: "Added automatic authentication prompts for better user onboarding"
        },
        {
          type: "improvement",
          title: "Security Improvements",
          description: "Enhanced input validation and sanitization across all forms"
        },
        {
          type: "bugfix",
          title: "Theme Persistence",
          description: "Fixed theme settings not persisting across browser sessions"
        }
      ]
    },
    {
      version: "2.0.0",
      date: "November 15, 2024",
      title: "Major UI Overhaul",
      changes: [
        {
          type: "major",
          title: "Dark Theme Implementation",
          description: "Complete redesign with dark theme matching modern design standards"
        },
        {
          type: "feature",
          title: "Sidebar Navigation",
          description: "Added collapsible sidebar with improved navigation structure"
        },
        {
          type: "feature",
          title: "Comment Generator V2",
          description: "Redesigned comment generation interface with enhanced AI model selection"
        },
        {
          type: "improvement",
          title: "Responsive Design",
          description: "Improved mobile and tablet experience across all pages"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/docs" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Docs
              </Link>
            </Button>
          </div>
        </div>

        <div className="max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Changelog</h1>
            <p className="text-muted-foreground">
              Stay up to date with the latest features, improvements, and bug fixes.
            </p>
          </div>

          {/* Changelog Entries */}
          <div className="space-y-8">
            {changelogEntries.map((entry, index) => (
              <div key={index} className="border border-border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="text-sm">
                    v{entry.version}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                </div>
                
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  {entry.title}
                </h2>

                <div className="space-y-3">
                  {entry.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className="flex items-start gap-3">
                      {getTypeIcon(change.type)}
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground text-sm">
                          {change.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {change.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Changelog;
