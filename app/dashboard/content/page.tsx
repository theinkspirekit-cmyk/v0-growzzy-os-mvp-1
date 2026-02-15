"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import { Wand2, Plus, Sparkles, Type, Video, Save, CheckCircle } from "lucide-react"
import { toast } from "sonner"
// Server Action
import { saveContent } from "@/app/actions/creatives"

export default function ContentStudioPage() {
  const [contentType, setContentType] = useState("SEO Strategy & Blog")
  const [tone, setTone] = useState("Professional & Authoritative")
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleGenerate = async () => {
    if (!prompt) return
    setIsGenerating(true)
    try {
      const res = await fetch("/api/ai/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, tone, prompt })
      })
      const data = await res.json()
      if (data.content) {
        setGeneratedContent(data.content)
      } else {
        toast.error("Generation failed. Please try again.")
      }
    } catch (e) {
      console.error("Generation failed", e)
      toast.error("Network error.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedContent) return
    setIsSaving(true)
    try {
      const result = await saveContent({
        title: `${contentType} - ${new Date().toLocaleDateString()}`,
        content: generatedContent,
        type: contentType
      })

      if (result.success) {
        toast.success("Content saved to Creatives library!")
      } else {
        toast.error("Failed to save content.")
      }
    } catch (err) {
      toast.error("Save failed.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleNewProject = () => {
    setPrompt("")
    setGeneratedContent("")
    setContentType("SEO Strategy & Blog")
    setTone("Professional & Authoritative")
  }

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
          <button
            onClick={handleNewProject}
            className="btn-primary h-10 px-5 text-[12px] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Project
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-6 space-y-6 bg-white border border-[#E2E8F0] shadow-sm rounded-2xl">
              <div className="space-y-4">
                <h3 className="text-[14px] font-bold text-[#1F2937] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1F57F5]" /> Creative Parameters
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-[#64748B] uppercase">Content Type</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 text-[13px] outline-none focus:border-[#1F57F5]"
                    >
                      <option>SEO Strategy & Blog</option>
                      <option>Video Narrative Script</option>
                      <option>Email Nurture Sequence</option>
                      <option>Social Content Calendar</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-[#64748B] uppercase">Tone of Voice</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 text-[13px] outline-none focus:border-[#1F57F5]"
                    >
                      <option>Professional & Authoritative</option>
                      <option>Friendly & Accessible</option>
                      <option>Bold & Disruptive</option>
                    </select>
                  </div>
                  <div className="space-y-1.5 text-left">
                    <label className="text-[11px] font-bold text-[#64748B] uppercase">Main Subject</label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full h-32 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-[13px] outline-none focus:border-[#1F57F5] resize-none"
                      placeholder="Describe what you want the AI to synthesize..."
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full h-11 bg-[#1F57F5] text-white rounded-xl text-[12px] font-bold uppercase tracking-wider hover:bg-[#1A4AD1] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1F57F5]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Synthesizing..." : "Engine Content"} <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview/Output */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white border border-[#E2E8F0] rounded-[2rem] h-[600px] flex flex-col overflow-hidden shadow-sm relative group">
              <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E2E8F0]" />
                  </div>
                  <span className="text-[12px] font-bold text-[#64748B]">
                    {generatedContent ? "generated_draft_v1.md" : "waiting_for_input..."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {generatedContent && (
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="bg-white border border-gray-200 text-green-600 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase hover:bg-green-50 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isSaving ? <span className="animate-spin">⏳</span> : <Save className="w-3.5 h-3.5" />}
                      Save Draft
                    </button>
                  )}
                  <button className="p-2 hover:bg-[#EFF6FF] text-[#1F57F5] rounded-lg transition-all"><Type className="w-4 h-4" /></button>
                  <button className="p-2 hover:bg-[#F8FAFC] text-[#64748B] rounded-lg transition-all"><Video className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex-1 p-8 overflow-y-auto bg-white text-left font-mono text-sm leading-relaxed whitespace-pre-wrap text-[#334155]">
                {generatedContent || (
                  <div className="max-w-xl mx-auto space-y-6 pt-20 opacity-50">
                    <div className="text-center space-y-2">
                      <Sparkles className="w-12 h-12 text-gray-300 mx-auto" />
                      <p className="font-bold text-gray-400">Describe your concept to begin synthesis.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
