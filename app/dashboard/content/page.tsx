"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Wand2, Plus, Sparkles, Type, Video } from "lucide-react"

export default function ContentStudioPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8 font-satoshi pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Neural Content Orchestrator</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F57F5] animate-pulse" />
              <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Semantic Generation Engine</p>
            </div>
          </div>
          <button className="btn-primary h-10 px-5 text-[12px] flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-[14px] font-bold text-[#1F2937] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1F57F5]" /> Creative Parameters
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-[#64748B] uppercase">Content Type</label>
                    <select className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 text-[13px] outline-none focus:border-[#1F57F5]">
                      <option>SEO Strategy & Blog</option>
                      <option>Video Narrative Script</option>
                      <option>Email Nurture Sequence</option>
                      <option>Social Content Calendar</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-[#64748B] uppercase">Tone of Voice</label>
                    <select className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 text-[13px] outline-none focus:border-[#1F57F5]">
                      <option>Professional & Authoritative</option>
                      <option>Friendly & Accessible</option>
                      <option>Bold & Disruptive</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-[#64748B] uppercase">Main Subject</label>
                    <textarea
                      className="w-full h-32 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-[13px] outline-none focus:border-[#1F57F5] resize-none"
                      placeholder="Describe what you want the AI to synthesize..."
                    />
                  </div>
                </div>
              </div>
              <button className="w-full h-11 bg-[#1F57F5] text-white rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#1A4AD1] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1F57F5]/20">
                Engine Content <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview/Output */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-[2rem] h-[600px] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
                  </div>
                  <span className="text-[12px] font-bold text-[#64748B]">creative_draft_01.md</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-[#EFF6FF] text-[#1F57F5] rounded-lg transition-all"><Type className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-[#F8FAFC] text-[#64748B] rounded-lg transition-all"><Video className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex-1 p-8 overflow-y-auto bg-white text-left">
                <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
                  <div className="h-8 bg-[#F1F5F9] rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-[#F8FAFC] rounded" />
                    <div className="h-4 bg-[#F8FAFC] rounded" />
                    <div className="h-4 bg-[#F8FAFC] rounded w-5/6" />
                  </div>
                  <div className="h-48 bg-[#F1F5F9] rounded-2xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-[#F8FAFC] rounded" />
                    <div className="h-4 bg-[#F8FAFC] rounded w-2/3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
