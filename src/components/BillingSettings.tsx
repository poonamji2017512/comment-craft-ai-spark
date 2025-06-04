import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Download, CreditCard } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { format } from "date-fns";

const BillingSettings = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const { 
    subscription, 
    billingHistory, 
    createSubscription, 
    manageSubscription,
    isCreatingSubscription,
    isManagingSubscription 
  } = useSubscription();

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

  const handleCreateSubscription = (planType: 'PRO' | 'ULTRA') => {
    createSubscription({ planType, billingCycle: billingPeriod });
  };

  const handleUpgrade = () => {
    manageSubscription({ 
      action: 'upgrade', 
      newPlanType: 'ULTRA', 
      newBillingCycle: billingPeriod 
    });
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      manageSubscription({ action: 'cancel' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Billing Toggle */}
      <div className="flex justify-between items-start mb-6">
        <div className="text-left">
          <h3 className="text-2xl font-bold">Billing & Plans</h3>
          <p className="text-muted-foreground mt-2">
            Manage your subscription and billing preferences
          </p>
        </div>
        
        <div className="flex bg-muted rounded-lg p-1 my-[10px] mx-[22px]">
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
      {subscription && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Current Plan: {subscription.plan_type}</h4>
                <p className="text-sm text-muted-foreground">
                  {subscription.current_period_end && (
                    <>Next billing: {format(new Date(subscription.current_period_end), 'MMMM dd, yyyy')}</>
                  )}
                </p>
              </div>
              <Badge className={`${
                subscription.status === 'active' ? 'bg-primary text-primary-foreground' : 
                subscription.status === 'past_due' ? 'bg-yellow-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {subscription.status === 'active' ? 'Active' : 
                 subscription.status === 'past_due' ? 'Past Due' : 
                 subscription.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Options */}
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
          
          {subscription?.plan_type === 'PRO' ? (
            <Button variant="outline" className="w-full my-[4px]" disabled>
              Current Plan
            </Button>
          ) : subscription?.plan_type === 'ULTRA' ? (
            <Button 
              variant="outline" 
              className="w-full my-[4px]"
              onClick={() => manageSubscription({ 
                action: 'downgrade', 
                newPlanType: 'PRO', 
                newBillingCycle: billingPeriod 
              })}
              disabled={isManagingSubscription}
            >
              Downgrade to Pro
            </Button>
          ) : (
            <Button 
              className="w-full bg-white text-black hover:bg-gray-100 my-[4px]"
              onClick={() => handleCreateSubscription('PRO')}
              disabled={isCreatingSubscription}
            >
              {isCreatingSubscription ? 'Processing...' : 'Choose Pro'}
            </Button>
          )}
          
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
          
          {subscription?.plan_type === 'ULTRA' ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : subscription?.plan_type === 'PRO' ? (
            <Button 
              className="w-full bg-white text-black hover:bg-gray-100"
              onClick={handleUpgrade}
              disabled={isManagingSubscription}
            >
              {isManagingSubscription ? 'Processing...' : 'Upgrade to Ultra'}
            </Button>
          ) : (
            <Button 
              className="w-full bg-white text-black hover:bg-gray-100"
              onClick={() => handleCreateSubscription('ULTRA')}
              disabled={isCreatingSubscription}
            >
              {isCreatingSubscription ? 'Processing...' : 'Choose Ultra'}
            </Button>
          )}
          
          <div className="border-t pt-4 my-[28px]">
            
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

      {/* Cancel Subscription Button */}
      {subscription && subscription.status === 'active' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Cancel Subscription</h4>
                <p className="text-sm text-muted-foreground">
                  Your subscription will remain active until the end of your billing period.
                </p>
              </div>
              <Button 
                variant="destructive" 
                onClick={handleCancelSubscription}
                disabled={isManagingSubscription}
              >
                {isManagingSubscription ? 'Processing...' : 'Cancel Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Billing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingHistory.length > 0 ? (
              billingHistory.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b">
                  <div>
                    <p className="font-medium">{item.description || 'Payment'}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(item.payment_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.amount.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mx-[70px] my-[-25px]">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          item.status === 'succeeded' ? 'bg-green-100 text-green-800' :
                          item.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status === 'succeeded' ? 'Paid' : 
                         item.status === 'failed' ? 'Failed' : 'Pending'}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No billing history available
              </p>
            )}
          </div>
          
          {billingHistory.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <Button variant="outline" className="w-full">
                View All Billing History
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method Section */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-5 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">
                CARD
              </div>
              <div>
                <p className="font-medium">Managed by Dodo Payments</p>
                <p className="text-sm text-muted-foreground">Secure payment processing</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          AI Comment Agent for teams or business?{' '}
          <Button variant="link" className="p-0 h-auto text-blue-600">
            Learn more
          </Button>
        </p>
      </div>
    </div>
  );
};

export default BillingSettings;
