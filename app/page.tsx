'use client';

import Link from 'next/link';
import { 
  Search, 
  CalendarCheck, 
  ShieldCheck, 
  ArrowRight, 
  Wrench, 
  Zap, 
  Shield,
  Hammer,
  Twitter,
  Linkedin,
  Github
} from 'lucide-react';

export default function Home() {
  return (
    <div className="relative isolate overflow-hidden bg-blue-50/30 min-h-screen flex flex-col">
      
      {/* Background Decorative Element */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),white)] opacity-60" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-blue-600/5 ring-1 ring-blue-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* REDUCED BOTTOM PADDING HERE: Removed sm:pb-32 and changed pb-24 to pb-12 */}
        <div className="mx-auto max-w-7xl px-6 pb-12 pt-8 lg:flex lg:px-8 lg:pt-16">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-2">
            {/* Badge */}
            <div className="mb-8 flex">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10 hover:ring-indigo-600/20 bg-indigo-50/50 font-medium transition-all">
                Trusted by 5,000+ households <ArrowRight className="inline-block ml-1" size={14} />
              </div>
            </div>

            {/* Hero Content */}
            <h1 className="mt-2 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              Repairing your home, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                simplified.
              </span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Stop scrolling through endless directories. RapidRepair connects you with 
              verified, professional technicians in under 60 seconds. Quality service, 
              guaranteed pricing.
            </p>

            <div className="mt-10 flex items-center gap-x-6">
              <Link
                href="/register"
                className="rounded-full bg-indigo-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:-translate-y-1 active:scale-95"
              >
                Get Started
              </Link>
              <Link href="/workers" className="text-lg font-bold leading-6 text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
                Browse Workers <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>

            {/* Social Proof Mini */}
            <div className="mt-12 flex items-center gap-4 text-slate-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                    <div className="bg-slate-300 h-full w-full" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">Join 200+ technicians today</p>
            </div>
          </div>

          {/* Hero Features / Image Placeholder */}
          <div className="mx-auto mt-16 flex max-w-2xl lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FeatureHighlight 
                  icon={<Zap className="text-amber-500" />} 
                  title="Express Booking" 
                  desc="Schedule a pro in minutes, not hours."
                />
                <FeatureHighlight 
                  icon={<Shield className="text-indigo-500" />} 
                  title="Verified Pros" 
                  desc="Every worker is background checked."
                />
                <div className="sm:col-span-2 bg-slate-900 rounded-3xl p-8 text-white flex flex-col justify-end min-h-[200px] shadow-2xl relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Wrench size={120} />
                   </div>
                   <h3 className="text-2xl font-bold mb-2">Ready to work?</h3>
                   <p className="text-slate-400 mb-6">Apply as a service provider and grow your business.</p>
                   <Link href="/register" className="text-indigo-400 font-bold flex items-center gap-1 hover:text-indigo-300">
                     Register as Worker <ArrowRight size={16} />
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        {/* TIGHTENED TOP MARGIN HERE */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24 mt-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-bold leading-7 text-indigo-600 uppercase tracking-widest">How it works</h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Three steps to a perfect home
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard 
              icon={<Search className="w-8 h-8" />} 
              step="01" 
              title="Search" 
              desc="Enter your service needs and compare profiles of top-rated workers near you." 
            />
            <StepCard 
              icon={<CalendarCheck className="w-8 h-8" />} 
              step="02" 
              title="Schedule" 
              desc="Pick a date and time that fits your life. No phone calls required." 
            />
            <StepCard 
              icon={<ShieldCheck className="w-8 h-8" />} 
              step="03" 
              title="Relax" 
              desc="Your technician arrives on time. Pay securely through the platform only when done." 
            />
          </div>
        </div>
      </main>

      {/* --- Medium Sized Footer --- */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <Hammer size={18} fill="currentColor" />
                </div>
                <span className="text-xl font-black tracking-tighter text-slate-900">
                  Rapid<span className="text-indigo-600">Repair</span>
                </span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Connecting you with verified professionals for all your home maintenance needs.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Platform</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li><Link href="/workers" className="hover:text-indigo-600 transition-colors">Browse Workers</Link></li>
                <li><Link href="/register" className="hover:text-indigo-600 transition-colors">Join as Professional</Link></li>
                <li><Link href="/login" className="hover:text-indigo-600 transition-colors">Sign In</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Support</h4>
              <ul className="space-y-4 text-sm font-medium text-slate-500">
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Trust & Safety</Link></li>
                <li><Link href="#" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-bold text-slate-900 mb-6 uppercase text-[11px] tracking-widest">Connect</h4>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                  <Twitter size={18} />
                </button>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                  <Linkedin size={18} />
                </button>
                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                  <Github size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs font-medium">
              © {new Date().getFullYear()} RapidRepair Inc. All rights reserved.
            </p>
            <div className="flex gap-6 text-xs font-medium text-slate-400">
              <Link href="#" className="hover:text-slate-600">Privacy Policy</Link>
              <Link href="#" className="hover:text-slate-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* --- Sub-components --- */

function FeatureHighlight({ icon, title, desc }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </div>
  );
}

// UPGRADED STEPCARD WITH "BLUE ON HOVER" EFFECT
function StepCard({ icon, step, title, desc }: any) {
  return (
    <div className="relative group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-200/50 hover:border-blue-300 overflow-hidden">
      
      {/* Giant Background Number */}
      <div className="absolute top-6 right-8 text-6xl font-black text-slate-50 transition-colors duration-300 group-hover:text-blue-50">
        {step}
      </div>
      
      {/* Icon Container */}
      <div className="relative z-10 mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-300 group-hover:-rotate-3">
        {icon}
      </div>
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-slate-900 mb-3 transition-colors group-hover:text-blue-900">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}