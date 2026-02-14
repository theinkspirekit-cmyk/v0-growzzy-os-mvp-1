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
// import { generateCreative } from "@/app/actions/creatives" // Removed in favor of API
import { getCreatives, deleteCreative } from "@/app/actions/creatives"

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
      if (Array.isArray(data)) setCreatives(data)
    } catch {
      toast.error("Failed to load assets")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerate = async () => {
    if (!genForm.name) {
      toast.error("Asset Name is required")
      return
    }

    setIsGenerating(true)
    const toastId = toast.loading("Generating creatives with AI...")

    try {
      // Call the new API Route
      const response = await fetch('/api/ai/generate-creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: genForm.name,
          goal: genForm.objective,
          platform: genForm.platform,
          format: genForm.format,
          aspect: genForm.aspect,
          // Combine description into tone/style for simplicity or pass separately if API supported
          tone: genForm.tone,
          style: genForm.style,
          cta: genForm.cta
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast.success("Assets generated successfully", { id: toastId })

        // Immediate UI update
        if (data.creatives && Array.isArray(data.creatives)) {
          setCreatives(prev => [...data.creatives, ...prev])
        }

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
        // load() // Optional: We just updated state manually
      } else {
        throw new Error(data.error || "Generation failed")
      }
    } catch (e: any) {
      console.error(e)
      toast.error(e.message || "Failed to generate assets", { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this asset?")) return
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[20px] font-semibold text-text-primary">Creative Studio</h1>
            <p className="text-[13px] text-text-secondary">AI-generated asset library.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-secondary h-9">
              <Upload className="w-3.5 h-3.5" /> Upload
            </button>
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="btn btn-primary h-9"
            >
              <Sparkles className="w-3.5 h-3.5" /> Generate
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="card p-1 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 px-2 flex-1">
            <Search className="w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search assets..."
              className="h-9 w-full text-[13px] border-none outline-none placeholder:text-text-tertiary"
            />
          </div>
          <div className="flex items-center gap-2 border-l border-border pl-2">
            <button className="btn btn-ghost h-8"><Filter className="w-3.5 h-3.5" /> Filter</button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            [1, 2, 3, 4].map(i => (
              <div key={i} className="h-[320px] bg-gray-100 rounded-[8px] animate-pulse" />
            ))
          ) : creatives.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-[8px]">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-text-primary">No assets found</h3>
              <p className="text-[13px] text-text-secondary mt-1 max-w-sm">
                Upload your own creative assets or use our AI to generate high-converting ads in seconds.
              </p>
              <button onClick={() => setIsGenerateModalOpen(true)} className="btn btn-primary mt-4">
                Generate First Asset
              </button>
            </div>
          ) : (
            creatives.map(c => (
              <div key={c.id} className="card overflow-hidden group hover:shadow-md transition-all duration-300 flex flex-col h-full">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-[2px] text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-yellow-400" /> {c.aiScore || 85}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-[13px] text-text-primary line-clamp-1" title={c.name}>{c.name}</h3>
                    <button className="text-text-tertiary hover:text-text-primary"><MoreHorizontal className="w-4 h-4" /></button>
                  </div>
                  <p className="text-[11px] text-text-secondary line-clamp-2 mb-3 h-[32px]">
                    {c.headline || c.bodyText || "No description"}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
                    <span className="badge badge-neutral lowercase">{c.platform || 'social'}</span>
                    <button onClick={() => handleDelete(c.id)} className="text-text-tertiary hover:text-danger px-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Generate Slide-out */}
        {isGenerateModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" onClick={() => !isGenerating && setIsGenerateModalOpen(false)} />
            <div className="relative w-full max-w-[480px] bg-white h-full shadow-2xl border-l border-border animate-in slide-in-from-right duration-300 flex flex-col">
              <div className="px-6 py-4 border-b border-border bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-semibold text-[15px]">Generate Creative</h3>
                <button onClick={() => setIsGenerateModalOpen(false)} disabled={isGenerating}>
                  <X className="w-5 h-5 text-text-secondary hover:text-text-primary" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-text-tertiary">Asset Name</label>
                  <input
                    className="input"
                    placeholder="e.g. Summer Promo V1"
                    value={genForm.name}
                    onChange={e => setGenForm({ ...genForm, name: e.target.value })}
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium uppercase text-text-tertiary">Platform</label>
                    <select
                      className="input"
                      value={genForm.platform}
                      onChange={e => setGenForm({ ...genForm, platform: e.target.value })}
                    >
                      <option>Meta</option>
                      <option>Google Ads</option>
                      <option>TikTok</option>
                      <option>LinkedIn</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium uppercase text-text-tertiary">Goal</label>
                    <select
                      className="input"
                      value={genForm.objective}
                      onChange={e => setGenForm({ ...genForm, objective: e.target.value })}
                    >
                      <option>Conversions</option>
                      <option>Traffic</option>
                      <option>Brand Awareness</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-text-tertiary">Product Context</label>
                  <textarea
                    className="input min-h-[100px] py-2"
                    placeholder="Describe your product, offer, and target audience..."
                    value={genForm.productDescription}
                    onChange={e => setGenForm({ ...genForm, productDescription: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium uppercase text-text-tertiary">Tone</label>
                    <select
                      className="input"
                      value={genForm.tone}
                      onChange={e => setGenForm({ ...genForm, tone: e.target.value })}
                    >
                      <option>Direct</option>
                      <option>Professional</option>
                      <option>Urgent</option>
                      <option>Friendly</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium uppercase text-text-tertiary">Style</label>
                    <select
                      className="input"
                      value={genForm.style}
                      onChange={e => setGenForm({ ...genForm, style: e.target.value })}
                    >
                      <option>Lifestyle</option>
                      <option>Minimalist</option>
                      <option>Product Focus</option>
                      <option>UGC Style</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-gray-50/50">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="btn btn-primary w-full h-10 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isGenerating ? 'Generating...' : 'Generate Assets'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
