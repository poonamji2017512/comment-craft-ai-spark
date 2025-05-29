
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Sparkles, 
  MessageSquare, 
  Settings, 
  Zap, 
  Shield, 
  Globe,
  Book,
  Code,
  Users
} from "lucide-react";

const Docs = () => {
  const sections = [
    {
      title: "Getting Started",
      icon: Sparkles,
      items: [
        { title: "Quick Start Guide", description: "Get up and running in minutes" },
        { title: "Account Setup", description: "Configure your profile and preferences" },
        { title: "First Comment Generation", description: "Create your first AI-powered comment" }
      ]
    },
    {
      title: "Features",
      icon: Zap,
      items: [
        { title: "Comment Generation", description: "AI-powered comment creation for social platforms" },
        { title: "Tone Customization", description: "Adjust tone and style to match your voice" },
        { title: "Platform Integration", description: "Seamless integration with major social platforms" }
      ]
    },
    {
      title: "Platform Support",
      icon: Globe,
      items: [
        { title: "Twitter Integration", description: "Generate engaging tweets and replies" },
        { title: "LinkedIn Comments", description: "Professional networking comments" },
        { title: "Facebook Posts", description: "Social media engagement content" },
        { title: "Instagram Captions", description: "Visual content descriptions" }
      ]
    },
    {
      title: "Advanced Usage",
      icon: Settings,
      items: [
        { title: "Custom Prompts", description: "Create personalized comment templates" },
        { title: "Batch Generation", description: "Generate multiple comments at once" },
        { title: "Analytics & Insights", description: "Track performance and engagement" }
      ]
    },
    {
      title: "API Documentation",
      icon: Code,
      items: [
        { title: "REST API", description: "Integrate AI Comment into your applications" },
        { title: "Authentication", description: "Secure API access and token management" },
        { title: "Rate Limits", description: "Understanding usage limits and quotas" }
      ]
    },
    {
      title: "Security & Privacy",
      icon: Shield,
      items: [
        { title: "Data Protection", description: "How we protect your information" },
        { title: "Privacy Policy", description: "Our commitment to user privacy" },
        { title: "Terms of Service", description: "Usage terms and conditions" }
      ]
    }
  ];

  const quickLinks = [
    { title: "API Reference", icon: Code, badge: "Developer" },
    { title: "Video Tutorials", icon: MessageSquare, badge: "Popular" },
    { title: "Community Forum", icon: Users, badge: "Support" },
    { title: "Changelog", icon: FileText, badge: "Updates" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Book className="w-10 h-10 text-primary" />
          <h1 className="text-4xl font-bold">Documentation</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about AI Comment Agent. Get started quickly with our comprehensive guides and resources.
        </p>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quick Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <link.icon className="w-5 h-5 text-primary" />
                  <Badge variant="secondary">{link.badge}</Badge>
                </div>
                <h3 className="font-medium">{link.title}</h3>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <Card key={index} className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="w-5 h-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-sm">{item.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    </div>
                    {itemIndex < section.items.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Popular Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Popular Articles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Badge variant="outline" className="mb-2">Getting Started</Badge>
              <h3 className="font-medium mb-2">How to Generate Your First Comment</h3>
              <p className="text-sm text-muted-foreground">Step-by-step guide to creating engaging comments with AI.</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Badge variant="outline" className="mb-2">Advanced</Badge>
              <h3 className="font-medium mb-2">Customizing Comment Tone</h3>
              <p className="text-sm text-muted-foreground">Learn how to adjust tone and style for different platforms.</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors">
              <Badge variant="outline" className="mb-2">Integration</Badge>
              <h3 className="font-medium mb-2">Platform Connections</h3>
              <p className="text-sm text-muted-foreground">Connect your social media accounts for seamless posting.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-2">Community Forum</h3>
              <p className="text-sm text-muted-foreground">
                Join our community to ask questions and share tips with other users.
              </p>
            </div>
            <div className="text-center">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-2">Live Chat Support</h3>
              <p className="text-sm text-muted-foreground">
                Get instant help from our support team during business hours.
              </p>
            </div>
            <div className="text-center">
              <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium mb-2">Submit a Ticket</h3>
              <p className="text-sm text-muted-foreground">
                Send us a detailed message for complex issues or feature requests.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Docs;
