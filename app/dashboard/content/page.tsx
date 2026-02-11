'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/Toast';
import {
  Plus,
  Wand2,
  Copy,
  Trash2,
  Eye,
  Sparkles,
  Layout,
  Target,
  MessageSquare,
  Activity,
  History,
  Lightbulb
} from 'lucide-react';

const MOCK_ASSETS = [
  { id: '1', title: 'Summer Sale Hero', type: 'AD_COPY', platform: 'Meta', status: 'published', content: 'Transform your summer productivity with AI-powered task management. Get 50% off for the first 3 months!', image: 'bg-gradient-to-br from-indigo-500 to-purple-600', performance: { reach: 12500, likes: 450, comments: 82 } },
  { id: '2', title: 'B2B Lead Magnet', type: 'LANDING_PAGE', platform: 'LinkedIn', status: 'draft', content: 'Download our ultimate guide to CRM automation for enterprise teams.', image: 'bg-neutral-800', performance: { reach: 0, likes: 0, comments: 0 } },
]

export default function ContentStudioPage() {
  const [assets, setAssets] = useState<any[]>(MOCK_ASSETS);
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const [variants, setVariants] = useState<Array<{ id: string; text: string; imageUrl: string }>>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});
  const [genLoading, setGenLoading] = useState(false);
  const [form, setForm] = useState({ product: '', benefit: '', audience: '', tone: 'Professional' });

  const deleteAsset = (id: string) => {
    setAssets(assets.filter((a) => a.id !== id));
  };

  const generateCopy = async () => {
    if (!form.product || !form.benefit || !form.audience) {
      showToast('Missing details. Let\'s fix that first.', 'error');
      return;
    }
    setGenLoading(true);
    setImageLoading({});
    showToast('AI is engineering your content...', 'info');

    // Simulate API delay for polish
    setTimeout(async () => {
      try {
        const res = await fetch('/api/content/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('Generation failed');
        const data = await res.json();
        setVariants(data.variants || []);
        setCurrentIdx(0);
        showToast('Precision content ready!', 'success');
      } catch (err) {
        console.error(err);
        showToast('The AI brain is having a moment. Try again?', 'error');
        // Dummy data for demo if API fails
        setVariants([
          { id: 'v1', text: `Stop struggling with ${form.product}. Our ${form.benefit} technology helps ${form.audience} scale faster than ever. 🚀`, imageUrl: '' }
        ]);
      } finally {
        setGenLoading(false);
      }
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto bg-neutral-50/50 min-h-screen">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Intelligence Unit</span>
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 tracking-tight">Content Studio</h1>
            <p className="text-neutral-500 max-w-lg">High-converting ad assets engineered by professional-grade AI.</p>
          </div>
          <Button
            onClick={() => setShowGenerator(true)}
            className="h-14 px-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-neutral-200 transition-all hover:scale-[1.02] active:scale-95 group"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            <span className="font-bold">Engineer New Asset</span>
          </Button>
        </div>

        {/* Dynamic Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Asset Library', value: assets.length, icon: Layout, color: 'text-indigo-600' },
            { label: 'Live Campaigns', value: assets.filter(a => a.status === 'published').length, icon: Activity, color: 'text-emerald-600' },
            { label: 'Total Reach', value: '142.8K', icon: History, color: 'text-amber-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-neutral-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-4 bg-neutral-50 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {assets.map((asset) => (
            <div key={asset.id} className="group relative bg-white rounded-3xl border border-neutral-200 overflow-hidden hover:shadow-2xl hover:shadow-neutral-200 transition-all duration-500 hover:-translate-y-1">
              <div className={`h-40 ${asset.image || 'bg-neutral-100'} p-6 flex flex-col justify-between transition-all group-hover:h-48 duration-500`}>
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest ${asset.status === 'published' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {asset.status}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white rounded-xl text-neutral-900 shadow-lg hover:bg-neutral-900 hover:text-white transition-colors">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => deleteAsset(asset.id)} className="p-2 bg-white rounded-xl text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
                    <Target className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{asset.platform}</span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="font-bold text-lg text-neutral-900 line-clamp-1">{asset.title}</h3>
                <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed">{asset.content}</p>

                <div className="pt-4 flex items-center justify-between border-t border-neutral-100">
                  <div className="flex gap-4">
                    <div className="text-center">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">Reach</p>
                      <p className="text-sm font-black text-neutral-900">{asset.performance.reach / 1000}K</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">Eng.</p>
                      <p className="text-sm font-black text-neutral-900">{asset.performance.likes}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAsset(asset)}
                    className="text-neutral-900 font-bold hover:bg-neutral-50 rounded-xl"
                  >
                    Details <Eye className="h-3.5 w-3.5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State / Add New Placeholder */}
          <button
            onClick={() => setShowGenerator(true)}
            className="h-full min-h-[400px] border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center p-10 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 hover:bg-white transition-all group"
          >
            <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8" />
            </div>
            <p className="font-bold uppercase tracking-widest text-xs">New Creative Asset</p>
          </button>
        </div>

        {/* Advanced Generator Modal */}
        {showGenerator && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto">
            <div className="animate-in fade-in zoom-in duration-300 w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side: Creative Brief */}
              <div className="p-8 lg:p-12 space-y-8 bg-neutral-50 border-r border-neutral-100">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center mb-4">
                    <Wand2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900">Creative Architect</h2>
                  <p className="text-sm text-neutral-500">Fine-tune the parameters for your AI engine.</p>
                </div>

                <div className="space-y-6">
                  {[
                    { label: 'Product Focus', field: 'product', icon: Lightbulb, placeholder: 'e.g., Ultra-Light Running Shoes' },
                    { label: 'Unique Benefit', field: 'benefit', icon: Sparkles, placeholder: '30% more energy return' },
                    { label: 'Vibe / Tone', field: 'tone', type: 'select', items: ['Professional', 'Disruptive', 'Emotive', 'Urgent'] },
                  ].map((item) => (
                    <div key={item.field} className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                        {item.icon && <item.icon className="w-3.5 h-3.5" />}
                        {item.label}
                      </label>
                      {item.type === 'select' ? (
                        <select
                          className="w-full bg-white border border-neutral-200 p-3 h-12 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-neutral-200"
                          value={form.tone}
                          onChange={(e) => setForm({ ...form, tone: e.target.value })}
                        >
                          {item.items?.map(opt => <option key={opt}>{opt}</option>)}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder={item.placeholder}
                          className="w-full bg-white border border-neutral-200 p-4 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-neutral-200 transition-all"
                          value={form[item.field as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [item.field]: e.target.value })}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={generateCopy}
                    disabled={genLoading}
                    className="flex-1 h-12 bg-neutral-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {genLoading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Engineering...</span> : 'Generate Masterpiece'}
                  </Button>
                  <Button
                    onClick={() => setShowGenerator(false)}
                    className="px-6 h-12 bg-white border border-neutral-200 text-neutral-600 rounded-xl font-bold hover:bg-neutral-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>

              {/* Right Side: Preview / Results */}
              <div className="p-8 lg:p-12 relative flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 flex items-center gap-2">
                    <Eye className="w-3 h-3" />
                    Live Preview
                  </h3>
                  {variants.length > 0 && (
                    <div className="flex gap-1">
                      {variants.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all ${i === currentIdx ? 'w-6 bg-neutral-900' : 'w-2 bg-neutral-200'}`} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  {!variants.length && !genLoading && (
                    <div className="text-center space-y-4 opacity-30">
                      <Layout className="w-16 h-16 mx-auto" />
                      <p className="text-sm font-bold uppercase tracking-widest text-neutral-400">Waiting for instructions</p>
                    </div>
                  )}

                  {genLoading && (
                    <div className="space-y-6">
                      <div className="h-4 w-full bg-neutral-50 animate-pulse rounded-full" />
                      <div className="h-4 w-5/6 bg-neutral-50 animate-pulse rounded-full" />
                      <div className="h-4 w-4/6 bg-neutral-50 animate-pulse rounded-full" />
                    </div>
                  )}

                  {variants.length > 0 && !genLoading && (
                    <div className="space-y-8 animate-in slide-in-from-right duration-500">
                      <div className="relative p-6 bg-neutral-900 rounded-[2rem] text-white shadow-2xl">
                        <MessageSquare className="absolute -top-3 -left-3 w-8 h-8 text-neutral-800" />
                        <p className="text-lg font-bold leading-relaxed mb-6">{variants[currentIdx].text}</p>
                        <div className="flex items-center gap-3 border-t border-white/10 pt-6">
                          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Suggested Platform</p>
                            <p className="text-xs font-bold">Meta Content Ad</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          onClick={() => {
                            setAssets([{
                              id: Date.now().toString(),
                              title: form.product,
                              type: 'AD_COPY',
                              platform: 'Meta',
                              status: 'draft',
                              content: variants[currentIdx].text,
                              performance: { reach: 0, likes: 0, comments: 0 }
                            }, ...assets]);
                            setShowGenerator(false);
                            showToast('Asset cached in library', 'success');
                          }}
                          className="flex-1 h-12 bg-neutral-900 text-white rounded-xl font-bold"
                        >
                          Adopt Asset
                        </Button>
                        <Button
                          onClick={() => setCurrentIdx((idx) => (idx + 1) % variants.length)}
                          className="h-12 px-6 border border-neutral-200 text-neutral-900 rounded-xl font-bold hover:bg-neutral-50"
                        >
                          Next Variant
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
