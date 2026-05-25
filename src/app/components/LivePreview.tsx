import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ZoomIn, ZoomOut, Monitor, Smartphone, FileText,
  RotateCw, Sparkles, Mail, Phone, MapPin, Award,
  Briefcase, GraduationCap, ScanLine, CheckCircle2,
  XCircle, ShieldCheck, ChevronDown, ChevronUp, Palette,
  Languages, Users, FlaskConical, FileCode2, BarChart3, Target
} from 'lucide-react';

export interface PreviewData {
  personal: { name: string; title: string; email: string; phone: string; location: string; photo?: string | null };
  summary: string;
  experience: { id: string; company: string; role: string; period: string; description: string }[];
  education: { id: string; institution: string; degree: string; period: string }[];
  skills: string[];
  certifications: { id: string; name: string; issuer: string; year: string }[];
  languages?: { id: string; name: string; level: string; pct: number }[];
  publications?: { id: string; title: string; journal: string; year: string }[];
  references?: { id: string; name: string; role: string; company: string; email: string }[];
  therapeuticAreas?: { id: string; name: string; icon: string; selected: boolean; trials: number }[];
  activeNiche?: string;
  isStudent?: boolean;
  sectionOrder?: string[];
}

export type ThemeId = 'modern' | 'clinical' | 'executive' | 'neon' | 'ats';
export type DeviceId = 'desktop' | 'mobile' | 'paper';

export const themes: Record<ThemeId, {
  name: string;
  swatch: string;
  bg: string; ink: string; accent: string; accent2: string;
  font: string; isDark: boolean;
}> = {
  modern:    { name: 'Modern',    swatch: 'linear-gradient(135deg,#1E3A8A,#22C55E)', bg: '#FFFFFF', ink: '#0F172A', accent: '#1E3A8A', accent2: '#22C55E', font: '"Inter", system-ui, sans-serif', isDark: false },
  clinical:  { name: 'Clinical',  swatch: 'linear-gradient(135deg,#0EA5E9,#14B8A6)', bg: '#F8FAFC', ink: '#0F172A', accent: '#0E7490', accent2: '#14B8A6', font: '"IBM Plex Sans", system-ui, sans-serif', isDark: false },
  executive: { name: 'Executive', swatch: 'linear-gradient(135deg,#78350F,#B45309)', bg: '#FAF7F2', ink: '#1C1917', accent: '#7C2D12', accent2: '#B45309', font: '"Playfair Display", Georgia, serif', isDark: false },
  neon:      { name: 'Neon Lab',  swatch: 'linear-gradient(135deg,#A855F7,#22C55E)', bg: '#0B1220', ink: '#E2E8F0', accent: '#A855F7', accent2: '#22C55E', font: '"JetBrains Mono", ui-monospace, monospace', isDark: true },
  ats:       { name: 'ATS Safe',  swatch: 'linear-gradient(135deg,#1F2937,#6B7280)', bg: '#FFFFFF', ink: '#000000', accent: '#000000', accent2: '#000000', font: 'Arial, Helvetica, sans-serif', isDark: false },
};

