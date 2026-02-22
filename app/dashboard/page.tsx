'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  User, 
  Plus, 
  Settings, 
  MoreVertical,
  ChevronRight,
  AlertCircle,
  LogOut,
  Check,
  X
} from 'lucide-react';

interface Booking {
  _id: string;
  service: string;
  bookingDate: string;
  status: string;
  customer?: { username: string; email: string };
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const fetchBookings = async () => {
    if (!user) return;
    const data = user.role === 'customer' 
      ? await api.bookings.getCustomer() 
      : await api.bookings.getWorker();
    setBookings(data);
  };

  useEffect(() => { fetchBookings(); }, [user]);

  const handleStatusUpdate = async (bookingId: string, status: 'accepted' | 'cancelled') => {
    setUpdatingId(bookingId);
    try {
      await api.bookings.updateStatus(bookingId, status);
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }), [bookings]);

  if (loading || !user) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">
                {user.role === 'customer' ? 'Service Overview' : 'Incoming Jobs'}
              </h1>
              <p className="text-slate-500">Manage your tasks and schedule.</p>
            </div>
            
            {user.role === 'customer' && (
              <Link href="/workers" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5 font-medium">
                <Plus size={18} />
                New Booking
              </Link>
            )}
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <QuickStat label="Active Requests" value={stats.pending + stats.accepted} icon={<Clock className="text-orange-500" />} color="orange" />
            <QuickStat label="Completed" value={stats.completed} icon={<CheckCircle2 className="text-emerald-500" />} color="emerald" />
            <QuickStat label="Total Volume" value={stats.total} icon={<LayoutDashboard className="text-indigo-500" />} color="indigo" />
          </div>

          {/* Table Area */}
          <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Recent Transactions</h3>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {(user.role === 'worker' ? ['all', 'pending', 'accepted', 'completed'] : ['all', 'pending', 'completed']).map((t) => (
                  <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${activeTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {bookings.length === 0 ? (
              <div className="p-20 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-50 text-slate-300 mb-4">
                  <AlertCircle size={32} />
                </div>
                <h4 className="text-slate-900 font-bold">Nothing here yet</h4>
                <p className="text-slate-500 text-sm">Your bookings will appear here once they are created.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-slate-50/50">
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Service</th>
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                      {user.role === 'worker' && (
                        <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                      )}
                      <th className="px-8 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings
                      .filter(b => activeTab === 'all' || b.status === activeTab)
                      .map((booking) => (
                      <tr key={booking._id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{booking.service}</p>
                              <p className="text-xs text-slate-500">ID: {booking._id.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm font-medium text-slate-600">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        {user.role === 'worker' && (
                          <td className="px-8 py-6 text-sm font-medium text-slate-600">
                            {(booking as any).customer?.username || 'Unknown'}
                          </td>
                        )}
                        <td className="px-8 py-6">
                          <StatusPill status={booking.status} />
                        </td>
                        <td className="px-8 py-6 text-right">
                          {user.role === 'worker' && booking.status === 'pending' ? (
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking._id, 'accepted'); }}
                                disabled={updatingId === booking._id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-all"
                              >
                                <Check size={14} />
                                Accept
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking._id, 'cancelled'); }}
                                disabled={updatingId === booking._id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition-all"
                              >
                                <X size={14} />
                                Reject
                              </button>
                            </div>
                          ) : user.role === 'worker' && booking.status === 'accepted' ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(booking._id, 'completed'); }}
                              disabled={updatingId === booking._id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all"
                            >
                              <CheckCircle2 size={14} />
                              Mark Complete
                            </button>
                          ) : (
                            <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                              <MoreVertical size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

/* --- Components --- */

function QuickStat({ label, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Live Data</span>
      </div>
      <p className="text-3xl font-black text-slate-900 mb-1">{value}</p>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: any = {
    pending: 'bg-orange-50 text-orange-600 ring-orange-100',
    accepted: 'bg-blue-50 text-blue-600 ring-blue-100',
    completed: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    cancelled: 'bg-rose-50 text-rose-600 ring-rose-100',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${styles[status]}`}>
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Authenticating</p>
      </div>
    </div>
  );
}