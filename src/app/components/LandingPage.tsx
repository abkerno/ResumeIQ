import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Target, Brain, Radar, TrendingUp, ArrowRight, ChevronRight, Handshake, Plus } from 'lucide-react';

type Phase = 'sponsors' | 'exit' | 'hero';

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [phase, setPhase] = useState<Phase>('sponsors');

  useEffect(() => {
    // Show sponsors for 3.2s, then begin exit transition
    const exitTimer = setTimeout(() => setPhase('exit'), 3200);
    const heroTimer = setTimeout(() => setPhase('hero'), 4400);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(heroTimer);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030710]">
      {/* Sponsors splash — unmounts after exit */}
      <AnimatePresence>
        {phase !== 'hero' && (
          <SponsorsSplash phase={phase} />
        )}
      </AnimatePresence>

      {/* Hero page — mounts after exit */}
      <AnimatePresence>
        {phase === 'hero' && (
          <HeroPage onGetStarted={onGetStarted} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   Sponsors Splash
───────────────────────────────────────── */
function SponsorsSplash({ phase }: { phase: Phase }) {
  const partnersList = [
    {
      name: 'EPSF Sinai',
      cat: 'Clinical Student Federation',
      logo: '/EPSF-Sinai.png',
      type: 'partner'
    },
    {
      name: 'حلها (Helha)',
      cat: 'Creative Solution Partner',
      logo: '/helha.png',
      type: 'partner'
    },
    {
      name: 'Become a Partner',
      cat: 'Join ResumeIQ Ecosystem',
      logo: 'cta',
      type: 'cta'
    }
  ];

  const isExiting = phase === 'exit';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030710] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Radial glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(30,58,138,0.18) 0%, transparent 70%)',
        }}
      />

      {/* Fine grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#22C55E 1px, transparent 1px), linear-gradient(90deg, #22C55E 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22C55E]/40 to-transparent pointer-events-none"
        initial={{ top: '-4px' }}
        animate={{ top: '104%' }}
        transition={{ duration: 2.8, ease: 'linear', repeat: Infinity }}
      />

      <div className="relative z-10 max-w-5xl w-full px-8 py-16 flex flex-col items-center gap-12">

        {/* Brand lockup */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#22C55E]/25 bg-[#22C55E]/6 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[#22C55E] text-xs font-medium tracking-widest uppercase">Ecosystem Partners & Sponsors</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-2">
            ResumeIQ <span className="text-[#22C55E]">2026</span>
          </h1>
          <p className="text-[#475569] text-sm tracking-widest uppercase font-medium">Pharmaceutical Career Intelligence</p>
        </motion.div>

        {/* Centered Partners Row */}
        <div className="w-full max-w-3xl">
          <motion.p
            className="text-center text-xs text-[#334155] uppercase tracking-[0.2em] font-bold mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Strategic Partners & Supporting Sponsors
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center items-stretch">
            {partnersList.map((p, i) => {
              if (p.type === 'cta') {
                return (
                  <motion.a
                    href="mailto:y.abdellatif2048@su.edu.eg?subject=ResumeIQ%20Partnership%20/%20Sponsorship"
                    key={p.name}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                    whileHover={{ scale: 1.03, borderColor: 'rgba(34, 197, 94, 0.4)' }}
                    className="flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-[#22C55E]/30 bg-[#22C55E]/5 backdrop-blur-md overflow-hidden cursor-pointer group transition-all"
                  >
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#22C55E]/10 border border-[#22C55E]/30 mb-4 group-hover:bg-[#22C55E]/20 transition-all">
                      <Handshake className="w-6 h-6 text-[#22C55E]" />
                    </div>
                    <div className="text-center">
                      <div className="text-[#22C55E] text-sm font-bold leading-none mb-1 group-hover:underline">Become a Partner</div>
                      <div className="text-[10px] text-gray-500 font-medium">Connect & Sponsor ResumeIQ</div>
                    </div>
                  </motion.a>
                );
              }

              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.15, duration: 0.5, ease: 'easeOut' }}
                  whileHover={{ scale: 1.03 }}
                  className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-md overflow-hidden cursor-default transition-all"
                >
                  {/* partner logo */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center mb-4 p-2">
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="w-full h-full object-contain filter brightness-110"
                      onError={(e) => {
                        // Fallback text if image fails to load
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-white text-sm font-bold leading-tight mb-1">{p.name}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{p.cat}</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Exit hint — fades in just before the exit */}
        <motion.div
          className="text-[#1E3A8A] text-xs tracking-widest uppercase font-medium mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isExiting ? 0 : [0, 0.6, 0.6] }}
          transition={{ delay: 2.4, duration: 0.8 }}
        >
          Entering platform…
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Hero Page
───────────────────────────────────────── */
function HeroPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-[#030710] via-[#0B1220] to-[#1E3A8A]/15 flex flex-col"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(30,58,138,0.22) 0%, transparent 65%)',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#1E3A8A 1px, transparent 1px), linear-gradient(90deg, #1E3A8A 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Subtle corner accent blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#22C55E]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#1E3A8A]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">

        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#22C55E]/8 border border-[#22C55E]/25 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
          <span className="text-[#22C55E] text-xs font-semibold tracking-widest uppercase">AI-Powered Career Intelligence</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-7xl md:text-8xl font-black tracking-tight leading-none mb-6"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #93C5FD 50%, #22C55E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ResumeIQ
          <br />
          <span className="text-5xl md:text-6xl font-black text-[#1E3A8A]" style={{ WebkitTextFillColor: '#2563EB' }}>2026</span>
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="text-xl text-[#94A3B8] max-w-xl mb-4 leading-relaxed"
        >
          Build pharma-ready careers. The enterprise platform for pharmaceutical, clinical, and regulatory professionals.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="flex items-center gap-8 mb-14 text-sm"
        >
          {[
            { label: 'ATS Match Rate', value: '94%', color: '#22C55E' },
            { label: 'Compliance Score', value: '98%', color: '#2563EB' },
            { label: 'GxP Keywords', value: '300+', color: '#F59E0B' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[#475569] text-xs uppercase tracking-widest font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white font-bold text-lg overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #22C55E 100%)',
              boxShadow: '0 0 40px rgba(34,197,94,0.25), 0 0 80px rgba(30,58,138,0.2)',
            }}
          >
            {/* shimmer sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full"
              animate={{ translateX: ['−100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.5, ease: 'easeInOut' }}
            />
            <span className="relative">Enter Platform</span>
            <motion.span
              className="relative"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.span>
          </motion.button>

          <p className="text-[#334155] text-xs mt-4 tracking-wider">No sign-up required · Start immediately</p>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="flex flex-wrap justify-center gap-2 mt-16"
        >
          {[
            { icon: <Radar className="w-3.5 h-3.5" />, label: 'ATS X-Ray Engine' },
            { icon: <Brain className="w-3.5 h-3.5" />, label: 'AI Career Coach' },
            { icon: <Target className="w-3.5 h-3.5" />, label: 'Pharma Intelligence' },
            { icon: <TrendingUp className="w-3.5 h-3.5" />, label: 'Live Analytics' },
          ].map((chip) => (
            <div
              key={chip.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 bg-white/[0.03] text-[#64748B] text-xs font-medium"
            >
              <span className="text-[#1E3A8A]">{chip.icon}</span>
              {chip.label}
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
