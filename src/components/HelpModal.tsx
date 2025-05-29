
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, MessageSquare, Sparkles, Clock, Users, Target } from "lucide-react";

interface HelpModalProps {
  children: React.ReactNode;
}

const HelpModal = ({ children }: HelpModalProps) => {
  const helpTopics = [
    {
      title: "Getting Started",
      description: "Learn how to generate your first AI comment",
      icon: Sparkles,
      content: [
        "Paste the social media post or content you want to comment on",
        "Select your preferred platform (Twitter, LinkedIn, Facebook, etc.)",
        "Choose the tone that matches your voice",
        "Click 'Generate Comment' and get AI-powered suggestions"
      ]
    },
    {
      title: "Choosing the Right Tone",
      description: "Pick the perfect tone for your audience",
      icon: MessageSquare,
      content: [
        "Professional: Great for LinkedIn and business contexts",
        "Friendly: Perfect for casual social interactions",
        "Humorous: Add some fun to your comments",
        "Supportive: Show empathy and encouragement",
        "Informative: Share knowledge and insights"
      ]
    },
    {
      title: "Platform Best Practices",
      description: "Optimize comments for each social platform",
      icon: Target,
      content: [
        "Twitter: Keep it concise and engaging",
        "LinkedIn: Professional and value-driven",
        "Facebook: Personal and conversational",
        "Instagram: Visual and trendy language",
        "TikTok: Fun and current with trends"
      ]
    },
    {
      title: "Understanding Your Dashboard",
      description: "Track your commenting activity and performance",
      icon: Clock,
      content: [
        "View total comments generated",
        "Monitor weekly activity trends",
        "See your most used platforms and tones",
        "Track engagement rates and success metrics",
        "Review recent comment history"
      ]
    }
  ];

  const faqs = [
    {
      question: "How many comments can I generate?",
      answer: "Comment limits depend on your subscription plan. Free users get 10 comments per day, while premium users enjoy unlimited generation."
    },
    {
      question: "Can I customize the AI's writing style?",
      answer: "Yes! You can select from various tones and the AI will adapt its writing style accordingly. You can also edit generated comments before posting."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade security and never store your personal posts or comments permanently. Your privacy is our priority."
    },
    {
      question: "Can I use this for business accounts?",
      answer: "Yes! Our professional tones are perfect for business social media management. Many companies use our tool for consistent brand voice."
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            Help & Support
          </DialogTitle>
          <DialogDescription>
            Everything you need to know about AI Comment Companion
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Quick Start Guide */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helpTopics.map((topic, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <topic.icon className="w-5 h-5 text-primary" />
                    {topic.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{topic.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.content.map((item, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQs */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h4 className="font-medium mb-2">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium mb-1">Still need help?</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact our support team for personalized assistance
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpModal;
