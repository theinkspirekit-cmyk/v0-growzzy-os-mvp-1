"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Palette,
  Sparkles,
  Wand2,
  Download,
  RefreshCw,
  CheckCircle,
  Circle,
  ArrowRight,
  Image,
  Video,
  FileText,
  Settings,
  Play,
  Eye,
  Copy,
  Trash2
} from "lucide-react"

export const dynamic = "force-dynamic"

export default function AdCreativesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCreatives, setGeneratedCreatives] = useState<any[]>([])
  
  // Form states
  const [brandInfo, setBrandInfo] = useState({
    name: "",
    industry: "",
    targetAudience: "",
    brandColors: "",
    tone: ""
  })
  
  const [campaignDetails, setCampaignDetails] = useState({
    objective: "",
    platforms: [] as string[],
    format: "",
    duration: ""
  })

  const steps = [
    { id: 1, title: "Brand Analysis", description: "AI analyzes your brand identity" },
    { id: 2, title: "Format Selection", description: "Choose creative formats" },
    { id: 3, title: "Generation", description: "AI creates your creatives" },
    { id: 4, title: "Optimization", description: "Review and refine" }
  ]

  const formats = [
    { id: "image", name: "Static Images", icon: Image, description: "Facebook, Instagram posts" },
    { id: "video", name: "Video Ads", icon: Video, description: "Short-form video content" },
    { id: "carousel", name: "Carousel", icon: FileText, description: "Multi-frame ads" },
    { id: "stories", name: "Stories", icon: Play, description: "Instagram/FB Stories" }
  ]

  const sampleCreatives = [
    {
      id: 1,
      type: "image",
      title: "Summer Sale Campaign",
      platform: "Instagram",
      performance: { ctr: 2.3, conversions: 45 },
      thumbnail: "/api/placeholder/300/200",
      status: "ready"
    },
    {
      id: 2,
      type: "video",
      title: "Product Launch Teaser",
      platform: "Facebook",
      performance: { ctr: 3.1, conversions: 62 },
      thumbnail: "/api/placeholder/300/200",
      status: "ready"
    },
    {
      id: 3,
      type: "carousel",
      title: "Feature Showcase",
      platform: "LinkedIn",
      performance: { ctr: 1.8, conversions: 28 },
      thumbnail: "/api/placeholder/300/200",
      status: "ready"
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
      } catch (error) {
        console.error("[v0] Creatives error:", error)
        router.push("/auth")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setCurrentStep(3)
    
    // Simulate AI generation process
    setTimeout(() => {
      setGeneratedCreatives(sampleCreatives)
      setCurrentStep(4)
      setIsGenerating(false)
    }, 3000)
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">AI Creative Studio</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Generate Ad Creatives with AI</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI analyzes your brand and creates stunning, performance-optimized ad creatives tailored to your campaigns
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-0">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all",
                    currentStep >= step.id 
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  )}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4 transition-all",
                    currentStep > step.id ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <Card className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Brand Information</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
                    <Input
                      placeholder="Enter your brand name"
                      value={brandInfo.name}
                      onChange={(e) => setBrandInfo(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <Select onValueChange={(value) => setBrandInfo(prev => ({ ...prev, industry: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="saas">SaaS</SelectItem>
                        <SelectItem value="fashion">Fashion & Apparel</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <Textarea
                      placeholder="Describe your target audience..."
                      value={brandInfo.targetAudience}
                      onChange={(e) => setBrandInfo(prev => ({ ...prev, targetAudience: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand Tone</label>
                    <Select onValueChange={(value) => setBrandInfo(prev => ({ ...prev, tone: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="playful">Playful</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="minimalist">Minimalist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={() => setCurrentStep(2)}
                    className="w-full"
                    disabled={!brandInfo.name || !brandInfo.industry}
                  >
                    Continue to Format Selection
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Choose Creative Formats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {formats.map((format) => (
                    <div
                      key={format.id}
                      className={cn(
                        "border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-purple-300",
                        campaignDetails.format === format.id ? "border-purple-600 bg-purple-50" : "border-gray-200"
                      )}
                      onClick={() => setCampaignDetails(prev => ({ ...prev, format: format.id }))}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          campaignDetails.format === format.id ? "bg-purple-600 text-white" : "bg-gray-100"
                        )}>
                          <format.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{format.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{format.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button 
                    onClick={handleGenerate}
                    className="flex-1"
                    disabled={!campaignDetails.format}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate Creatives
                  </Button>
                </div>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="p-8">
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-6">
                    <Wand2 className="w-8 h-8 text-white animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI is Creating Your Creatives</h3>
                  <p className="text-gray-600 mb-8">
                    Our AI is analyzing your brand and generating performance-optimized ad creatives...
                  </p>
                  
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-gray-700">Brand analysis complete</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Circle className="w-5 h-5 text-blue-600 animate-pulse" />
                      <span className="text-sm text-gray-700">Generating visual concepts...</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Circle className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Optimizing for performance...</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {currentStep === 4 && (
              <Card className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Generated Creatives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedCreatives.map((creative) => (
                    <div key={creative.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        <Image className="w-12 h-12 text-gray-400" />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{creative.title}</h4>
                            <p className="text-sm text-gray-600">{creative.platform}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Ready</Badge>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-3">
                          <span>CTR: {creative.performance.ctr}%</span>
                          <span>Conversions: {creative.performance.conversions}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setCurrentStep(2)}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate More
                  </Button>
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Tips */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-0">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-900">AI Tips</h4>
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <p>• Include high-quality brand assets for better results</p>
                <p>• Specify your target audience for personalized creatives</p>
                <p>• Test multiple formats to find what works best</p>
                <p>• Our AI optimizes for platform-specific requirements</p>
              </div>
            </Card>

            {/* Recent Generations */}
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Recent Generations</h4>
              <div className="space-y-3">
                {sampleCreatives.slice(0, 3).map((creative) => (
                  <div key={creative.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <Image className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{creative.title}</div>
                      <div className="text-xs text-gray-600">{creative.platform}</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Performance Stats */}
            <Card className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">AI Performance</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Average CTR</span>
                    <span className="font-medium text-gray-900">2.8%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "72%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-medium text-gray-900">4.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "84%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Quality Score</span>
                    <span className="font-medium text-gray-900">8.5/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
