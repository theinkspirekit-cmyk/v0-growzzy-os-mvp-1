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
} from "lucide-react"
import { toast } from "sonner" // Assuming sonner is installed, if not will use alert

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
      // Call REAL backend logic
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to process")
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
          action: data.action
        },
      ])

      // Handle specific actions for UI feedback
      if (data.action === "PAUSE_CAMPAIGNS") {
        toast.success("Campaigns paused successfully")
      } else if (data.action === "GENERATE_REPORT") {
        toast.success("New report generated")
      }

    } catch (error) {
      console.error("Copilot Error", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting to my brain. Please try again in a moment.",
        },
      ])
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
      <div className="relative h-[calc(100vh-60px)] -m-8 bg-neutral-50/50 flex flex-col items-center justify-center overflow-hidden">

        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]" />
        </div>

        {!hasStarted ? (
          /* HERO STATE (Nixtio Style) */
          <div className="z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center -mt-20 animate-fade-in-up">
            {/* 3D Robot / Icon Placeholder */}
            <div className="relative mb-8 group cursor-pointer transition-transform hover:scale-105 duration-500">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-xl shadow-purple-500/10 flex items-center justify-center border border-white/50 backdrop-blur-sm">
                <Bot className="w-10 h-10 text-neutral-900" />
              </div>
              {/* Quick Bubble */}
              <div className="absolute -top-6 -right-16 bg-white px-3 py-1.5 rounded-xl rounded-bl-sm shadow-sm border border-neutral-100 text-xs font-medium text-neutral-600 animate-bounce-slow">
                Hey there! 👋 Need a boost?
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-3">
              Hi Marketer, Ready to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-500">Achieve Great Things?</span>
            </h1>

            <p className="text-neutral-500 text-lg mb-12 max-w-2xl">
              I'm your AI marketing copilot (v2.6). Ask me to analyze data, optimize campaigns, or generate creative ideas.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
              {[
                { icon: AlertTriangle, title: "Pause low performing campaigns", desc: "Identify and stop ads wasting budget (ROAS < 1.0).", color: "bg-amber-50 text-amber-600" },
                { icon: Sparkles, title: "Generate a weekly report", desc: "Summarize performance and export PDF.", color: "bg-purple-50 text-purple-600" },
                { icon: Search, title: "Why did ROAS drop?", desc: "Analyze metrics and find root causes.", color: "bg-blue-50 text-blue-600" },
              ].map((card) => (
                <button
                  key={card.title}
                  onClick={() => handleSend(card.title)}
                  className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-neutral-200 transition-all text-left flex flex-col items-start group relative overflow-hidden"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color} group-hover:scale-110 transition-transform relative z-10`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-1 relative z-10">{card.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed relative z-10">{card.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* CHAT HISTORY STATE */
          <div className="flex-1 w-full max-w-3xl px-6 flex flex-col py-8 overflow-hidden z-10 relative mt-12">
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pb-32 scrollbar-hide px-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user" ? "bg-neutral-900" : "bg-white border border-neutral-200"}`}>
                    {msg.role === "user" ? <span className="text-white text-xs font-bold">U</span> : <Bot className="w-4 h-4 text-neutral-900" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm transform transition-all duration-300 ${msg.role === "user"
                      ? "bg-neutral-900 text-white rounded-tr-sm"
                      : "bg-white text-neutral-800 border border-neutral-100 rounded-tl-sm whitespace-pre-wrap"
                    }`}>
                    {msg.content}
                    {msg.action && (
                      <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs font-medium text-emerald-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Action Executed: {msg.action}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Bot className="w-4 h-4 text-neutral-900" />
                  </div>
                  <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm border border-neutral-100 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
                    <span className="text-sm text-neutral-500">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Floating Input Bar (Nixtio Style) */}
        <div className={`w-full max-w-2xl px-6 pb-8 transition-all duration-500 z-20 ${!hasStarted ? "absolute bottom-10" : "fixed bottom-4"}`}>
          <div className="bg-white/80 backdrop-blur-md p-2 rounded-[2rem] shadow-xl shadow-neutral-200/50 border border-neutral-200/50 ring-1 ring-white/50 flex items-center gap-2 pl-4 transition-all focus-within:ring-2 focus-within:ring-neutral-200">
            <div className="flex-1 flex flex-col justify-center min-h-[44px]">
              <input
                className="w-full text-sm bg-transparent border-none outline-none text-neutral-900 placeholder:text-neutral-400"
                placeholder="Ask anything... (e.g. 'Explain why ROAS dropped')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isProcessing}
              />
            </div>

            {!input && !hasStarted && (
              <div className="hidden md:flex items-center gap-1 pr-2">
                <button className="p-2 hover:bg-neutral-50 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors" title="Deep Research">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-neutral-50 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors" title="Make Image">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-neutral-50 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors" title="Voice Mode">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isProcessing}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${input.trim()
                  ? "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg scale-100"
                  : "bg-neutral-100 text-neutral-300 scale-90 cursor-not-allowed"
                }`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

          {!hasStarted && (
            <div className="text-center mt-4 flex items-center justify-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3" /> Unlock more with Pro Plan</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300" />
              <span className="flex items-center gap-1.5"><Bot className="w-3 h-3" /> Powered by Growzzy AI v2.6</span>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
