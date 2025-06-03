
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  MessageSquare, 
  Brain, 
  Shield, 
  Users, 
  Zap, 
  Target,
  Globe,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { theme, setTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [activeUseCase, setActiveUseCase] = useState("creators");

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Advanced AI Models",
      description: "Access to the latest GPT, Claude, and Google AI models for intelligent comment generation"
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: "Multi-Platform Support",
      description: "Generate comments for LinkedIn, Twitter, Reddit, Facebook, YouTube, and more"
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lightning Fast",
      description: "Get perfectly crafted comments in seconds, not minutes"
    },
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Tone Customization",
      description: "Choose from professional, casual, witty, and 10+ other tone options"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Team Collaboration",
      description: "Share templates and collaborate with your team on content strategies"
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "Global Reach",
      description: "Support for multiple languages and cultural contexts"
    }
  ];

  const useCases = {
    creators: {
      title: "Content Creators",
      description: "Engage your audience with thoughtful, on-brand comments that drive meaningful conversations",
      benefits: ["Increase engagement rates", "Maintain consistent voice", "Save 3+ hours daily"]
    },
    business: {
      title: "Business Teams",
      description: "Scale your social media presence with professional, strategic comments across all platforms",
      benefits: ["Professional brand voice", "Team collaboration tools", "Analytics & insights"]
    },
    marketers: {
      title: "Digital Marketers",
      description: "Amplify your marketing campaigns with strategic comments that convert viewers into customers",
      benefits: ["Lead generation", "Brand awareness", "Campaign amplification"]
    }
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Content Creator",
      company: "SJ Digital",
      quote: "This tool has completely transformed how I engage with my audience. I've seen a 300% increase in meaningful conversations.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Marketing Director",
      company: "TechFlow Inc",
      quote: "Our team productivity has skyrocketed. We're now active on 5x more platforms with the same resources.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Social Media Manager",
      company: "GrowthLab",
      quote: "The AI understands context so well. It's like having a professional copywriter for every comment.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              🚀 Join 10,000+ creators using AI Comment Companion
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Transform Your Social
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> Engagement</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Generate thoughtful, engaging comments across all social platforms with AI that understands context, tone, and your unique voice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/')}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Trusted by creators at Google, Meta, Netflix, and 500+ other companies
            </p>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Stop Struggling with Social Media Engagement
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h3 className="text-xl font-semibold text-foreground mb-4">The Problem</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Spending hours crafting the perfect comment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Inconsistent brand voice across platforms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Missing engagement opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Generic, uninspired responses</span>
                  </li>
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-foreground mb-4">Our Solution</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 h-5 w-5" />
                    <span>Generate perfect comments in seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 h-5 w-5" />
                    <span>Maintain consistent, authentic voice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 h-5 w-5" />
                    <span>Never miss an engagement opportunity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 h-5 w-5" />
                    <span>Contextual, intelligent responses</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features & Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Dominate Social Media
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to transform your social media presence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Enterprise-Grade Security & Compliance
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your data is protected with industry-leading security measures
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">SOC 2 Compliant</h3>
              <p className="text-sm text-muted-foreground">Rigorous security standards</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">GDPR Compliant</h3>
              <p className="text-sm text-muted-foreground">EU data protection standards</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">256-bit Encryption</h3>
              <p className="text-sm text-muted-foreground">Bank-level security</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">99.9% Uptime</h3>
              <p className="text-sm text-muted-foreground">Reliable and always available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Perfect for Every Professional
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how AI Comment Companion fits your specific needs
            </p>
          </div>
          <div className="flex justify-center mb-8">
            <div className="flex bg-muted rounded-lg p-1">
              {Object.entries(useCases).map(([key, useCase]) => (
                <Button
                  key={key}
                  variant={activeUseCase === key ? "default" : "ghost"}
                  onClick={() => setActiveUseCase(key)}
                  className="rounded-md"
                >
                  {useCase.title}
                </Button>
              ))}
            </div>
          </div>
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-4">
                  {useCases[activeUseCase as keyof typeof useCases].title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {useCases[activeUseCase as keyof typeof useCases].description}
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {useCases[activeUseCase as keyof typeof useCases].benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Paste Content</h3>
              <p className="text-muted-foreground">Copy and paste the post or content you want to comment on</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Choose Your Tone</h3>
              <p className="text-muted-foreground">Select from professional, casual, witty, or any of our 10+ tone options</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Generate & Engage</h3>
              <p className="text-muted-foreground">Get your perfect comment in seconds and engage with confidence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by Thousands of Professionals
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our users are saying about their experience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Social Media Game?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using AI to create better, more engaging content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/')}>
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Schedule a Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <span className="font-semibold text-foreground">AI Comment Companion</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Transform your social media engagement with AI-powered comment generation.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Theme:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-8 w-8 p-0"
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Features</a></li>
                <li><a href="#" className="hover:text-foreground">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
                <li><a href="#" className="hover:text-foreground">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">About Us</a></li>
                <li><a href="#" className="hover:text-foreground">Careers</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 AI Comment Companion. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
