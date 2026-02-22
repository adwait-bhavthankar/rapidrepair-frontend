'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, User, LayoutDashboard, Search, Hammer, ChevronDown } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-md group-hover:scale-110 transition-transform">
              <Hammer size={20} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              Rapid<span className="text-blue-100 opacity-80">Repair</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1 items-center">
            {user ? (
              <>
                <NavLink href="/dashboard" active={isActive('/dashboard')}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </NavLink>

                {user.role === 'customer' && (
                  <NavLink href="/workers" active={isActive('/workers')}>
                    <Search size={18} />
                    Find Workers
                  </NavLink>
                )}

                {user.role === 'worker' && (
                  <NavLink href="/profile" active={isActive('/profile')}>
                    <User size={18} />
                    My Profile
                  </NavLink>
                )}

                {/* Divider */}
                <div className="h-6 w-[1px] bg-white/20 mx-3" />

                {/* User Info & Logout */}
                <div className="flex items-center gap-4 pl-2">
                  <div className="flex flex-col items-end mr-1">
                    <span className="text-sm font-bold text-white leading-none">
                      {user.username}
                    </span>
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest leading-none mt-1 opacity-80">
                      {user.role}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-blue-500/40 hover:bg-rose-500 text-white px-3 py-2 rounded-xl border border-white/10 transition-all active:scale-95 shadow-inner"
                  >
                    <LogOut size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="px-5 py-2 text-sm font-bold text-blue-50 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-white text-blue-600 px-6 py-2.5 rounded-full text-sm font-black hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-900/30 transition-all active:scale-95 uppercase tracking-wide"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button className="p-2 text-white opacity-80 hover:opacity-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* --- Styled Nav Link Sub-component --- */
function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
        ${active 
          ? 'bg-white/20 text-white ring-1 ring-white/30 shadow-inner' 
          : 'text-blue-50 hover:text-white hover:bg-white/10'
        }
      `}
    >
      {children}
    </Link>
  );
}