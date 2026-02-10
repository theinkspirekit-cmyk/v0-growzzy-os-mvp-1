"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import {
  Sparkles,
  Image as ImageIcon,
  Type,
  LayoutTemplate,
  Wand2,
  Download,
  Share2,
  Copy,
  CheckCircle2,
} from "lucide-react"

const GENERATED_CREATIVES = [
  { id: 1, type: "Meta Feed", headline: "Scale Your Agency with AI", copy: "Stop manually managing ads. Let AI optimize your campaigns 24/7. 🚀", image: "bg-gradient-to-br from-indigo-500 to-purple-600", score: 94 },
  { id: 2, type: "Story Ad", headline: "Marketing on Autopilot", copy: "Get back 20 hours/week. Automate reporting, bid management, and creative testing.", image: "bg-gradient-to-br from-emerald-400 to-teal-600", score: 88 },
  { id: 3, type: "LinkedIn Post", headline: "Enterprise Marketing OS", copy: "The unified platform for modern marketing teams. Integration with all major ad networks.", image: "bg-neutral-800", score: 91 },
]

export default function CreativesPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "library">("generate")

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">AI Ad Creatives</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Generate high-converting ads in seconds</p>
          </div>
          <div className="flex bg-neutral-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("generate")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "generate" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
            >
              Generate
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === "library" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
            >
              Library
            </button>
          </div>
        </div>

        {activeTab === "generate" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                <h3 className="text-base font-semibold text-neutral-900">Creative Settings</h3>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-700">Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Meta", "Google", "LinkedIn"].map((p) => (
                      <button key={p} className="px-3 py-2 text-sm border border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-700">Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Feed Image", "Story", "Carousel", "Text Ad"].map((f) => (
                      <button key={f} className="px-3 py-2 text-sm border border-neutral-200 rounded-lg text-left hover:bg-neutral-50">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-700">Target Audience</label>
                  <input type="text" placeholder="e.g. SaaS Founders, Marketing Directors" className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900" />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-700">Key Benefit / Hook</label>
                  <textarea placeholder="e.g. Save 20 hours a week on reporting" className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 h-24 resize-none" />
                </div>

                <button className="w-full py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 font-medium">
                  <Wand2 className="w-4 h-4" />
                  Generate 3 Variations
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-neutral-900">Generated Variations</h3>
                <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded-full">3 credits remaining</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {GENERATED_CREATIVES.map((creative) => (
                  <div key={creative.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">
                    {/* Visual Preview */}
                    <div className={`h-40 ${creative.image} flex items-center justify-center`}>
                      <ImageIcon className="w-8 h-8 text-white/50" />
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{creative.type}</span>
                          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            <Sparkles className="w-3 h-3" />
                            {creative.score}
                          </div>
                        </div>
                        <h4 className="font-bold text-neutral-900 leading-tight">{creative.headline}</h4>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">{creative.copy}</p>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <button className="flex-1 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-50 rounded hover:bg-neutral-100 flex items-center justify-center gap-1.5">
                          <Download className="w-3.5 h-3.5" /> Save
                        </button>
                        <button className="flex-1 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-50 rounded hover:bg-neutral-100 flex items-center justify-center gap-1.5">
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutTemplate className="w-6 h-6 text-neutral-400" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900">Creative Library</h3>
            <p className="text-sm text-neutral-500 mt-1">Your saved templates and past generations will appear here.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
