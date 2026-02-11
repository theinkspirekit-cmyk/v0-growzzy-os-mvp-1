"use client"

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import {
  Plus,
  Wand2,
  Copy,
  Trash2,
  Eye,
  Sparkles,
  Layout,
  Target,
  MessageSquare,
  Activity,
  History,
  Lightbulb,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { toast } from "sonner";

const MOCK_ASSETS = [
  { id: '1', title: 'Q1 SaaS Hero Variant', type: 'AD_COPY', platform: 'Meta', status: 'published', content: 'Transform your multichannel productivity with AI-driven intelligence. Scale faster with the first unified Marketing OS.', performance: { reach: 12500, likes: 450, comments: 82 } },
  { id: '2', title: 'LinkedIn B2B Lead Magnet', type: 'LANDING_PAGE', platform: 'LinkedIn', status: 'draft', content: 'The Enterprise Guide to CRM Automation. Download the blueprint for modern marketing teams.', performance: { reach: 0, likes: 0, comments: 0 } },
]

export default function ContentStudioPage() {
  const [assets, setAssets] = useState<any[]>(MOCK_ASSETS);
  const [showGenerator, setShowGenerator] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [form, setForm] = useState({ product: '', benefit: '', audience: '', tone: 'Professional' });
  const [variants, setVariants] = useState<Array<{ id: string; text: string }>>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
    toast.success("Asset deleted");
  };

  const generateCopy = async () => {
    if (!form.product || !form.benefit) {
      toast.error("Missing architectural parameters");
      return;
    }
    setGenLoading(true);
    toast.info("Synthesizing high-fidelity copy...");

    setTimeout(() => {
      setVariants([
        { id: 'v1', text: `Stop manually managing ${form.product}. Our ${form.benefit} technology helps marketing teams scale intelligence 10x faster. 🚀` },
        { id: 'v2', text: `The future of ${form.product} is here. Experience the impact of ${form.benefit} in your multichannel strategy today.` }
      ]);
      setGenLoading(false);
      toast.success("Synthesis complete");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Content Studio</h1>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Asset Management & Synthesis</p>
          </div>
          <button
            onClick={() => setShowGenerator(true)}
            className="enterprise-button h-12 px-8 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Engineer New Asset
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Asset Library', value: assets.length, icon: Layout },
            { label: 'Deployed Assets', value: assets.filter(a => a.status === 'published').length, icon: Activity },
            { label: 'Multichannel Reach', value: '142.8K', icon: History },
          ].map((stat) => (
            <div key={stat.label} className="enterprise-card p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
              </div>
              <div className="w-10 h-10 bg-neutral-50 rounded flex items-center justify-center border border-neutral-100">
                <stat.icon className="w-5 h-5 text-neutral-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.map((asset) => (
            <div key={asset.id} className="enterprise-card group hover:shadow-lg transition-all">
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-50 border border-neutral-200 rounded text-[9px] font-black uppercase tracking-tight">
                    {asset.platform}
                  </div>
                  <button onClick={() => deleteAsset(asset.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-black">{asset.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">{asset.content}</p>
                </div>

                <div className="pt-6 border-t border-neutral-50 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="space-y-0.5 text-left">
                      <p className="text-[9px] text-neutral-400 font-bold uppercase">Reach</p>
                      <p className="text-xs font-bold">{asset.performance.reach / 1000}K</p>
                    </div>
                    <div className="space-y-0.5 text-left">
                      <p className="text-[9px] text-neutral-400 font-bold uppercase">ROI</p>
                      <p className="text-xs font-bold">4.2x</p>
                    </div>
                  </div>
                  <button className="text-[11px] font-bold text-neutral-400 hover:text-black uppercase tracking-widest flex items-center gap-1">
                    Details <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* New Asset Button */}
          <button
            onClick={() => setShowGenerator(true)}
            className="enterprise-card group border-dashed flex flex-col items-center justify-center p-12 text-center hover:border-black hover:bg-neutral-50/50 transition-all opacity-40 hover:opacity-100"
          >
            <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-neutral-400 group-hover:text-black" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest">New Intelligence Asset</p>
          </button>
        </div>

        {/* Generator Sidebar Overlay */}
        {showGenerator && (
          <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-end p-4 antialiased">
            <div className="bg-white w-full max-w-lg h-full rounded-md border border-neutral-200 shadow-xl overflow-hidden animate-in slide-in-from-right duration-300 flex flex-col">
              <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <div className="space-y-0.5 text-left">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Intelligence Architect</h3>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Engine Parameters</p>
                </div>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="text-neutral-400 hover:text-black transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Product Focus</label>
                      <input
                        type="text"
                        placeholder="What are we building content for?"
                        className="enterprise-input text-sm"
                        value={form.product}
                        onChange={(e) => setForm({ ...form, product: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Core Benefit</label>
                      <input
                        type="text"
                        placeholder="Competitive advantage..."
                        className="enterprise-input text-sm"
                        value={form.benefit}
                        onChange={(e) => setForm({ ...form, benefit: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Tone Profile</label>
                      <select
                        className="enterprise-input text-sm h-10"
                        value={form.tone}
                        onChange={(e) => setForm({ ...form, tone: e.target.value })}
                      >
                        <option>Professional</option>
                        <option>Disruptive</option>
                        <option>Direct</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={generateCopy}
                    disabled={genLoading}
                    className="enterprise-button w-full h-12 gap-2"
                  >
                    {genLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Synthesize Assets
                  </button>
                </div>

                {variants.length > 0 && (
                  <div className="space-y-6 pt-10 border-t border-neutral-100 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Precision Results</h4>
                      <div className="flex gap-2">
                        <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} className="text-neutral-400 hover:text-black transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                        <span className="text-[10px] font-bold">{currentIdx + 1} / {variants.length}</span>
                        <button onClick={() => setCurrentIdx(Math.min(variants.length - 1, currentIdx + 1))} className="text-neutral-400 hover:text-black transition-colors"><ChevronRight className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="bg-neutral-900 text-white p-6 rounded-md shadow-xl">
                      <p className="text-sm font-bold leading-relaxed">{variants[currentIdx].text}</p>
                    </div>
                    <button
                      onClick={() => {
                        setAssets([{ id: Date.now().toString(), title: form.product, content: variants[currentIdx].text, status: 'draft', platform: 'Meta', performance: { reach: 0, likes: 0, comments: 0 } }, ...assets]);
                        setShowGenerator(false);
                        toast.success("Intelligence asset synchronized to library");
                      }}
                      className="enterprise-button w-full h-10 bg-neutral-100 text-black border-neutral-200 hover:bg-neutral-200"
                    >
                      Adopt Variant
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

