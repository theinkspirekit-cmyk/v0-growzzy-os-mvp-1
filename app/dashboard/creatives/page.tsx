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

  // Generation Progress UI Component (Premium AI Sphere)
  const renderGenerationProgress = () => {
    const texts = [
      "Analyzing your inputs...",
      "Fetching best practices...",
      "Generating ad components...",
      "Rendering 150+ variations..."
    ]
    const currentText = texts[generationStep - 1] || "Initializing AI..."

    return (
      <div className="w-full h-[500px] bg-black rounded-xl overflow-hidden relative flex flex-col items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-purple-900/20 blur-3xl opacity-50" />

        {/* The Sphere Loader */}
        <div className="relative z-10 scale-125">
          <div className="relative w-48 h-48 perspective-1000">
            {/* Ring 1 */}
            <div className="absolute inset-0 border-[4px] border-cyan-400/80 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.6)] animate-[spin_3s_linear_infinite]"
              style={{ transform: "rotateX(70deg) rotateY(10deg)" }}></div>

            {/* Ring 2 */}
            <div className="absolute inset-0 border-[4px] border-blue-500/80 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-[spin_4s_linear_infinite_reverse]"
              style={{ transform: "rotateX(70deg) rotateY(60deg)" }}></div>

            {/* Ring 3 */}
            <div className="absolute inset-0 border-[4px] border-indigo-500/80 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)] animate-[spin_5s_linear_infinite]"
              style={{ transform: "rotateX(70deg) rotateY(-60deg)" }}></div>

            {/* Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-[20px] animate-pulse shadow-[0_0_40px_rgba(59,130,246,0.9)]" />
          </div>
        </div>

        {/* Text Animation */}
        <div className="mt-16 text-center z-10 space-y-4 max-w-md mx-auto px-6">
          <h3 className="text-2xl font-bold text-white tracking-widest animate-[pulse_2s_infinite]">
            Creating Magic
          </h3>
          <div className="h-6">
            <p className="text-cyan-200/80 text-sm font-light tracking-wide animate-fade-in-up transition-all duration-300">
              {currentText}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-1 bg-neutral-800 rounded-full mx-auto mt-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-1000 ease-linear shadow-[0_0_10px_#22d3ee]"
              style={{ width: `${(generationStep / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

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
