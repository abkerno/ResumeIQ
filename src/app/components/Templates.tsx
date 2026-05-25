import { useState } from 'react';
import { motion } from 'motion/react';
import {
  FlaskConical, Microscope, ShieldCheck, Stethoscope, ClipboardList,
  Beaker, Pill, Activity, Search, Star, Eye, Sparkles, Filter,
  BarChart3, Code, GraduationCap
} from 'lucide-react';
import { Button, TextField, Chip, IconButton } from '@mui/material';
import { useCV } from '../context/CVContext';

interface Template {
  id: string;
  name: string;
  role: string;
  category: 'Clinical' | 'Regulatory' | 'R&D' | 'Quality' | 'Medical' | 'Manufacturing' | 'Tech' | 'Business' | 'Marketing' | 'Academic';
  atsScore: number;
  popularity: number;
  premium: boolean;
  accent: string;
  icon: React.ReactNode;
  description: string;
  tags: string[];
}

const templates: Template[] = [
  {
    id: 'tpl-student',
    name: 'Academic Scholar & Intern',
    role: 'Graduate Research Intern & Student',
    category: 'Academic',
    atsScore: 98,
    popularity: 4.95,
    premium: false,
    accent: '#22C55E',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'Educational achievements and university project details prioritized. Ideal for internship and research applications.',
    tags: ['Research', 'Lab Internships', 'BU Student', 'GCP'],
  },
  {
    id: 'tpl-tech',
    name: 'Tech Catalyst',
    role: 'Senior Software Engineer',
    category: 'Tech',
    atsScore: 97,
    popularity: 4.95,
    premium: false,
    accent: '#3B82F6',
    icon: <Code className="w-6 h-6" />,
    description: 'SDLC, system design, and high-performance algorithms focused structure.',
    tags: ['React', 'TypeScript', 'Node.js', 'AWS'],
  },
  {
    id: 'tpl-biz',
    name: 'Financial Architect',
    role: 'Investment Banking Associate',
    category: 'Business',
    atsScore: 95,
    popularity: 4.85,
    premium: true,
    accent: '#F59E0B',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'DCF modeling, valuations, mergers, and financial strategy layout.',
    tags: ['Valuations', 'Finance', 'DCF', 'MBA'],
  },
  {
    id: 'tpl-mkt',
    name: 'Brand Dynamo',
    role: 'Senior Digital Marketer',
    category: 'Marketing',
    atsScore: 94,
    popularity: 4.75,
    premium: false,
    accent: '#EC4899',
    icon: <Sparkles className="w-6 h-6" />,
    description: 'Growth marketing, search engine optimization (SEO), and campaign optimizations.',
    tags: ['SEO', 'Growth', 'Figma', 'Analytics'],
  },
  {
    id: 'tpl-cra',
    name: 'Clinical Research Architect',
    role: 'Clinical Research Associate',
    category: 'Clinical',
    atsScore: 96,
    popularity: 4.9,
    premium: false,
    accent: '#22C55E',
    icon: <Stethoscope className="w-6 h-6" />,
    description: 'Optimized for Phase II/III trial monitoring roles. GCP & FDA keyword-rich.',
    tags: ['GCP', 'Phase III', 'Veeva', 'Medidata'],
  },
  {
    id: 'tpl-reg',
    name: 'Regulatory Vanguard',
    role: 'Regulatory Affairs Specialist',
    category: 'Regulatory',
    atsScore: 94,
    popularity: 4.8,
    premium: true,
    accent: '#3B82F6',
    icon: <ShieldCheck className="w-6 h-6" />,
    description: 'Built for FDA, EMA, and ICH submissions. Compliance-forward layout.',
    tags: ['FDA', 'EMA', 'ICH', 'NDA/BLA'],
  },
  {
    id: 'tpl-qa',
    name: 'Quality Sentinel',
    role: 'QA Manager — Pharma',
    category: 'Quality',
    atsScore: 92,
    popularity: 4.7,
    premium: false,
    accent: '#F59E0B',
    icon: <ClipboardList className="w-6 h-6" />,
    description: 'GxP, CAPA, and audit-readiness emphasized for QA leadership roles.',
    tags: ['GxP', 'CAPA', 'ISO 13485', 'Audit'],
  },
  {
    id: 'tpl-rnd',
    name: 'Discovery Lab',
    role: 'R&D Scientist',
    category: 'R&D',
    atsScore: 93,
    popularity: 4.8,
    premium: true,
    accent: '#A855F7',
    icon: <FlaskConical className="w-6 h-6" />,
    description: 'Publications-first layout for medicinal chemistry and biology scientists.',
    tags: ['Assay', 'In-vitro', 'HPLC', 'Publications'],
  },
  {
    id: 'tpl-medaff',
    name: 'Medical Affairs Pro',
    role: 'Medical Science Liaison',
    category: 'Medical',
    atsScore: 95,
    popularity: 4.9,
    premium: true,
    accent: '#EC4899',
    icon: <Microscope className="w-6 h-6" />,
    description: 'KOL engagement, scientific exchange, and therapy-area expertise highlighted.',
    tags: ['MSL', 'KOL', 'Oncology', 'CNS'],
  },
  {
    id: 'tpl-pv',
    name: 'Pharmacovigilance Guardian',
    role: 'Drug Safety Officer',
    category: 'Clinical',
    atsScore: 91,
    popularity: 4.6,
    premium: false,
    accent: '#22C55E',
    icon: <Activity className="w-6 h-6" />,
    description: 'ICSR, signal detection, and PSUR-focused structure.',
    tags: ['ICSR', 'PSUR', 'Argus', 'Signal Detection'],
  },
  {
    id: 'tpl-mfg',
    name: 'GMP Manufacturing Lead',
    role: 'Manufacturing Manager',
    category: 'Manufacturing',
    atsScore: 90,
    popularity: 4.5,
    premium: false,
    accent: '#F59E0B',
    icon: <Beaker className="w-6 h-6" />,
    description: 'Highlights cGMP, batch records, and process validation experience.',
    tags: ['cGMP', 'Validation', 'OEE', 'Lean'],
  },
  {
    id: 'tpl-formul',
    name: 'Formulation Strategist',
    role: 'Formulation Scientist',
    category: 'R&D',
    atsScore: 89,
    popularity: 4.4,
    premium: true,
    accent: '#A855F7',
    icon: <Pill className="w-6 h-6" />,
    description: 'Solid dose, biologics, and stability-study oriented design.',
    tags: ['Stability', 'Biologics', 'Solid Dose', 'DoE'],
  },
];

