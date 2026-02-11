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

  // Form State
  const [platform, setPlatform] = useState("Meta")
  const [format, setFormat] = useState("Single Image Ad")
  const [sellingPoint, setSellingPoint] = useState("")
  const [tone, setTone] = useState("Professional")

  const startGeneration = () => {
    if (!sellingPoint.trim()) {
      toast.error("Please describe your product/service first")
      return
    }

    setIsGenerating(true)
    setGenerationStep(1)

    // Simulate step progress
    setTimeout(() => setGenerationStep(2), 1200)
    setTimeout(() => setGenerationStep(3), 2400)
    setTimeout(() => setGenerationStep(4), 3600)
    setTimeout(() => {
      setIsGenerating(false)
      setGenerationStep(0)
      toast.success("AI has generated 3 high-converting variations!")
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
      <div className="w-full h-full min-h-[400px] bg-neutral-900 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-[120px] opacity-50" />
        <div className="relative z-10">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 border-t-2 border-cyan-400/50 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-2 border-r-2 border-blue-500/50 rounded-full animate-spin-reverse-slow"></div>
            <div className="absolute inset-4 border-b-2 border-purple-500/50 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-[25px] animate-pulse" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white z-20" />
          </div>
        </div>
        <div className="mt-10 text-center z-10 px-8">
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">AI is Engineering</h3>
          <p className="text-cyan-200/50 text-sm font-medium tracking-wide uppercase">{currentText}</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 space-y-10 bg-[#fafafa] min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 pb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 tracking-tight">AI Creative Laboratory</h2>
            <p className="text-sm text-neutral-500 mt-1">Engineer high-converting visuals and copy in seconds</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white border border-neutral-200 rounded-xl shadow-sm text-xs font-bold text-neutral-600 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              128 Credits
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Generation Sidebar - Left Area */}
          <div className="w-full lg:w-[400px] flex-shrink-0 space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-xl shadow-neutral-200/40 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 rounded-bl-[100px] -mr-16 -mt-16 group-hover:bg-neutral-100 transition-colors" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Wand2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">Creative Brief</h3>
                    <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">AI Generation Mode</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-neutral-400 uppercase tracking-[0.1em]">Target Platform</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Meta", "Google", "LinkedIn"].map((p) => (
                        <button
                          key={p}
                          onClick={() => setPlatform(p)}
                          className={`py-3 text-xs font-bold rounded-xl border transition-all ${platform === p
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-md shadow-neutral-200"
                              : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                            }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-neutral-400 uppercase tracking-[0.1em]">Ad Format</label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-4 py-3.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-neutral-200 outline-none font-medium transition-all"
                    >
                      <option>Single Image Ad</option>
                      <option>Video / Motion Ad</option>
                      <option>Carousel Gallery</option>
                      <option>Messenger Ad</option>
                    </select>
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-xs font-black text-neutral-400 uppercase tracking-[0.1em]">Brand Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {["Professional", "Witty", "Direct", "Urgent"].map(t => (
                        <button
                          key={t}
                          onClick={() => setTone(t)}
                          className={`px-4 py-2 text-[11px] font-bold rounded-full transition-all ${tone === t
                              ? "bg-neutral-100 text-neutral-900 border border-neutral-300"
                              : "bg-transparent text-neutral-500 border border-transparent hover:bg-neutral-50"
                            }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <label className="text-xs font-black text-neutral-400 uppercase tracking-[0.1em]">Product Description</label>
                    <textarea
                      value={sellingPoint}
                      onChange={(e) => setSellingPoint(e.target.value)}
                      placeholder="Describe what makes your product special (e.g. AI-powered analytics for startups)..."
                      className="w-full px-4 py-4 text-sm bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-neutral-200 outline-none h-40 resize-none font-medium transition-all placeholder:text-neutral-400"
                    />
                  </div>

                  <button
                    onClick={startGeneration}
                    disabled={isGenerating}
                    className="w-full py-4.5 mt-4 bg-neutral-900 text-white rounded-2xl hover:bg-neutral-800 transition-all active:scale-[0.97] flex items-center justify-center gap-3 font-black text-sm shadow-xl shadow-neutral-200 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin text-white/50" /> : <Sparkles className="w-5 h-5 text-amber-400" />}
                    BUILD CREATIVES
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Library / Content Area - Right Side */}
          <div className="flex-1 space-y-8 min-w-0">
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
