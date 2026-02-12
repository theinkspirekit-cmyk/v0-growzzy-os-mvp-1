"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
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
  Plus,
  Rocket,
  Palette,
  Layers,
  ShieldCheck,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
]

export default function CreativesPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [savedCreatives, setSavedCreatives] = useState<any[]>([])

  // Form State
  const [platform, setPlatform] = useState("Meta")
  const [format, setFormat] = useState("SINGLE_IMAGE_ENTITY")
  const [sellingPoint, setSellingPoint] = useState("")
  const [tone, setTone] = useState("PRO")

  useEffect(() => {
    // Initial load
    setSavedCreatives([
      { id: 101, type: "Meta Feed", headline: "Scale Agency ROI with AI", copy: "Stop manually managing bids. Let our neural engine optimize your 24/7 client performance.", image: MOCK_IMAGES[0], score: 94 },
      { id: 102, type: "LinkedIn Post", headline: "Enterprise Marketing OS", copy: "The unified operational layer for modern CMOs. Real-time multi-platform attribution.", image: MOCK_IMAGES[1], score: 88 },
    ])
  }, [])

  const startGeneration = () => {
    if (!sellingPoint.trim()) {
      toast.error("Brief initialization required")
      return
    }

    setIsGenerating(true)
    setGenerationStep(1)

    // Simulate cognitive steps
    const timers = [
      setTimeout(() => setGenerationStep(2), 1200),
      setTimeout(() => setGenerationStep(3), 2400),
      setTimeout(() => setGenerationStep(4), 3600),
      setTimeout(() => {
        setIsGenerating(false)
        setGenerationStep(0)
        const newCreative = {
          id: Date.now(),
          type: `${platform} ${format.replace(/_/g, ' ')}`,
          headline: `Optimized ${platform} Solution`,
          copy: sellingPoint.length > 50 ? sellingPoint.substring(0, 100) + "..." : "High-performance creative synthesized from behavioral audit.",
          image: MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
          score: Math.floor(Math.random() * 15) + 80
        }
        setSavedCreatives(prev => [newCreative, ...prev])
        toast.success("Intelligence Engine synthesized 3 new variations")
      }, 4800)
    ]

    return () => timers.forEach(clearTimeout)
  }

  const renderProgress = () => {
    const steps = [
      "Analyzing Brand DNA & Market Positioning",
      "Auditing Competitor Attribution Hooks",
      "Synthesizing Neural-Network Copy Options",
      "Finalizing Visual Alignment Layers"
    ]
    const current = steps[generationStep - 1] || "Initializing Cognitive Brain"

    return (
      <div className="h-full min-h-[600px] bg-[#05090E] rounded-[3rem] text-white flex flex-col items-center justify-center space-y-12 animate-in fade-in duration-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1F57F5]/20 rounded-full -mr-48 -mt-48 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00DDFF]/10 rounded-full -ml-48 -mb-48 blur-[100px]" />

        <div className="relative z-10">
          <div className="w-40 h-40 border-2 border-white/5 rounded-[2.5rem] flex items-center justify-center relative bg-white/5 backdrop-blur-3xl">
            <Sparkles className="w-12 h-12 text-[#1F57F5] animate-pulse" />
            <div className="absolute inset-x-[-10px] inset-y-[-10px] border-t-2 border-[#1F57F5] rounded-[3rem] animate-spin duration-[3000ms]" />
            <div className="absolute inset-x-2 inset-y-2 border-r-2 border-[#00DDFF]/30 rounded-[2rem] animate-reverse-spin duration-[5000ms]" />
          </div>
        </div>

        <div className="text-center space-y-4 relative z-10 px-12">
          <p className="text-[12px] font-bold text-[#1F57F5] uppercase tracking-[0.4em] mb-4">Neural Architecture v9.2</p>
          <h3 className="text-[32px] font-bold tracking-tight">Synthesizing Creative Matrix</h3>
          <p className="text-[14px] font-medium text-white/40 uppercase tracking-widest animate-pulse h-6">{current}</p>
        </div>

        <div className="w-80 h-1.5 bg-white/5 rounded-full overflow-hidden relative z-10">
          <div
            className="h-full bg-[#1F57F5] transition-all duration-[1200ms] ease-out shadow-[0_0_20px_rgba(31,87,245,0.5)]"
            style={{ width: `${(generationStep / 4) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-8 lg:p-12 bg-white min-h-[calc(100vh-64px)] space-y-12 pb-32 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#F1F5F9] pb-10 gap-6">
          <div className="space-y-1 text-left">
            <h1 className="text-[32px] font-bold text-[#05090E] tracking-tight">Creative Laboratory</h1>
            <p className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.2em] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#1F57F5]" />
              HIGH-FIDELITY ASSET SYNTHESIS
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-6 py-2.5 bg-[#F8FAFC] border border-[#F1F5F9] rounded-xl text-[12px] font-bold uppercase tracking-widest text-[#05090E] shadow-sm">
              <Zap className="w-4 h-4 text-[#FFB800]" /> 1,240 COGNITIVE CREDITS
            </div>
            <button className="h-12 px-8 border border-[#F1F5F9] text-[12px] font-bold text-[#64748B] uppercase tracking-wider rounded-xl hover:text-[#05090E] hover:border-[#1F57F5] transition-all flex items-center gap-3">
              <Layers className="w-5 h-5" /> Library
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-16 items-start">
          {/* Generation Workspace */}
          <div className="w-full xl:w-[460px] shrink-0 space-y-10 group">
            <div className="bg-white p-12 space-y-10 rounded-[2.5rem] border-2 border-[#F1F5F9] hover:border-[#1F57F5] transition-all duration-300 shadow-sm hover:shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-[#05090E] rounded-2xl flex items-center justify-center shadow-xl shadow-[#05090E]/10">
                  <Wand2 className="w-7 h-7 text-[#1F57F5]" />
                </div>
                <div className="text-left space-y-1">
                  <h3 className="text-[18px] font-bold text-[#05090E]">Brief Architect</h3>
                  <p className="text-[12px] text-[#64748B] font-bold uppercase tracking-widest">Cognitive Configuration</p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="space-y-4 text-left">
                  <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Deployment Channel</label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Meta", "Google", "LinkedIn"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={cn(
                          "h-12 text-[11px] font-bold uppercase tracking-widest transition-all rounded-xl border-2",
                          platform === p
                            ? "bg-[#05090E] text-white border-[#05090E] shadow-lg shadow-[#05090E]/10"
                            : "bg-white text-[#64748B] border-[#F1F5F9] hover:border-[#2BAFF2] hover:text-[#05090E]"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Asset Geometry</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full h-14 px-6 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[13px] font-bold rounded-2xl focus:border-[#1F57F5] outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="SINGLE_IMAGE_ENTITY">SINGLE IMAGE ENTITY</option>
                    <option value="MOTION_VIDEO_VECTOR">MOTION VIDEO VECTOR</option>
                    <option value="CAROUSEL_HIERARCHY">CAROUSEL HIERARCHY</option>
                  </select>
                </div>

                <div className="space-y-4 text-left">
                  <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Synthesis Tone</label>
                  <div className="flex flex-wrap gap-2">
                    {["PRO", "DISRUPTIVE", "DIRECT", "URGENT"].map(t => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={cn(
                          "px-6 py-2.5 text-[10px] font-bold transition-all rounded-lg border-2 uppercase tracking-wider",
                          tone === t
                            ? "bg-[#1F57F5] text-white border-[#1F57F5] shadow-lg shadow-[#1F57F5]/20"
                            : "bg-white text-[#64748B] border-[#F1F5F9] hover:border-[#1F57F5] hover:text-[#1F57F5]"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <label className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Market DNA (Brief)</label>
                  <textarea
                    value={sellingPoint}
                    onChange={(e) => setSellingPoint(e.target.value)}
                    placeholder="DEFINE THE PRODUCT DNA AND MARKET VALUE PROPOSITION..."
                    className="w-full min-h-[160px] p-6 bg-[#F8FAFC] border-2 border-[#F1F5F9] text-[14px] font-medium leading-relaxed rounded-2xl focus:border-[#1F57F5] outline-none transition-all resize-none placeholder:text-[#A3A3A3]"
                  />
                </div>

                <button
                  onClick={startGeneration}
                  disabled={isGenerating}
                  className="w-full h-16 bg-[#1F57F5] text-white text-[14px] font-bold uppercase tracking-[0.3em] rounded-2xl hover:bg-[#1A4AD1] transition-all flex items-center justify-center gap-4 shadow-xl shadow-[#1F57F5]/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                  Finalize Synthesis
                </button>
              </div>
            </div>

            <div className="p-10 border-2 border-[#F1F5F9] rounded-[2.5rem] text-left bg-[#F8FAFC]/50 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-[#00DDFF] shrink-0" />
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-[#A3A3A3] uppercase tracking-widest">Operational Compliance</p>
                <p className="text-[13px] text-[#64748B] font-medium leading-relaxed">Assets are pre-audited against platform protocols for 99.8% approval probability.</p>
              </div>
            </div>
          </div>

          {/* Results Gallery */}
          <div className="flex-1 space-y-12 min-w-0">
            {isGenerating ? (
              renderProgress()
            ) : (
              <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-8 px-4">
                  <div className="flex items-center gap-4">
                    <LayoutTemplate className="w-6 h-6 text-[#A3A3A3]" />
                    <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[#05090E]">Audited Asset Stream</h3>
                  </div>
                  <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-[#A3A3A3]">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00DDFF] animate-pulse" />
                      Intelligence Sync: Online
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {savedCreatives.map((creative) => (
                    <div key={creative.id} className="bg-white rounded-[2.5rem] border-2 border-[#F1F5F9] hover:border-[#1F57F5] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl group">
                      <div className="aspect-video relative bg-[#F8FAFC] overflow-hidden">
                        <img
                          src={creative.image}
                          alt="AI Generated"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#05090E]/60 to-transparent" />
                        <div className="absolute top-6 right-6 flex items-center gap-2.5 px-4 py-2 bg-[#05090E]/80 backdrop-blur-xl border border-white/10 rounded-xl text-[11px] font-bold text-white uppercase tracking-widest shadow-2xl">
                          <Sparkles className="w-4 h-4 text-[#1F57F5]" />
                          {creative.score} Performance Index
                        </div>
                      </div>

                      <div className="p-10 space-y-8 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.2em] px-4 py-1.5 bg-[#F8FAFC] rounded-full border border-[#F1F5F9]">{creative.type}</span>
                          <button className="p-2.5 text-[#A3A3A3] hover:text-[#F43F5E] hover:bg-[#F43F5E]/5 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-[22px] font-bold text-[#05090E] leading-tight tracking-tight group-hover:text-[#1F57F5] transition-colors">{creative.headline}</h4>
                          <p className="text-[14px] text-[#64748B] leading-relaxed font-medium">{creative.copy}</p>
                        </div>

                        <div className="pt-8 flex items-center gap-4 border-t border-[#F1F5F9]">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(creative.copy)
                              toast.success("Cognitive copy synchronized")
                            }}
                            className="flex-1 h-14 bg-[#F8FAFC] border border-[#F1F5F9] text-[#05090E] text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#1F57F5] hover:text-white hover:border-[#1F57F5] transition-all flex items-center justify-center gap-3 active:scale-95"
                          >
                            <Copy className="w-4 h-4" /> Transmit Data
                          </button>
                          <button className="h-14 w-14 bg-[#05090E] text-white rounded-xl hover:bg-neutral-800 transition-all shadow-xl shadow-[#05090E]/10 flex items-center justify-center active:scale-95">
                            <Rocket className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty Slot */}
                  <div className="lg:col-span-2 p-12 border-2 border-dashed border-[#F1F5F9] rounded-[3rem] bg-[#F8FAFC]/30 flex flex-col items-center justify-center text-center group hover:border-[#2BAFF2] transition-all cursor-pointer">
                    <div className="w-16 h-16 bg-white border border-[#F1F5F9] rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-[#1F57F5] group-hover:text-white group-hover:border-[#1F57F5] transition-all shadow-sm">
                      <Plus className="w-8 h-8 text-[#A3A3A3] group-hover:text-white" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-[0.2em] group-hover:text-[#05090E] transition-all">Initialize New Synthesis</p>
                      <p className="text-[13px] text-[#A3A3A3] font-medium">Execute the Brief Architect to expand your high-fidelity library.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
