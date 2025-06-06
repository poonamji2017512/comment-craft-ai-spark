
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export interface Subscription {
  id: string;
  user_id: string;
  dodo_customer_id?: string;
  dodo_subscription_id?: string;
  plan_type: 'PRO' | 'ULTRA';
  billing_cycle: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing';
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

export interface BillingHistory {
  id: string;
  user_id: string;
  subscription_id?: string;
  dodo_payment_id?: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending';
  description?: string;
  payment_date: string;
  created_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data as Subscription | null;
    },
    enabled: !!user,
  });

  const { data: billingHistory = [] } = useQuery({
    queryKey: ['billing-history', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .eq('user_id', user.id)
        .order('payment_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as BillingHistory[];
    },
    enabled: !!user,
  });

  // Real-time subscription updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Subscription updated:', payload);
          // Invalidate and refetch subscription data
          queryClient.invalidateQueries({ queryKey: ['subscription', user.id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'billing_history',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New billing history:', payload);
          // Invalidate and refetch billing history
          queryClient.invalidateQueries({ queryKey: ['billing-history', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const createSubscriptionMutation = useMutation({
    mutationFn: async ({ planType, billingCycle }: { planType: 'PRO' | 'ULTRA'; billingCycle: 'monthly' | 'yearly' }) => {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { planType, billingCycle },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        // For embedded checkout, open in overlay
        if (data.embedded) {
          // Trigger embedded checkout here
          console.log('Opening embedded checkout:', data.checkoutUrl);
          // You would integrate with Dodo's embedded checkout SDK here
          window.open(data.checkoutUrl, '_blank');
        } else {
          // Redirect to Dodo Payments checkout
          window.location.href = data.checkoutUrl;
        }
      } else {
        toast({
          title: "Subscription Created",
          description: "Your subscription has been created successfully.",
        });
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      });
    },
  });

  const manageSubscriptionMutation = useMutation({
    mutationFn: async ({ action, newPlanType, newBillingCycle }: {
      action: 'cancel' | 'upgrade' | 'downgrade';
      newPlanType?: 'PRO' | 'ULTRA';
      newBillingCycle?: 'monthly' | 'yearly';
    }) => {
      const { data, error } = await supabase.functions.invoke('manage-subscription', {
        body: { action, newPlanType, newBillingCycle },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const message = data.provisional ? 
        "Your subscription is being updated. Changes will be reflected shortly." :
        "Your subscription has been updated successfully.";
      
      toast({
        title: "Subscription Updated",
        description: message,
      });
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['billing-history'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update subscription",
        variant: "destructive",
      });
    },
  });

  return {
    subscription,
    billingHistory,
    isLoading,
    createSubscription: createSubscriptionMutation.mutate,
    manageSubscription: manageSubscriptionMutation.mutate,
    isCreatingSubscription: createSubscriptionMutation.isPending,
    isManagingSubscription: manageSubscriptionMutation.isPending,
  };
};
