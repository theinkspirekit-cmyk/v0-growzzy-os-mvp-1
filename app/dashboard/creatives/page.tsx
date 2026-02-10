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
} from "lucide-react"

const GENERATED_CREATIVES = [
  { id: 1, type: "Meta Feed", headline: "Scale Your Agency with AI", copy: "Stop manually managing ads. Let AI optimize your campaigns 24/7. 🚀", image: "bg-gradient-to-br from-indigo-500 to-purple-600", score: 94 },
  { id: 2, type: "Story Ad", headline: "Marketing on Autopilot", copy: "Get back 20 hours/week. Automate reporting, bid management, and creative testing.", image: "bg-gradient-to-br from-emerald-400 to-teal-600", score: 88 },
  { id: 3, type: "LinkedIn Post", headline: "Enterprise Marketing OS", copy: "The unified platform for modern marketing teams. Integration with all major ad networks.", image: "bg-neutral-800", score: 91 },
]

export default function CreativesPage() {
  const [activeTab, setActiveTab] = useState<"generate" | "library">("generate")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0) // 0: Idle, 1: Analyzing, 2: Fetching, 3: Generating, 4: Rendering

  const startGeneration = () => {
    setIsGenerating(true)
    setGenerationStep(1)

    // Simulate step progress
    setTimeout(() => setGenerationStep(2), 1500)
    setTimeout(() => setGenerationStep(3), 3000)
    setTimeout(() => setGenerationStep(4), 4500)
    setTimeout(() => {
      setIsGenerating(false)
      setGenerationStep(0)
    }, 6000)
  }

  // Generation Progress UI Component (Platelink Style)
  const renderGenerationProgress = () => (
    <div className="flex flex-col items-center justify-center p-12 lg:p-24 bg-white rounded-xl border border-neutral-100 shadow-sm min-h-[500px]">
      {/* Animated AI Brain Icon */}
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-purple-200">
          <Sparkles className="w-10 h-10 text-white animate-spin-slow" />
        </div>
        <div className="absolute -inset-2 bg-purple-500/20 rounded-full animate-ping opacity-75" />
      </div>

      <h3 className="text-xl font-bold text-neutral-900 mb-8">Your Ad Creative is Being Generated</h3>

      <div className="w-full max-w-md space-y-3">
        {[
          "Our AI is analyzing your texts and background image.",
          "We're fetching the best practices from your brand category.",
          "We're generating components & arranging them for high ROI.",
          "We're rendering over 150 variations using Artificial Intelligence.",
        ].map((text, index) => {
          const stepIndex = index + 1
          const isCompleted = generationStep > stepIndex
          const isCurrent = generationStep === stepIndex

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${isCurrent
                  ? "bg-white border-purple-200 shadow-sm scale-[1.02]"
                  : isCompleted
                    ? "bg-neutral-50/50 border-neutral-100 opacity-60"
                    : "bg-white border-neutral-100 opacity-40 blur-[1px]"
                }`}
            >
              <span className={`text-sm font-medium ${isCurrent ? "text-neutral-900" : "text-neutral-500"}`}>
                {text}
              </span>
              {isCompleted ? (
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded-full border border-neutral-200" />
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-neutral-400 mt-8 animate-pulse text-center">
        Note: The process may take up to a minute, please wait...
      </p>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">AI Ad Creatives</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Generate high-converting ads in seconds</p>
          </div>
          {!isGenerating && (
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
          )}
        </div>

        {isGenerating ? (
          renderGenerationProgress()
        ) : activeTab === "generate" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
                <h3 className="text-base font-semibold text-neutral-900">Creative Settings</h3>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-neutral-700">Platform</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Meta", "Google", "LinkedIn"].map((p) => (
                      <button key={p} className="px-3 py-2 text-sm border border-neutral-200 rounded-lg hover:border-neutral-900 hover:bg-neutral-50 transition-colors focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1">
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
                  <label className="text-sm font-medium text-neutral-700">Key Benefit / Hook</label>
                  <textarea placeholder="e.g. Save 20 hours a week on reporting" className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-neutral-900 h-24 resize-none" />
                </div>

                <button
                  onClick={startGeneration}
                  className="w-full py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-medium shadow-lg shadow-neutral-200"
                >
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
                  <div key={creative.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-all hover:scale-[1.01] duration-300 group">
                    {/* Visual Preview */}
                    <div className={`h-48 ${creative.image} flex items-center justify-center relative`}>
                      <ImageIcon className="w-8 h-8 text-white/50" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{creative.type}</span>
                          <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-100">
                            <Sparkles className="w-3 h-3" />
                            {creative.score} AI Score
                          </div>
                        </div>
                        <h4 className="font-bold text-neutral-900 leading-tight text-lg">{creative.headline}</h4>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed font-light">{creative.copy}</p>

                      <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                        <button className="flex-1 py-2 text-xs font-semibold text-neutral-700 bg-neutral-50 rounded-lg hover:bg-neutral-100 flex items-center justify-center gap-1.5 transition-colors border border-neutral-200/50">
                          <Download className="w-3.5 h-3.5" /> Save
                        </button>
                        <button className="flex-1 py-2 text-xs font-semibold text-neutral-700 bg-neutral-50 rounded-lg hover:bg-neutral-100 flex items-center justify-center gap-1.5 transition-colors border border-neutral-200/50">
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
          <div className="p-16 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-300 min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center mb-6">
              <LayoutTemplate className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900">Creative Library</h3>
            <p className="text-sm text-neutral-500 mt-2 max-w-sm mx-auto">Your saved templates and past generations will appear here. Start generating to build your library.</p>
            <button
              onClick={() => setActiveTab("generate")}
              className="mt-6 text-sm font-medium text-neutral-900 border-b border-neutral-900 hover:opacity-75 transition-opacity"
            >
              Start Generating
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
