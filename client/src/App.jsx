import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Flame, 
  Cpu, 
  Radio, 
  Globe2, 
  Database,
  CheckCircle2,
  ExternalLink,
  ShieldHalf,
  FileCheck2,
  Activity,
  Layers
} from 'lucide-react';
import Header from './components/Header';
import Inspector from './components/Inspector';
import ThreatFeed from './components/ThreatFeed';
import HistoryView from './components/HistoryView';
import LandingPage from './components/LandingPage';
import { saveScan, loadScans, subscribeUserScans } from './lib/store';
import { checkHealth } from './lib/scanApi';
import { useAuth } from './context/AuthContext';
import { pageVariants } from './components/ui';

function AmbientSecurityBackdrop() {
  // Organically scattered, randomized 3D security emblems with irregular offsets (no straight lines, no grid columns)
  const emblems = [
    // Random Left-Flank Clusters & Singletons - with mobile breakpoint awareness
    { top: '3.5%', left: '4%', Icon: ShieldCheck, color: 'text-blue-500 dark:text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-500/10 dark:bg-blue-500/15', shadow: 'shadow-[0_8px_20px_rgba(59,130,246,0.12)]', delay: '0s', size: 'w-6 h-6 sm:w-8 sm:h-8', mobile: true },
    { top: '11%', left: '11.5%', Icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', shadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.12)]', delay: '1.8s', size: 'w-5 h-5 sm:w-6 sm:h-6', mobile: false },
    { top: '17.5%', left: '2.5%', Icon: Flame, color: 'text-amber-500 dark:text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-500/10 dark:bg-amber-500/15', shadow: 'shadow-[0_8px_20px_rgba(245,158,11,0.12)]', delay: '2.1s', size: 'w-5 h-5 sm:w-7 sm:h-7', mobile: true },
    { top: '25%', left: '9%', Icon: Cpu, color: 'text-violet-500 dark:text-violet-400', border: 'border-violet-400/30', bg: 'bg-violet-500/10 dark:bg-violet-500/15', shadow: 'shadow-[0_8px_20px_rgba(139,92,246,0.12)]', delay: '2.8s', size: 'w-4 h-4 sm:w-6 sm:h-6', mobile: false },
    { top: '32%', left: '1.5%', Icon: ShieldAlert, color: 'text-rose-500 dark:text-rose-400', border: 'border-rose-400/30', bg: 'bg-rose-500/10 dark:bg-rose-500/15', shadow: 'shadow-[0_8px_20px_rgba(244,63,94,0.12)]', delay: '4.4s', size: 'w-6 h-6 sm:w-7 sm:h-7', mobile: true },
    { top: '39%', left: '13%', Icon: Globe2, color: 'text-cyan-500 dark:text-cyan-400', border: 'border-cyan-400/30', bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', shadow: 'shadow-[0_8px_20px_rgba(6,182,212,0.12)]', delay: '3.6s', size: 'w-5 h-5 sm:w-6 sm:h-6', mobile: false },
    { top: '47%', left: '5.5%', Icon: Lock, color: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', shadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.12)]', delay: '4.2s', size: 'w-6 h-6 sm:w-8 sm:h-8', mobile: true },
    { top: '54.5%', left: '11%', Icon: ShieldCheck, color: 'text-blue-500 dark:text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-500/10 dark:bg-blue-500/15', shadow: 'shadow-[0_8px_20px_rgba(59,130,246,0.12)]', delay: '1.1s', size: 'w-5 h-5 sm:w-7 sm:h-7', mobile: false },
    { top: '61%', left: '2%', Icon: Database, color: 'text-cyan-500 dark:text-cyan-400', border: 'border-cyan-400/30', bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', shadow: 'shadow-[0_8px_20px_rgba(6,182,212,0.12)]', delay: '1.7s', size: 'w-5 h-5 sm:w-7 sm:h-7', mobile: true },
    { top: '68%', left: '8%', Icon: Flame, color: 'text-rose-500 dark:text-rose-400', border: 'border-rose-400/30', bg: 'bg-rose-500/10 dark:bg-rose-500/15', shadow: 'shadow-[0_8px_20px_rgba(244,63,94,0.12)]', delay: '4.8s', size: 'w-5 h-5 sm:w-6 sm:h-6', mobile: false },
    { top: '75%', left: '13.5%', Icon: FileCheck2, color: 'text-teal-500 dark:text-teal-400', border: 'border-teal-400/30', bg: 'bg-teal-500/10 dark:bg-teal-500/15', shadow: 'shadow-[0_8px_20px_rgba(20,184,166,0.12)]', delay: '3.3s', size: 'w-5 h-5 sm:w-7 sm:h-7', mobile: false },
    { top: '82%', left: '3.5%', Icon: ShieldHalf, color: 'text-purple-500 dark:text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-500/10 dark:bg-purple-500/15', shadow: 'shadow-[0_8px_20px_rgba(168,85,247,0.12)]', delay: '2.3s', size: 'w-5 h-5 sm:w-7 sm:h-7', mobile: true },
    { top: '89%', left: '10%', Icon: Activity, color: 'text-sky-500 dark:text-sky-400', border: 'border-sky-400/30', bg: 'bg-sky-500/10 dark:bg-sky-500/15', shadow: 'shadow-[0_8px_20px_rgba(14,165,233,0.12)]', delay: '5s', size: 'w-5 h-5 sm:w-7 sm:h-7', mobile: false },
    { top: '96%', left: '4%', Icon: ShieldCheck, color: 'text-indigo-500 dark:text-indigo-400', border: 'border-indigo-400/30', bg: 'bg-indigo-500/10 dark:bg-indigo-500/15', shadow: 'shadow-[0_8px_20px_rgba(99,102,241,0.12)]', delay: '1.4s', size: 'w-6 h-6 sm:w-8 sm:h-8', mobile: true },

    // Random Right-Flank Clusters & Singletons - with mobile breakpoint awareness
    { top: '4.5%', right: '3%', Icon: Lock, color: 'text-purple-500 dark:text-purple-400', border: 'border-purple-400/30', bg: 'bg-purple-500/10 dark:bg-purple-500/15', shadow: 'shadow-[0_8px_20px_rgba(168,85,247,0.12)]', delay: '1.2s', size: 'w-6 h-6 sm:w-8 sm:h-8', mobile: true },
    { top: '12%', right: '12%', Icon: Database, color: 'text-cyan-500 dark:text-cyan-400', border: 'border-cyan-400/30', bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', shadow: 'shadow-[0_8px_20px_rgba(6,182,212,0.12)]', delay: '2.3s', size: 'w-5 h-5 sm:w-6 sm:h-6', mobile: false },
    { top: '19%', right: '5%', Icon: ShieldCheck, color: 'text-blue-500 dark:text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-500/10 dark:bg-blue-500/15', shadow: 'shadow-[0_8px_20px_rgba(59,130,246,0.12)]', delay: '3.5s', size: 'w-5 h-5 sm:w-7 sm:h-7', mobile: true },
    { top: '26.5%', right: '13.5%', Icon: Flame, color: 'text-amber-500 dark:text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-500/10 dark:bg-amber-500/15', shadow: 'shadow-[0_8px_20px_rgba(245,158,11,0.12)]', delay: '1.5s', size: 'w-5 h-5 sm:w-6 sm:h-6', mobile: false },
    { top: '34%', right: '2%', Icon: Globe2, color: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', shadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.12)]', delay: '0.9s', size: 'w-6 h-6 sm:w-7 sm:h-7', mobile: true },
    { top: '42%', right: '10.5%', Icon: ShieldAlert, color: 'text-cyan-500 dark:text-cyan-400', border: 'border-cyan-400/30', bg: 'bg-cyan-500/10 dark:bg-cyan-500/15', shadow: 'shadow-[0_8px_20px_rgba(6,182,212,0.12)]', delay: '0.8s', size: 'w-6 h-6 sm:w-8 sm:h-8', mobile: false },
    { top: '49%', right: '3.5%', Icon: CheckCircle2, color: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', shadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.12)]', delay: '4.5s', size: 'w-6 h-6 sm:w-8 sm:h-8', mobile: true },
    { top: '56%', right: '12%', Icon: Layers, color: 'text-indigo-500 dark:text-indigo-400', border: 'border-indigo-400/30', bg: 'bg-indigo-500/10 dark:bg-indigo-500/15', shadow: 'shadow-[0_8px_20px_rgba(99,102,241,0.12)]', delay: '3.7s', size: 'w-4 h-4 sm:w-6 sm:h-6', mobile: false },
    { top: '64%', right: '5%', Icon: ShieldAlert, color: 'text-amber-500 dark:text-amber-400', border: 'border-amber-400/30', bg: 'bg-amber-500/10 dark:bg-amber-500/15', shadow: 'shadow-[0_8px_20px_rgba(245,158,11,0.12)]', delay: '4.6s', size: 'w-5 h-5 sm:w-7 sm:h-7', mobile: true },
    { top: '71%', right: '13%', Icon: FileCheck2, color: 'text-teal-500 dark:text-teal-400', border: 'border-teal-400/30', bg: 'bg-teal-500/10 dark:bg-teal-500/15', shadow: 'shadow-[0_8px_20px_rgba(20,184,166,0.12)]', delay: '2.9s', size: 'w-4 h-4 sm:w-6 sm:h-6', mobile: false },
    { top: '78%', right: '2%', Icon: Cpu, color: 'text-violet-500 dark:text-violet-400', border: 'border-violet-400/30', bg: 'bg-violet-500/10 dark:bg-violet-500/15', shadow: 'shadow-[0_8px_20px_rgba(139,92,246,0.12)]', delay: '1.9s', size: 'w-5 h-5 sm:w-7 sm:h-7', mobile: true },
    { top: '85%', right: '11%', Icon: ShieldAlert, color: 'text-rose-500 dark:text-rose-400', border: 'border-rose-400/30', bg: 'bg-rose-500/10 dark:bg-rose-500/15', shadow: 'shadow-[0_8px_20px_rgba(244,63,94,0.12)]', delay: '3.4s', size: 'w-4 h-4 sm:w-6 sm:h-6', mobile: false },
    { top: '91%', right: '4%', Icon: Radio, color: 'text-blue-500 dark:text-blue-400', border: 'border-blue-400/30', bg: 'bg-blue-500/10 dark:bg-blue-500/15', shadow: 'shadow-[0_8px_20px_rgba(59,130,246,0.12)]', delay: '3.1s', size: 'w-5 h-5 sm:w-6 sm:h-6', mobile: true },
    { top: '96.5%', right: '8%', Icon: ShieldCheck, color: 'text-emerald-500 dark:text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-500/10 dark:bg-emerald-500/15', shadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.12)]', delay: '3.8s', size: 'w-6 h-6 sm:w-7 sm:h-7', mobile: false },
  ];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Dynamic Aurora Atmospheric Orbs */}
      <div
        className="aurora-orb orb-a -left-[18vw] -top-[22vh] h-[52vw] max-h-[760px] w-[52vw] min-w-[420px]"
        style={{ background: 'var(--aurora-1)' }}
      />
      <div
        className="aurora-orb orb-b -right-[14vw] top-[8vh] h-[46vw] max-h-[680px] w-[46vw] min-w-[380px]"
        style={{ background: 'var(--aurora-2)' }}
      />
      <div
        className="aurora-orb orb-c -bottom-[24vh] left-[22vw] h-[44vw] max-h-[640px] w-[44vw] min-w-[360px]"
        style={{ background: 'var(--aurora-3)' }}
      />

      {/* Ambient Random Floating Cybersecurity 3D Emblems - Mobile Optimized (lighter on small screens, full on tablet/desktop) */}
      {emblems.map((item, idx) => {
        const IconComponent = item.Icon;
        return (
          <div
            key={idx}
            className={`absolute pointer-events-none float-slow z-0 ${item.mobile ? 'block' : 'hidden md:block'}`}
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: item.delay,
            }}
          >
            <div
              className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl ${item.bg} border ${item.border} backdrop-blur-md ${item.shadow} transition-transform duration-700 hover:scale-105`}
            >
              <IconComponent className={`${item.size} ${item.color} opacity-60 sm:opacity-70 dark:opacity-75 sm:dark:opacity-85 stroke-[1.6] sm:stroke-[1.8] drop-shadow-[0_4px_10px_rgba(0,0,0,0.12)]`} />
            </div>
          </div>
        );
      })}

      {/* Extra Soft Ambient Watermarks */}
      <div className="absolute top-1/2 -left-12 opacity-15 dark:opacity-20 text-blue-500 pointer-events-none float-slow" style={{ animationDelay: '4s' }}>
        <ShieldCheck className="w-48 h-48 stroke-[1]" />
      </div>
      <div className="absolute top-2/3 -right-12 opacity-15 dark:opacity-20 text-purple-500 pointer-events-none float-slow" style={{ animationDelay: '1.5s' }}>
        <Lock className="w-44 h-44 stroke-[1]" />
      </div>

      <div className="grid-dots absolute inset-0 opacity-70" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% -10%, transparent 45%, color-mix(in srgb, var(--page-bg) 78%, transparent) 100%)'
        }}
      />
    </div>
  );
}

function ProfessionalEnterpriseFooter({ health }) {
  const online = Boolean(health);

  const pillars = [
    { title: 'Global Virus & Malware Defense', desc: 'Cross-checks every site with 90+ threat databases to stop dangerous downloads.', icon: ShieldCheck, color: 'text-blue-500' },
    { title: 'Scam & Phishing Protection', desc: 'Warns you immediately if a link tries to steal passwords or credit cards.', icon: Globe2, color: 'text-emerald-500' },
    { title: 'Fake Brand Detection', desc: 'Smart AI checks if a website is secretly impersonating a company you trust.', icon: Cpu, color: 'text-purple-500' },
    { title: 'Private & Encrypted Connection', desc: 'Inspects website security locks to keep your private browsing safe.', icon: Lock, color: 'text-cyan-500' },
  ];

  return (
    <footer className="relative z-10 w-full mt-2 sm:mt-8 border-t border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl overflow-hidden pb-28 sm:pb-8">
      {/* Background Watermark Logos inside How TRUSIFY Keeps You Safe Online Section */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-10 dark:opacity-15 text-blue-500 float-slow hidden md:block">
        <ShieldCheck className="w-56 h-56 stroke-[0.8]" />
      </div>
      <div className="pointer-events-none absolute left-1/3 -top-12 opacity-[0.07] dark:opacity-10 text-emerald-500 float-slow hidden lg:block" style={{ animationDelay: '3s' }}>
        <Globe2 className="w-44 h-44 stroke-[0.8]" />
      </div>
      <div className="pointer-events-none absolute -left-8 -bottom-8 opacity-10 dark:opacity-15 text-purple-500 float-slow hidden sm:block" style={{ animationDelay: '1.8s' }}>
        <Lock className="w-48 h-48 stroke-[0.8]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-8">
        
        {/* Simple English Feature Banners */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h3 className="text-xs sm:text-[13px] font-sans font-extrabold tracking-wide uppercase text-slate-800 dark:text-slate-200">
              How TRUSIFY Keeps You Safe Online
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-2 shadow-xs hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl bg-slate-100 dark:bg-white/5 ${pillar.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight font-sans">
                      {pillar.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Company & Purpose Statement */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-5 border-t border-slate-200/50 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400 font-sans">
          <div className="flex items-center gap-2.5">
            <img 
              src="/trusify-icon.svg" 
              alt="Trusify" 
              className="w-6 h-6 object-contain select-none"
            />
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider font-sans">
                TRUSIFY
              </span>
              <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
              <span className="text-[11px]">Safe and Trustified • Next-Generation Digital Trust</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] font-sans font-medium">
            <span>Client-Safe</span>
            <span>•</span>
            <span>Zero Tracking</span>
            <span>•</span>
            <span>Free For Everyone</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default function App() {
  const { user, isGuest, continueAsGuest } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return isGuest ? 'inspector' : 'landing';
  });
  const [scanCount, setScanCount] = useState(0);
  const [health, setHealth] = useState(null);

  // Transition to inspector when user signs in or is in guest mode, or landing on logout
  useEffect(() => {
    if (user || isGuest) {
      setActiveTab((prev) => (prev === 'landing' ? 'inspector' : prev));
    } else {
      setActiveTab('landing');
    }
  }, [user, isGuest]);

  // Subscribe to current user's scan count (or guest device scans)
  useEffect(() => {
    const unsub = subscribeUserScans(user?.uid, (scans) => {
      setScanCount(scans?.length || 0);
    });
    return () => unsub?.();
  }, [user?.uid]);

  useEffect(() => {
    checkHealth().then(setHealth);
    const timer = setInterval(() => checkHealth().then(setHealth), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleScanComplete = useCallback((report) => {
    saveScan(report, user);
    setScanCount(loadScans(user?.uid).length);
  }, [user]);

  const handleContinueGuest = () => {
    continueAsGuest();
    setActiveTab('inspector');
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-500">
      <AmbientSecurityBackdrop />
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        scanCount={scanCount}
        onOpenLanding={() => setActiveTab('landing')}
      />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-3 py-1 sm:px-6 sm:py-4 lg:px-8 pb-4 sm:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {activeTab === 'landing' && (
              <LandingPage 
                onContinueGuest={handleContinueGuest} 
                onSignedInSuccess={() => setActiveTab('inspector')} 
              />
            )}
            {activeTab === 'inspector' && (
              <Inspector onScanComplete={handleScanComplete} onViewHistory={() => setActiveTab('history')} />
            )}
            {activeTab === 'feed' && <ThreatFeed />}
            {activeTab === 'history' && (
              <HistoryView onOpenSignIn={() => setActiveTab('landing')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {activeTab !== 'landing' && <ProfessionalEnterpriseFooter health={health} />}
    </div>
  );
}