const categories = ['All', 'Academic', 'Tech', 'Business', 'Marketing', 'Clinical', 'Regulatory', 'R&D', 'Quality', 'Medical', 'Manufacturing'] as const;

const catNicheMap: Record<string, 'general' | 'cra' | 'regulatory' | 'quality' | 'tech' | 'business' | 'creative'> = {
  'Academic': 'general',
  'Tech': 'tech',
  'Business': 'business',
  'Marketing': 'creative',
  'Clinical': 'cra',
  'Regulatory': 'regulatory',
  'Quality': 'quality',
  'R&D': 'general',
  'Medical': 'general',
  'Manufacturing': 'general'
};

export function Templates({ onUseTemplate }: { onUseTemplate: () => void }) {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<typeof categories[number]>('All');
  const { createCV, selectCV } = useCV();

  const filtered = templates.filter(t => {
    const matchesCat = activeCat === 'All' || t.category === activeCat;
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q) || t.tags.some(x => x.toLowerCase().includes(q));
    return matchesCat && matchesQuery;
  });

  const handleUseTemplate = (t: Template) => {
    const niche = catNicheMap[t.category] || 'general';
    const newId = createCV(t.name, niche, t.id);
    selectCV(newId);
    onUseTemplate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1E3A8A]/10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-[#22C55E] text-sm mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Pharmaceutical CV Templates</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Template Gallery</h1>
          <p className="text-gray-400">ATS-optimized templates engineered for life-sciences roles. Pick one and start in seconds.</p>
        </motion.div>

        {/* Search + Filters */}
        <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 mb-6 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="flex-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <TextField
              fullWidth
              size="small"
              variant="standard"
              placeholder="Search templates, roles, or skills…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              InputProps={{
                disableUnderline: true,
                sx: { color: 'white', fontSize: '14px' }
              }}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                  activeCat === c
                    ? 'bg-gradient-to-r from-[#1E3A8A] to-[#22C55E] text-white border-transparent'
                    : 'text-gray-400 border-white/10 hover:bg-white/5'
                }`}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden"
            >
              {/* Preview surface */}
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-[#0B1220] to-[#1E3A8A]/30">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${t.accent}55, transparent 60%)` }}
                />
                {/* Mini paper preview */}
                <div className="absolute inset-4 rounded-md bg-white p-3 shadow-2xl">
                  <div className="h-2 w-1/2 rounded" style={{ background: t.accent }} />
                  <div className="mt-2 h-1.5 w-3/4 rounded bg-gray-300" />
                  <div className="mt-1 h-1.5 w-2/3 rounded bg-gray-200" />
                  <div className="mt-3 grid grid-cols-3 gap-1">
                    {[0, 1, 2].map(k => (
                      <div key={`m-${t.id}-${k}`} className="h-1 rounded bg-gray-200" />
                    ))}
                  </div>
                  <div className="mt-2 h-1 w-full rounded bg-gray-200" />
                  <div className="mt-1 h-1 w-5/6 rounded bg-gray-200" />
                  <div className="mt-1 h-1 w-4/6 rounded bg-gray-200" />
                  <div className="mt-3 flex gap-1">
                    <div className="h-1.5 w-8 rounded" style={{ background: `${t.accent}88` }} />
                    <div className="h-1.5 w-6 rounded bg-gray-300" />
                    <div className="h-1.5 w-10 rounded bg-gray-200" />
                  </div>
                </div>

                {t.premium && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EC4899] text-[10px] font-semibold text-white">
                    PREMIUM
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${t.accent}22`, color: t.accent }}
                  >
                    {t.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold leading-tight">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{t.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {t.tags.map(tag => (
                    <Chip key={`${t.id}-${tag}`} label={tag} size="small" sx={{
                      bgcolor: 'rgba(255,255,255,0.04)', color: '#9CA3AF',
                      border: '1px solid rgba(255,255,255,0.08)', fontSize: '10px', height: '20px'
                    }} />
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1 text-[#22C55E]">
                      <span className="font-semibold">{t.atsScore}%</span>
                      <span className="text-gray-500">ATS</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Star className="w-3 h-3 text-[#F59E0B]" fill="#F59E0B" />
                      <span>{t.popularity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => handleUseTemplate(t)}
                      size="small"
                      sx={{
                        textTransform: 'none', color: 'white',
                        background: 'linear-gradient(135deg, #1E3A8A, #22C55E)',
                        px: 2, '&:hover': { opacity: 0.9 }
                      }}
                    >Use Template</Button>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">No templates match your filter.</div>
        )}
      </div>
    </div>
  );
}

