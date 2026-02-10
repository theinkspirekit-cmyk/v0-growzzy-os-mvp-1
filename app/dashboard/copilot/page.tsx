"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import {
  Bot,
  Send,
  Sparkles,
  Search,
  Image as ImageIcon,
  Music,
  MoreHorizontal,
  Mic,
  ArrowUp,
  Zap,
} from "lucide-react"

export default function CopilotPage() {
  const [input, setInput] = useState("")
  const [hasStarted, setHasStarted] = useState(false)
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])

  const handleSend = () => {
    if (!input.trim()) return
    setHasStarted(true)
    const userMsg = input
    setMessages((prev) => [...prev, { role: "user", content: userMsg }])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Here is a quick analysis based on "${userMsg}":\n\n• Your ROAS on Meta has increased by 12% this week.\n• Google Ads spend is under-pacing by $400.\n• Suggestion: Move budget to Meta for higher efficiency.`,
        },
      ])
    }, 1000)
  }

  return (
    <DashboardLayout>
      <div className="relative h-[calc(100vh-60px)] bg-neutral-50/50 flex flex-col items-center justify-center overflow-hidden">

        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]" />
        </div>

        {!hasStarted ? (
          /* HERO STATE (Nixtio Style) */
          <div className="z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center -mt-20">
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
              I'm your AI marketing copilot. Ask me to analyze data, optimize campaigns, or generate creative ideas.
            </p>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-12">
              {[
                { icon: Zap, title: "Analyze Trends", desc: "Spot opportunities in your live campaign data instantly.", color: "bg-amber-50 text-amber-600" },
                { icon: Sparkles, title: "Generate Ideas", desc: "Brainstorm ad angles and copy for your next launch.", color: "bg-purple-50 text-purple-600" },
                { icon: Search, title: "Deep Research", desc: "Competitor analysis and market intent discovery.", color: "bg-blue-50 text-blue-600" },
              ].map((card) => (
                <button
                  key={card.title}
                  onClick={() => {
                    setInput(card.title)
                  }}
                  className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md hover:border-neutral-200 transition-all text-left flex flex-col items-start group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color} group-hover:scale-110 transition-transform`}>
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-1">{card.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{card.desc}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* CHAT HISTORY STATE */
          <div className="flex-1 w-full max-w-3xl px-6 flex flex-col py-8 overflow-hidden z-10">
            <div className="flex-1 overflow-y-auto space-y-6 pb-24 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-neutral-900" : "bg-white border border-neutral-200"}`}>
                    {msg.role === "user" ? <span className="text-white text-xs">U</span> : <Bot className="w-4 h-4 text-neutral-900" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                      ? "bg-neutral-900 text-white rounded-tr-sm"
                      : "bg-white text-neutral-800 border border-neutral-100 rounded-tl-sm whitespace-pre-wrap"
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Input Bar (Nixtio Style) */}
        <div className={`w-full max-w-2xl px-6 pb-8 transition-all duration-500 z-20 ${!hasStarted ? "absolute bottom-10" : "fixed bottom-4"}`}>
          <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-neutral-200/50 border border-neutral-100 ring-1 ring-neutral-50 flex items-center gap-2 pl-4">
            <div className="flex-1 flex flex-col justify-center min-h-[44px]">
              <input
                className="w-full text-sm bg-transparent border-none outline-none text-neutral-900 placeholder:text-neutral-400"
                placeholder="Ask anything... (e.g. 'Explain why ROAS dropped')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
            </div>

            {/* Action Chips (Visible only when empty or specialized) */}
            {!input && (
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
              onClick={handleSend}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${input.trim()
                  ? "bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg scale-100"
                  : "bg-neutral-100 text-neutral-300 scale-90"
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