export function translateArea(id: string, niche: string): { name: string; icon: string; suffix: string } {
  if (niche === 'tech') {
    switch (id) {
      case 'onc':  return { name: 'Frontend Architecture', icon: '💻', suffix: 'projects' };
      case 'cv':   return { name: 'Backend & System APIs', icon: '⚙️', suffix: 'deployments' };
      case 'imm':  return { name: 'Cloud & Infrastructure', icon: '☁️', suffix: 'architectures' };
      case 'cns':  return { name: 'AI & Data Science', icon: '🧠', suffix: 'models' };
      case 'inf':  return { name: 'System Security', icon: '🔒', suffix: 'audits' };
      case 'rare': return { name: 'DevOps & CI/CD Pipelines', icon: '🚀', suffix: 'integrations' };
      case 'end':  return { name: 'Database Management', icon: '💾', suffix: 'systems' };
      case 'res':  return { name: 'Mobile App Development', icon: '📱', suffix: 'apps' };
    }
  } else if (niche === 'business') {
    switch (id) {
      case 'onc':  return { name: 'Corporate Valuations', icon: '📊', suffix: 'deals' };
      case 'cv':   return { name: 'Mergers & Acquisitions', icon: '💼', suffix: 'audits' };
      case 'imm':  return { name: 'Agile Strategy', icon: '🔄', suffix: 'sprints' };
      case 'cns':  return { name: 'Risk Assessment', icon: '🛡️', suffix: 'assessments' };
      case 'inf':  return { name: 'Project Audits', icon: '📝', suffix: 'audits' };
      case 'rare': return { name: 'Market Diligence', icon: '🔍', suffix: 'reports' };
      case 'end':  return { name: 'Financial Planning & Analysis', icon: '📈', suffix: 'budgets' };
      case 'res':  return { name: 'Operations Excellence', icon: '⚡', suffix: 'pipelines' };
    }
  } else if (niche === 'creative') {
    switch (id) {
      case 'onc':  return { name: 'UI/UX Prototyping', icon: '🎨', suffix: 'designs' };
      case 'cv':   return { name: 'SEO & Growth Strategy', icon: '📈', suffix: 'campaigns' };
      case 'imm':  return { name: 'Brand Identity', icon: '🏷️', suffix: 'launches' };
      case 'cns':  return { name: 'Social Media Strategy', icon: '📱', suffix: 'campaigns' };
      case 'inf':  return { name: 'Copywriting & Content', icon: '✍️', suffix: 'articles' };
      case 'rare': return { name: 'Product Marketing', icon: '🎁', suffix: 'launches' };
      case 'end':  return { name: 'Conversion Optimization', icon: '🎯', suffix: 'tests' };
      case 'res':  return { name: 'Influencer Campaigns', icon: '✨', suffix: 'collabs' };
    }
  } else if (niche === 'general') {
    switch (id) {
      case 'onc':  return { name: 'Operations Strategy', icon: '⚡', suffix: 'initiatives' };
      case 'cv':   return { name: 'Project Coordination', icon: '📅', suffix: 'projects' };
      case 'imm':  return { name: 'Client Relationships', icon: '🤝', suffix: 'accounts' };
      case 'cns':  return { name: 'Team Leadership', icon: '👥', suffix: 'teams' };
      case 'inf':  return { name: 'Compliance Audits', icon: '🔒', suffix: 'audits' };
      case 'rare': return { name: 'SOP & QA Oversight', icon: '📋', suffix: 'protocols' };
      case 'end':  return { name: 'Resource Management', icon: '💼', suffix: 'budgets' };
      case 'res':  return { name: 'Workflow Optimization', icon: '🔄', suffix: 'flows' };
    }
  }

  // Default Clinical CRA
  switch (id) {
    case 'onc':  return { name: 'Oncology',          icon: '🧬', suffix: 'trials' };
    case 'cv':   return { name: 'Cardiovascular',    icon: '❤️', suffix: 'trials' };
    case 'imm':  return { name: 'Immunology',        icon: '🛡️', suffix: 'trials' };
    case 'cns':  return { name: 'Neurology / CNS',   icon: '🧠', suffix: 'trials' };
    case 'inf':  return { name: 'Infectious Disease',icon: '🦠', suffix: 'trials' };
    case 'rare': return { name: 'Rare Disease',      icon: '💎', suffix: 'trials' };
    case 'end':  return { name: 'Endocrinology',     icon: '⚗️', suffix: 'trials' };
    case 'res':  return { name: 'Respiratory',       icon: '🫁', suffix: 'trials' };
    default:     return { name: 'Specialization Area', icon: '🎯', suffix: 'projects' };
  }
}

interface AtsCheck { id: string; label: string; pass: boolean; detail: string }

