"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  Sparkles,
  Wand2,
  CheckCircle2,
  Loader2,
  LayoutTemplate,
  Download,
  Copy,
  Image as ImageIcon,
  ChevronRight,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

const GENERATED_CREATIVES = [
  { id: 1, type: "Meta Feed", headline: "Scale Your Agency with AI", copy: "Stop manually managing ads. Let AI optimize your campaigns 24/7. 🚀", image: "bg-gradient-to-br from-indigo-500 to-purple-600", score: 94 },
  { id: 2, type: "Story Ad", headline: "Marketing on Autopilot", copy: "Get back 20 hours/week. Automate reporting, bid management, and creative testing.", image: "bg-gradient-to-br from-emerald-400 to-teal-600", score: 88 },
  { id: 3, type: "LinkedIn Post", headline: "Enterprise Marketing OS", copy: "The unified platform for modern marketing teams. Integration with all major ad networks.", image: "bg-neutral-800", score: 91 },
]

export default function CreativesPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [savedCreatives, setSavedCreatives] = useState(GENERATED_CREATIVES)

  const startGeneration = () => {
    setIsGenerating(true)
    setGenerationStep(1)

    // Simulate step progress
    setTimeout(() => setGenerationStep(2), 1200)
    setTimeout(() => setGenerationStep(3), 2400)
    setTimeout(() => setGenerationStep(4), 3600)
    setTimeout(() => {
      setIsGenerating(false)
      setGenerationStep(0)
      // In a real app we'd fetch newly generated ones here
    }, 4500)
  }

  const renderGenerationProgress = () => {
    const texts = [
      "Analyzing your brand profile...",
      "Analyzing competitors & winning hooks...",
      "Generating high-ROI ad copy...",
      "Rendering visual variations..."
    ]
    const currentText = texts[generationStep - 1] || "Booting AI Creative Engine..."

    return (
      <div className="w-full h-full min-h-[400px] bg-neutral-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center border border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-3xl opacity-50" />
        <div className="relative z-10 scale-90">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-2 border-cyan-400/50 rounded-full animate-[spin_4s_linear_infinite]" style={{ transform: "rotateX(65deg) rotateY(15deg)" }}></div>
            <div className="absolute inset-0 border-2 border-blue-500/50 rounded-full animate-[spin_6s_linear_infinite_reverse]" style={{ transform: "rotateX(65deg) rotateY(120deg)" }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-[20px] animate-pulse" />
          </div>
        </div>
        <div className="mt-8 text-center z-10 px-6">
          <h3 className="text-xl font-bold text-white mb-2 animate-pulse">AI is Thinking</h3>
          <p className="text-cyan-200/60 text-xs font-light tracking-wide">{currentText}</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">AI Ad Creatives</h2>
            <p className="text-sm text-neutral-500 mt-1">Generate and manage high-converting ad assets</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-neutral-400 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-100">
              <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
              128 Credits Available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Generation Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900">Creative Lab</h3>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Target Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Meta", "Google", "LinkedIn"].map((p) => (
                      <button key={p} className="py-2.5 text-xs font-medium border border-neutral-200 rounded-xl hover:border-neutral-900 hover:bg-neutral-50 transition-all focus:ring-2 focus:ring-neutral-200">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Ad Format</label>
                  <select className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-200 transition-all">
                    <option>Single Image Ad</option>
                    <option>Video / Motion Ad</option>
                    <option>Carousel Gallery</option>
                    <option>Messenger Ad</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Key Selling Point</label>
                  <textarea
                    placeholder="Describe what makes your product/service special..."
                    className="w-full px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-200 h-32 resize-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Brand Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {["Professional", "Witty", "Direct", "Urgent"].map(tone => (
                      <button key={tone} className="px-3 py-1.5 text-[11px] font-medium bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 transition-colors">
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startGeneration}
                  disabled={isGenerating}
                  className="w-full py-4 mt-4 bg-neutral-900 text-white rounded-2xl hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-bold shadow-xl shadow-neutral-200 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-400" />}
                  Generate My Ad
                </button>
              </div>
            </div>
          </div>

          {/* Results & Library Section */}
          <div className="lg:col-span-8 space-y-8">
            {isGenerating ? (
              renderGenerationProgress()
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate className="w-5 h-5 text-neutral-400" />
                    <h3 className="text-base font-semibold text-neutral-900">Generation History & Library</h3>
                  </div>
                  <button className="text-xs font-medium text-neutral-500 hover:text-neutral-900 flex items-center gap-1 transition-colors">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  {savedCreatives.map((creative) => (
                    <div key={creative.id} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden group hover:shadow-xl hover:border-neutral-300 transition-all duration-500">
                      {/* Visual Preview */}
                      <div className={`h-56 ${creative.image} flex items-center justify-center relative`}>
                        <ImageIcon className="w-10 h-10 text-white/30 group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white text-neutral-900">
                            <ImageIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{creative.type}</span>
                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-100">
                            <Sparkles className="w-3 h-3" />
                            {creative.score} AI SCORE
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-neutral-900 leading-tight text-xl mb-2">{creative.headline}</h4>
                          <p className="text-[13px] text-neutral-500 leading-relaxed line-clamp-3">{creative.copy}</p>
                        </div>

                        <div className="pt-6 border-t border-neutral-50 flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                          <button className="flex-1 py-3 text-xs font-bold text-neutral-700 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-center gap-2 transition-all active:scale-95 border border-neutral-200/50">
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(creative.copy)
                              toast.success("Copy copied to clipboard!")
                            }}
                            className="flex-1 py-3 text-xs font-bold text-neutral-700 bg-neutral-50 rounded-xl hover:bg-neutral-100 flex items-center justify-center gap-2 transition-all active:scale-95 border border-neutral-200/50"
                          >
                            <Copy className="w-3.5 h-3.5" /> Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty Slate Placeholder */}
                  <div className="md:col-span-2 border-2 border-dashed border-neutral-100 rounded-2xl p-12 flex flex-col items-center justify-center text-center opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                      <Zap className="w-8 h-8 text-neutral-300" />
                    </div>
                    <p className="text-sm font-medium text-neutral-400">Run more experiments to grow your library</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
