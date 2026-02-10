"use client"

import DashboardLayout from "@/components/dashboard-layout"
import {
  FileText,
  Download,
  Share2,
  Calendar,
  FileBarChart,
  Eye,
} from "lucide-react"

const REPORTS = [
  { id: 1, name: "January 2024 Performance", date: "Feb 1, 2024", type: "Monthly", status: "Ready" },
  { id: 2, name: "Q4 2023 Review", date: "Jan 5, 2024", type: "Quarterly", status: "Ready" },
  { id: 3, name: "Meta Ads Deep Dive", date: "Jan 12, 2024", type: "Ad-hoc", status: "Ready" },
]

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Reports</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Professional, client-ready exports</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-white bg-neutral-900 px-4 py-2 rounded-lg hover:bg-neutral-800">
            <FileBarChart className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORTS.map((report) => (
            <div key={report.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-neutral-50 rounded-lg flex items-center justify-center group-hover:bg-neutral-100 transition-colors">
                  <FileText className="w-5 h-5 text-neutral-500 group-hover:text-neutral-900" />
                </div>
                <span className="text-xs font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {report.status}
                </span>
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-1 leading-snug">{report.name}</h3>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mb-5">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {report.date}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-300" />
                <span>{report.type}</span>
              </div>
              <div className="flex items-center gap-2 pt-4 border-t border-neutral-100">
                <button className="flex-1 py-2 text-xs font-medium text-neutral-700 bg-neutral-50 rounded-lg hover:bg-neutral-100 flex items-center justify-center gap-2">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button className="flex-1 py-2 text-xs font-medium text-neutral-700 bg-neutral-50 rounded-lg hover:bg-neutral-100 flex items-center justify-center gap-2">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
