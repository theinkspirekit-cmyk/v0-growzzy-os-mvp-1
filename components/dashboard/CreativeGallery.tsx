'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit2, Share2, Copy, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { getCreatives, deleteCreative, publishCreative } from '@/app/actions/creatives'
import Image from 'next/image'

interface Creative {
  id: string
  name: string
  type: string
  format: string
  headline?: string
  bodyText?: string
  imageUrl?: string
  aiScore?: number
  status: string
  createdAt: Date
}

export function CreativeGallery() {
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchCreatives()
  }, [filter])

  const fetchCreatives = async () => {
    try {
      setLoading(true)
      const data = await getCreatives()
      const filtered = filter === 'all' ? data : data.filter((c: any) => c.status === filter)
      setCreatives(filtered)
    } catch (error) {
      console.error('Failed to fetch creatives:', error)
      toast.error('Failed to load creatives')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this creative?')) return

    try {
      const result = await deleteCreative(id)
      if (result.success) {
        toast.success('Creative deleted')
        fetchCreatives()
      } else {
        toast.error(result.error || 'Failed to delete creative')
      }
    } catch (error) {
      toast.error('Failed to delete creative')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const result = await publishCreative(id)
      if (result.success) {
        toast.success('Creative published')
        fetchCreatives()
      } else {
        toast.error(result.error || 'Failed to publish creative')
      }
    } catch (error) {
      toast.error('Failed to publish creative')
    }
  }

  if (loading) {
    return (
      <div className={view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-2'}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-48 md:h-64 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Creatives</h3>
        <div className="flex gap-2">
          {['all', 'draft', 'published'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1 text-sm rounded-lg font-medium transition ${
                filter === status ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="px-3 py-1 text-sm bg-gray-100 rounded-lg font-medium"
          >
            {view === 'grid' ? 'List' : 'Grid'}
          </button>
        </div>
      </div>

      {creatives.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No creatives found</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {creatives.map(creative => (
            <div
              key={creative.id}
              className="group relative bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {creative.imageUrl && (
                <Image
                  src={creative.imageUrl}
                  alt={creative.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                />
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                  <Edit2 className="w-5 h-5 text-gray-900" />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                  <Share2 className="w-5 h-5 text-gray-900" />
                </button>
                <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                  <Copy className="w-5 h-5 text-gray-900" />
                </button>
              </div>

              {/* Info */}
              <div className="p-3 bg-white">
                <p className="text-sm font-semibold text-gray-900 truncate">{creative.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    creative.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {creative.status}
                  </span>
                  {creative.aiScore && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-orange-500" />
                      <span className="text-xs font-semibold">{creative.aiScore}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {creatives.map(creative => (
            <div key={creative.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition flex items-center justify-between">
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{creative.name}</p>
                <p className="text-sm text-gray-600 mt-1">{creative.format}</p>
              </div>

              <div className="flex items-center gap-3">
                {creative.aiScore && (
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold">{creative.aiScore}%</span>
                  </div>
                )}
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  creative.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {creative.status}
                </span>
                {creative.status === 'draft' && (
                  <button
                    onClick={() => handlePublish(creative.id)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={() => handleDelete(creative.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
