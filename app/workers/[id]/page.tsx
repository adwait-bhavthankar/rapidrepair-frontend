'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Wrench, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Star,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react';

interface Worker {
  _id: string;
  user: { username: string; email: string };
  serviceCategory: string;
  experienceYears: number;
  description: string;
}

export default function BookWorker() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user && params.id) {
      api.workers.list().then((workers: Worker[]) => {
        const w = workers.find((w) => w._id === params.id);
        if (w) {
          setWorker(w);
          setService(w.serviceCategory);
        }
      });
    }
  }, [user, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.bookings.create({
        workerId: worker!._id,
        service,
        bookingDate: date,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to process booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading || !user || !worker) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Preparing Checkout...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10">
      {/* Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to search
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left: Form Column */}
        <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 p-8 md:p-12 relative overflow-hidden">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Confirm Details</h2>
              <p className="text-slate-500 font-medium mt-1">Specify your service requirements and preferred time.</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-700 p-4 rounded-2xl mb-8">
                <Info size={20} className="text-rose-500" />
                <p className="text-sm font-bold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                {/* Service Type */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                    Service Required
                  </label>
                  <div className="relative group">
                    <Wrench className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900 placeholder:text-slate-500"
                      placeholder="e.g. Bathroom Sink Repair"
                      required
                    />
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                    Preferred Date
                  </label>
                  <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all font-bold text-slate-900"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-200 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                  <span>Confirm Booking</span>
                </button>
                <p className="mt-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Secure booking • No upfront payment required
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Summary Sidebar */}
        <div className="lg:col-span-1 sticky top-28 order-1 lg:order-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-black text-2xl shadow-inner">
                  {worker.user.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {worker.user.username}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-500 mt-1">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-black">4.9 Rating</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Wrench size={16} className="text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">{worker.serviceCategory}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Clock size={16} className="text-blue-500" />
                  <span className="text-xs font-bold uppercase tracking-wider">{worker.experienceYears} Years Exp.</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Professional Bio</p>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{worker.description}"
                </p>
              </div>
            </div>

            <div className="bg-blue-600 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Pro</span>
              </div>
              <ChevronRight size={18} className="opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}