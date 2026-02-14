"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Copy,
  Download,
  Search,
  Loader2,
  Filter,
  X,
  Upload,
  MoreHorizontal,
  Wand2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { generateCreative, getCreatives, deleteCreative } from "@/app/actions/creatives"

export default function CreativesPage() {
  const [creatives, setCreatives] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const [genForm, setGenForm] = useState({
    name: "",
    objective: "Conversions",
    platform: "Meta",
    format: "Single Image",
    aspect: "1:1",
    productDescription: "",
    cta: "Shop Now",
    tone: "Direct",
    style: "Lifestyle",
  })

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await getCreatives()
      setCreatives(data || [])
    } catch {
      toast.error("Failed to load creative assets")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!genForm.name || !genForm.productDescription) {
      toast.error("Name and Product Description are required")
      return
    }

    setIsGenerating(true)
    const toastId = toast.loading("Initializing AI Generation Protocol...")

    // Safety Timeout to prevent indefinite loading state
    const timeoutId = setTimeout(() => {
      if (isGenerating) {
        setIsGenerating(false)
        toast.error("Generation timed out. Please try again.", { id: toastId })
      }
    }, 15000) // 15s timeout

    try {
      const res = await generateCreative({
        product_name: genForm.name,
        target_audience: "General",
        goal: genForm.objective,
        platform: genForm.platform,
        format: genForm.format,
        aspect: genForm.aspect,
        cta: genForm.cta,
        tone: genForm.tone,
        style: genForm.style,
      })

      clearTimeout(timeoutId)

      if (res.success) {
        toast.success("Creative Asset Generated Successfully", { id: toastId })
        setIsGenerateModalOpen(false)
        setGenForm({
          name: "",
          objective: "Conversions",
          platform: "Meta",
          format: "Single Image",
          aspect: "1:1",
          productDescription: "",
          cta: "Shop Now",
          tone: "Direct",
          style: "Lifestyle",
        })
        load()
      } else {
        toast.error(res.error || "Generation failed on server", { id: toastId })
      }
    } catch (e: any) {
      clearTimeout(timeoutId)
      console.error(e)
      toast.error("Client-side error: " + e.message, { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this asset?")) return
    setCreatives(prev => prev.filter(c => c.id !== id))
    try {
      await deleteCreative(id)
      toast.success("Asset deleted")
    } catch {
      toast.error("Deletion failed")
      load()
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 font-satoshi min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E2E8F0] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#64748B]">
              <span>Dashboard</span>
              <span>/</span>
              <span className="text-[#1F2937]">Creative Studio</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Creative Studio</h1>
              <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded text-[10px] font-bold uppercase tracking-wide">Beta</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-11 px-4 bg-white border border-[#E2E8F0] rounded-md text-[13px] font-medium text-[#1F2937] hover:bg-[#F8FAFC] shadow-sm flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload Asset
            </button>
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="btn-primary h-11 px-5 flex items-center gap-2 shadow-sm hover:shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate New Asset
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-6 hidden lg:block">
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-bold text-[#1F2937] flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" /> Filters
                </h3>
                <button className="text-[10px] text-[#1F57F5] hover:underline">Reset</button>
              </div>
              <div className="space-y-3">
                {['Platform', 'Format', 'Aspect Ratio', 'Style', 'Tags'].map(filter => (
                  <div key={filter} className="space-y-1.5">
                    <label className="text-[11px] font-medium text-[#64748B] uppercase tracking-wide">{filter}</label>
                    <select className="w-full h-8 text-[12px] border border-[#E2E8F0] rounded bg-[#F8FAFC] px-2 outline-none focus:border-[#1F57F5]">
                      <option>All {filter}s</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid Area */}
          <div className="flex-1 w-full">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[360px] bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : creatives.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-[16px] font-bold text-[#1F2937]">Your studio is empty</h3>
                <button onClick={() => setIsGenerateModalOpen(true)} className="mt-6 btn-primary">
                  <Sparkles className="w-4 h-4 mr-2" /> Generate First Asset
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                {creatives.map(c => (
                  <div key={c.id} className="group bg-white border border-[#E2E8F0] rounded-[8px] overflow-hidden shadow-sm hover:translate-y-[-4px] hover:shadow-lg transition-all duration-300 flex flex-col h-[380px]">
                    <div className="h-[200px] bg-gray-100 relative overflow-hidden flex-shrink-0 group">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                          <ImageIcon className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-white text-[10px] font-bold border border-white/10 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-400" /> {c.aiScore || 85}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-[14px] font-bold text-[#1F2937] line-clamp-1" title={c.name}>{c.name}</h3>
                        <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal className="w-4 h-4" /></button>
                      </div>
                      <p className="text-[11px] text-[#64748B] line-clamp-3 leading-relaxed bg-gray-50 p-2 rounded border border-gray-100 italic mb-auto">
                        "{c.headline || c.bodyText}"
                      </p>
                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#F1F5F9]">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase">{c.platform || 'General'}</span>
                        <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Slide-over Generator Panel */}
        {isGenerateModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className="absolute inset-0 bg-[#0F172A]/30 backdrop-blur-[2px] transition-opacity"
              onClick={() => !isGenerating && setIsGenerateModalOpen(false)}
            />
            <div className="relative w-full max-w-[520px] bg-white h-full shadow-2xl border-l border-[#E2E8F0] animate-in slide-in-from-right duration-300 flex flex-col">
              <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div>
                  <h2 className="text-[18px] font-bold text-[#1F2937]">Asset Generator</h2>
                  <p className="text-[11px] text-[#64748B] uppercase tracking-wide font-medium flex items-center gap-1.5 mt-0.5">
                    <Sparkles className="w-3 h-3 text-violet-500" /> Powered by OpenAI
                  </p>
                </div>
                <button
                  onClick={() => setIsGenerateModalOpen(false)}
                  disabled={isGenerating}
                  className="p-2 hover:bg-white rounded-full border border-transparent hover:shadow-sm text-gray-400 hover:text-gray-600 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[#1F2937]">Asset Name *</label>
                  <input
                    type="text"
                    className="input-field h-10"
                    placeholder="e.g. Summer Launch Video Variant A"
                    value={genForm.name}
                    onChange={e => setGenForm({ ...genForm, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#64748B]">Objective</label>
                    <select
                      className="input-field h-10"
                      value={genForm.objective}
                      onChange={e => setGenForm({ ...genForm, objective: e.target.value })}
                    >
                      <option>Conversions</option>
                      <option>Traffic</option>
                      <option>Brand Awareness</option>
                      <option>Lead Generation</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-[#64748B]">Platform</label>
                    <select
                      className="input-field h-10"
                      value={genForm.platform}
                      onChange={e => setGenForm({ ...genForm, platform: e.target.value })}
                    >
                      <option>Meta</option>
                      <option>Google Ads</option>
                      <option>TikTok</option>
                      <option>LinkedIn</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-[#1F2937]">Product / Offer Description *</label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border border-[#E2E8F0] rounded-lg text-[13px] outline-none focus:border-[#1F57F5] focus:ring-1 focus:ring-[#1F57F5] placeholder:text-gray-400"
                    placeholder="Describe the product, key benefits, and offer details..."
                    value={genForm.productDescription}
                    onChange={e => setGenForm({ ...genForm, productDescription: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-[#E2E8F0] bg-[#F8FAFC]">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={cn(
                    "w-full h-12 rounded-lg font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm",
                    isGenerating ? "bg-[#CBD5E1] text-white cursor-not-allowed" : "bg-[#1F57F5] text-white hover:bg-[#1A4AD1] hover:shadow-md"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Creative...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate with AI
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
