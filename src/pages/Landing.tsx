import React from "react";
import { HeroSection } from "@/components/ui/hero-section-1";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Shield, Users, Brain, MessageSquare, Users2, TrendingUp, DollarSign, Bot, Smartphone, Globe, Flame, BarChart3, CheckCircle, Zap as ZapIcon, Link2 } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";
import SectionWithMockup from "@/components/ui/section-with-mockup";
import { Testimonials } from "@/components/ui/testimonials-columns-1";
import { ConfiguredPricing } from "@/components/ui/configured-pricing";
import { FaqSection } from "@/components/ui/faq-section";
import { CTASection } from "@/components/ui/cta-with-rectangle";
import { Footer } from "@/components/ui/footer-section";

const faqItems = [
  {
    question: "Will it sound robotic?",
    answer: "No. Multi-model AI + brand-specific personas ensure human-like replies."
  },
  {
    question: "Can I trust it with my brand?",
    answer: "Yes. You control every post, and smart onboarding trains it on your tone."
  },
  {
    question: "Do I need another tool?",
    answer: "Interact complements your scheduler. It powers engagement, not just publishing."
  },
  {
    question: "What if I only use LinkedIn or Reddit?",
    answer: "One platform is enough — ROI starts with a single touchpoint."
  },
  {
    question: "Is it worth the price?",
    answer: "Absolutely. Close deals, grow followers, and save hours — faster than a VA."
  }
];

const Landing = () => {
  return <div className="min-h-screen bg-background">
      <HeroSection />
      
      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Powerful Features for Social Media Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to automate and optimize your social media presence
            </p>
          </div>
          
          <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-4 lg:gap-4 xl:max-h-[50rem] xl:grid-rows-3">
            <GridItem area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]" icon={<Brain className="h-4 w-4" />} title="Campaign Planning & Post Creation" description="Intelligent content planning with AI-powered post creation and scheduling" />
            <GridItem area="md:[grid-area:1/7/2/13] xl:[grid-area:1/5/2/9]" icon={<Bot className="h-4 w-4" />} title="One-Click DMs & Smart Comments" description="10 preset personas + custom creation with natural replies in 10 different tones" />
            <GridItem area="md:[grid-area:2/1/3/7] xl:[grid-area:1/9/2/13]" icon={<Smartphone className="h-4 w-4" />} title="7 Platform Support" description="LinkedIn, X, Reddit, Threads, Bluesky, Facebook, YouTube" />
            <GridItem area="md:[grid-area:2/7/3/13] xl:[grid-area:2/1/3/5]" icon={<Globe className="h-4 w-4" />} title="50+ Languages" description="Go global without losing your tone with multi-language support" />
            <GridItem area="md:[grid-area:3/1/3/7] xl:[grid-area:2/5/3/9]" icon={<Flame className="h-4 w-4" />} title="Meme Generator" description="Viral content that stays on-brand with AI-powered meme creation" />
            <GridItem area="md:[grid-area:3/7/4/13] xl:[grid-area:2/9/3/13]" icon={<BarChart3 className="h-4 w-4" />} title="Advanced Analytics" description="In-depth insights, customizable dashboards, and ROI tracking" />
            <GridItem area="md:[grid-area:4/1/5/7] xl:[grid-area:3/1/4/5]" icon={<Users2 className="h-4 w-4" />} title="Team Collaboration" description="Multi-user access, role-based permissions, and approval workflows" />
            <GridItem area="md:[grid-area:4/7/5/13] xl:[grid-area:3/5/4/9]" icon={<DollarSign className="h-4 w-4" />} title="Ad Campaign Management" description="Create, manage, and optimize paid ads with A/B testing across platforms" />
            <GridItem area="md:[grid-area:5/1/6/13] xl:[grid-area:3/9/4/13]" icon={<Link2 className="h-4 w-4" />} title="Custom API Integrations" description="Flexible connections with CRM, marketing, and project management tools" />
          </ul>
        </div>
      </section>

      {/* Why choose Interact Section */}
      <SectionWithMockup title={<>
            Why choose
            <br />
            Interact?
          </>} description={<>
            Transform your social media presence with AI-powered automation that 
            <br />
            feels authentic. Our intelligent platform learns your brand voice,
            <br />
            creates engaging content, and manages interactions across all major
            <br />
            platforms while you focus on growing your business.
          </>} primaryImageSrc="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop" secondaryImageSrc="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop" />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">          
          <Testimonials />
        </div>
      </section>

      {/* Pricing Section */}
      <ConfiguredPricing />

      {/* FAQ Section */}
      <FaqSection
        title="Frequently Asked Questions"
        description="Everything you need to know about our platform"
        items={faqItems}
        contactInfo={{
          title: "Still have questions?",
          description: "We're here to help you get started",
          buttonText: "Contact Support",
          onContact: () => console.log("Contact support clicked"),
        }}
      />

      {/* CTA Section */}
      <CTASection
        badge={{
          text: "Get started"
        }}
        title="Ready to Transform Your Social Media?"
        description="Join thousands of businesses already using Interact to automate their social media engagement and grow their online presence."
        action={{
          text: "Start Free Trial",
          href: "/signup",
          variant: "default"
        }}
      />

      {/* Footer */}
      <Footer />
    </div>;
};

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}
const GridItem = ({
  area,
  icon,
  title,
  description
}: GridItemProps) => {
  return <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-border p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect spread={40} glow={true} disabled={false} proximity={64} inactiveZone={0.01} borderWidth={3} />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] bg-background p-6 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
              {icon}
            </div>
            <div className="space-y-3">
              <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance text-foreground">
                {title}
              </h3>
              <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                {description}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </li>;
};
export default Landing;
