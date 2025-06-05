
import React from 'react';
import LandingNavbar from './LandingNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, ArrowRight, Zap, Users, MessageSquare, Palette, Workflow, Shield } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section id="hero" className="pt-20 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Stuck with growth on{' '}
              <span className="text-primary">Social Media?</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              Say goodbye to writer's block and endless scrolling. One click is all it takes to generate 
              high-quality replies, memes, and viral comments across every platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4">
                Try Free Pro plan for 3 Days
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                See the Agent in Action
              </Button>
            </div>
            <p className="text-gray-500 italic">
              Built for creators, founders, and teams who want to stay active — without the burnout.
            </p>
          </div>
        </div>
      </section>

      {/* Product Definition Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              A Social Media Manager That Works Like an Agent, Not a Tool
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              It's like having a social media manager, content strategist, and meme artist in your browser.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Reads and understands context</h3>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Writes thoughtful, on-brand comments</h3>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Suggests replies, memes, and insights</h3>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowRight className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">Engages across all platforms with single click</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Everything You Need to Stay Active, Relevant, and Viral — In One Click
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-primary" />
                  One-Click Smart Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Instant comment generation with multi-platform support</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">X (Twitter)</Badge>
                  <Badge variant="secondary">LinkedIn</Badge>
                  <Badge variant="secondary">Reddit</Badge>
                  <Badge variant="secondary">Threads</Badge>
                  <Badge variant="secondary">Bluesky</Badge>
                  <Badge variant="secondary">YouTube</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  Tone & Voice Control
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Multiple tone options for brand consistency</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Friendly</Badge>
                  <Badge variant="outline">Funny</Badge>
                  <Badge variant="outline">Sarcastic</Badge>
                  <Badge variant="outline">Thoughtful</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-6 h-6 text-primary" />
                  Built-in Meme Generator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Instant meme creation from posts/topics with viral moment optimization</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="w-6 h-6 text-primary" />
                  Workflow Mode
                  <Badge className="ml-2">Ultra</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Campaign-focused reply planning with "Build in Public" integration</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Team Mode
                  <Badge className="ml-2">Ultra</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Up to 3 team members with collaborative comment management and approval workflows</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  AI-Powered Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Engagement potential prioritization with trend-based recommendations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Three Steps to Always-On Engagement
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Install & Connect</h3>
              <p className="text-gray-600">One-click social account linking to get started instantly</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Set Your Style</h3>
              <p className="text-gray-600">Voice selection or let AI learn your unique communication style</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Click to Comment</h3>
              <p className="text-gray-600">Single-click reply generation with approval and editing capabilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Differentiation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Stop Scheduling. Start Engaging.
            </h2>
            <p className="text-xl text-gray-600">
              Traditional tools vs. AI Agent - See the difference
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-600">Traditional Tools</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Schedule posts in advance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Generic, templated responses</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>No real-time engagement</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Limited creativity</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-primary">AI Agent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Real-time engagement</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Personalized, context-aware responses</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Reactive and proactive approaches</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Creative memes and viral content</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Founders, Creators & Teams
            </h2>
            <p className="text-xl text-gray-600">
              Built for People Who Are Building in Public
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "This AI agent has completely transformed how I engage on social media. As a SaaS founder, I can now stay active across all platforms without spending hours crafting responses."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">DP</span>
                  </div>
                  <div>
                    <p className="font-semibold">Dev Patel</p>
                    <p className="text-sm text-gray-500">SaaS Founder</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "My engagement rates have increased by 300% since using CommentCraft. The AI understands my brand voice perfectly and creates content that actually resonates."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">PR</span>
                  </div>
                  <div>
                    <p className="font-semibold">Priya Rao</p>
                    <p className="text-sm text-gray-500">Content Creator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a solo marketer managing multiple clients, this tool is a lifesaver. One click and I have thoughtful, engaging comments ready across all platforms."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">JH</span>
                  </div>
                  <div>
                    <p className="font-semibold">James H.</p>
                    <p className="text-sm text-gray-500">Solo Marketer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Perfect for solo creators or marketing teams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">Pro Plan</CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$20</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">Perfect for solo creators</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>One-Click Comments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Meme Generator</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Multi-Platform Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Tone Selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Standard Model Access</span>
                </div>
                <Button className="w-full mt-6">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Ultra Plan</CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$40</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-gray-600">Perfect for marketing teams</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>All Pro features</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Team Access (up to 3 members)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Content Workflows</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Priority Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Full Model Access (GPT-4, Claude, Gemini)</span>
                </div>
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              <span className="font-semibold">Special Offer:</span> Save 20% on yearly plans
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Let Your AI Agent Handle Social Media — You Focus on What Matters
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Whether you're building a product, growing a brand, or creating content — stay active, 
            relevant, and visible without spending hours online.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
              See the Agent in Action
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CommentCraft</h3>
              <p className="text-gray-400">
                Your AI-powered social media engagement agent
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CommentCraft. All rights reserved.</p>
            <p className="mt-2">Contact: support@Irmm.in</p>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default LandingPage;
