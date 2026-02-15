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
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  // Configuration State
  const [timeHorizon, setTimeHorizon] = useState("Last 30 Days")

  const handleGenerate = () => {
    setIsGenerating(true)
    const toastId = toast.loading("Initializing Neural Audit Protocol...")

    setTimeout(() => {
      setReportData({
        companyName: "GROWZZY INC.",
        reportTitle: "Executive Intelligence Audit",
        date: new Date().toISOString(),
        timeHorizon,
        // Mock consolidated data
        summary: "Performance metrics indicate a 14.2% increase in cross-channel efficiency. Automated optimization protocols have successfully reduced CPA by $12.40 while maintaining steady conversion volume.",
        chartData: generateRevenueData(1.4),
        topMetric: "92/100",
        growthRate: "14.2",
        roi: "4.8x"
      })
      setIsGenerating(false)
      toast.success("Audit Complete", { id: toastId })
    }, 2500)
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 font-satoshi pb-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-[24px] font-bold text-text-primary tracking-tight">Executive Intelligence</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Automated Audit System</p>
            </div>
          </div>

          {reportData && (
            <div className="flex gap-3">
              <button onClick={() => setReportData(null)} className="btn-secondary h-10 text-[12px]">
                New Audit
              </button>
              <button onClick={() => window.print()} className="btn-primary h-10 text-[12px] gap-2">
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </div>
          )}
        </div>

        {!reportData ? (
          /* CONFIGURATION VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500 items-center min-h-[500px]">

            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-[32px] font-bold text-text-primary leading-tight">
                  Generate comprehensive <br /> performance audits in <br /> <span className="text-purple-600">seconds.</span>
                </h2>
                <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                  Our neural engine analyzes every touchpoint, spend metric, and creative performance signal to construct a boardroom-ready strategic document.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm max-w-md space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-secondary uppercase">Audit Time Horizon</label>
                  <select
                    value={timeHorizon}
                    onChange={(e) => setTimeHorizon(e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm font-medium outline-none focus:border-purple-500 transition-colors"
                  >
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>Last Quarter</option>
                    <option>Year to Date</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-xl shadow-purple-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Data Streams...
                    </>
                  ) : (
                    <>
                      Generate Executive Audit <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Visual Flair */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-purple-100 rounded-full blur-[100px] opacity-50" />
              <div className="relative bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="h-2 w-24 bg-gray-200 rounded mb-1" />
                    <div className="h-2 w-16 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-gray-100 rounded" />
                  <div className="h-2 w-5/6 bg-gray-100 rounded" />
                  <div className="h-2 w-4/6 bg-gray-100 rounded" />
                </div>
                <div className="mt-6 flex gap-4">
                  <div className="flex-1 h-24 bg-purple-50 rounded-xl border border-purple-100" />
                  <div className="flex-1 h-24 bg-gray-50 rounded-xl border border-gray-100" />
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* REPORT VIEW (Consolidated) */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* 1. Executive Summary Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Executive Summary</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {reportData.summary}
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Audit Score</p>
                  <p className="text-3xl font-black text-gray-900">{reportData.topMetric}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Growth Velocity</p>
                  <p className="text-3xl font-black text-purple-600">+{reportData.growthRate}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Blended ROI</p>
                  <p className="text-3xl font-black text-gray-900">{reportData.roi}</p>
                </div>
              </div>
            </div>

            {/* 2. Financial Performance */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Financial Trajectory</h2>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={reportData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, fill: '#7C3AED', strokeWidth: 2, stroke: '#fff' }} />
                    <Line type="monotone" dataKey="forecast" stroke="#E5E7EB" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Strategic Recommendations (AI Generated) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 text-white shadow-lg">
                <h3 className="flex items-center gap-2 font-bold uppercase tracking-widest mb-6 text-purple-200 text-sm">
                  <Target className="w-4 h-4" /> Primary Opportunities
                </h3>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-200 font-bold text-xs border border-purple-500/50">1</span>
                    <p className="text-sm leading-relaxed text-purple-50">Shift 15% of budget from Display to Video Reels for estimated 2.3x ROAS lift.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-200 font-bold text-xs border border-purple-500/50">2</span>
                    <p className="text-sm leading-relaxed text-purple-50">Activate lookalike audience "High_LTV_Purchasers" on Meta.</p>
                  </li>
                  <li className="flex gap-4">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-200 font-bold text-xs border border-purple-500/50">3</span>
                    <p className="text-sm leading-relaxed text-purple-50">Refresh ad creative for "Summer Campaign" to combat fatigue (CTR -0.5%).</p>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="flex items-center gap-2 font-bold uppercase tracking-widest mb-6 text-gray-400 text-sm">
                    <AlertTriangle className="w-4 h-4" /> Risk Mitigation
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    Current CPM volatility suggests a potential 10-15% cost increase in Q3. Recommendation: Lock in placement bids early or diversify platform spend.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex gap-3 text-orange-800 text-xs font-medium">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Action Required: Review bid caps on Google Search campaigns.</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
