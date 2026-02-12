'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Plus, X, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
// Import from the context file instead of page
import { useCampaignLauncher } from '../_context/CampaignLauncherContext';

type Audience = {
  id: string;
  name: string;
  size: string;
  interests: string[];
};

const mockAudiences: Audience[] = [
  {
    id: 'aud-1',
    name: 'Tech Enthusiasts',
    size: '1.2M',
    interests: ['Gadgets', 'AI', 'Programming']
  },
  {
    id: 'aud-2',
    name: 'Online Shoppers',
    size: '3.5M',
    interests: ['E-commerce', 'Deals', 'Fashion']
  },
  {
    id: 'aud-3',
    name: 'Fitness Lovers',
    size: '890K',
    interests: ['Workout', 'Nutrition', 'Wellness']
  },
  {
    id: 'aud-4',
    name: 'Business Professionals',
    size: '2.1M',
    interests: ['Networking', 'Leadership', 'Startups']
  },
];

export function AudienceStep() {
  const { data, update } = useCampaignLauncher();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAudienceForm, setShowNewAudienceForm] = useState(false);
  const [newAudienceName, setNewAudienceName] = useState('');
  const [newAudienceDescription, setNewAudienceDescription] = useState('');
  const [newAudienceInterests, setNewAudienceInterests] = useState('');

  const selectedAudiences = data.audiences || [];

  const filteredAudiences = mockAudiences.filter(audience =>
    audience.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    audience.interests.some(interest =>
      interest.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleAudience = (audienceId: string) => {
    const newAudiences = selectedAudiences.includes(audienceId)
      ? selectedAudiences.filter((id: string) => id !== audienceId)
      : [...selectedAudiences, audienceId];
    update({ audiences: newAudiences });
  };

  const createNewAudience = () => {
    // In a real app, this would make an API call
    console.log('Creating new audience:', {
      name: newAudienceName,
      description: newAudienceDescription,
      interests: newAudienceInterests.split(',').map(s => s.trim())
    });

    // Reset form
    setNewAudienceName('');
    setNewAudienceDescription('');
    setNewAudienceInterests('');
    setShowNewAudienceForm(false);
  };

  return (
    <div className="space-y-10 font-satoshi">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-96">
          <Input
            type="text"
            placeholder="Search global audience index..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 border-[#F1F5F9] bg-[#F8FAFC] text-[14px] focus:ring-[#1F57F5]/20 focus:border-[#1F57F5] rounded-xl"
          />
          <svg
            className="absolute left-4 top-3.5 h-5 w-5 text-[#A3A3A3]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            onClick={() => setShowNewAudienceForm(true)}
            variant="outline"
            className="flex-1 md:flex-none h-12 px-6 border-[#F1F5F9] text-[13px] font-bold uppercase tracking-wider text-[#64748B] hover:text-[#05090E] hover:border-[#1F57F5] rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Synthesize New Audience
          </Button>
        </div>
      </div>

      {showNewAudienceForm && (
        <Card className="mb-10 border-[#F1F5F9] shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4">
          <CardHeader className="bg-[#F8FAFC] border-b border-[#F1F5F9] p-8">
            <CardTitle className="text-[18px] font-bold text-[#05090E]">Audience Synthesis Engine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Audience Identity</label>
                <Input
                  value={newAudienceName}
                  onChange={(e) => setNewAudienceName(e.target.value)}
                  placeholder="e.g., Enterprise Decision Makers"
                  className="h-12 border-[#F1F5F9] bg-[#F8FAFC]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Interest Vector Matrix</label>
                <Input
                  value={newAudienceInterests}
                  onChange={(e) => setNewAudienceInterests(e.target.value)}
                  placeholder="technology, logistics, procurement"
                  className="h-12 border-[#F1F5F9] bg-[#F8FAFC]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Contextual Description</label>
              <Input
                value={newAudienceDescription}
                onChange={(e) => setNewAudienceDescription(e.target.value)}
                placeholder="High-intent operational leaders in the APAC region..."
                className="h-12 border-[#F1F5F9] bg-[#F8FAFC]"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowNewAudienceForm(false)}
                className="h-11 px-6 border-[#F1F5F9] text-[13px] font-bold uppercase tracking-wider text-[#64748B]"
              >
                Abort
              </Button>
              <Button
                onClick={createNewAudience}
                className="h-11 px-8 bg-[#1F57F5] text-white text-[13px] font-bold uppercase tracking-widest shadow-lg shadow-[#1F57F5]/20"
              >
                Finalize Synthesis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAudiences.map((audience) => (
          <div
            key={audience.id}
            className={cn(
              "group cursor-pointer p-8 rounded-[2rem] border-2 transition-all duration-300 relative overflow-hidden",
              selectedAudiences.includes(audience.id)
                ? "bg-white border-[#1F57F5] shadow-xl shadow-[#1F57F5]/5"
                : "bg-white border-[#F1F5F9] hover:border-[#2BAFF2] hover:bg-[#F8FAFC]"
            )}
            onClick={() => toggleAudience(audience.id)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                selectedAudiences.includes(audience.id) ? "bg-[#1F57F5] text-white" : "bg-[#F8FAFC] text-[#A3A3A3] group-hover:bg-white group-hover:text-[#2BAFF2]"
              )}>
                <Target className="w-6 h-6" />
              </div>
              {selectedAudiences.includes(audience.id) && (
                <div className="bg-[#00DDFF] text-white p-1 rounded-full shadow-lg shadow-[#00DDFF]/20">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#05090E] tracking-tight">{audience.name}</h3>
                <p className="text-[12px] font-medium text-[#64748B] mt-1">{audience.size} users identified</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {audience.interests.slice(0, 3).map((interest, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold bg-[#F8FAFC] text-[#64748B] px-3 py-1 rounded-full uppercase tracking-widest border border-[#F1F5F9]"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