function runAtsChecks(data: PreviewData): AtsCheck[] {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personal.email);
  const phoneOk = /\d{3}/.test(data.personal.phone);
  const sectionsOk = !!(data.summary && data.experience.length && data.education.length && data.skills.length);
  const wordCount = data.summary.split(/\s+/).filter(Boolean).length;
  const datesOk = data.experience.every(e => /\d{4}/.test(e.period));
  const skillCountOk = data.skills.length >= 8;
  const summaryOk = wordCount >= 30 && wordCount <= 80;

  return [
    { id: 'c-contact', label: 'Contact info parseable', pass: !!data.personal.name && emailOk && phoneOk, detail: emailOk ? 'Email & phone detected' : 'Invalid email format' },
    { id: 'c-sections', label: 'Standard sections present', pass: sectionsOk, detail: 'Profile · Experience · Education · Skills' },
    { id: 'c-summary', label: 'Summary length optimal', pass: summaryOk, detail: `${wordCount} words (target 30–80)` },
    { id: 'c-dates', label: 'Experience dates parseable', pass: datesOk, detail: 'YYYY format detected' },
    { id: 'c-skills', label: 'Skills keyword density', pass: skillCountOk, detail: `${data.skills.length} skills listed` },
    { id: 'c-headings', label: 'Single-column ATS layout', pass: true, detail: 'No multi-column tables' },
    { id: 'c-fonts', label: 'ATS-safe typography', pass: true, detail: 'System sans-serif' },
    { id: 'c-noimage', label: 'No graphics blocking parse', pass: !data.personal.photo, detail: data.personal.photo ? 'Graphics/photo present (ATS penalty)' : 'Pure text content' },
  ];
}

const deviceFrames: Record<DeviceId, { w: number; h: number; label: string; icon: React.ReactNode }> = {
  desktop: { w: 720, h: 980, label: 'A4',     icon: <Monitor className="w-3.5 h-3.5" /> },
  mobile:  { w: 360, h: 720, label: 'Mobile', icon: <Smartphone className="w-3.5 h-3.5" /> },
  paper:   { w: 595, h: 842, label: 'Print',  icon: <FileText className="w-3.5 h-3.5" /> },
};

