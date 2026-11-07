import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Radio, History, Sun, Moon, LogIn, LogOut, Sparkles, User, UserCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { spring } from './ui';

function GoogleIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

const TABS = [
  { id: 'inspector', label: 'Inspector', icon: ShieldCheck },
  { id: 'feed', label: 'Threat Intel', icon: Radio },
  { id: 'history', label: 'History', icon: History }
];

export default function Header({ activeTab, onTabChange, scanCount, onOpenLanding }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, isGuest, logout, loginWithGoogle } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-6 sm:pt-5">
      <div className="glass mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-[26px] px-2.5 py-2 sm:gap-3 sm:px-3">
        {/* Brand & Logo */}
        <div 
          onClick={onOpenLanding}
          className="flex min-w-0 items-center gap-2.5 pl-1 sm:gap-3 sm:pl-2 cursor-pointer group"
          title="Open Welcome & Sign-In Page"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={spring}
            className="relative flex items-center justify-center shrink-0"
          >
            <img 
              src="/trusify-icon.svg" 
              alt="Trusify" 
              className="h-8 w-8 sm:h-9 sm:w-9 object-contain drop-shadow-sm select-none"
            />
          </motion.div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-black uppercase leading-tight tracking-wider sm:text-base font-sans group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                TRUSIFY
              </span>
            </div>
            <p className="hidden truncate text-[10px] font-medium sm:block" style={{ color: 'var(--text-faint)' }}>
              Safe and Trustified
            </p>
          </div>
        </div>

        {/* Tab Navigation (Desktop & Tablet) - Only visible when inside dashboard */}
        {activeTab !== 'landing' && (
          <nav className="segmented hidden sm:flex items-center gap-0.5 rounded-2xl p-1 shrink-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  aria-label={tab.label}
                  className="relative flex cursor-pointer items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-medium transition-colors sm:px-3.5 sm:text-xs"
                  style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  {active && (
                    <motion.span
                      layoutId="navThumb"
                      className="segmented-thumb absolute inset-0 rounded-xl"
                      transition={spring}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" strokeWidth={active ? 2.4 : 2} />
                    <span>{tab.label}</span>
                    {tab.id === 'history' && scanCount > 0 && (
                      <span
                        className="rounded-full px-1.5 font-mono text-[9px] font-bold"
                        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                      >
                        {scanCount}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Section: User Profile & Theme Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {activeTab !== 'landing' && (
            user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((p) => !p)}
                  className="flex items-center gap-2 p-0.5 sm:px-2 sm:py-1 rounded-full sm:rounded-2xl bg-white/70 dark:bg-white/10 border border-slate-200/90 dark:border-white/20 hover:border-blue-500/50 shadow-sm active:scale-95 transition-all cursor-pointer"
                  title={`${user.displayName || user.email} (Google Account)`}
                >
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user.displayName || 'Google Profile'} 
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full object-cover ring-2 ring-blue-500/50 shadow-xs shrink-0" 
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs ring-2 ring-blue-500/50">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.displayName?.split(' ')[0] || 'Profile'}
                  </span>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-white/10 p-2 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{user.displayName || 'Google Account'}</p>
                        <p className="font-mono text-[10.5px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); onTabChange('history'); }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 text-left cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5 text-blue-500" />
                        <span>Cloud Scan History</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setMenuOpen(false);
                          await logout();
                          onOpenLanding?.();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-left cursor-pointer font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : isGuest ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((p) => !p)}
                  className="flex h-9 sm:h-10 items-center gap-2 px-3.5 sm:px-4 rounded-full sm:rounded-2xl bg-white/70 dark:bg-white/10 border border-slate-200/90 dark:border-white/20 hover:border-emerald-500/50 shadow-xs active:scale-95 transition-all cursor-pointer"
                  title="Guest Device - Click for options"
                >
                  <UserCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-500 shrink-0" />
                  <span className="text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                    Guest Device
                  </span>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      className="absolute right-0 mt-2 w-60 sm:w-64 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-white/10 p-2.5 z-50 text-xs"
                    >
                      <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/5 mb-1.5">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-[13px]">
                          <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Guest Device</span>
                        </div>
                        <p className="font-mono text-[11px] text-slate-400 mt-0.5">Stored locally on this device</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); onTabChange('history'); }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 text-left cursor-pointer transition-colors text-xs font-medium"
                      >
                        <History className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Device Scan History</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => { setMenuOpen(false); onOpenLanding?.(); }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 text-left cursor-pointer transition-colors text-xs font-medium"
                      >
                        <GoogleIcon className="w-4 h-4 shrink-0" />
                        <span>Sign In with Google</span>
                      </button>
                      <div className="my-1.5 border-t border-slate-100 dark:border-white/5" />
                      <button
                        type="button"
                        onClick={async () => {
                          setMenuOpen(false);
                          await logout();
                          onOpenLanding?.();
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-rose-50/70 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-left cursor-pointer font-semibold transition-colors text-xs"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={onOpenLanding}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 shadow-xs border border-slate-200/90 dark:border-white/20 text-xs font-semibold active:scale-95 transition-all cursor-pointer"
                title="Sign in with Google"
              >
                <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            )
          )}

          <motion.button
            whileHover={{ scale: 1.07, rotate: 8 }}
            whileTap={{ scale: 0.9 }}
            transition={spring}
            onClick={toggleTheme}
            aria-label="Toggle appearance"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-[13px] sm:h-10 sm:w-10"
            style={{ background: 'var(--pill-bg)', border: '1px solid var(--pill-border)', color: isDark ? '#fcd34d' : '#475569' }}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Floating Bottom Dock (Only when in dashboard on small screens) */}
      {activeTab !== 'landing' && (
        <aside className="sm:hidden fixed bottom-3 inset-x-3 z-40 flex justify-center pointer-events-none">
          <nav 
            aria-label="Mobile Navigation"
            className="pointer-events-auto glass w-full max-w-sm flex items-center justify-around gap-1 rounded-2xl p-1.5 shadow-2xl border border-slate-200/90 dark:border-white/15 backdrop-blur-2xl"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex-1 flex flex-col items-center justify-center py-1.5 px-2 text-[11px] font-medium transition-colors rounded-xl cursor-pointer"
                  style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}
                >
                  {active && (
                    <motion.span
                      layoutId="mobileNavThumb"
                      className="segmented-thumb absolute inset-0 rounded-xl"
                      transition={spring}
                    />
                  )}
                  <span className="relative z-10 flex flex-col items-center gap-0.5">
                    <span className="relative">
                      <Icon className="h-4 w-4" strokeWidth={active ? 2.4 : 2} />
                      {tab.id === 'history' && scanCount > 0 && (
                        <span
                          className="absolute -top-1 -right-3 rounded-full px-1 font-mono text-[8.5px] font-bold"
                          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                        >
                          {scanCount}
                        </span>
                      )}
                    </span>
                    <span className="tracking-tight text-[10.5px]">{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>
      )}
    </header>
  );
}
