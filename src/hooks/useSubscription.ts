
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Subscription {
  id: string;
  user_id: string;
  dodo_customer_id?: string;
  dodo_subscription_id?: string;
  plan_type: 'PRO' | 'ULTRA';
  billing_cycle: 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
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
        .single();

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
        // Redirect to Dodo Payments checkout
        window.location.href = data.checkoutUrl;
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
    onSuccess: () => {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been updated successfully.",
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
