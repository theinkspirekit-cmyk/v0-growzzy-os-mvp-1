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
  Layers,
  Zap,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MOCK_ASSETS = [
  { id: '1', title: 'Q1 Enterprise SaaS Hero', type: 'AD_COPY', platform: 'Meta', status: 'published', content: 'Transform your multichannel productivity with AI-driven intelligence. Scale faster with the first unified Marketing OS.', performance: { reach: 12500, likes: 450, comments: 82 }, roi: "4.8x" },
  { id: '2', title: 'LinkedIn B2B Lead Magnet', type: 'LANDING_PAGE', platform: 'LinkedIn', status: 'draft', content: 'The Enterprise Guide to CRM Automation. Download the blueprint for modern marketing teams and scale ROI.', performance: { reach: 0, likes: 0, comments: 0 }, roi: "3.2x" },
]

export default function ContentStudioPage() {
  const [assets, setAssets] = useState<any[]>(MOCK_ASSETS);
  const [showGenerator, setShowGenerator] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [form, setForm] = useState({ product: '', benefit: '', audience: '', tone: 'PRO' });
  const [variants, setVariants] = useState<Array<{ id: string; text: string }>>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
    toast.success("Asset purged from matrix");
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
        { id: 'v1', text: `Stop manually managing ${form.product}. Our ${form.benefit} technology helps enterprise marketing teams scale intelligence 10x faster with unified orchestration.` },
        { id: 'v2', text: `The future of ${form.product} is here. Experience the impact of autonomous ${form.benefit} in your multichannel strategy and drive 30% higher conversion today.` }
      ]);
      setGenLoading(false);
      toast.success("Synthesis complete");
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto pb-40 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F1F5F9] pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Content Studio</h1>
            <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em]">High-Fidelity Asset Creation Engine</p>
          </div>
          <button
            onClick={() => setShowGenerator(true)}
            className="h-12 px-10 bg-[#1F57F5] text-white text-[12px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all flex items-center gap-3 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Engineer New Asset
          </button>
        </div>

        {/* Global Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Strategic Library', value: assets.length, icon: Layers, color: '#1F57F5' },
            { label: 'Deployed Nodes', value: assets.filter(a => a.status === 'published').length, icon: Activity, color: '#00DDFF' },
            { label: 'Network Reach', value: '142.8K', icon: Globe, color: '#2BAFF2' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-8 border-2 border-[#F1F5F9] rounded-[2rem] hover:border-[#1F57F5] transition-all duration-300 shadow-sm hover:shadow-xl group flex items-center justify-between">
              <div className="space-y-1 text-left">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.15em]">{stat.label}</p>
                <p className="text-[28px] font-bold text-[#05090E] tracking-tight">{stat.value}</p>
              </div>
              <div className="w-14 h-14 bg-[#F8FAFC] rounded-2xl flex items-center justify-center transition-all group-hover:scale-110" style={{ color: stat.color }}>
                <stat.icon className="w-7 h-7" />
              </div>
            </div>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-white rounded-[2.5rem] border-2 border-[#F1F5F9] hover:border-[#1F57F5] transition-all duration-500 shadow-sm hover:shadow-2xl group flex flex-col p-10 relative overflow-hidden">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#1F57F5] uppercase tracking-widest px-3 py-1 bg-[#1F57F5]/5 border border-[#1F57F5]/10 rounded-lg">{asset.platform}</span>
                    <span className={cn(
                      "w-2 h-2 rounded-full",
                      asset.status === 'published' ? "bg-[#00DDFF] animate-pulse" : "bg-[#64748B]"
                    )} />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-[#A3A3A3] hover:text-[#05090E] transition-colors"><Copy className="w-4 h-4" /></button>
                    <button onClick={() => deleteAsset(asset.id)} className="p-2 text-[#A3A3A3] hover:text-[#F43F5E] transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <h3 className="text-[20px] font-bold text-[#05090E] group-hover:text-[#1F57F5] transition-colors leading-tight">{asset.title}</h3>
                  <p className="text-[14px] text-[#64748B] font-medium leading-relaxed line-clamp-4">{asset.content}</p>
                </div>

                <div className="pt-8 border-t border-[#F1F5F9] flex items-center justify-between">
                  <div className="flex gap-8">
                    <div className="space-y-1 text-left">
                      <p className="text-[10px] text-[#A3A3A3] font-bold uppercase tracking-wider">Reach Index</p>
                      <p className="text-[15px] font-bold text-[#05090E]">{asset.performance.reach > 0 ? `${asset.performance.reach / 1000}K` : '--'}</p>
                    </div>
                    <div className="space-y-1 text-left">
                      <p className="text-[10px] text-[#A3A3A3] font-bold uppercase tracking-wider">Yield ROI</p>
                      <p className="text-[15px] font-bold text-[#1F57F5]">{asset.roi}</p>
                    </div>
                  </div>
                  <button className="h-10 px-5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl text-[11px] font-bold text-[#05090E] uppercase tracking-widest hover:bg-[#1F57F5] hover:text-white hover:border-[#1F57F5] transition-all flex items-center gap-2">
                    Review <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* New Asset Trigger */}
          <button
            onClick={() => setShowGenerator(true)}
            className="rounded-[2.5rem] border-2 border-dashed border-[#F1F5F9] bg-[#F8FAFC]/30 flex flex-col items-center justify-center p-12 text-center group hover:border-[#2BAFF2] hover:bg-white transition-all cursor-pointer min-h-[380px]"
          >
            <div className="w-16 h-16 bg-white border-2 border-[#F1F5F9] rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-[#1F57F5] group-hover:bg-[#1F57F5] group-hover:text-white transition-all shadow-sm">
              <Plus className="w-8 h-8 text-[#A3A3A3] group-hover:text-white" />
            </div>
            <div className="space-y-2">
              <p className="text-[12px] font-bold text-[#05090E] uppercase tracking-[0.2em]">Synthesize New Record</p>
              <p className="text-[13px] text-[#64748B] font-medium max-w-[200px]">Initialize the Architect to engineer fresh intelligence assets.</p>
            </div>
          </button>
        </div>

        {/* Intelligence Architect Sidebar */}
        {showGenerator && (
          <div className="fixed inset-0 z-[1000] bg-[#05090E]/80 backdrop-blur-xl flex items-center justify-end p-6">
            <div className="bg-white w-full max-w-xl h-full rounded-[3.5rem] border-2 border-white/20 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-500 flex flex-col">
              <div className="px-12 py-10 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]/50">
                <div className="space-y-1.5 text-left">
                  <h3 className="text-[20px] font-bold text-[#05090E]">Intelligence Architect</h3>
                  <p className="text-[11px] text-[#64748B] font-bold uppercase tracking-[0.3em]">Neural Engineering Parameters</p>
                </div>
                <button
                  onClick={() => setShowGenerator(false)}
                  className="p-3.5 hover:bg-white rounded-2xl text-[#64748B] shadow-sm transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 space-y-12">
                <div className="space-y-10">
                  <div className="space-y-8">
                    <div className="space-y-3 text-left">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] pl-2">Product DNA Focus</label>
                      <input
                        type="text"
                        placeholder="Define the core product entity..."
                        className="w-full h-16 px-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[16px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                        value={form.product}
                        onChange={(e) => setForm({ ...form, product: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3 text-left">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] pl-2">Primary Value Vector</label>
                      <input
                        type="text"
                        placeholder="Define the competitive advantage..."
                        className="w-full h-16 px-8 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[16px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all placeholder:text-[#A3A3A3]"
                        value={form.benefit}
                        onChange={(e) => setForm({ ...form, benefit: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3 text-left">
                      <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] pl-2">Synthesis Tone</label>
                      <div className="grid grid-cols-3 gap-3">
                        {["PRO", "URGENT", "DIRECT"].map(t => (
                          <button
                            key={t}
                            onClick={() => setForm({ ...form, tone: t })}
                            className={cn(
                              "h-12 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all border-2",
                              form.tone === t
                                ? "bg-[#05090E] text-white border-[#05090E] shadow-lg shadow-[#05090E]/20"
                                : "bg-white text-[#64748B] border-[#F1F5F9] hover:border-[#1F57F5] hover:text-[#05090E]"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={generateCopy}
                    disabled={genLoading}
                    className="w-full h-20 bg-[#1F57F5] text-white text-[15px] font-bold uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-[#1F57F5]/30 hover:bg-[#1A4AD1] transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                  >
                    {genLoading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Sparkles className="w-7 h-7" />}
                    Synthesize Content Matrix
                  </button>
                </div>

                {variants.length > 0 && (
                  <div className="space-y-8 pt-12 border-t border-[#F1F5F9] animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#00DDFF]" />
                        <h4 className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#A3A3A3]">High-Precision Result</h4>
                      </div>
                      <div className="flex gap-4 items-center">
                        <button onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))} className="p-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl hover:text-[#1F57F5] transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <span className="text-[12px] font-bold text-[#05090E]">{currentIdx + 1} / {variants.length}</span>
                        <button onClick={() => setCurrentIdx(Math.min(variants.length - 1, currentIdx + 1))} className="p-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl hover:text-[#1F57F5] transition-colors"><ChevronRight className="w-5 h-5" /></button>
                      </div>
                    </div>
                    <div className="bg-[#05090E] text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1F57F5]/20 rounded-full -mr-16 -mt-16 blur-2xl" />
                      <p className="text-[16px] font-bold leading-relaxed relative z-10">{variants[currentIdx].text}</p>
                    </div>
                    <button
                      onClick={() => {
                        setAssets([{ id: Date.now().toString(), title: form.product, content: variants[currentIdx].text, status: 'draft', platform: 'Meta', performance: { reach: 0, likes: 0, comments: 0 }, roi: "Pending" }, ...assets]);
                        setShowGenerator(false);
                        toast.success("Intelligence asset synchronized to library");
                      }}
                      className="w-full h-16 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[#05090E] text-[13px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:border-[#1F57F5] hover:text-[#1F57F5] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-sm"
                    >
                      <Plus className="w-5 h-5" /> Adopt Architecture Variant
                    </button>
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <ShieldCheck className="w-4 h-4 text-[#00DDFF]" />
                      <span className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-[0.2em]">Verified Compliance v4.2</span>
                    </div>
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
