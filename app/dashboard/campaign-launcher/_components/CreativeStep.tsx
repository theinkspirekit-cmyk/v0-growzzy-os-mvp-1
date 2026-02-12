'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Plus, Image as ImageIcon, Video, FileText, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCampaignLauncher } from '../_context/CampaignLauncherContext';

type CreativeType = 'image' | 'video' | 'carousel' | 'story';

type CreativeAsset = {
  id: string;
  type: CreativeType;
  url: string;
  title: string;
  dimensions: string;
  size: string;
  lastUpdated: string;
};

const mockCreatives: CreativeAsset[] = [
  {
    id: 'creative-1',
    type: 'image',
    url: 'https://via.placeholder.com/800x600',
    title: 'Summer Sale Banner',
    dimensions: '1200x628',
    size: '1.2MB',
    lastUpdated: '2 days ago',
  },
  {
    id: 'creative-2',
    type: 'video',
    url: 'https://via.placeholder.com/800x450',
    title: 'Product Demo Video',
    dimensions: '1920x1080',
    size: '5.7MB',
    lastUpdated: '1 week ago',
  },
  {
    id: 'creative-3',
    type: 'carousel',
    url: 'https://via.placeholder.com/800x800',
    title: 'Product Collection',
    dimensions: '1080x1080',
    size: '3.1MB',
    lastUpdated: '3 days ago',
  },
  {
    id: 'creative-4',
    type: 'story',
    url: 'https://via.placeholder.com/1080x1920',
    title: 'Mobile Story Ad',
    dimensions: '1080x1920',
    size: '2.8MB',
    lastUpdated: '1 day ago',
  },
];

export function CreativeStep() {
  const { data, update } = useCampaignLauncher();
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const selectedCreatives = data.creatives || [];

  const filteredCreatives = mockCreatives.filter(creative =>
    creative.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creative.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCreative = (creativeId: string) => {
    const newCreatives = selectedCreatives.includes(creativeId)
      ? selectedCreatives.filter((id: string) => id !== creativeId)
      : [...selectedCreatives, creativeId];
    update({ creatives: newCreatives });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            // In a real app, you would add the uploaded file to your state/API here
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Reset file input
    e.target.value = '';
  };

  const getTypeIcon = (type: CreativeType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'carousel':
        return <div className="flex">
          <div className="h-5 w-3 bg-blue-400 mr-0.5"></div>
          <div className="h-5 w-3 bg-blue-300 mr-0.5"></div>
          <div className="h-5 w-3 bg-blue-200"></div>
        </div>;
      case 'story':
        return <div className="h-5 w-5 rounded-full bg-gradient-to-br from-pink-500 to-purple-600"></div>;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-10 font-satoshi">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative w-full md:w-96">
          <Input
            type="text"
            placeholder="Search asset repository..."
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
          <input
            type="file"
            id="creative-upload"
            className="hidden"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
          />
          <label
            htmlFor="creative-upload"
            className="flex-1 md:flex-none h-12 px-8 bg-[#F8FAFC] border border-[#F1F5F9] text-[#64748B] hover:text-[#05090E] hover:border-[#1F57F5] rounded-xl flex items-center justify-center gap-2.5 cursor-pointer transition-all font-bold uppercase tracking-wider text-[11px]"
          >
            <Upload className="h-4 w-4" />
            Upload New Asset
          </label>
        </div>
      </div>

      {isUploading && (
        <div className="p-8 bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center text-[12px] font-bold text-[#64748B] uppercase tracking-widest">
            <span>Transmitting asset data...</span>
            <span className="text-[#1F57F5]">{uploadProgress}% COMPLETE</span>
          </div>
          <div className="w-full bg-white border border-[#F1F5F9] rounded-full h-3 overflow-hidden">
            <div
              className="bg-[#1F57F5] h-full transition-all duration-300 shadow-md shadow-[#1F57F5]/20"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredCreatives.map((creative) => (
          <div
            key={creative.id}
            className={cn(
              "group relative bg-white border-2 rounded-[2rem] overflow-hidden transition-all duration-300",
              selectedCreatives.includes(creative.id)
                ? "border-[#1F57F5] shadow-xl shadow-[#1F57F5]/5"
                : "border-[#F1F5F9] hover:border-[#2BAFF2]"
            )}
          >
            <div className="aspect-[4/5] bg-[#F8FAFC] relative overflow-hidden">
              <img
                src={creative.url}
                alt={creative.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-[12px] font-bold">{creative.dimensions} • {creative.size}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCreative(creative.id);
                }}
                className={cn(
                  "absolute top-4 right-4 h-10 w-10 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90",
                  selectedCreatives.includes(creative.id)
                    ? "bg-[#1F57F5] text-white"
                    : "bg-white/90 text-[#A3A3A3] hover:text-[#1F57F5]"
                )}
              >
                {selectedCreatives.includes(creative.id) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-[15px] font-bold text-[#05090E] line-clamp-1">{creative.title}</h4>
                  <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-wider">{creative.type}</p>
                </div>
                <div className="p-2 bg-[#F8FAFC] rounded-lg">
                  {creative.type === 'video' ? <Video className="w-5 h-5 text-[#2BAFF2]" /> : <ImageIcon className="w-5 h-5 text-[#1F57F5]" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}
