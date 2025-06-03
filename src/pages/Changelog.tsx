import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  GitCommit, 
  Plus, 
  Settings, 
  Zap, 
  Bug,
  Sparkles,
  ArrowLeft,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Changelog = () => {
  const releases = [
    {
      version: "2.4.0",
      date: "2024-12-18",
      type: "feature",
      title: "Footer Navigation & Enhanced UI",
      changes: [
        {
          type: "feature",
          title: "Footer Navigation Bar",
          description: "Added persistent footer navigation with Pro, Ultra, Enterprise, Store, and Careers links at the bottom of the main content area"
        },
        {
          type: "improvement",
          title: "Pricing Plans Update",
          description: "Updated pricing modal with new PRO ($20/month) and ULTRA ($40/month) plans, replacing the old Free/Pro structure"
        },
        {
          type: "improvement",
          title: "Enhanced Tone & Style Settings",
          description: "Reorganized tone selection into categorized 3-column grid layout with Short, Medium, and Long form categories"
        },
        {
          type: "improvement",
          title: "Changelog Notification Redesign",
          description: "Redesigned changelog notification modal to be smaller, positioned in bottom-left corner, and appear only once per update"
        }
      ]
    },
    {
      version: "2.3.0",
      date: "2024-12-17",
      type: "feature",
      title: "Enhanced Settings & UI Improvements",
      changes: [
        {
          type: "feature",
          title: "Improved AI Model Selection",
          description: "Reorganized AI models into a 3-column grid layout with clearer categorization by provider (Google Gemini, OpenAI, Anthropic Claude)"
        },
        {
          type: "bugfix",
          title: "Settings Save Fix",
          description: "Fixed duplicate key constraint error when saving user settings by properly handling insert vs update operations"
        },
        {
          type: "improvement",
          title: "Enhanced User Experience",
          description: "Improved settings save error handling with better feedback and validation for timezone settings"
        },
        {
          type: "improvement",
          title: "Changelog UI Updates",
          description: "Moved 'Back to Docs' button to the right side and updated layout for better navigation"
        },
        {
          type: "feature",
          title: "Timezone Database Support",
          description: "Added timezone column to user_settings table with proper default values and validation"
        }
      ]
    },
    {
      version: "2.2.0",
      date: "2024-12-16",
      type: "feature",
      title: "Settings Improvements & Timezone Support",
      changes: [
        {
          type: "feature",
          title: "Timezone Configuration",
          description: "Added user timezone settings for accurate 24-Hour Activity Timeline display based on user's local time"
        },
        {
          type: "improvement",
          title: "Enhanced AI Model Selection",
          description: "Reorganized AI models into clear categories (Google Gemini, OpenAI, Anthropic Claude) with improved descriptions and selection UI"
        },
        {
          type: "bugfix",
          title: "Settings Save Fix",
          description: "Resolved issues with settings not saving properly and improved error handling with detailed feedback"
        },
        {
          type: "improvement",
          title: "Better User Experience",
          description: "Enhanced loading states, error messages, and validation feedback throughout the settings interface"
        }
      ]
    },
    {
      version: "2.1.0",
      date: "2024-12-15",
      type: "feature",
      title: "Enhanced AI Models & Settings",
      changes: [
        {
          type: "feature",
          title: "New AI Models Added",
          description: "Added support for Google Gemini 2.0 Flash, 2.5 Flash, OpenAI GPT-4.1, GPT-4o, o3-mini, and Claude 4 Sonnet models"
        },
        {
          type: "feature", 
          title: "Advanced Settings Panel",
          description: "Complete settings overhaul with AI model selection, custom API keys, and personalization options"
        },
        {
          type: "improvement",
          title: "Default Model Update",
          description: "Set Google Gemini 2.5 Pro as the default AI model for optimal performance"
        }
      ]
    },
    {
      version: "2.0.5",
      date: "2024-12-10", 
      type: "improvement",
      title: "Dashboard Analytics Enhancement",
      changes: [
        {
          type: "feature",
          title: "Unique Comments Tracking",
          description: "Replaced active users metric with unique comments for better A/B testing insights"
        },
        {
          type: "improvement",
          title: "Real-time Statistics", 
          description: "Improved dashboard data fetching with live updates from Supabase"
        }
      ]
    },
    {
      version: "2.0.0",
      date: "2024-12-01",
      type: "major",
      title: "Complete Platform Redesign",
      changes: [
        {
          type: "feature",
          title: "New Sidebar Navigation",
          description: "Implemented collapsible sidebar with improved navigation and user experience"
        },
        {
          type: "feature",
          title: "Documentation Portal",
          description: "Added comprehensive documentation with guides, API references, and tutorials"
        },
        {
          type: "feature",
          title: "User Authentication",
          description: "Integrated Supabase authentication with user profiles and settings"
        },
        {
          type: "improvement",
          title: "UI/UX Overhaul",
          description: "Complete redesign using Shadcn UI components with dark/light theme support"
        }
      ]
    },
    {
      version: "1.5.2",
      date: "2024-11-25",
      type: "bugfix",
      title: "Performance & Bug Fixes",
      changes: [
        {
          type: "bugfix",
          title: "Comment Generation Speed",
          description: "Fixed slow response times for AI comment generation"
        },
        {
          type: "bugfix",
          title: "Platform Integration",
          description: "Resolved issues with Twitter and LinkedIn comment formatting"
        },
        {
          type: "improvement",
          title: "Error Handling",
          description: "Enhanced error messages and user feedback throughout the application"
        }
      ]
    },
    {
      version: "1.5.0",
      date: "2024-11-20",
      type: "feature",
      title: "Multi-Platform Support",
      changes: [
        {
          type: "feature",
          title: "Platform Expansion",
          description: "Added support for Facebook, Instagram, and Reddit comment generation"
        },
        {
          type: "feature",
          title: "Tone Customization",
          description: "Introduced multiple tone options: Professional, Casual, Enthusiastic, Supportive, Humorous, and Critical"
        },
        {
          type: "improvement",
          title: "Comment History",
          description: "Added comprehensive history tracking with search and filter capabilities"
        }
      ]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "feature":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "improvement":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "bugfix":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "major":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Plus className="w-4 h-4" />;
      case "improvement":
        return <Zap className="w-4 h-4" />;
      case "bugfix":
        return <Bug className="w-4 h-4" />;
      case "major":
        return <Sparkles className="w-4 h-4" />;
      default:
        return <GitCommit className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Changelog</h1>
            <p className="text-muted-foreground">Stay updated with the latest features and improvements</p>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/docs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Docs
          </Link>
        </Button>
      </div>

      {/* Releases */}
      <div className="space-y-8">
        {releases.map((release, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-sm">
                    v{release.version}
                  </Badge>
                  <Badge className={getTypeColor(release.type)}>
                    {getTypeIcon(release.type)}
                    <span className="ml-1 capitalize">{release.type}</span>
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {release.date}
                </div>
              </div>
              <CardTitle className="text-xl">{release.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {release.changes.map((change, changeIndex) => (
                  <div key={changeIndex}>
                    <div className="flex items-start gap-3">
                      <div className={`p-1 rounded ${getTypeColor(change.type)}`}>
                        {getTypeIcon(change.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{change.title}</h4>
                        <p className="text-sm text-muted-foreground">{change.description}</p>
                      </div>
                    </div>
                    {changeIndex < release.changes.length - 1 && (
                      <Separator className="my-3" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <GitCommit className="w-8 h-8 text-primary mx-auto" />
            <div>
              <h3 className="font-medium mb-2">Want to suggest a feature?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We're always looking to improve AI Comment Companion based on your feedback.
              </p>
              <Button variant="outline">
                Submit Feature Request
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Changelog;
