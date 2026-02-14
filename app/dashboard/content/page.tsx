"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { Wand2, Target, Video, Type } from "lucide-react"

export default function ContentStudioPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-100px)] items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 animate-in zoom-in duration-500">
          <Wand2 className="w-10 h-10 text-indigo-600" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-bold text-[#1F2937]">Content Studio Coming Soon</h1>
          <p className="text-[#64748B] text-sm leading-relaxed">
            The advanced content orchestration engine is currently being provisioned.
            This module will allow for long-form content generation, video scripting, and cross-platform localization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mt-8">
          {[
            { label: "Blog & SEO", icon: Type },
            { label: "Video Scripts", icon: Video },
            { label: "Email Sequences", icon: Target },
          ].map(f => (
            <div key={f.label} className="p-4 border border-[#E2E8F0] rounded-lg bg-white flex flex-col items-center gap-3 opacity-60">
              <f.icon className="w-6 h-6 text-[#94A3B8]" />
              <span className="text-sm font-semibold text-[#64748B]">{f.label}</span>
            </div>
          ))}
        </div>

        <button className="px-5 py-2.5 bg-[#1F2937] text-white text-sm font-medium rounded-md hover:bg-black transition-all">
          Notify When Ready
        </button>
      </div>
    </DashboardLayout>
  )
}
