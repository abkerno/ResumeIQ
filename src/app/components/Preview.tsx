import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronLeft, Download, Printer, Maximize2,
  Eye, FileText, Sparkles
} from 'lucide-react';
import { LivePreview, PreviewData } from './LivePreview';
import { ExportModal } from './ExportModal';

const demoData: PreviewData = {
  personal: {
    name: 'Dr. Sarah Chen',
    title: 'Senior Clinical Research Associate',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 234-9821',
    location: 'Boston, MA',
  },
  summary:
    'Senior Clinical Research Associate with 7+ years orchestrating Phase II–III pharmaceutical trials in oncology and cardiovascular therapeutics. Demonstrated record reducing protocol deviations by 38% and accelerating site activation timelines by 22% across global multi-center studies.',
  experience: [
    { id: 'exp-1', company: 'Pfizer Inc.', role: 'Senior Clinical Research Associate', period: '2022 — Present',
      description: 'Led Phase II/III oncology trials across 14 sites, ensuring GCP and FDA 21 CFR Part 11 compliance. Reduced protocol deviations by 38% through risk-based monitoring.' },
    { id: 'exp-2', company: 'Novartis Pharmaceuticals', role: 'Clinical Research Associate II', period: '2019 — 2022',
      description: 'Monitored cardiovascular Phase III trials. Authored 22+ monitoring visit reports and supported FDA inspection readiness for two pivotal NDA submissions.' },
  ],
  education: [
    { id: 'edu-1', institution: 'Johns Hopkins University', degree: 'M.S. Pharmaceutical Sciences', period: '2017 — 2019' },
    { id: 'edu-2', institution: 'University of Michigan', degree: 'B.S. Biochemistry', period: '2013 — 2017' },
  ],
  skills: [
    'GCP', 'FDA 21 CFR Part 11', 'Clinical Trial Management', 'Veeva Vault',
    'Medidata Rave', 'Risk-Based Monitoring', 'Protocol Development', 'CDISC SDTM',
    'ICH-E6 (R2)', 'Pharmacovigilance', 'Oncology', 'Cardiovascular',
  ],
  certifications: [
    { id: 'cert-1', name: 'ACRP Certified Clinical Research Associate (CCRA)', issuer: 'ACRP', year: '2021' },
    { id: 'cert-2', name: 'GCP Certification (TransCelerate)', issuer: 'TransCelerate', year: '2023' },
  ],
};

import { useCV } from '../context/CVContext';

export function Preview({ onBack }: { onBack: () => void }) {
  const { activeCV, atsAnalysis } = useCV();
  const [showExportModal, setShowExportModal] = useState(false);

  if (!activeCV) {
    return (
      <div className="min-h-screen bg-[#070D1A] flex items-center justify-center text-white font-medium">
        Loading preview...
      </div>
    );
  }

  const previewData = {
    personal: activeCV.personal,
    summary: activeCV.summary,
    experience: activeCV.experience,
    education: activeCV.education,
    skills: activeCV.skills,
    certifications: activeCV.certifications,
    languages: activeCV.languages,
    publications: activeCV.publications,
    references: activeCV.references,
    therapeuticAreas: activeCV.therapeuticAreas,
    activeNiche: activeCV.activeNiche,
    isStudent: activeCV.isStudent,
    sectionOrder: activeCV.sectionOrder,
  };

  const stats = [
    { id: 'st-1', label: 'Sections',     value: 8,  hint: 'Standard pharma layout' },
    { id: 'st-2', label: 'Skills',       value: activeCV.skills.length, hint: 'Industry keywords' },
    { id: 'st-3', label: 'Experience',   value: activeCV.experience.length, hint: 'Roles documented' },
    { id: 'st-4', label: 'ATS Score',    value: `${atsAnalysis.score}%`, hint: 'Compatibility rating', accent: true },
  ];

  return (
    <div className="min-h-screen bg-[#070D1A]">
      {/* ── Page Header ──────────────────────────── */}
      <div className="border-b border-white/[0.06] bg-[#070D1A]/95 backdrop-blur-xl sticky top-0 z-40 py-3 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center gap-3 sm:gap-5">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#475569] hover:text-white transition-colors text-sm font-medium group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          <div className="w-px h-6 bg-white/10" />

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}>
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-white font-bold text-sm sm:text-lg leading-none">CV Preview</h1>
                <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#22C55E]/12 text-[#22C55E] border border-[#22C55E]/25">
                  Live
                </span>
              </div>
              <p className="text-[#64748B] text-[10px] sm:text-xs mt-1 truncate">
                {activeCV.personal.name} · {activeCV.personal.title}
              </p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setShowExportModal(true)} className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-white/10 text-[#94A3B8] hover:text-white hover:border-white/20 transition-all">
              <Printer className="w-4 h-4" />
              Print
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-white text-xs sm:text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}
            >
              <Download className="w-3.5 h-3.5 sm:w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl p-4 border ${
                s.accent
                  ? 'border-[#22C55E]/25 bg-gradient-to-br from-[#1E3A8A]/15 to-[#22C55E]/10'
                  : 'border-white/[0.06] bg-white/[0.02]'
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider text-[#64748B] font-semibold">{s.label}</div>
              <div className={`text-2xl font-bold mt-1 ${s.accent ? 'text-[#22C55E]' : 'text-white'}`}>{s.value}</div>
              <div className="text-[10px] text-[#475569] mt-1">{s.hint}</div>
            </motion.div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Preview viewer */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LivePreview data={previewData} />
          </motion.div>

          {/* Side panel: tips + share */}
          <aside className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-semibold text-sm">Preview tips</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#94A3B8] leading-relaxed">
                <li className="flex gap-2.5">
                  <span className="text-[#22C55E] mt-0.5">›</span>
                  <span>Try the <span className="text-white font-medium">5 themes</span> to find the best fit for your target role.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#22C55E] mt-0.5">›</span>
                  <span>Switch to <span className="text-white font-medium">ATS Safe</span> theme to see exactly how recruiters' parsers will read your CV.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#22C55E] mt-0.5">›</span>
                  <span>Tap the <span className="text-white font-medium">flip icon</span> for a designer summary card with your CV stats.</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#22C55E] mt-0.5">›</span>
                  <span>Use <span className="text-white font-medium">Mobile</span> device to verify how recruiters scanning on phones will see your CV.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="rounded-2xl border border-[#22C55E]/20 bg-gradient-to-br from-[#1E3A8A]/15 to-[#22C55E]/10 p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[#22C55E]" />
                <span className="text-white font-semibold text-sm">Ready to send?</span>
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                Export an ATS-optimized PDF or print your resume to send to recruiters.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.26 }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <Maximize2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                <span className="text-white font-semibold text-sm">Need changes?</span>
              </div>
              <p className="text-xs text-[#94A3B8] mb-3">
                Jump back to the editor to refine your content — preview updates live.
              </p>
              <button
                onClick={onBack}
                className="w-full text-[11px] font-semibold text-[#22C55E] py-2 rounded-xl border border-[#22C55E]/25 bg-[#22C55E]/5 hover:bg-[#22C55E]/10 transition-all"
              >
                Open CV Builder →
              </button>
            </motion.div>
          </aside>
        </div>
      </div>
      {showExportModal && <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />}
    </div>
  );
}
