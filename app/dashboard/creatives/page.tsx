"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import {
  Sparkles,
  Wand2,
  Loader2,
  LayoutTemplate,
  Download,
  Copy,
  Image as ImageIcon,
  ChevronRight,
  Zap,
  ArrowRight,
  X,
} from "lucide-react"
import { toast } from "sonner"

const GENERATED_CREATIVES = [
  { id: 1, type: "Meta Feed", headline: "Scale Your Agency with AI", copy: "Stop manually managing ads. Let AI optimize your campaigns 24/7. 🚀", image: "bg-neutral-900", score: 94 },
  { id: 2, type: "Story Ad", headline: "Marketing on Autopilot", copy: "Get back 20 hours/week. Automate reporting, bid management, and creative testing.", image: "bg-neutral-100", score: 88 },
  { id: 3, type: "LinkedIn Post", headline: "Enterprise Marketing OS", copy: "The unified platform for modern marketing teams. Integration with all major ad networks.", image: "bg-neutral-50", score: 91 },
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
      toast.error("Please provide a product description first")
      return
    }

    setIsGenerating(true)
    setGenerationStep(1)

    // Simulate step progress
    setTimeout(() => setGenerationStep(2), 1000)
    setTimeout(() => setGenerationStep(3), 2000)
    setTimeout(() => setGenerationStep(4), 3000)
    setTimeout(() => {
      setIsGenerating(false)
      setGenerationStep(0)
      toast.success("Intelligence Engine generated 3 new variations")
    }, 4000)
  }

  const renderProgress = () => {
    const steps = [
      "Analyzing Brand Guidelines",
      "Auditing Competitor Hooks",
      "Drafting High-ROI Copy",
      "Synthesizing Visual Layouts"
    ]
    const current = steps[generationStep - 1] || "Initializing Engine"

    return (
      <div className="enterprise-card h-full min-h-[450px] bg-black text-white flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="w-24 h-24 border-2 border-white/10 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold tracking-tight">AI Engineering in Progress</h3>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{current}</p>
        </div>
        <div className="w-48 h-1 bg-neutral-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-500"
            style={{ width: `${(generationStep / 4) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 space-y-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Creative Architect</h1>
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">High-fidelity asset generation</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-md text-[11px] font-bold text-neutral-600 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              128 Credits Available
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Generation Sidebar */}
          <div className="w-full lg:w-[380px] shrink-0 space-y-8">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded flex items-center justify-center shadow-sm">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tight">Intelligence Brief</h3>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Configure Parameters</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Target Channel</label>
                  <div className="grid grid-cols-3 gap-1">
                    {["Meta", "Google", "LinkedIn"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`py-2 text-[11px] font-bold border transition-all rounded-md ${platform === p
                          ? "bg-black text-white border-black"
                          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Ad Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="enterprise-input text-xs h-10"
                  >
                    <option>Single Image Ad</option>
                    <option>Video / Motion Ad</option>
                    <option>Carousel Gallery</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Brand Archetype</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["Professional", "Disruptive", "Direct", "Urgent"].map(t => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`px-3 py-1.5 text-[10px] font-bold border transition-all rounded-full ${tone === t
                          ? "bg-black text-white border-black"
                          : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-900"
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Intelligence Requirements</label>
                  <textarea
                    value={sellingPoint}
                    onChange={(e) => setSellingPoint(e.target.value)}
                    placeholder="Describe your product's core value proposition..."
                    className="enterprise-input text-xs h-32 resize-none py-3"
                  />
                </div>

                <button
                  onClick={startGeneration}
                  disabled={isGenerating}
                  className="enterprise-button w-full h-12 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Synthesize Assets
                </button>
              </div>
            </div>
          </div>

          {/* Library / Results */}
          <div className="flex-1 space-y-8 min-w-0">
            {isGenerating ? (
              renderProgress()
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4 text-neutral-400" />
                    <h3 className="text-sm font-bold uppercase tracking-tight">Intelligence Library</h3>
                  </div>
                  <button className="text-[10px] font-bold text-neutral-400 hover:text-black uppercase tracking-widest flex items-center gap-1 transition-colors">
                    View Complete History <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {savedCreatives.map((creative) => (
                    <div key={creative.id} className="enterprise-card group overflow-hidden hover:shadow-lg transition-all">
                      <div className={`h-48 ${creative.image} flex items-center justify-center border-b border-neutral-100 relative`}>
                        <ImageIcon className="w-8 h-8 text-neutral-200 group-hover:scale-110 transition-transform" />
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 bg-white border border-neutral-200 rounded text-[9px] font-black uppercase tracking-tight">
                          {creative.score} Confidence
                        </div>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{creative.type}</span>
                          <button className="p-1 text-neutral-400 hover:text-black transition-colors"><X className="w-4 h-4" /></button>
                        </div>

                        <div className="space-y-1">
                          <h4 className="font-bold text-neutral-900 leading-tight text-lg">{creative.headline}</h4>
                          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{creative.copy}</p>
                        </div>

                        <div className="pt-4 flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(creative.copy)
                              toast.success("Asset copy synchronized to clipboard")
                            }}
                            className="flex-1 enterprise-button bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200 text-[11px] h-9"
                          >
                            <Copy className="w-3.5 h-3.5" /> Synchronize
                          </button>
                          <button className="enterprise-button text-[11px] h-9 px-4">
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty Slate */}
                  <div className="md:col-span-2 border border-dashed border-neutral-200 rounded p-12 flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Execute architect to expand library</p>
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
