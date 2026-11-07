import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Globe,
  Mail,
  Image,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  TriangleAlert,
  Sparkles,
  X,
  Radio,
  ImagePlus,
  Shield,
  ShieldCheck,
  Lock,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import ScanReport from './ScanReport';
import ScanOverlay from './ScanOverlay';
import { scanUrl, scanEmail, scanScreenshot } from '../lib/scanApi';
import { spring } from './ui';

const MODES = [
  { id: 'url', label: 'Website', icon: Globe, placeholder: 'example.com or https://a-site-you-want-to-check.com' },
  { id: 'screenshot', label: 'Screenshot', icon: Image, placeholder: '' }
];

const PRESETS = [
  { label: 'github.com', url: 'https://github.com' },
  { label: 'example.com', url: 'https://example.com' },
  { label: 'paypal-verification.top', url: 'https://paypal-verification-account-sec.top' }
];

const HINTS = {
  url: 'We check any website or link before you click it.',
  email: 'Paste a suspicious email and we will spot the tricks inside it.',
  screenshot: 'Upload a picture of a page or message and we will read it for you.'
};

function ModeSwitcher({ mode, onChange }) {
  return (
    <div className="segmented flex items-center gap-0.5 rounded-2xl p-1">
      {MODES.map((item) => {
        const Icon = item.icon;
        const active = mode === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className="relative flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold sm:px-3.5 sm:text-xs"
            style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}
          >
            {active && <motion.span layoutId="modeThumb" className="segmented-thumb absolute inset-0 rounded-xl" transition={spring} />}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function Inspector({ onScanComplete, onViewHistory }) {
  const [mode, setMode] = useState('url');
  const [url, setUrl] = useState('');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [scanning, setScanning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);
  const resultRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      abortRef.current?.abort();
    };
  }, [preview]);

  const reset = () => {
    setError(null);
    setResult(null);
  };

  const attachFile = (nextFile) => {
    if (!nextFile) return;
    if (!nextFile.type.startsWith('image/')) {
      setError('That file is not an image. Please choose a PNG, JPG or WebP.');
    }
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(nextFile);
    });
    setFile(nextFile);
    setError(null);
  };

  const looksLikeHost = (value) => /^[a-z0-9._-]+\.[a-z]{2,}([/:?#]|$)/i.test(value.replace(/^https?:\/\//i, '').split(/\s/)[0]);

  const cancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setScanning(false);
    setIsDone(false);
  };

  const run = async (overrideUrl) => {
    if (scanning) return;
    const targetUrl = typeof overrideUrl === 'string' ? overrideUrl : url;
    if (typeof overrideUrl === 'string') setUrl(overrideUrl);

    reset();
    if (mode === 'url' && !targetUrl.trim()) return setError('Type a website address to check.');
    if (mode === 'url' && !looksLikeHost(targetUrl.trim())) return setError('That does not look like a website address. Try something like example.com.');
    if (mode === 'email' && !sender.trim() && !body.trim()) return setError('Add the sender or paste the email text.');
    if (mode === 'screenshot' && !file) return setError('Choose a screenshot first.');

    const controller = new AbortController();
    abortRef.current = controller;
    const scanStartTime = performance.now();
    setStartedAt(scanStartTime);
    setScanning(true);
    setIsDone(false);

    try {
      let report;
      const apiPromise = mode === 'url' 
        ? scanUrl(targetUrl.trim(), controller.signal)
        : mode === 'email' 
        ? scanEmail({ sender: sender.trim(), subject: subject.trim(), body: body.trim() }, controller.signal)
        : scanScreenshot(file, controller.signal);

      // Smooth visual window: quick minimum (1.8s) so stages can be perceived without dragging
      const minAnimationDuration = 1800;
      const [apiReport] = await Promise.all([
        apiPromise,
        new Promise((resolve) => {
          const elapsed = performance.now() - scanStartTime;
          const remaining = Math.max(0, minAnimationDuration - elapsed);
          setTimeout(resolve, remaining);
        })
      ]);

      report = apiReport;

      // Smooth transition to 100% verified state before rendering
      setIsDone(true);
      await new Promise((resolve) => setTimeout(resolve, 450));

      setResult(report);
      onScanComplete?.(report);
      setScanning(false);
      setIsDone(false);

      if (report.riskLevel === 'SAFE' && report.trustScore >= 80) {
        confetti({
          particleCount: 70,
          spread: 70,
          startVelocity: 32,
          origin: { y: 0.7 },
          ticks: 160,
          colors: ['#34d399', '#22d3ee', '#0a84ff', '#ffffff']
        });
      }

      requestAnimationFrame(() => {
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 140);
      });
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setError(err.message || 'The scan failed. Please try again.');
      setScanning(false);
      setIsDone(false);
    } finally {
      abortRef.current = null;
    }
  };

  const overlayTarget = mode === 'url' ? url : mode === 'email' ? sender || 'Email message' : file?.name || 'Screenshot';

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className={!result ? "min-h-[calc(100dvh-130px)] flex flex-col justify-center py-3 sm:py-4" : "pt-2 sm:pt-4"}>
        <section className="glass glass-shine relative overflow-hidden rounded-[32px] shadow-xl">
        <div className="hairline" />

        {/* Ultra-subtle Floating Cybersecurity Watermarks Inside Card */}
        <div className="pointer-events-none absolute -right-6 -bottom-8 opacity-[0.05] dark:opacity-[0.07] text-blue-500 float-slow hidden sm:block">
          <ShieldCheck className="w-44 h-44 stroke-[0.8]" />
        </div>
        <div className="pointer-events-none absolute right-44 -top-10 opacity-[0.04] dark:opacity-[0.06] text-amber-500 float-slow hidden md:block" style={{ animationDelay: '2s' }}>
          <Flame className="w-32 h-32 stroke-[0.8]" />
        </div>
        <div className="pointer-events-none absolute left-4 -bottom-6 opacity-[0.04] dark:opacity-[0.06] text-indigo-500 float-slow hidden lg:block" style={{ animationDelay: '3.5s' }}>
          <Lock className="w-28 h-28 stroke-[0.8]" />
        </div>

        <div className="p-5 sm:p-9 space-y-6 sm:space-y-8">
          {/* Top Section: Shifted upwards with distinct high-contrast headline */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between pt-1">
            <div className="space-y-3">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.04 }}
                className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]"
              >
                Is it{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400">
                  safe
                </span>{' '}
                to click?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
              >
                Check any link before you open it. We run live forensic checks across 90+ security databases and explain the risk in plain English.
              </motion.p>
            </div>

            <div className="self-start sm:self-auto shrink-0 pt-1">
              <ModeSwitcher mode={mode} onChange={(next) => { setMode(next); reset(); }} />
            </div>
          </div>

          {/* Bottom Section: Space to enter website link with prominent label */}
          <div className="pt-3 space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 font-sans tracking-wide">
              Enter website link or domain address
            </label>

            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.24 }}
              >
                {mode === 'url' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Globe className="pointer-events-none absolute left-4.5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
                        <input
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && run()}
                          inputMode="url"
                          spellCheck={false}
                          placeholder="Paste link here (e.g. github.com, netmirror.gg, chase.com)..."
                          className="field w-full rounded-2xl py-4.5 pl-12 pr-4 font-mono text-sm sm:text-base shadow-inner bg-white/80 dark:bg-black/25 border border-slate-200/90 dark:border-white/10 focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white placeholder-slate-400"
                        />
                      </div>
                      <button
                        onClick={() => run()}
                        disabled={scanning}
                        className="flex items-center justify-center gap-2 rounded-2xl px-9 py-4.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 bg-white hover:bg-slate-50 text-slate-900 shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer border border-slate-200/90 dark:border-white/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shrink-0"
                      >
                        {scanning ? <Loader2 className="h-4 w-4 animate-spin text-slate-900" /> : <Sparkles className="h-4 w-4 text-slate-900" />}
                        <span>Check now</span>
                        {!scanning && <ArrowRight className="h-4 w-4 text-slate-900" />}
                      </button>
                    </div>
                  </div>
                )}

              {mode === 'email' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <input
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="Who sent it? e.g. billing@netflix.com"
                      className="field w-full rounded-2xl px-4 py-3 font-mono text-xs"
                    />
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Subject line (optional)"
                      className="field w-full rounded-2xl px-4 py-3 text-xs"
                    />
                  </div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    placeholder="Paste the whole email text here…"
                    className="field w-full resize-none rounded-2xl px-4 py-3 font-mono text-xs leading-relaxed"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px]" style={{ color: 'var(--text-faint)' }}>{HINTS.email}</span>
                    <button
                      onClick={() => run()}
                      disabled={scanning}
                      className="btn-primary flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-semibold disabled:opacity-60"
                    >
                      {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Check email
                    </button>
                  </div>
                </div>
              )}

              {mode === 'screenshot' && (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      attachFile(e.dataTransfer.files?.[0]);
                    }}
                    className="relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-8 transition-all"
                    style={{
                      borderColor: dragging ? 'color-mix(in srgb, var(--accent) 70%, transparent)' : 'color-mix(in srgb, var(--text-faint) 35%, transparent)',
                      background: dragging ? 'var(--accent-soft)' : 'var(--sub-glass-bg)'
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => attachFile(e.target.files?.[0])}
                    />
                    {preview ? (
                      <div className="w-full space-y-3 text-center">
                        <img src={preview} alt="Screenshot preview" className="mx-auto max-h-52 rounded-2xl object-contain" style={{ boxShadow: 'var(--glass-shadow)' }} />
                        <div className="flex items-center justify-center gap-2">
                          <span className="max-w-[240px] truncate font-mono text-[11px]" style={{ color: 'var(--accent)' }}>
                            {file?.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFile(null);
                              setPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return null; });
                            }}
                            className="grid h-5 w-5 place-items-center rounded-full"
                            style={{ background: 'var(--pill-bg)', color: 'var(--text-muted)' }}
                            aria-label="Remove image"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="float-slow mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                          <ImagePlus className="h-6 w-6" />
                        </div>
                        <p className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                          Drop a picture, or click to choose one
                        </p>
                        <p className="mt-1 text-[11px]" style={{ color: 'var(--text-faint)' }}>
                          Login pages, text messages, scam emails · up to 10 MB
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px]" style={{ color: 'var(--text-faint)' }}>{HINTS.screenshot}</span>
                    {file && (
                      <button
                        onClick={() => run()}
                        disabled={scanning}
                        className="flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-semibold disabled:opacity-60 bg-white hover:bg-slate-50 text-slate-900 shadow-sm border border-slate-200/90 dark:border-white/20 transition-all active:scale-95 cursor-pointer"
                      >
                        {scanning ? <Loader2 className="h-4 w-4 animate-spin text-slate-900" /> : <Sparkles className="h-4 w-4 text-slate-900" />}
                        <span>Check picture</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="flex items-start gap-2.5 rounded-2xl px-4 py-3 text-xs" style={{ background: 'color-mix(in srgb, var(--rose) 11%, transparent)', color: 'var(--rose)', border: '1px solid color-mix(in srgb, var(--rose) 30%, transparent)' }}>
                  <TriangleAlert className="mt-px h-4 w-4 shrink-0" />
                  <span className="flex-1 leading-relaxed">{error}</span>
                  <button onClick={() => setError(null)} className="cursor-pointer opacity-70 hover:opacity-100" aria-label="Dismiss">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      </div>

      <AnimatePresence mode="wait">
        {result && (
          <div ref={resultRef} className="scroll-mt-24">
            <ScanReport
              key={`${result.target}-${result.timestamp}`}
              report={result}
              onClose={() => setResult(null)}
              onRescan={() => run(mode === 'url' ? url : undefined)}
              onViewHistory={onViewHistory}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {scanning && (
          <ScanOverlay 
            target={overlayTarget} 
            startedAt={startedAt} 
            isComplete={isDone} 
            onCancel={cancel} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
