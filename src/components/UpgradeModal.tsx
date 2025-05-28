
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Plan
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Free Plan */}
          <div className="border border-border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Free</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">$0.00</span>
                <span className="text-muted-foreground ml-1">Forever</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Start for free, no credit card needed.
            </p>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited basic searches</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>3 Pro searches per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Upload 3 files per day</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full" disabled>
              Continue with free
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="border border-border rounded-lg p-6 space-y-4 relative">
            <div className="absolute -top-3 right-4">
              <Badge className="bg-blue-600 text-white">Popular</Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground">Pro</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">$20.00</span>
                <span className="text-muted-foreground ml-1">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                $8.67 when billed annually
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Unlimited access to AI Comment Agent and enjoy new perks as they are added.
            </p>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Everything in Free</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Access to Deep Search</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>10x as many questions in answers</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Powered by the latest top AI models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Upload unlimited documents and images</span>
              </li>
              <li className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-orange-500" />
                <span>And much more</span>
              </li>
            </ul>
            
            <Button className="w-full bg-white text-black hover:bg-gray-100">
              Continue with Pro
            </Button>
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
    </Dialog>
  );
};

export default UpgradeModal;
