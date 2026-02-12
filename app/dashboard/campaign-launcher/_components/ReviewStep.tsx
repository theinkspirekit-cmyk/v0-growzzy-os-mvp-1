'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, DollarSign, Users, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { useCampaignLauncher } from '../_context/CampaignLauncherContext';

type ReviewItem = {
  title: string;
  value: string | number | string[];
  icon: React.ReactNode;
  type?: 'list' | 'text' | 'chips';
};

export function ReviewStep() {
  const { data } = useCampaignLauncher();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewItems: ReviewItem[] = [
    {
      title: 'Campaign Goal',
      value: data.goal || 'Not specified',
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    },
    {
      title: 'Strategy',
      value: data.strategy || 'Not specified',
      icon: <Clock className="h-5 w-5 text-blue-500" />,
    },
    {
      title: 'Daily Budget',
      value: data.dailyBudget ? `$${data.dailyBudget.toLocaleString()}` : 'Not specified',
      icon: <DollarSign className="h-5 w-5 text-yellow-500" />,
    },
    {
      title: 'Target Audiences',
      value: data.audiences.length > 0 ? data.audiences : ['No audiences selected'],
      icon: <Users className="h-5 w-5 text-purple-500" />,
      type: 'chips',
    },
    {
      title: 'Creatives',
      value: data.creatives.length > 0 ? data.creatives : ['No creatives selected'],
      icon: <ImageIcon className="h-5 w-5 text-pink-500" />,
      type: 'chips',
    },
  ];

  const handleSubmit = async () => {
    if (!data.goal || !data.strategy || !data.dailyBudget || data.audiences.length === 0 || data.creatives.length === 0) {
      setError('Please complete all steps before submitting');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you would make an API call here
      console.log('Submitting campaign:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      // In a real app, you might use a toast notification here
      alert('Campaign created successfully!');

      // Redirect to campaigns list or dashboard
      router.push('/dashboard/campaigns');
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 font-satoshi">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviewItems.map((item, index) => (
          <div key={index} className="p-8 rounded-[2rem] border-2 border-[#F1F5F9] bg-white group hover:border-[#1F57F5] transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-[#F8FAFC] rounded-2xl text-[#1F57F5] group-hover:bg-[#1F57F5] group-hover:text-white transition-all">
                {item.icon}
              </div>
              <h4 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.15em]">{item.title}</h4>
            </div>

            <div className="space-y-3">
              {item.type === 'chips' ? (
                <div className="flex flex-wrap gap-2">
                  {(item.value as string[]).slice(0, 3).map((value, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider border border-[#F1F5F9]"
                    >
                      {value}
                    </span>
                  ))}
                  {(item.value as string[]).length > 3 && (
                    <span className="text-[10px] font-bold text-[#1F57F5] px-2 py-1">+{(item.value as string[]).length - 3} MORE</span>
                  )}
                </div>
              ) : (
                <p className="text-[20px] font-bold text-[#05090E] tracking-tight">{item.value as string}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-[#F8FAFC] border border-[#F1F5F9] rounded-[2.5rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F57F5]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <h3 className="text-[14px] font-bold text-[#05090E] uppercase tracking-[0.2em] mb-8 relative z-10">Projection Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Daily Allocation</h4>
            <p className="text-[28px] font-bold text-[#05090E] tracking-tighter">
              ${data.dailyBudget ? data.dailyBudget.toLocaleString() : '0.00'}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Monthly Commitment</h4>
            <p className="text-[28px] font-bold text-[#05090E] tracking-tighter">
              ${data.dailyBudget ? (data.dailyBudget * 30).toLocaleString() : '0.00'}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Targeting Nodes</h4>
            <p className="text-[28px] font-bold text-[#05090E] tracking-tighter">
              {data.audiences.length}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Asset Count</h4>
            <p className="text-[28px] font-bold text-[#05090E] tracking-tighter">
              {data.creatives.length}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-[#F43F5E]/10 border border-[#F43F5E]/20 rounded-xl flex items-center gap-3 text-[#F43F5E] text-[13px] font-medium">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      )}
    </div>

  );
}
