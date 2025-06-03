import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";
interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
const UpgradeModal = ({
  open,
  onOpenChange
}: UpgradeModalProps) => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const getPrice = (monthlyPrice: number) => {
    if (billingPeriod === "yearly") {
      const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount
      const monthlyEquivalent = yearlyPrice / 12;
      return {
        display: `$${monthlyEquivalent.toFixed(2)}`,
        period: "/ month",
        note: `$${yearlyPrice.toFixed(2)} billed annually`
      };
    }
    return {
      display: `$${monthlyPrice.toFixed(2)}`,
      period: "/ month",
      note: null
    };
  };
  const proPrice = getPrice(20);
  const ultraPrice = getPrice(40);
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          {/* New layout: Headline on left, billing toggle on right */}
          <div className="flex justify-between items-start mb-6">
            <div className="text-left">
              <DialogTitle className="text-2xl font-bold">
                Choose Your Plan
              </DialogTitle>
              <p className="text-muted-foreground mt-2">
                Select the perfect plan for your AI comment needs
              </p>
            </div>
            
            {/* Billing Period Toggle moved to right */}
            <div className="flex bg-muted rounded-lg p-1 my-[10px] mx-[22px]">
              <Button variant={billingPeriod === "monthly" ? "default" : "ghost"} size="sm" onClick={() => setBillingPeriod("monthly")} className="rounded-md">
                Monthly
              </Button>
              <Button variant={billingPeriod === "yearly" ? "default" : "ghost"} size="sm" onClick={() => setBillingPeriod("yearly")} className="rounded-md">
                Yearly
                <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                  20% OFF
                </Badge>
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PRO Plan */}
          <div className="border border-border rounded-lg p-6 space-y-4">
            <div className="my-0 py-[14px]">
              <h3 className="text-lg font-semibold text-foreground">PRO</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">{proPrice.display}</span>
                <span className="text-muted-foreground ml-1">{proPrice.period}</span>
                {proPrice.note && <div className="text-sm text-muted-foreground">{proPrice.note}</div>}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Ideal for individual creators and getting started with AI comments.
              </p>
            </div>
            
            <Button className="w-full bg-white text-black hover:bg-gray-100">
              Continue with Pro
            </Button>
            
            <div className="border-t pt-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Access to Standard AI Models</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unlimited access to other standard models</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>LinkedIn, X (Twitter), Reddit, Threads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Bluesky, Facebook, YouTube replies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Meme Creator</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unlimited Tone Selection</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ULTRA Plan */}
          <div className="border border-border rounded-lg p-6 space-y-4 relative">
            <div className="absolute -top-3 right-4">
              <Badge className="bg-blue-600 text-white">Popular</Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground">ULTRA</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">{ultraPrice.display}</span>
                <span className="text-muted-foreground ml-1">{ultraPrice.period}</span>
                {ultraPrice.note && <div className="text-sm text-muted-foreground">{ultraPrice.note}</div>}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Best for power users, teams, and businesses needing advanced AI and collaboration.
              </p>
            </div>
            
            <Button className="w-full bg-white text-black hover:bg-gray-100">
              Continue with Ultra
            </Button>
            
            <div className="border-t pt-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">Full & Priority Access to all Google, Claude, and OpenAI models</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unlimited access to other standard models</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>LinkedIn, X (Twitter), Reddit, Threads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Bluesky, Facebook, YouTube replies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Meme Creator</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">Content Creator with Workflows</span>
                  <span className="text-muted-foreground text-xs">(e.g., Build in Public)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">Team Features</span>
                  <span className="text-muted-foreground text-xs">(collaboration, shared access)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Unlimited Tone Selection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm mt-0.5">⚡</span>
                  <span className="font-semibold">Priority Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            AI Comment Agent for teams or business?{' '}
            <Button variant="link" className="p-0 h-auto text-blue-600">
              Learn more
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>;
};
export default UpgradeModal;