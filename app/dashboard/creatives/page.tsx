"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useEffect } from "react"
import {
  Sparkles,
  Plus,
  Trash2,
  Image as ImageIcon,
  Copy,
  Share2,
  Download,
  Search,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Import Server Actions
import { generateCreative, getCreatives, deleteCreative } from "@/app/actions/creatives"

export default function CreativesPage() {
  const [creatives, setCreatives] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Generation Form
  const [genForm, setGenForm] = useState({
    product: "",
    audience: "",
    goal: "conversions",
    platform: "facebook"
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
    if (!genForm.product) {
      toast.error("Product name is required")
      return
    }
    setIsGenerating(true)
    try {
      const res = await generateCreative({
        product_name: genForm.product,
        target_audience: genForm.audience,
        goal: genForm.goal,
        platform: genForm.platform
      })

      if (res.success) {
        toast.success("Creative Asset Generated")
        setIsGenerateModalOpen(false)
        setGenForm({ product: "", audience: "", goal: "conversions", platform: "facebook" })
        load()
      } else {
        toast.error(res.error)
      }
    } catch {
      toast.error("Generation failed")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this asset permanently?")) return
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
      <div className="space-y-6 font-satoshi">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-[24px] font-bold text-[#1F2937] tracking-tight">Creative Laboratory</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
              <p className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">Generative Asset Engine</p>
            </div>
          </div>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="btn-primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate New Asset
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search assets..." className="w-full h-9 pl-9 pr-4 rounded-md border border-[#E2E8F0] focus:border-[#1F57F5] outline-none text-[13px]" />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-[12px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-md hover:text-[#1F2937]">Images</button>
            <button className="px-3 py-1.5 text-[12px] font-medium text-[#64748B] bg-white border border-[#E2E8F0] rounded-md hover:text-[#1F2937]">Copy</button>
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : creatives.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-gray-200 rounded-lg">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-[16px] font-semibold text-[#1F2937]">No assets generated yet</h3>
            <p className="text-[13px] text-[#64748B] mt-2 mb-6">Start by generating your first AI creative.</p>
            <button onClick={() => setIsGenerateModalOpen(true)} className="btn-primary mx-auto">
              <Plus className="w-4 h-4 mr-2" /> Generate Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {creatives.map(c => (
              <div key={c.id} className="group bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all relative">
                {/* Image Preview */}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  {c.imageUrl ? (
                    <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-700" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} className="p-2 bg-white rounded-full hover:bg-red-50 text-red-500" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {c.aiScore && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-white text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-400" /> {c.aiScore}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#1F2937] truncate" title={c.headline}>{c.headline || c.name}</h3>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 mt-1">{c.bodyText}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
                    <span className="text-[10px] font-medium uppercase text-[#94A3B8] bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      {c.format || 'Feed'}
                    </span>
                    <button className="text-[11px] font-medium text-[#1F57F5] hover:underline flex items-center gap-1">
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Generate Modal */}
        {isGenerateModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg border border-[#E2E8F0]">
              <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
                <div>
                  <h3 className="text-[16px] font-bold text-[#1F2937]">Generate Creative Asset</h3>
                  <p className="text-[11px] text-[#64748B] uppercase tracking-wide">Powered by Generative Engine v2</p>
                </div>
                <button onClick={() => setIsGenerateModalOpen(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label>Product / Service Name *</label>
                  <input
                    type="text"
                    className="input-field h-10"
                    placeholder="e.g. Lumina Smart Watch"
                    value={genForm.product}
                    onChange={e => setGenForm({ ...genForm, product: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Target Audience Context</label>
                  <textarea
                    className="w-full p-3 border border-[#E2E8F0] rounded-md text-[13px] focus:border-[#1F57F5] outline-none min-h-[80px]"
                    placeholder="e.g. Tech enthusiasts aged 25-40 looking for premium wearables..."
                    value={genForm.audience}
                    onChange={e => setGenForm({ ...genForm, audience: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Campaign Objective</label>
                    <select className="input-field h-10" value={genForm.goal} onChange={e => setGenForm({ ...genForm, goal: e.target.value })}>
                      <option value="conversions">Conversions</option>
                      <option value="awareness">Brand Awareness</option>
                      <option value="engagement">Engagement</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label>Platform Format</label>
                    <select className="input-field h-10" value={genForm.platform} onChange={e => setGenForm({ ...genForm, platform: e.target.value })}>
                      <option value="facebook">Meta Feed</option>
                      <option value="instagram">Instagram Story</option>
                      <option value="linkedin">LinkedIn Post</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary w-full h-11 justify-center text-[14px]">
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Synthesizing Visuals...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Execute Generation</span>
                      </div>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-[#94A3B8] mt-3">Estimated time: 3-5 seconds • 1 Credit</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
