"use client"

import DashboardLayout from "@/components/dashboard-layout"
import { useState } from "react"
import {
  FileText, Download, Calendar, CheckCircle2, Loader2,
  BarChart3, PieChart, Target, Settings2, LineChart,
  Grid, Briefcase, TrendingUp, AlertTriangle, Shield,
  Users, Video, Mic, Search
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
// Recharts
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Pie, Legend, Line, ComposedChart, LineChart as RechartsLineChart
} from 'recharts'

// --- Mock Data Generators (simulating dynamic data) ---
const generateRevenueData = (growthFactor: number) => [
  { name: 'Jan', budget: 18 * growthFactor, revenue: 10 * growthFactor, forecast: 12 * growthFactor },
  { name: 'Feb', budget: 30 * growthFactor, revenue: 12 * growthFactor, forecast: 15 * growthFactor },
  { name: 'Mar', budget: 25 * growthFactor, revenue: 38 * growthFactor, forecast: 20 * growthFactor },
  { name: 'Apr', budget: 40 * growthFactor, revenue: 30 * growthFactor, forecast: 25 * growthFactor },
  { name: 'May', budget: 42 * growthFactor, revenue: 32 * growthFactor, forecast: 50 * growthFactor },
]

const generateROIData = () => [
  { name: 'A', value: Math.floor(Math.random() * 30) + 5 },
  { name: 'B', value: Math.floor(Math.random() * 30) + 10 },
  { name: 'C', value: Math.floor(Math.random() * 40) + 20 },
]

const CONTENT_PERFORMANCE_DATA = [
  { name: 'Item 1', value: 10.7, fill: "#BEF264" }, // Green
  { name: 'Item 2', value: 16.0, fill: "#86EFAC" },
  { name: 'Item 3', value: 22.5, fill: "#FDE047" }, // Yellow
  { name: 'Item 4', value: 13.4, fill: "#FFFFF0" },
  { name: 'Item 5', value: 26.7, fill: "#FFFFFF" },
]

// --- Report Components ---

// 1. REPORT SUMMARY (Annual Budget Planner)
const ReportSummary = ({ data }: { data: any }) => (
  <div className="bg-white p-8 max-w-4xl mx-auto shadow-sm border border-gray-200 min-h-[1000px] relative animate-in fade-in duration-500">
    {/* Header */}
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-orange-500 rounded-sm" />
        <span className="font-bold text-gray-700 tracking-wider text-sm">{data.companyName || "WARDIERE INC."}</span>
      </div>
      <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">REPORT SUMMARY</h1>
      <div className="flex justify-between items-end border-b-4 border-orange-400 pb-2">
        <h2 className="text-xl font-bold text-gray-700 uppercase tracking-widest">{data.reportTitle || "Company Annual Budget Planner"}</h2>
      </div>
    </div>

    {/* Executive Summary Text */}
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-black text-white p-1 rounded-full"><Grid className="w-4 h-4" /></div>
        <h3 className="font-bold text-lg">Executive Summary</h3>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed text-justify">
        {data.summary || "Comprehensive analysis of fiscal performance indicates a strong upward trajectory in operational efficiency and market penetration. Strategic reallocation of resources has yielded significant improvements in ROI across key sectors."}
      </p>
    </div>

    {/* 3 Columns */}
    <div className="grid grid-cols-3 gap-8 mb-12">
      <div className="space-y-2">
        <h4 className="text-3xl font-bold text-gray-900">01</h4>
        <h5 className="font-bold text-gray-800 text-sm uppercas">STRATEGIC GOALS</h5>
        <p className="text-xs text-gray-500">Prioritizing market expansion in {data.targetRegion || "Southeast Asia"} and a 15% improvement in operational efficiency.</p>
      </div>
      <div className="space-y-2">
        <h4 className="text-3xl font-bold text-gray-900">02</h4>
        <h5 className="font-bold text-gray-800 text-sm uppercase">BUDGET ALLOCATION</h5>
        <p className="text-xs text-gray-500">Total budget of {data.currency || "$"}{data.totalBudget || "85,000,000"} allocated primarily to support strategic objectives.</p>
      </div>
      <div className="space-y-2">
        <h4 className="text-3xl font-bold text-gray-900">03</h4>
        <h5 className="font-bold text-gray-800 text-sm uppercase">REVENUE</h5>
        <p className="text-xs text-gray-500">Revenue increase is a strong indicator that recent strategic investments are beginning to pay dividends.</p>
      </div>
    </div>

    {/* Financial Forecast Chart */}
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-orange-100 p-1.5 rounded-full"><TrendingUp className="w-5 h-5 text-gray-800" /></div>
        <h3 className="font-bold text-xl text-gray-800">Financial Forecast</h3>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 py-4">
          <h4 className="font-bold text-gray-800 text-sm mb-2">01. OPERATIONAL BUDGET</h4>
          <p className="text-xs text-gray-500 leading-relaxed text-justify">
            Detailed breakdown of operational expenditures reveals optimization opportunities in logistics and supply chain management.
          </p>
        </div>
        <div className="col-span-2 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data.chartData || generateRevenueData(1)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="forecast" stroke="#EAB308" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="budget" stroke="#FB923C" strokeWidth={2} dot={{ r: 3 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Risk & Mitigation */}
    <div>
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gray-100 p-1.5 rounded-full"><AlertTriangle className="w-5 h-5 text-gray-800" /></div>
        <h3 className="font-bold text-xl text-gray-800">Risk & Mitigation</h3>
      </div>
      <div className="grid grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-orange-200 flex items-center justify-center border-4 border-white shadow-lg text-gray-800 mb-2">
            <Briefcase className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-xs uppercase">Financial Risks</h4>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-orange-300 flex items-center justify-center border-4 border-white shadow-lg text-gray-800 mb-2">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-xs uppercase">Internal Risk</h4>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-orange-400 flex items-center justify-center border-4 border-white shadow-lg text-gray-800 mb-2">
            <Shield className="w-8 h-8" />
          </div>
          <h4 className="font-bold text-xs uppercase">Mitigation Plan</h4>
        </div>
      </div>
    </div>
  </div>
)

