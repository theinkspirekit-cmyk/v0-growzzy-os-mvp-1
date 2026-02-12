"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard-layout";
import { Plus, Search, Share, Download, Trash2, Target, Users, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";

const audienceTabs = [
  "Lookalikes",
  "Interest",
  "Behavioral",
  "Retargeting",
  "Zero-party",
] as const;

type Tab = typeof audienceTabs[number];

export default function AudienceStudioPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Lookalikes");

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-white font-satoshi">
        {/* Left Panel */}
        <aside className="w-80 border-r border-[#F1F5F9] flex flex-col">
          <div className="p-8 space-y-8 flex-1 overflow-y-auto">
            <div className="space-y-1">
              <h2 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] mb-4">Audience Categories</h2>
              <div className="space-y-1.5 text-left">
                {audienceTabs.map((t) => (
                  <button
                    key={t}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200",
                      activeTab === t
                        ? "bg-[#1F57F5]/5 text-[#1F57F5] shadow-sm ring-1 ring-[#1F57F5]/10"
                        : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#05090E]"
                    )}
                    onClick={() => setActiveTab(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Active Segments</h2>
              <div className="relative">
                <Input
                  placeholder="Filter nodes..."
                  className="pl-10 h-10 border-[#F1F5F9] bg-[#F8FAFC] text-[13px] rounded-lg"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A3A3A3]" />
              </div>
              <div className="h-[40vh] bg-[#F8FAFC] border border-[#F1F5F9] rounded-2xl flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#A3A3A3] border border-[#F1F5F9]">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest leading-relaxed">
                  {activeTab} Index<br />Syncing with Node...
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-[#F1F5F9] bg-[#F8FAFC]/50">
            <button className="w-full h-12 bg-[#1F57F5] text-white rounded-xl text-[13px] font-bold uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all">
              <Plus className="w-5 h-5" />
              New Segment
            </button>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 overflow-y-auto p-12 space-y-12">
          {/* Header */}
          <div className="flex justify-between items-end border-b border-[#F1F5F9] pb-10">
            <div className="space-y-1 text-left">
              <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">{activeTab} Audience Studio</h1>
              <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em]">Active Population: 2.3M Nodes Identifier</p>
            </div>
            <div className="flex gap-3">
              <button className="h-11 px-6 border border-[#F1F5F9] text-[12px] font-bold text-[#64748B] uppercase tracking-wider rounded-xl hover:text-[#05090E] hover:border-[#1F57F5] transition-all flex items-center gap-2">
                <Share className="w-4 h-4" /> Share
              </button>
              <button className="h-11 px-6 border border-[#F1F5F9] text-[12px] font-bold text-[#64748B] uppercase tracking-wider rounded-xl hover:text-[#05090E] hover:border-[#1F57F5] transition-all flex items-center gap-2">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          {/* AI Audience Wizard */}
          <section className="relative group">
            <div className="absolute inset-0 bg-[#00DDFF]/5 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative p-10 border-2 border-dashed border-[#F1F5F9] rounded-[2.5rem] bg-white flex flex-col items-center justify-center text-center space-y-6 hover:border-[#00DDFF] transition-all">
              <div className="w-16 h-16 bg-[#F8FAFC] text-[#00DDFF] rounded-[1.5rem] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-[20px] font-bold text-[#05090E]">Cognitive Audience Architect</h3>
                <p className="text-[14px] text-[#64748B] max-w-md mx-auto">Deploy deep-learning models to identify high-probability converters from your raw dataset.</p>
              </div>
              <button className="h-11 px-8 bg-[#05090E] text-white text-[12px] font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-all">
                Initialize AI Wizard
              </button>
            </div>
          </section>

          {/* Audience Inspector grid */}
          <div className="space-y-6">
            <h2 className="text-[14px] font-bold text-[#05090E] uppercase tracking-[0.2em]">Live Intelligence Matrix</h2>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="p-8 border-2 border-[#F1F5F9] rounded-[2rem] bg-white hover:border-[#2BAFF2] shadow-sm hover:shadow-xl transition-all space-y-4"
                >
                  <div className="w-12 h-12 bg-[#F8FAFC] rounded-2xl flex items-center justify-center text-[#2BAFF2]">
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[16px] font-bold text-[#05090E]">Attribute Matrix {i + 1}</h4>
                    <p className="text-[13px] text-[#64748B]">Operationalizing engagement data nodes...</p>
                  </div>
                  <div className="pt-4 border-t border-[#F1F5F9] flex justify-between items-center text-[12px] font-bold text-[#2BAFF2]">
                    <span>98% CONFIDENCE</span>
                    <span>1.2M NODES</span>
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Global Actions */}
          <div className="flex justify-between items-center p-8 bg-[#05090E] rounded-[2rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1F57F5]/20 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10">
              <h3 className="text-white text-[18px] font-bold">Ready for Deployment?</h3>
              <p className="text-white/60 text-[14px] font-medium">Synchronize this audience set with your active campaign launchers.</p>
            </div>
            <div className="flex gap-4 relative z-10">
              <button className="h-14 px-10 bg-[#1F57F5] text-white text-[13px] font-bold uppercase tracking-widest rounded-xl shadow-xl shadow-[#1F57F5]/20 hover:bg-[#1A4AD1] transition-all">
                Command Force Deployment
              </button>
              <button className="h-14 w-14 border border-white/10 text-white hover:bg-white/10 rounded-xl flex items-center justify-center transition-all">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>

        {/* Right Detail Panel */}
        <aside className="hidden xl:flex w-96 border-l border-[#F1F5F9] flex-col bg-[#F8FAFC]/30">
          <div className="p-10 space-y-10">
            <div className="space-y-4">
              <h2 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Contextual Insights</h2>
              <div className="p-6 bg-white border border-[#F1F5F9] rounded-2xl space-y-6">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">Estimated CPM Impact</p>
                  <p className="text-[24px] font-bold text-[#05090E] tracking-tighter">-$2.40</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-wider">Projected Reach</p>
                  <p className="text-[24px] font-bold text-[#05090E] tracking-tighter">+12%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Growth Pulse</h2>
              <div className="h-48 bg-white border border-[#F1F5F9] rounded-2xl flex items-center justify-center text-[12px] font-bold text-[#A3A3A3] uppercase tracking-widest text-center p-8">
                Data Visualization Engine<br />Coming Soon
              </div>
            </div>
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}
