
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";

const BillingSettings = () => {
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Billing & Plans</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing preferences
        </p>
      </div>

      {/* Billing Period Toggle */}
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          <Button
            variant={billingPeriod === "monthly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingPeriod("monthly")}
            className="rounded-md"
          >
            Monthly
          </Button>
          <Button
            variant={billingPeriod === "yearly" ? "default" : "ghost"}
            size="sm"
            onClick={() => setBillingPeriod("yearly")}
            className="rounded-md"
          >
            Yearly
            <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
              20% OFF
            </Badge>
          </Button>
        </div>
      </div>

      {/* Current Plan Status */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Current Plan: PRO</h4>
              <p className="text-sm text-muted-foreground">
                Next billing: January 15, 2025
              </p>
            </div>
            <Badge className="bg-primary text-primary-foreground">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Plan Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PRO Plan */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>PRO</span>
              <Badge variant="outline">Current</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{proPrice.display}</span>
                <span className="text-muted-foreground text-sm">{proPrice.period}</span>
              </div>
              {proPrice.note && (
                <p className="text-xs text-muted-foreground">{proPrice.note}</p>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Ideal for individual creators
            </p>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Standard AI Models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>All Social Platforms</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited Tones</span>
              </li>
            </ul>

            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* ULTRA Plan */}
        <Card className="border-primary relative">
          <div className="absolute -top-2 right-4">
            <Badge className="bg-blue-600 text-white">Popular</Badge>
          </div>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>ULTRA</span>
              <Crown className="h-5 w-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{ultraPrice.display}</span>
                <span className="text-muted-foreground text-sm">{ultraPrice.period}</span>
              </div>
              {ultraPrice.note && (
                <p className="text-xs text-muted-foreground">{ultraPrice.note}</p>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground">
              Best for power users and teams
            </p>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="font-medium">Premium AI Models</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="font-medium">Team Features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="font-medium">Priority Support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Content Workflows</span>
              </li>
            </ul>

            <Button className="w-full">
              Upgrade to Ultra
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Billing History Section */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">PRO Plan</p>
                <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$20.00</p>
                <Badge variant="secondary" className="text-xs">Paid</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">PRO Plan</p>
                <p className="text-sm text-muted-foreground">Nov 15, 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$20.00</p>
                <Badge variant="secondary" className="text-xs">Paid</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingSettings;
