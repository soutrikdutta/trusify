import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, UserCheck, ShieldCheck, Zap, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fadeUp, stagger } from './ui';

function GoogleIcon({ className = 'w-4 h-4' }) {
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

export default function LandingPage({ onContinueGuest, onSignedInSuccess }) {
  const { user, loginWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState(null);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      const loggedUser = await loginWithGoogle();
      if (loggedUser) {
        onSignedInSuccess?.(loggedUser);
      }
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setAuthError(err?.message || 'Could not complete Google sign-in. Please try again.');
      }
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10 md:py-14 flex flex-col justify-center min-h-[calc(100dvh-100px)]"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
        {/* Left Column: Heading & Value Prop */}
        <motion.div variants={fadeUp} className="md:col-span-7 text-center md:text-left space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs sm:text-[13px] font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Live Forensic Link & Phishing Protection</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Is that link{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400">
              really safe
            </span>{' '}
            to click?
          </h1>

          <p className="max-w-xl mx-auto md:mx-0 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Check any link or message screenshot before you risk opening it. We run live forensic checks across 90+ threat databases, unmask cloaked redirects, and explain risks in simple English.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Instant AI Verification</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Zero Tracking Privacy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>Client-Safe Isolation</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Sign In & Guest Box */}
        <motion.div variants={fadeUp} className="md:col-span-5 flex justify-center">
          <div className="glass glass-shine relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 dark:border-white/10">
            <div className="hairline" />

            <div className="space-y-4 sm:space-y-5 text-center">
              {/* App Icon */}
              <div className="flex justify-center">
                <img src="/trusify-icon.svg" alt="Trusify" className="w-12 h-12 sm:w-14 sm:h-14 object-contain select-none drop-shadow-md" />
              </div>

              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase font-sans">
                  TRUSIFY
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Safe and Trustified
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 text-left">
                  {authError}
                </div>
              )}

              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user.displayName} 
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/40" 
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="text-left text-xs truncate">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{user.displayName || 'Google User'}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] font-mono truncate">{user.email}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSignedInSuccess?.(user)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 px-5 text-sm font-bold bg-white text-slate-900 shadow-md hover:shadow-lg hover:bg-slate-50 border border-slate-200/90 dark:border-white/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Open Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-3.5">
                  {/* Continue with Google */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-3.5 px-5 text-sm font-bold bg-white text-slate-900 shadow-sm hover:shadow-md hover:bg-slate-50 border border-slate-200/90 dark:border-white/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {signingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                    ) : (
                      <GoogleIcon className="w-4 h-4 shrink-0" />
                    )}
                    <span>{signingIn ? 'Signing in...' : 'Continue with Google'}</span>
                  </button>

                  <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
                    <span className="flex-shrink mx-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider">or</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-white/10" />
                  </div>

                  {/* Continue with Guest Account */}
                  <button
                    onClick={onContinueGuest}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-5 text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200/80 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 active:scale-95 transition-all cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>Continue as Guest</span>
                  </button>
                  
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                    Guest scan history is kept on this device only.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
