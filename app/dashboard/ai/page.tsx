"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  BarChart3,
  Lightbulb,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Settings,
  MessageSquare
} from "lucide-react"

export const dynamic = "force-dynamic"

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

interface Insight {
  id: string
  type: 'opportunity' | 'warning' | 'success'
  title: string
  description: string
  action?: string
  metrics?: {
    label: string
    value: string
    change: string
  }
}

export default function AICopilotPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const suggestedPrompts = [
    "What's my best performing campaign this week?",
    "Optimize my ad spend for better ROAS",
    "Create a campaign targeting new customers",
    "Analyze my conversion funnel drop-offs",
    "Suggest improvements for my landing pages"
  ]

  const insights: Insight[] = [
    {
      id: "1",
      type: "opportunity",
      title: "High ROAS Opportunity",
      description: "Your Meta Ads campaigns are showing 3.2x ROAS, consider increasing budget by 25%",
      action: "Adjust Budget",
      metrics: {
        label: "Current ROAS",
        value: "3.2x",
        change: "+12%"
      }
    },
    {
      id: "2",
      type: "warning",
      title: "Conversion Rate Drop",
      description: "Google Ads conversion rate decreased by 15% in the last 7 days",
      action: "Investigate",
      metrics: {
        label: "Conversion Rate",
        value: "2.1%",
        change: "-15%"
      }
    },
    {
      id: "3",
      type: "success",
      title: "Lead Quality Improvement",
      description: "Lead quality score increased by 22% after recent creative updates",
      action: "View Details",
      metrics: {
        label: "Quality Score",
        value: "8.5/10",
        change: "+22%"
      }
    }
  ]

  const quickActions = [
    {
      icon: Target,
      title: "Create Campaign",
      description: "Launch new ad campaign with AI assistance",
      color: "bg-blue-500"
    },
    {
      icon: BarChart3,
      title: "Optimize Budget",
      description: "AI-powered budget allocation recommendations",
      color: "bg-green-500"
    },
    {
      icon: Users,
      title: "Audience Insights",
      description: "Deep dive into your audience demographics",
      color: "bg-purple-500"
    },
    {
      icon: TrendingUp,
      title: "Performance Report",
      description: "Generate comprehensive performance analysis",
      color: "bg-orange-500"
    }
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/auth")
          return
        }
        setUser((await response.json()).user)

        // Initialize with welcome message
        setMessages([
          {
            id: "1",
            type: "ai",
            content: "Hello! I'm your AI marketing copilot. I can help you analyze campaigns, optimize performance, and make data-driven decisions. What would you like to explore today?",
            timestamp: new Date()
          }
        ])
      } catch (error) {
        console.error("[v0] AI Copilot error:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I've analyzed your recent campaign performance. Your Meta Ads are performing exceptionally well with a 3.2x ROAS. I recommend allocating 20% more budget to your top performing campaigns. Would you like me to create a detailed optimization plan?",
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-4 h-4" />
      case 'warning': return <AlertCircle className="w-4 h-4" />
      case 'success': return <CheckCircle className="w-4 h-4" />
      default: return <Lightbulb className="w-4 h-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return "bg-blue-100 text-blue-800 border-blue-200"
      case 'warning': return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case 'success': return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="flex h-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">AI Copilot</h2>
                <p className="text-sm text-gray-600">Your intelligent marketing assistant</p>
              </div>
              <Badge className="bg-green-100 text-green-800 ml-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-2xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-4'
                        : 'bg-gray-100 text-gray-900 mr-4'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-lg mr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-6">
            {/* Suggested Prompts */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePromptClick(prompt)}
                    className="text-xs"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Message Input */}
            <div className="flex gap-3">
              <Input
                placeholder="Ask me anything about your marketing performance..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputValue.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* AI Insights */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h3 className="font-semibold text-gray-900">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {insights.map((insight) => (
                <Card key={insight.id} className={`p-4 border ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                      {insight.metrics && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">{insight.metrics.label}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium">{insight.metrics.value}</span>
                            <span className={`text-xs ${insight.metrics.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {insight.metrics.change}
                            </span>
                          </div>
                        </div>
                      )}
                      {insight.action && (
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          {insight.action}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2"
                >
                  <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">{action.title}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">Total Revenue</span>
                </div>
                <span className="text-sm font-medium text-gray-900">$24,580</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-600">ROAS</span>
                </div>
                <span className="text-sm font-medium text-gray-900">3.2x</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Conversions</span>
                </div>
                <span className="text-sm font-medium text-gray-900">1,247</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-gray-600">Avg. Response Time</span>
                </div>
                <span className="text-sm font-medium text-gray-900">1.2s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