// 2. GROWTH OPPORTUNITIES
const GrowthOpportunities = ({ data }: { data: any }) => (
  <div className="bg-gray-50 p-8 max-w-4xl mx-auto shadow-sm border border-gray-200 min-h-[1000px] font-sans animate-in fade-in duration-500">
    {/* Header */}
    <div className="mb-8">
      <div className="text-right text-xs font-bold text-purple-600 mb-1">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()} REPORT</div>
      <h1 className="text-4xl font-black text-purple-700 uppercase tracking-tight mb-2">GROWTH <br /> OPPORTUNITIES</h1>
      <div className="text-right text-xs text-gray-600">Focus Area: {data.focusArea || "Market Expansion & Product Diversification"}</div>
      <div className="h-4 bg-purple-600 w-full rounded-r-full mt-4 ml-[-32px] w-[calc(100%+64px)]" />
    </div>

    {/* KPI Cards */}
    <div className="flex items-center gap-4 mb-8">
      <div className="w-32 font-bold text-gray-700 text-sm uppercase leading-tight">Market Sentiment & Trends</div>
      <div className="flex-1 grid grid-cols-4 gap-4">
        <div className="bg-pink-100 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-black text-gray-800">+{data.growthRate || "8.4"}%</span>
          <span className="text-[10px] text-gray-600 text-center leading-tight mt-1">Market Growth Rate</span>
        </div>
        <div className="bg-gray-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-black text-gray-800">{data.interest || "72"}%</span>
          <span className="text-[10px] text-gray-600 text-center leading-tight mt-1">Customer Interest</span>
        </div>
        <div className="bg-purple-100 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
          <span className="text-2xl font-black text-gray-800">{data.demand || "$1.2M"}</span>
          <span className="text-[10px] text-gray-600 text-center leading-tight mt-1">Unmet Demand</span>
        </div>
        <div className="bg-gray-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
          <span className="text-md font-black text-gray-800 text-center">3 High-value</span>
          <span className="text-[10px] text-gray-600 text-center leading-tight mt-1">Competitive Gap</span>
        </div>
      </div>
    </div>

    {/* SWOT Analysis */}
    <div className="flex gap-8 mb-8">
      <div className="w-32 font-bold text-gray-700 text-sm uppercase">SWOT Analysis Summary</div>
      <div className="flex-1 grid grid-cols-2 gap-4">
        <div className="bg-purple-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-50"><Target className="w-6 h-6" /></div>
          <p className="text-[10px] italic mb-2 opacity-80">Strong brand loyalty, agile dev team.</p>
          <h3 className="text-xl font-black text-yellow-300 uppercase">Strengths</h3>
        </div>
        <div className="bg-purple-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-50"><AlertTriangle className="w-6 h-6" /></div>
          <p className="text-[10px] italic mb-2 opacity-80">Limited global reach, high opex.</p>
          <h3 className="text-xl font-black text-yellow-300 uppercase">Weaknesses</h3>
        </div>
        <div className="bg-purple-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-50"><TrendingUp className="w-6 h-6" /></div>
          <p className="text-[10px] italic mb-2 opacity-80">Emerging Asia markets, AI integration.</p>
          <h3 className="text-xl font-black text-yellow-300 uppercase">Opportunities</h3>
        </div>
        <div className="bg-purple-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-50"><Shield className="w-6 h-6" /></div>
          <p className="text-[10px] italic mb-2 opacity-80">New regulatory policies, inflation.</p>
          <h3 className="text-xl font-black text-yellow-300 uppercase">Threats</h3>
        </div>
      </div>
    </div>

    {/* Forecasting */}
    <div className="flex gap-8 mb-8">
      <div className="w-32 font-bold text-gray-700 text-sm uppercase">Growth Forecasting</div>
      <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data.growthCurve || [
            { name: 'Point A', value: 10 }, { name: 'Point B', value: 20 },
            { name: 'Point C', value: 45 }, { name: 'Point D', value: 75 },
            { name: 'Point E', value: 100 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} dot={{ fill: '#7C3AED', r: 4 }} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Footer Charts */}
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-purple-600 rounded-xl p-4 text-white">
        <h4 className="text-center font-bold mb-4">Potential ROI by Segment</h4>
        <div className="h-[120px] flex items-end justify-between gap-2 px-4">
          {generateROIData().map((d, i) => (
            <div key={i} className="w-full bg-yellow-200 rounded-t-sm flex flex-col justify-end items-center relative group" style={{ height: `${d.value * 2}%` }}>
              <span className="text-[10px] text-purple-900 font-bold mb-1">{d.value}%</span>
              <span className="text-[10px] text-white absolute -bottom-5">{d.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-purple-600 rounded-xl p-4 text-white">
        <h4 className="text-center font-bold mb-4">Market Sentiment & Trends</h4>
        <div className="grid grid-cols-3 gap-2 text-center h-full">
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-black text-yellow-300">$100k</span>
            <span className="text-[10px]">(25%)</span>
            <span className="text-[9px] mt-2 opacity-80">Marketing & Awareness</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-black text-yellow-300">$150k</span>
            <span className="text-[10px]">(35%)</span>
            <span className="text-[9px] mt-2 opacity-80">Research & Development</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <span className="text-lg font-black text-yellow-300">$180k</span>
            <span className="text-[10px]">(40%)</span>
            <span className="text-[9px] mt-2 opacity-80">Infrastructure / Talent</span>
          </div>
        </div>
      </div>
    </div>
  </div>
)

// 3. CONTENT ENGAGEMENT
const ContentEngagement = ({ data }: { data: any }) => (
  <div className="bg-[#111111] p-8 max-w-4xl mx-auto shadow-sm min-h-[1000px] font-sans text-white relative overflow-hidden animate-in fade-in duration-500">
    {/* Decorative */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>

    {/* Header */}
    <div className="flex justify-between items-center mb-12 border-b border-gray-800 pb-4">
      <span className="text-[#BEF264] font-bold uppercase tracking-widest text-sm">{data.companyName || "GIGGLING PLATYPUS CO."}</span>
      <span className="text-purple-400 font-bold uppercase tracking-widest text-sm">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
    </div>

    <div className="text-center mb-12">
      <h1 className="text-6xl font-black text-white uppercase tracking-tighter mb-2">CONTENT</h1>
      <h1 className="text-6xl font-black text-white uppercase tracking-tighter">ENGAGEMENT</h1>
    </div>

    {/* Pills */}
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div className="border border-white/20 rounded-full px-4 py-2 text-sm flex items-center justify-between">
        <span className="text-gray-400">Subject Discussion:</span>
        <span className="font-bold">{data.topic || "Quarterly Review"}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-white/20 rounded-full px-4 py-2 text-sm flex items-center justify-between">
          <span className="text-gray-400">Start:</span>
          <span className="font-bold">{data.startDate || "Jan 01"}</span>
        </div>
        <div className="border border-white/20 rounded-full px-4 py-2 text-sm flex items-center justify-between">
          <span className="text-gray-400">End:</span>
          <span className="font-bold">{data.endDate || "Mar 31"}</span>
        </div>
      </div>
    </div>

    {/* Box 1 - Pie */}
    <div className="bg-[#BEF264] rounded-3xl p-6 mb-8 text-black">
      <h3 className="text-center font-bold uppercase tracking-wider mb-6">CONTENT PERFORMANCE</h3>
      <div className="flex items-center justify-between">
        {/* Donut */}
        <div className="w-1/3 h-[180px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={CONTENT_PERFORMANCE_DATA}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {CONTENT_PERFORMANCE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="block text-2xl font-black">{data.topMetric || "24.7%"}</span>
              <span className="text-xs font-bold">Content 5</span>
            </div>
          </div>
        </div>

        {/* Legend Grid */}
        <div className="w-2/3 grid grid-cols-2 gap-4 pl-8">
          {['ITEM 1', 'ITEM 2', 'ITEM 3', 'ITEM 4', 'ITEM 5', 'ITEM 6'].map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b border-black/10 pb-1">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-sm ${i === 0 ? 'bg-black' : 'bg-white'}`} />
                <span className="font-bold text-sm uppercase">{item}</span>
              </div>
              <span className="font-bold text-sm">{Math.floor(Math.random() * 20) + 10}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Box 2 - Bar */}
    <div className="bg-[#A78BFA] rounded-3xl p-6 mb-8 text-white shadow-lg border border-purple-500/30">
      <h3 className="text-center font-bold uppercase tracking-wider mb-2 text-black/70">CONTENT PERFORMANCE</h3>
      <div className="flex gap-8">
        <div className="w-1/3 pt-8">
          <h4 className="font-bold text-lg mb-2">Effective measurement</h4>
          <p className="text-xs opacity-80 leading-relaxed">of content in achieving the desired goal. We track user interactions across all touchpoints.</p>
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-white opacity-40" /> Performance A: 55%</div>
            <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-white opacity-70" /> Performance B: 45%</div>
            <div className="flex items-center gap-2 text-xs"><div className="w-3 h-3 rounded-full bg-white" /> Performance C: 65%</div>
          </div>
        </div>
        <div className="w-2/3 h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={[
              { name: 'Content A', sent: 30, open: 40, click: 30 },
              { name: 'Content B', sent: 20, open: 50, click: 15 },
              { name: 'Content C', sent: 15, open: 25, click: 40 },
            ]} barSize={20}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={80} tick={{ fill: 'white', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Bar dataKey="sent" stackId="a" fill="rgba(255,255,255,0.3)" radius={[4, 0, 0, 4]} />
              <Bar dataKey="open" stackId="a" fill="rgba(255,255,255,0.6)" />
              <Bar dataKey="click" stackId="a" fill="#fff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Footer Insights */}
    <div>
      <h4 className="text-center font-bold uppercase tracking-widest mb-6">KEY INSIGHTS</h4>
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="bg-[#BEF264] text-black font-bold rounded-full py-1 px-4 mb-3 inline-block text-xs uppercase">Article</div>
          <p className="text-xs text-gray-400">Informative writing that is organized to convey ideas, facts, and opinions.</p>
        </div>
        <div className="text-center">
          <div className="bg-white text-black font-bold rounded-full py-1 px-4 mb-3 inline-block text-xs uppercase">Videos</div>
          <p className="text-xs text-gray-400">Moving visual content used to convey information, entertainment.</p>
        </div>
        <div className="text-center">
          <div className="bg-[#A78BFA] text-black font-bold rounded-full py-1 px-4 mb-3 inline-block text-xs uppercase">Podcast</div>
          <p className="text-xs text-gray-400">Digital audio content that is presented in a serial or episode format.</p>
        </div>
      </div>
    </div>
  </div>
)


export default function ReportsPage() {
  // State for the generator
  const [view, setView] = useState<'config' | 'report'>('config')
  const [isGenerating, setIsGenerating] = useState(false)

  // Configuration State
  const [config, setConfig] = useState({
    title: "Executive Weekly Summary",
    period: "Last 30 Days",
    template: "summary", // summary | growth | content
    company: "WARDIERE INC."
  })

  // Generated Real-time Data State
  const [reportData, setReportData] = useState<any>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    const toastId = toast.loading("Synthesizing Intelligence Report...")

    // Simulate API call to fetch real data based on config
    // In a real app, this would be: await fetch('/api/reports/generate', { body: config })
    setTimeout(() => {
      // Generate pseudo-real data based on selection
      setReportData({
        companyName: config.company,
        reportTitle: config.title,
        chartData: generateRevenueData(1.2), // Randomize slightly
        date: new Date().toISOString()
      })

      setIsGenerating(false)
      setView('report')
      toast.success("Report Generated Successfully", { id: toastId })
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header (Always Visible) */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-[20px] font-semibold text-text-primary">Intelligence Hub</h1>
            <p className="text-[13px] text-text-secondary">Automated PDF briefs and performance summaries.</p>
          </div>
          {view === 'report' && (
            <div className="flex gap-2">
              <button onClick={() => setView('config')} className="btn btn-secondary h-8 text-xs">
                ← Back to Generator
              </button>
              <button onClick={() => window.print()} className="btn btn-primary h-8 gap-2 text-xs">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          )}
        </div>

        {/* VIEW 1: CONFIGURATOR */}
        {view === 'config' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Visual Template Selector */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-medium text-text-secondary">Select Template Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1 */}
                <div
                  onClick={() => setConfig({ ...config, template: 'summary' })}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md",
                    config.template === 'summary' ? "border-orange-500 bg-orange-50/50" : "border-border bg-white hover:border-gray-300"
                  )}
                >
                  <div className="aspect-[3/4] bg-white border border-gray-100 shadow-sm mb-3 rounded-md overflow-hidden p-2 relative">
                    {/* Mini Preview */}
                    <div className="w-full h-8 bg-orange-500 mb-2 rounded-sm" />
                    <div className="w-2/3 h-2 bg-gray-200 mb-1 rounded-sm" />
                    <div className="w-full h-2 bg-gray-100 rounded-sm" />
                    <div className="absolute bottom-2 left-2 right-2 h-16 bg-gray-50 border border-gray-100" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Annual Budget</h4>
                  <p className="text-xs text-gray-500">Clean, corporate, executive style.</p>
                </div>

                {/* Option 2 */}
                <div
                  onClick={() => setConfig({ ...config, template: 'growth' })}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md",
                    config.template === 'growth' ? "border-purple-500 bg-purple-50/50" : "border-border bg-white hover:border-gray-300"
                  )}
                >
                  <div className="aspect-[3/4] bg-white border border-gray-100 shadow-sm mb-3 rounded-md overflow-hidden p-2 relative">
                    <div className="w-full h-12 bg-purple-600 mb-2 rounded-sm" />
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      <div className="h-8 bg-purple-100 rounded-sm" />
                      <div className="h-8 bg-purple-100 rounded-sm" />
                    </div>
                    <div className="w-full h-12 bg-gray-100 rounded-sm" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Growth Opps</h4>
                  <p className="text-xs text-gray-500">Vibrant, strategic, KPI-focused.</p>
                </div>

                {/* Option 3 */}
                <div
                  onClick={() => setConfig({ ...config, template: 'content' })}
                  className={cn(
                    "cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md",
                    config.template === 'content' ? "border-[#BEF264] bg-gray-900" : "border-border bg-white hover:border-gray-300"
                  )}
                >
                  <div className="aspect-[3/4] bg-[#111] border border-gray-800 shadow-sm mb-3 rounded-md overflow-hidden p-2 relative">
                    <div className="w-full h-8 bg-transparent border-b border-gray-700 mb-2" />
                    <div className="w-24 h-24 rounded-full border-4 border-[#BEF264] mx-auto mb-2" />
                  </div>
                  <h4 className={cn("font-bold text-sm", config.template === 'content' ? "text-white" : "text-gray-900")}>Engagement</h4>
                  <p className={cn("text-xs", config.template === 'content' ? "text-gray-400" : "text-gray-500")}>Dark mode, neon, high contrast.</p>
                </div>
              </div>
            </div>

            {/* Settings Panel */}
            <div className="card p-6 space-y-6 h-fit">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-4 h-4 text-text-tertiary" />
                <h3 className="text-[13px] font-bold uppercase text-text-secondary">Report Configuration</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-text-tertiary">Report Title</label>
                  <input
                    type="text"
                    className="input"
                    value={config.title}
                    onChange={e => setConfig({ ...config, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-text-tertiary">Company Name</label>
                  <input
                    type="text"
                    className="input"
                    value={config.company}
                    onChange={e => setConfig({ ...config, company: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase text-text-tertiary">Time Horizon</label>
                  <select
                    className="input"
                    value={config.period}
                    onChange={e => setConfig({ ...config, period: e.target.value })}
                  >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last Quarter</option>
                    <option>Year to Date</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn btn-primary w-full h-10 justify-center"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Data...</span>
                ) : (
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> Generate Report</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: RENDERED REPORT */}
        {view === 'report' && (
          <div className="min-h-screen pb-20 overflow-x-auto print:overflow-visible">
            {config.template === 'summary' && <ReportSummary data={reportData} />}
            {config.template === 'growth' && <GrowthOpportunities data={reportData} />}
            {config.template === 'content' && <ContentEngagement data={reportData} />}
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
