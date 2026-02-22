'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Loader2, 
  Wrench, 
  Clock, 
  Star, 
  MapPin,
  ArrowRight,
  Filter,
  LayoutGrid,
  Map
} from 'lucide-react';
import dynamic from 'next/dynamic';

const WorkerMap = dynamic(() => import('@/components/WorkerMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-slate-100 rounded-3xl flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={32} />
    </div>
  )
});

interface Worker {
  _id: string;
  user: { username: string; email: string };
  serviceCategory: string;
  experienceYears: number;
  description: string;
  location?: { lat: number; lng: number; address: string };
}

export default function WorkersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.workers.list(false).then((data: Worker[]) => {
        setWorkers(data);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }
  }, [user]);

  const categories = ['all', ...new Set(workers.map(w => w.serviceCategory).filter(Boolean))];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || worker.serviceCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (authLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Find Workers</h1>
        <p className="text-slate-500 font-medium">Browse professionals and book a service</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900 placeholder:text-slate-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-12 pr-10 py-3 bg-white border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900 appearance-none cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="flex bg-white border border-slate-300 rounded-2xl p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid size={18} />
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              viewMode === 'map' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Map size={18} />
            Map
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="animate-spin text-blue-600" size={40} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Finding workers...</p>
        </div>
      ) : filteredWorkers.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No workers found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : viewMode === 'map' ? (
        <div className="h-[600px] border border-slate-300 rounded-3xl overflow-hidden">
          <WorkerMap workers={filteredWorkers} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map(worker => (
            <WorkerCard key={worker._id} worker={worker} />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkerCard({ worker }: { worker: Worker }) {
  const router = useRouter();

  return (
    <div 
      className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 cursor-pointer group overflow-hidden"
      onClick={() => router.push(`/workers/${worker._id}`)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl shadow-inner">
            {worker.user.username[0].toUpperCase()}
          </div>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <span className="text-xs font-black">4.9</span>
          </div>
        </div>

        <h3 className="text-lg font-black text-slate-900 mb-1">{worker.user.username}</h3>
        
        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
          <Wrench size={14} className="text-blue-500" />
          {worker.serviceCategory || 'General Service'}
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {worker.description || 'No description available'}
        </p>

        <div className="flex items-center gap-3 text-slate-500 text-xs font-bold uppercase tracking-wider mb-4">
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-blue-500" />
            <span>{worker.experienceYears} Years</span>
          </div>
          {worker.location?.address && (
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-blue-500" />
              <span className="truncate max-w-[120px]">{worker.location.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">View Profile</span>
        <ArrowRight size={18} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
