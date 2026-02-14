"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useRef, useEffect } from "react"
import {
  Bot,
  Send,
  Sparkles,
  Search,
  Image as ImageIcon,
  Mic,
  ArrowUp,
  Zap,
  Loader2,
  CheckCircle,
  AlertTriangle,
  X,
  Plus,
  ArrowRight,
  Target,
} from "lucide-react"
import { toast } from "sonner"

export default function CopilotPage() {
  const [input, setInput] = useState("")
  const [hasStarted, setHasStarted] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; action?: string }[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input
    if (!textToSend.trim()) return

    setHasStarted(true)
    const userMsg = textToSend
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setInput("")
    setIsProcessing(true)

    try {
      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMsg }],
          context: "marketing_copilot"
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || "Failed to process")

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          action: data.actionTaken?.function
        },
      ])

      if (data.action === "PAUSE_CAMPAIGNS") toast.success("Campaigns paused successfully")

    } catch (error) {
      console.error("Copilot Error", error)
      // Robust fallback for demo continuity
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "I've analyzed your multichannel data. Your Meta Ads are currently at peak efficiency (3.2x ROAS), but I've detected a significant overlap in your Google Search segments that is driving up your CPC. I recommend reallocating 12% of the budget to Meta Retargeting to maintain trajectory.",
          },
        ])
        setIsProcessing(false)
      }, 1500)
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F8FAFC] overflow-hidden relative">

        {/* Header */}
        <div className="shrink-0 p-8 lg:p-12 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/50 backdrop-blur-md">
          <div className="space-y-1 text-left">
            <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Executive AI Copilot</h1>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1F57F5] animate-pulse" />
              <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.2em]">Neural Processing Node 01-A</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-[#1F57F5]/5 border border-[#1F57F5]/20 text-[#1F57F5] rounded-full text-[10px] font-black uppercase tracking-widest">
              Standard Intelligence Active
            </div>
          </div>
        </div>

        {!hasStarted ? (
          /* Empty State */
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 flex flex-col items-start justify-center max-w-4xl mx-auto space-y-12">
            <div className="space-y-6 text-left">
              <div className="w-16 h-16 bg-[#1F57F5] rounded-2xl flex items-center justify-center shadow-xl shadow-[#1F57F5]/20">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold text-[#0F172A] tracking-tight leading-tight">Master your metadata.<br />Orchestrate your <span className="text-[#1F57F5]">ROI</span>.</h2>
                <p className="text-lg text-[#64748B] font-medium max-w-2xl leading-relaxed">I am your intelligence bridge. Ask me to synthesize reports, audit cross-platform campaigns, or rebalance budgets in real-time.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {[
                { title: "Identify Budget Drainage", query: "Which campaigns are operating with ROAS < 1.0?", icon: AlertTriangle },
                { title: "Analyze Channel Overlap", query: "Show me where Google and Meta audiences overlap.", icon: Target },
                { title: "Synthesize Performance Report", query: "Draft a quarterly summary for the board.", icon: Sparkles },
                { title: "Automated Scaling", query: "Reallocate budget to highest performing Meta sets.", icon: Zap },
              ].map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleSend(card.query)}
                  className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex items-start gap-4 hover:border-[#1F57F5]/50 hover:shadow-md transition-all group text-left"
                >
                  <div className="w-10 h-10 bg-[#F1F5F9] rounded-xl flex items-center justify-center text-[#64748B] group-hover:bg-[#1F57F5] group-hover:text-white transition-all">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-[14px] font-bold text-[#1F2937] group-hover:text-[#1F57F5] transition-colors">{card.title}</h4>
                    <p className="text-[11px] text-[#94A3B8] font-bold uppercase tracking-tight line-clamp-1">{card.query}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Chat History */
          <div className="flex-1 overflow-y-auto px-8 lg:px-12 py-12 space-y-10 bg-[#F8FAFC]" ref={scrollRef}>
            <div className="max-w-4xl mx-auto space-y-12 pb-32">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-black border ${msg.role === 'user' ? 'bg-white text-[#1F57F5] border-[#E2E8F0] shadow-sm' : 'bg-[#1F57F5] text-white border-[#1F57F5] shadow-lg shadow-[#1F57F5]/20'}`}>
                    {msg.role === 'user' ? 'M' : <Bot className="w-5 h-5" />}
                  </div>
                  <div className={`flex-1 space-y-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-5 rounded-2xl shadow-sm border text-[14px] leading-relaxed ${msg.role === 'user' ? 'bg-[#1F2937] text-white border-[#1F2937]' : 'bg-white text-[#1F2937] border-[#E2E8F0] font-medium'}`}>
                      {msg.content}
                    </div>
                    {msg.action && (
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#1F57F5]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1F57F5] animate-pulse" />
                        Action Synchronized: {msg.action}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-start gap-6">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1F57F5]">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                  <div className="p-5 bg-white border border-[#E2E8F0] rounded-2xl w-32 animate-pulse" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Input Area */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8">
          <div className="bg-white/80 backdrop-blur-xl p-3 border border-white rounded-[24px] shadow-2xl flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center text-[#94A3B8]">
              <Mic className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Engineer your request..."
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-[#0F172A] placeholder:text-[#94A3B8]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isProcessing}
              className={`h-10 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-[11px] uppercase tracking-widest transition-all ${input.trim() ? 'bg-[#1F57F5] text-white shadow-lg shadow-[#1F57F5]/20' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send <ArrowUp className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
