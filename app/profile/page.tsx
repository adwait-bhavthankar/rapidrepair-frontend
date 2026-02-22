'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { 
  Wrench, 
  Briefcase, 
  AlignLeft, 
  MapPin, 
  Save, 
  CheckCircle2, 
  Loader2,
  ShieldCheck,
  Navigation
} from 'lucide-react';

// Refined Skeleton for Map
const LocationPicker = dynamic(() => import('@/components/LocationPicker'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl flex flex-col items-center justify-center text-slate-400 gap-3">
      <Navigation className="animate-bounce" size={24} />
      <p className="text-[10px] font-black uppercase tracking-widest">Loading Map Widget...</p>
    </div>
  )
});

interface WorkerProfile {
  serviceCategory: string;
  experienceYears: number;
  description: string;
  verified: boolean;
  location: {
    lat: number | null;
    lng: number | null;
    address: string;
  };
}

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [serviceCategory, setServiceCategory] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState({ lat: null as number | null, lng: null as number | null, address: '' });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user && user.role !== 'worker') router.push('/dashboard');
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role === 'worker') {
      api.workers.getProfile().then((p: WorkerProfile) => {
        if (p) {
          setServiceCategory(p.serviceCategory || '');
          setExperienceYears(p.experienceYears || 0);
          setDescription(p.description || '');
          if (p.location) setLocation(p.location);
        }
        setIsInitialLoading(false);
      }).catch(() => setIsInitialLoading(false));
    }
  }, [user]);

  const handleLocationChange = (newLocation: { lat: number; lng: number }) => {
    setLocation({ ...newLocation, address: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.workers.updateProfile({ 
        serviceCategory, 
        experienceYears, 
        description,
        location
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isInitialLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Worker Profile</h1>
          <p className="text-slate-600 font-medium mt-1">Manage your service details and visibility.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 shadow-sm self-start">
          <ShieldCheck size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Verified Account</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 items-start">
        {/* Form Column */}
        <div className="xl:col-span-3 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-8 md:p-12">
            {saved && (
              <div className="flex items-center gap-3 bg-emerald-600 text-white p-4 rounded-2xl mb-8 animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle2 size={20} />
                <p className="text-sm font-bold">Success! Your profile is now live.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Service Category</label>
                  <div className="relative">
                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900 placeholder:text-slate-400"
                      placeholder="e.g., Professional Plumber"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Years of Exp.</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="number"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(parseInt(e.target.value))}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Professional Bio</label>
                <div className="relative">
                  <AlignLeft className="absolute left-4 top-4 text-slate-400" size={18} />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900 placeholder:text-slate-400 min-h-[160px]"
                    placeholder="Describe your background and specialties..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-200 disabled:opacity-70"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        </div>

        {/* Map Column - STRETCH FIX APPLIED HERE */}
        <div className="xl:col-span-2 sticky top-28">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col h-fit">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <MapPin size={18} />
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-tighter">Service Hub</h3>
              </div>
              <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded-md uppercase tracking-wider">Live Pin</span>
            </div>
            
            {/* Map Wrapper with Square Aspect Ratio to avoid Elongation */}
            <div className="relative aspect-square w-full p-4">
              <div className="h-full w-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner">
                <LocationPicker location={location} onLocationChange={handleLocationChange} />
              </div>
            </div>

            {/* Added Coordinate Display to fill space naturally */}
            <div className="p-6 border-t border-slate-50">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Coordinates</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                  <Navigation className="text-slate-400" size={14} />
                  <span className="text-xs font-mono text-slate-600 font-bold tracking-tight">
                    {location.lat ? `${location.lat.toFixed(6)}, ${location.lng?.toFixed(6)}` : 'Location not pinned'}
                  </span>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </div>
  );
}