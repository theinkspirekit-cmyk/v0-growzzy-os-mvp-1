"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import {
  Bot,
  Send,
  Sparkles,
  BarChart3,
  TrendingUp,
  Zap,
  Lightbulb,
  ArrowRight,
  MessageSquare,
} from "lucide-react"

const SUGGESTED_PROMPTS = [
  "Why did ROAS drop last week?",
  "Pause underperforming campaigns",
  "Which platform is generating the best leads?",
  "Generate a weekly performance summary",
  "Increase budget for top performing ads",
  "Show me conversion funnel breakdown",
]

const PROACTIVE_INSIGHTS = [
  { icon: TrendingUp, title: "Revenue Trend", desc: "Revenue increased 12.5% week-over-week. Meta retargeting is driving the majority of growth." },
  { icon: Zap, title: "Quick Win", desc: "3 campaigns have ROAS above 4x. Increasing their budget by 20% could yield $6,200 more revenue." },
  { icon: Lightbulb, title: "Opportunity", desc: "LinkedIn leads have 40% higher close rate than other channels. Consider reallocating 15% of Meta budget." },
]

const SAMPLE_CONVERSATION = [
  { role: "assistant", content: "Welcome back! Here's what I noticed today:\n\n• Your overall ROAS is 3.03x, down 2.1% from last week\n• Meta video ads are outperforming static by 23%\n• 3 campaigns have ROAS below 1.5x and are candidates for pausing\n\nWhat would you like to explore?" },
]

export default function CopilotPage() {
  const [messages, setMessages] = useState(SAMPLE_CONVERSATION)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Great question! Let me analyze that for you.\n\nBased on your current data, here's what I found:\n\n• Your top performing campaign is "Search — High Intent KWs" with 4.0x ROAS\n• The weakest campaign is "Product Launch Video" at 1.29x ROAS\n• I recommend reallocating $600/day from the video campaign to search campaigns\n\nWould you like me to execute this change, or would you prefer to review the details first?`,
        },
      ])
    }, 1200)
  }

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 h-[calc(100vh-60px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">AI Copilot</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Your intelligent marketing assistant</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online
          </div>
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.role === "user"
                      ? "bg-neutral-900 text-white rounded-2xl rounded-br-md px-4 py-3"
                      : "bg-neutral-50 text-neutral-800 rounded-2xl rounded-bl-md px-4 py-3 border border-neutral-100"
                    }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-neutral-600">You</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Suggested Prompts */}
            {messages.length <= 1 && (
              <div className="px-6 pb-3">
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setInput(prompt)
                      }}
                      className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-full hover:bg-neutral-200 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything about your marketing data..."
                  className="flex-1 px-4 py-3 text-sm bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 transition-colors"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center hover:bg-neutral-800 transition-colors flex-shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Proactive Insights Sidebar */}
          <div className="hidden lg:block w-[300px] space-y-4 flex-shrink-0">
            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-neutral-900" />
                <h3 className="text-sm font-semibold text-neutral-900">Proactive Insights</h3>
              </div>
              <div className="space-y-4">
                {PROACTIVE_INSIGHTS.map((insight, i) => (
                  <div key={i} className="p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <insight.icon className="w-3.5 h-3.5 text-neutral-600" />
                      <span className="text-xs font-semibold text-neutral-900">{insight.title}</span>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed">{insight.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-5">
              <h3 className="text-sm font-semibold text-neutral-900 mb-3">Capabilities</h3>
              <div className="space-y-2">
                {[
                  "Answer analytics questions",
                  "Explain performance changes",
                  "Execute campaign actions",
                  "Generate reports & summaries",
                  "Budget optimization",
                ].map((cap) => (
                  <div key={cap} className="flex items-center gap-2 text-xs text-neutral-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                    {cap}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
