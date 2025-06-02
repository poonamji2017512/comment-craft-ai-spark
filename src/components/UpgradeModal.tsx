
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
          {/* PRO Plan */}
          <div className="border border-border rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">PRO</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">$20.00</span>
                <span className="text-muted-foreground ml-1">/ month</span>
              </div>
            </div>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">AI Model Access</div>
                  <div className="text-muted-foreground text-xs">All Google, Claude, and OpenAI models (limited access)</div>
                  <div className="text-muted-foreground text-xs">Unlimited access to standard models</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm mt-0.5">📱</span>
                <div>
                  <div className="font-medium">Social Media Platforms</div>
                  <div className="text-muted-foreground text-xs">LinkedIn, X (Twitter), Reddit, Threads</div>
                  <div className="text-muted-foreground text-xs">Bluesky, Facebook, YouTube replies</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm mt-0.5">🧰</span>
                <div>
                  <div className="font-medium">Features</div>
                  <div className="text-muted-foreground text-xs">Meme Creator</div>
                  <div className="text-muted-foreground text-xs">Unlimited Tone Selection</div>
                </div>
              </li>
            </ul>
            
            <Button className="w-full bg-white text-black hover:bg-gray-100">
              Continue with Pro
            </Button>
          </div>

          {/* ULTRA Plan */}
          <div className="border border-border rounded-lg p-6 space-y-4 relative">
            <div className="absolute -top-3 right-4">
              <Badge className="bg-blue-600 text-white">Popular</Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground">ULTRA</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-foreground">$40.00</span>
                <span className="text-muted-foreground ml-1">/ month</span>
              </div>
            </div>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium">AI Model Access</div>
                  <div className="text-muted-foreground text-xs">All Google, Claude, and OpenAI models (full access)</div>
                  <div className="text-muted-foreground text-xs">Unlimited access to standard models</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm mt-0.5">📱</span>
                <div>
                  <div className="font-medium">Social Media Platforms</div>
                  <div className="text-muted-foreground text-xs">LinkedIn, X (Twitter), Reddit, Threads</div>
                  <div className="text-muted-foreground text-xs">Bluesky, Facebook, YouTube replies</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm mt-0.5">🧰</span>
                <div>
                  <div className="font-medium">Features</div>
                  <div className="text-muted-foreground text-xs">Meme Creator</div>
                  <div className="text-muted-foreground text-xs">Content Creator with workflows (e.g., Build in Public)</div>
                  <div className="text-muted-foreground text-xs">Team Features</div>
                  <div className="text-muted-foreground text-xs">Unlimited Tone Selection</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sm mt-0.5">⚡</span>
                <div>
                  <div className="font-medium">Support</div>
                  <div className="text-muted-foreground text-xs">Priority Support</div>
                </div>
              </li>
            </ul>
            
            <Button className="w-full bg-white text-black hover:bg-gray-100">
              Continue with Ultra
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
