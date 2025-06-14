
"use client"

import { Brain, Zap } from "lucide-react"
import { PricingSection } from "@/components/ui/pricing-section"

const pricingTiers = [
  {
    name: "PRO",
    price: {
      monthly: 20,
      yearly: 192,
    },
    description: "Ideal for individual creators and getting started with AI comments.",
    icon: (
      <div className="relative">
        <Brain className="w-7 h-7 relative z-10 text-zinc-600 dark:text-zinc-400" />
      </div>
    ),
    features: [
      {
        name: "Access to Standard AI Models",
        description: "Use standard AI models for content generation",
        included: true,
      },
      {
        name: "Unlimited access to other standard models",
        description: "No limits on standard model usage",
        included: true,
      },
      {
        name: "LinkedIn, X (Twitter), Reddit, Threads, Bluesky, Facebook, YouTube replies",
        description: "Support for all major social platforms",
        included: true,
      },
      {
        name: "Meme Creator",
        description: "AI-powered meme generation",
        included: true,
      },
      {
        name: "Unlimited Tone Selection",
        description: "Choose from various writing tones",
        included: true,
      },
    ],
  },
  {
    name: "ULTRA",
    price: {
      monthly: 40,
      yearly: 384,
    },
    description: "Best for power users, teams, and businesses needing advanced AI and collaboration.",
    highlight: true,
    badge: "Popular",
    icon: (
      <div className="relative">
        <Zap className="w-7 h-7 relative z-10" />
      </div>
    ),
    features: [
      {
        name: "Full & Priority Access to all Google, Claude, and OpenAI models",
        description: "Premium AI models with priority access",
        included: true,
      },
      {
        name: "LinkedIn, X (Twitter), Reddit, Threads, Bluesky, Facebook, YouTube replies",
        description: "Support for all major social platforms",
        included: true,
      },
      {
        name: "Meme Creator",
        description: "AI-powered meme generation",
        included: true,
      },
      {
        name: "Content Creator with Workflows",
        description: "Advanced workflows (e.g., Build in Public)",
        included: true,
      },
      {
        name: "Team Features",
        description: "Collaboration and shared access",
        included: true,
      },
      {
        name: "Unlimited Tone Selection",
        description: "Choose from various writing tones",
        included: true,
      },
      {
        name: "⚡️ Priority Support",
        description: "Get help faster with priority support",
        included: true,
      },
    ],
  },
]

function ConfiguredPricing() {
  return <PricingSection tiers={pricingTiers} />
}

export { ConfiguredPricing }
