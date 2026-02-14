"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState, useRef, useEffect } from "react"
import {
    Send,
    Zap,
    Sparkles,
    BarChart2,
    AlertCircle,
    Loader2,
    Bot
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Message = {
    role: "user" | "assistant" | "system"
    content: string
}

export default function AssistantPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const SUGGESTED_PROMPTS = [
        { label: "Analyze my ROAS", prompt: "How is my ROAS performing compared to last month? Identify any drop-offs.", icon: BarChart2 },
        { label: "Optimize Budget", prompt: "Review my active campaigns. Which ones should I scale and which should I pause?", icon: Zap },
        { label: "Creative Audit", prompt: "Which creative formats are driving the highest CTR right now?", icon: Sparkles },
        { label: "Troubleshoot", prompt: "Why did my lead cost increase yesterday?", icon: AlertCircle },
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (text: string) => {
        if (!text.trim()) return

        const newMessage: Message = { role: "user", content: text }
        const newMessages = [...messages, newMessage]
        setMessages(newMessages)
        setInput("")
        setIsLoading(true)

        try {
            const response = await fetch("/api/ai/assistant/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            })

            if (!response.ok) throw new Error("Failed to get response")

            const data = await response.json()

            if (data.message) {
                const assistantMsg: Message = { role: "assistant", content: data.message.content }
                setMessages([...newMessages, assistantMsg])
            }
        } catch (error) {
            toast.error("AI Assistant is offline. Please try again.")
            // Remove failed message or show error state
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">

                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-[20px] font-semibold text-text-primary flex items-center gap-2">
                            <Bot className="w-5 h-5 text-primary" />
                            Neural Copilot
                        </h1>
                        <p className="text-[13px] text-text-secondary">Ask questions about your data, strategy, or creative performance.</p>
                    </div>
                    <span className="badge badge-success flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Wait
                    </span>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white border border-border rounded-[12px] shadow-sm flex flex-col overflow-hidden">

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-0 animate-in fade-in duration-500 forwards delay-100" style={{ opacity: 1 }}>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-[18px] font-semibold text-text-primary">How can I help optimize your growth today?</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                                    {SUGGESTED_PROMPTS.map((p, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(p.prompt)}
                                            className="flex items-center gap-4 p-4 bg-white border border-border rounded-[12px] hover:border-primary hover:shadow-md transition-all text-left group"
                                        >
                                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <p.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-[13px] font-semibold text-text-primary block">{p.label}</span>
                                                <span className="text-[11px] text-text-tertiary">Click to ask</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((m, i) => (
                                <div key={i} className={cn("flex gap-4 max-w-3xl", m.role === "user" ? "ml-auto flex-row-reverse" : "")}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                                        m.role === "user" ? "bg-primary text-white" : "bg-white border border-border text-primary"
                                    )}>
                                        {m.role === "user" ? <div className="text-[10px] font-bold">YOU</div> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={cn(
                                        "p-4 rounded-[16px] text-[14px] leading-relaxed shadow-sm",
                                        m.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-white border border-border text-text-primary rounded-tl-none"
                                    )}>
                                        {m.content}
                                    </div>
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="flex gap-4 max-w-3xl">
                                <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-primary mt-1">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="p-4 bg-white border border-border rounded-[16px] rounded-tl-none shadow-sm flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                    <span className="text-[13px] text-text-secondary">Analyzing data...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-border">
                        <div className="relative max-w-4xl mx-auto">
                            <input
                                className="w-full h-12 pl-4 pr-12 bg-gray-50 border border-border rounded-[12px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-[14px]"
                                placeholder="Ask anything about your campaigns, leads, or strategy..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend(input)}
                                disabled={isLoading}
                                autoFocus
                            />
                            <button
                                onClick={() => handleSend(input)}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-2 h-8 w-8 bg-primary text-white rounded-[8px] flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <p className="text-[10px] text-text-tertiary">AI accesses real-time data. Double-check critical financial decisions.</p>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    )
}