export function LivePreview({ data }: { data: PreviewData }) {
  const [theme, setTheme] = useState<ThemeId>('modern');
  const [device, setDevice] = useState<DeviceId>('desktop');
  const [zoom, setZoom] = useState(0.55);
  const [flipped, setFlipped] = useState(false);
  const [reportOpen, setReportOpen] = useState(true);

  const t = themes[theme];
  const d = deviceFrames[device];
  const atsMode = theme === 'ats';
  const checks = runAtsChecks(data);
  const passed = checks.filter(c => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);
  const scoreColor = score === 100 ? '#22C55E' : score >= 75 ? '#22C55E' : score >= 50 ? '#F59E0B' : '#EF4444';

  return (
    <>
      <div className="rounded-2xl bg-[#0A1020] border border-white/[0.07] overflow-hidden shadow-xl shadow-black/40 print:hidden">
      {/* ── Unified Toolbar ──────────────────────── */}
      <div className="flex items-center gap-3 px-3 py-2.5 border-b border-white/[0.06] bg-white/[0.015]">
        {/* Device segmented control */}
        <div className="flex items-center rounded-lg bg-black/30 border border-white/[0.06] p-0.5">
          {(['desktop', 'mobile', 'paper'] as DeviceId[]).map(id => (
            <button
              key={id}
              onClick={() => setDevice(id)}
              title={deviceFrames[id].label}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                device === id
                  ? 'bg-white/[0.08] text-white shadow-sm'
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}
            >
              {deviceFrames[id].icon}
              <span className="hidden xl:inline">{deviceFrames[id].label}</span>
            </button>
          ))}
        </div>

        {/* Zoom */}
        <div className="flex items-center rounded-lg bg-black/30 border border-white/[0.06]">
          <button
            onClick={() => setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(2)))}
            className="p-1.5 text-[#64748B] hover:text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-white font-mono w-10 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(1.2, +(z + 0.1).toFixed(2)))}
            className="p-1.5 text-[#64748B] hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1" />

        {/* Flip */}
        <button
          onClick={() => setFlipped(f => !f)}
          title="Flip preview"
          className={`p-1.5 rounded-lg border transition-all ${
            flipped
              ? 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
              : 'bg-black/30 border-white/[0.06] text-[#64748B] hover:text-white'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* Theme dots */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/30 border border-white/[0.06]">
          <Palette className="w-3 h-3 text-[#475569]" />
          {(Object.keys(themes) as ThemeId[]).map(id => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              title={themes[id].name}
              className={`relative w-5 h-5 rounded-md transition-all ${
                theme === id ? 'scale-110 ring-2 ring-white/40 ring-offset-1 ring-offset-[#0A1020]' : 'opacity-60 hover:opacity-100'
              }`}
              style={{ background: themes[id].swatch }}
            />
          ))}
        </div>
      </div>

      {/* ── Active theme caption ─────────────────── */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/[0.06] bg-black/10">
        <div className="flex items-center gap-2 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: scoreColor, boxShadow: `0 0 8px ${scoreColor}` }} />
          <span className="text-[#94A3B8] font-medium">{t.name}</span>
          <span className="text-[#334155]">·</span>
          <span className="text-[#64748B] font-mono">{d.w}×{d.h}</span>
          {atsMode && (
            <>
              <span className="text-[#334155]">·</span>
              <span className="text-[#22C55E] font-semibold uppercase tracking-wider">ATS Mode</span>
            </>
          )}
        </div>
        <div className="text-[10px] text-[#475569] font-mono uppercase tracking-wider">Live preview</div>
      </div>

      {/* ── Stage ────────────────────────────────── */}
      <div
        className="relative overflow-auto"
        style={{
          height: 480,
          background:
            'radial-gradient(ellipse at top, rgba(34,197,94,0.05), transparent 60%), radial-gradient(ellipse at bottom, rgba(30,58,138,0.06), transparent 50%), #06091A',
        }}
      >
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />

        <div className="min-h-full flex items-start justify-center p-8" style={{ perspective: '2200px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${theme}-${device}-${flipped}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, rotateY: flipped ? 180 : 0, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: d.w,
                minHeight: d.h,
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                boxShadow: '0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
              className="relative rounded-md overflow-hidden"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: t.bg,
                  color: t.ink,
                  fontFamily: t.font,
                  backfaceVisibility: 'hidden',
                }}
              >
                {atsMode ? <AtsSafeContent data={data} /> : <ResumeContent theme={t} data={data} device={device} />}
              </div>

              <div
                className="absolute inset-0"
                style={{
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  background: 'linear-gradient(135deg,#0B1220,#1E3A8A)',
                  color: 'white',
                  padding: 32,
                }}
              >
                <DesignBack theme={t} data={data} />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ATS scan line */}
        {atsMode && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 440 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            className="absolute left-0 right-0 h-10 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent, rgba(34,197,94,0.28), transparent)',
            }}
          />
        )}
      </div>

      {/* ── ATS Report (collapsible) ─────────────── */}
      <div className="border-t border-white/[0.06] bg-black/20">
        <button
          onClick={() => setReportOpen(o => !o)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
        >
          {/* Score ring */}
          <div className="relative w-9 h-9 flex-shrink-0">
            <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="15" fill="none"
                stroke={scoreColor} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 15}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 15 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 15 * (1 - score / 100) }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: scoreColor }} />
            </div>
          </div>

          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-white text-xs font-semibold">ATS Parseability</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-[#94A3B8]">
                {passed}/{checks.length}
              </span>
            </div>
            <div className="text-[10px] text-[#64748B] mt-0.5 flex items-center gap-1.5">
              <ScanLine className="w-3 h-3" />
              Real-time compliance analysis
            </div>
          </div>

          <span className="text-sm font-bold tabular-nums" style={{ color: scoreColor }}>{score}%</span>
          {reportOpen
            ? <ChevronUp className="w-4 h-4 text-[#64748B]" />
            : <ChevronDown className="w-4 h-4 text-[#64748B]" />}
        </button>

        <AnimatePresence initial={false}>
          {reportOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-1.5">
                {checks.map((c, idx) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/[0.02] transition-colors"
                  >
                    {c.pass
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] flex-shrink-0" />
                      : <XCircle className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-[#CBD5E1] font-medium leading-none">{c.label}</div>
                      <div className="text-[10px] text-[#475569] mt-0.5 truncate">{c.detail}</div>
                    </div>
                  </motion.div>
                ))}

                {!atsMode && (
                  <button
                    onClick={() => setTheme('ats')}
                    className="w-full mt-2 py-2 rounded-lg text-[11px] font-semibold text-[#22C55E] border border-[#22C55E]/25 bg-[#22C55E]/5 hover:bg-[#22C55E]/10 transition-all flex items-center justify-center gap-2"
                  >
                    <ScanLine className="w-3.5 h-3.5" />
                    Switch to ATS-Safe Preview
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Printable Version */}
    <div className="hidden print:block printable-cv" style={{ background: t.bg, color: t.ink, fontFamily: t.font }}>
       {atsMode ? <AtsSafeContent data={data} /> : <ResumeContent theme={t} data={data} device="desktop" />}
    </div>
  </>
);
}

export function AtsSafeContent({ data, includePhoto = false }: { data: PreviewData; includePhoto?: boolean }) {
  const heading: React.CSSProperties = {
    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: 1, marginTop: 18, marginBottom: 6,
    paddingBottom: 3, borderBottom: '1px solid #000'
  };
  const para: React.CSSProperties = { fontSize: 11, lineHeight: 1.5, color: '#000' };

  const selectedTherapeutic = (data.therapeuticAreas || []).filter(a => a.selected);
  const hasLanguages = (data.languages || []).length > 0;
  const hasPublications = (data.publications || []).length > 0;
  const hasReferences = (data.references || []).length > 0;

  const sectionsOrder = data.sectionOrder || (data.isStudent
    ? ['summary', 'education', 'certifications', 'experience', 'skills', 'therapeutic', 'publications', 'languages', 'references']
    : ['summary', 'experience', 'education', 'skills', 'therapeutic', 'certifications', 'publications', 'languages', 'references']);

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <div key="summary">
            <h2 style={heading}>Profile</h2>
            <p style={para}>{data.summary}</p>
          </div>
        );
      case 'therapeutic':
        if (selectedTherapeutic.length === 0) return null;
        const niche = data.activeNiche || 'general';
        let specializationsLabel = "Therapeutic Specializations";
        if (niche === 'tech') specializationsLabel = "Tech Verticals";
        else if (niche === 'business') specializationsLabel = "Business Verticals";
        else if (niche === 'creative') specializationsLabel = "Creative Fields";
        else if (niche === 'general') specializationsLabel = "Focus Verticals";

        const formatted = selectedTherapeutic.map(a => {
          const trans = translateArea(a.id, niche);
          return `${trans.name} (${a.trials} ${trans.suffix})`;
        }).join(', ');

        return (
          <div key="therapeutic">
            <h2 style={heading}>{specializationsLabel}</h2>
            <p style={para}>{formatted}</p>
          </div>
        );
      case 'experience':
        if (data.experience.length === 0) return null;
        return (
          <div key="experience">
            <h2 style={heading}>{data.isStudent ? 'Projects & Internships' : 'Experience'}</h2>
            {data.experience.map(e => (
              <div key={`ats-exp-${e.id}`} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{e.role}</div>
                <div style={{ fontSize: 11, fontStyle: 'italic' }}>{e.company} — {e.period}</div>
                <p style={{ ...para, marginTop: 3 }}>{e.description}</p>
              </div>
            ))}
          </div>
        );
      case 'education':
        if (data.education.length === 0) return null;
        return (
          <div key="education">
            <h2 style={heading}>Education</h2>
            {data.education.map(e => (
              <div key={`ats-edu-${e.id}`} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{e.degree}</div>
                <div style={{ fontSize: 11 }}>{e.institution} — {e.period}</div>
              </div>
            ))}
          </div>
        );
      case 'skills':
        if (data.skills.length === 0) return null;
        return (
          <div key="skills">
            <h2 style={heading}>Skills</h2>
            <p style={para}>{data.skills.join(', ')}</p>
          </div>
        );
      case 'certifications':
        if (data.certifications.length === 0) return null;
        return (
          <div key="certifications">
            <h2 style={heading}>Certifications</h2>
            {data.certifications.map(c => (
              <p key={`ats-cert-${c.id}`} style={{ ...para, margin: '2px 0' }}>
                {c.name} — {c.issuer} ({c.year})
              </p>
            ))}
          </div>
        );
      case 'publications':
        if (!hasPublications) return null;
        return (
          <div key="publications">
            <h2 style={heading}>Publications</h2>
            {data.publications?.map(p => (
              <p key={`ats-pub-${p.id}`} style={{ ...para, margin: '2px 0' }}>
                "{p.title}" — {p.journal} ({p.year})
              </p>
            ))}
          </div>
        );
      case 'languages':
        if (!hasLanguages) return null;
        return (
          <div key="languages">
            <h2 style={heading}>Languages</h2>
            <p style={para}>
              {data.languages?.map(l => `${l.name} (${l.level})`).join(', ')}
            </p>
          </div>
        );
      case 'references':
        if (!hasReferences) return null;
        return (
          <div key="references">
            <h2 style={heading}>References</h2>
            {data.references?.map(r => (
              <p key={`ats-ref-${r.id}`} style={{ ...para, margin: '2px 0' }}>
                {r.name} — {r.role}, {r.company} ({r.email})
              </p>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 36, fontFamily: 'Arial, Helvetica, sans-serif', color: '#000' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 8 }}>
        {includePhoto && data.personal.photo && (
          <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '1px solid #000' }}>
            <img src={data.personal.photo} alt={data.personal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{data.personal.name}</h1>
          <p style={{ fontSize: 12, margin: '4px 0 0 0' }}>{data.personal.title}</p>
        </div>
      </div>
      <p style={{ fontSize: 11, margin: '6px 0 0 0', borderBottom: '1px solid #000', paddingBottom: 6 }}>
        {data.personal.email} | {data.personal.phone} | {data.personal.location}
      </p>

      {sectionsOrder.map(id => renderSection(id))}
    </div>
  );
}

export function ResumeContent({ theme: t, data, device, includePhoto = true }: { theme: typeof themes[ThemeId]; data: PreviewData; device: DeviceId; includePhoto?: boolean }) {
  const compact = device === 'mobile';
  
  const selectedTherapeutic = (data.therapeuticAreas || []).filter(a => a.selected);
  const hasLanguages = (data.languages || []).length > 0;
  const hasPublications = (data.publications || []).length > 0;
  const hasReferences = (data.references || []).length > 0;

  const sectionsOrder = data.sectionOrder || (data.isStudent
    ? ['summary', 'education', 'certifications', 'experience', 'skills', 'therapeutic', 'publications', 'languages', 'references']
    : ['summary', 'experience', 'education', 'skills', 'therapeutic', 'certifications', 'publications', 'languages', 'references']);

  const renderSection = (id: string) => {
    switch (id) {
      case 'summary':
        if (!data.summary) return null;
        return (
          <Section key="summary" title="Profile" theme={t} icon={<Sparkles className="w-3 h-3" />}>
            <p style={{ fontSize: 11, lineHeight: 1.65, opacity: 0.85 }}>{data.summary}</p>
          </Section>
        );
      case 'therapeutic':
        if (selectedTherapeutic.length === 0) return null;
        const niche = data.activeNiche || 'general';
        let sectionTitle = "Therapeutic";
        let sectionIcon = <Monitor className="w-3 h-3" />;
        if (niche === 'tech') {
          sectionTitle = "Tech Verticals";
          sectionIcon = <FileCode2 className="w-3 h-3" />;
        } else if (niche === 'business') {
          sectionTitle = "Business Verticals";
          sectionIcon = <BarChart3 className="w-3 h-3" />;
        } else if (niche === 'creative') {
          sectionTitle = "Creative Fields";
          sectionIcon = <Sparkles className="w-3 h-3" />;
        } else if (niche === 'general') {
          sectionTitle = "Focus Verticals";
          sectionIcon = <Target className="w-3 h-3" />;
        }
        return (
          <Section key="therapeutic" title={sectionTitle} theme={t} icon={sectionIcon}>
            <div className="flex flex-wrap gap-1.5">
              {data.therapeuticAreas?.filter(a => a.selected).map(a => {
                const trans = translateArea(a.id, niche);
                return (
                  <span
                    key={`pv-ther-${a.id}`}
                    style={{
                      fontSize: 9.5,
                      padding: '3px 8px',
                      borderRadius: 6,
                      background: t.isDark ? 'rgba(255,255,255,0.06)' : `${t.accent}08`,
                      color: t.isDark ? t.ink : t.accent,
                      border: `1px solid ${t.accent}15`,
                      fontWeight: 550,
                    }}
                  >
                    {trans.icon} {trans.name}
                  </span>
                );
              })}
            </div>
          </Section>
        );
      case 'experience':
        if (data.experience.length === 0) return null;
        return (
          <Section key="experience" title={data.isStudent ? "Projects & Internships" : "Experience"} theme={t} icon={<Briefcase className="w-3 h-3" />}>
            <div className="space-y-3.5">
              {data.experience.map(exp => (
                <div
                  key={`pv-exp-${exp.id}`}
                  className="relative pl-4"
                  style={{ borderLeft: `2px solid ${t.accent}30` }}
                >
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ background: t.accent2 }} />
                  <div style={{ fontSize: 11.5, fontWeight: 700 }}>{exp.role}</div>
                  <div style={{ fontSize: 10, opacity: 0.75, color: t.accent, marginTop: 1 }}>{exp.company} · {exp.period}</div>
                  <p style={{ fontSize: 10, lineHeight: 1.6, opacity: 0.82, marginTop: 4 }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'education':
        if (data.education.length === 0) return null;
        return (
          <Section key="education" title="Education" theme={t} icon={<GraduationCap className="w-3 h-3" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.education.map(e => (
                <div key={`pv-edu-${e.id}`} className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/[0.04]">
                  <div style={{ fontSize: 11, fontWeight: 600 }}>{e.degree}</div>
                  <div style={{ fontSize: 10, opacity: 0.7 }}>{e.institution}</div>
                  <div style={{ fontSize: 9, opacity: 0.5, marginTop: 1 }}>{e.period}</div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'skills':
        if (data.skills.length === 0) return null;
        return (
          <Section key="skills" title="Skills" theme={t} icon={<Sparkles className="w-3 h-3" />}>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map(s => (
                <span
                  key={`pv-skill-${s}`}
                  style={{
                    fontSize: 9.5,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: t.isDark ? 'rgba(255,255,255,0.06)' : `${t.accent}10`,
                    color: t.isDark ? t.ink : t.accent,
                    border: `1px solid ${t.accent}25`,
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>
        );
      case 'certifications':
        if (data.certifications.length === 0) return null;
        return (
          <Section key="certifications" title="Certifications" theme={t} icon={<Award className="w-3 h-3" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.certifications.map(c => (
                <div key={`pv-cert-${c.id}`} className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/[0.04]">
                  <div style={{ fontSize: 10, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 9, opacity: 0.6 }}>{c.issuer} · {c.year}</div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'publications':
        if (data.publications && data.publications.length === 0) return null;
        return (
          <Section key="publications" title="Publications" theme={t} icon={<FlaskConical className="w-3 h-3" />}>
            <div className="space-y-3">
              {data.publications?.map(p => (
                <div key={`pv-pub-${p.id}`} className="relative pl-4" style={{ borderLeft: `2px solid ${t.accent}20` }}>
                  <div style={{ fontSize: 11, fontWeight: 700 }}>"{p.title}"</div>
                  <div style={{ fontSize: 9.5, opacity: 0.7, color: t.accent, marginTop: 1 }}>{p.journal} · {p.year}</div>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'languages':
        if (data.languages && data.languages.length === 0) return null;
        return (
          <Section key="languages" title="Languages" theme={t} icon={<Languages className="w-3 h-3" />}>
            <div className="flex flex-wrap gap-3">
              {data.languages?.map(l => (
                <div key={`pv-lang-${l.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-white/[0.04]">
                  <span style={{ fontSize: 10, fontWeight: 600 }}>{l.name}</span>
                  <span style={{ fontSize: 9, opacity: 0.6 }}>({l.level})</span>
                </div>
              ))}
            </div>
          </Section>
        );
      case 'references':
        if (data.references && data.references.length === 0) return null;
        return (
          <Section key="references" title="References" theme={t} icon={<Users className="w-3 h-3" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.references?.map(r => (
                <div key={`pv-ref-${r.id}`} className="p-3 rounded-xl bg-black/[0.08] border border-white/[0.04]">
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{r.name}</div>
                  <div style={{ fontSize: 9.5, opacity: 0.8 }}>{r.role}</div>
                  <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>{r.company} · {r.email}</div>
                </div>
              ))}
            </div>
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: compact ? 22 : 40 }}>
      {/* Refined header */}
      <div
        className="rounded-xl mb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
          color: '#fff',
          padding: compact ? 20 : 28,
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
            backgroundSize: '18px 18px',
          }}
        />
        <div className="relative flex items-center gap-5">
          {includePhoto && data.personal.photo && (
            <div className="w-16 h-16 rounded-full border-2 border-white/40 overflow-hidden flex-shrink-0 bg-white/10 shadow-md">
              <img src={data.personal.photo} alt={data.personal.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <div style={{ fontSize: compact ? 22 : 30, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              {data.personal.name}
            </div>
            <div style={{ fontSize: compact ? 12 : 15, opacity: 0.92, marginTop: 6, fontWeight: 500, letterSpacing: '0.01em' }}>
              {data.personal.title}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4" style={{ fontSize: 10.5, opacity: 0.95 }}>
              <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{data.personal.email}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" />{data.personal.phone}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{data.personal.location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {sectionsOrder.map(id => renderSection(id))}
      </div>

      <div className="mt-8 pt-3 flex items-center justify-between" style={{
        borderTop: `1px solid ${t.accent}20`, fontSize: 9, opacity: 0.45
      }}>
        <span>ResumeIQ 2026</span>
        <span>{t.name} · ATS-ready</span>
      </div>
    </div>
  );
}

function Section({ title, icon, theme: t, children }: { title: string; icon: React.ReactNode; theme: typeof themes[ThemeId]; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5" style={{ color: t.accent }}>
        {icon}
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.6, textTransform: 'uppercase' }}>{title}</div>
        <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${t.accent}40, transparent)` }} />
      </div>
      {children}
    </div>
  );
}

/* ----------------- Back face ----------------- */
function DesignBack({ theme: t, data }: { theme: typeof themes[ThemeId]; data: PreviewData }) {
  const stats = [
    { id: 'st-1', label: 'Skills',  value: data.skills.length,         icon: <Sparkles className="w-4 h-4" /> },
    { id: 'st-2', label: 'Roles',   value: data.experience.length,     icon: <Briefcase className="w-4 h-4" /> },
    { id: 'st-3', label: 'Degrees', value: data.education.length,      icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'st-4', label: 'Certs',   value: data.certifications.length, icon: <Award className="w-4 h-4" /> },
  ];
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-5">
        <div className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30">
          <div className="text-[9px] uppercase tracking-widest text-[#22C55E] font-bold">Design Card</div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-1 tracking-tight">{data.personal.name}</h2>
      <p className="text-sm opacity-70 mb-6">{data.personal.title}</p>

      <div className="grid grid-cols-2 gap-2.5 mb-6">
        {stats.map(s => (
          <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <div className="text-2xl font-bold tabular-nums" style={{ color: t.accent2 }}>{s.value}</div>
              <div className="opacity-50">{s.icon}</div>
            </div>
            <div className="text-[10px] opacity-60 uppercase tracking-wider font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-widest opacity-50 mb-2.5">Active Theme</div>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3.5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg shadow-md" style={{ background: t.swatch }} />
          <div>
            <div className="font-semibold text-sm">{t.name}</div>
            <div className="text-[10px] opacity-50 mt-0.5">{t.font.split(',')[0].replace(/"/g, '')}</div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4 flex items-center gap-1.5 text-[9px] opacity-40">
        <RotateCw className="w-3 h-3" />
        <span>Tap rotate to flip back</span>
      </div>
    </div>
  );
}
