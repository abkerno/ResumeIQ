import { useState, useRef, useEffect, useMemo } from 'react';
import {
  useCV, Experience, Education, Certification, Reference,
  CoachMessage, Publication, Language
} from '../context/CVContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Briefcase, GraduationCap, Award, FlaskConical, Languages,
  Plus, Trash2, Sparkles, Download, Save, Eye, Wand2,
  CheckCircle2, AlertCircle, Zap, Brain, Target, X,
  ChevronLeft, Send, ArrowUpRight, BarChart3, Clock,
  Microscope, Users, Camera, FileText, FileCode2, FileType2,
  ScanSearch, Command, ChevronDown, ArrowUp, ArrowDown
} from 'lucide-react';

type SectionId =
  | 'personal' | 'summary' | 'experience' | 'education'
  | 'skills' | 'therapeutic' | 'certifications'
  | 'publications' | 'languages' | 'references'
  | 'coverletter';

const sectionMeta: Record<SectionId, { label: string; icon: React.ReactNode; description: string }> = {
  personal:       { label: 'Personal',        icon: <User className="w-4 h-4" />,           description: 'Contact & identity' },
  summary:        { label: 'Summary',         icon: <Sparkles className="w-4 h-4" />,       description: 'Professional profile' },
  experience:     { label: 'Experience',      icon: <Briefcase className="w-4 h-4" />,      description: 'Work history' },
  education:      { label: 'Education',       icon: <GraduationCap className="w-4 h-4" />,  description: 'Degrees & training' },
  skills:         { label: 'Skills',          icon: <Zap className="w-4 h-4" />,            description: 'Technical keywords' },
  therapeutic:    { label: 'Therapeutic',     icon: <Microscope className="w-4 h-4" />,     description: 'Disease areas' },
  certifications: { label: 'Certifications',  icon: <Award className="w-4 h-4" />,          description: 'Credentials' },
  publications:   { label: 'Publications',    icon: <FlaskConical className="w-4 h-4" />,   description: 'Research & papers' },
  languages:      { label: 'Languages',       icon: <Languages className="w-4 h-4" />,      description: 'Language proficiency' },
  references:     { label: 'References',      icon: <Users className="w-4 h-4" />,          description: 'Professional referees' },
  coverletter:    { label: 'Cover Letter',    icon: <FileText className="w-4 h-4" />,       description: 'Tailored job letter' }
};

const SECTIONS: SectionId[] = ['personal', 'summary', 'experience', 'education', 'skills', 'therapeutic', 'certifications', 'publications', 'languages', 'references', 'coverletter'];

const initialExperience: Experience[] = [
  { id: 'exp-1', company: 'Pfizer Inc.', role: 'Senior Clinical Research Associate', period: '2022 — Present',
    description: 'Led Phase II/III oncology trials across 14 sites, ensuring GCP and FDA 21 CFR Part 11 compliance. Reduced protocol deviations by 38% through risk-based monitoring.' },
  { id: 'exp-2', company: 'Novartis Pharmaceuticals', role: 'Clinical Research Associate II', period: '2019 — 2022',
    description: 'Monitored cardiovascular Phase III trials. Authored 22+ monitoring visit reports and supported FDA inspection readiness for two pivotal NDA submissions.' },
];

const initialEducation: Education[] = [
  { id: 'edu-1', institution: 'Johns Hopkins University', degree: 'M.S. Pharmaceutical Sciences', period: '2017 — 2019' },
  { id: 'edu-2', institution: 'University of Michigan', degree: 'B.S. Biochemistry', period: '2013 — 2017' },
];

const initialCerts: Certification[] = [
  { id: 'cert-1', name: 'ACRP Certified Clinical Research Associate (CCRA)', issuer: 'ACRP', year: '2021' },
  { id: 'cert-2', name: 'GCP Certification (TransCelerate)', issuer: 'TransCelerate', year: '2023' },
];

const initialSkills = [
  'GCP', 'FDA 21 CFR Part 11', 'Clinical Trial Management', 'Veeva Vault',
  'Medidata Rave', 'Risk-Based Monitoring', 'Protocol Development', 'CDISC SDTM',
  'ICH-E6 (R2)', 'Pharmacovigilance',
];

const THERAPEUTIC_AREAS = [
  { id: 'onc',  name: 'Oncology',          icon: '🧬', selected: true,  trials: 14 },
  { id: 'cv',   name: 'Cardiovascular',    icon: '❤️', selected: true,  trials: 6 },
  { id: 'imm',  name: 'Immunology',        icon: '🛡️', selected: false, trials: 0 },
  { id: 'cns',  name: 'Neurology / CNS',   icon: '🧠', selected: false, trials: 0 },
  { id: 'inf',  name: 'Infectious Disease',icon: '🦠', selected: false, trials: 0 },
  { id: 'rare', name: 'Rare Disease',      icon: '💎', selected: false, trials: 0 },
  { id: 'end',  name: 'Endocrinology',     icon: '⚗️', selected: false, trials: 0 },
  { id: 'res',  name: 'Respiratory',       icon: '🫁', selected: false, trials: 0 },
];

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

const initialReferences: Reference[] = [
  { id: 'ref-1', name: 'Dr. Marcus Holloway', role: 'Director, Clinical Operations', company: 'Pfizer Inc.', email: 'm.holloway@example.com' },
];

const initialCoach: CoachMessage[] = [
  { id: 'm-1', role: 'ai', text: "Welcome! I'm your AI CV coach. Try the JD Matcher to tailor your CV to a specific role — I'll spot missing keywords." },
];

const inputBase =
  "w-full bg-[#0B1220]/60 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#334155] focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all duration-200 resize-none";

/* ══════════════════════════════════════════════ */
export function CVBuilder({ onBack, onOpenPreview }: { onBack: () => void; onOpenPreview?: () => void }) {
  const {
    activeCV,
    isLoadingAI,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    removeExperience,
    updateExperience,
    addEducation,
    removeEducation,
    updateEducation,
    addSkill,
    removeSkill,
    addCertification,
    removeCertification,
    updateCertification,
    toggleTherapeuticArea,
    addReference,
    removeReference,
    updateReference,
    addLanguage,
    removeLanguage,
    addPublication,
    removePublication,
    sendCoachMessage,
    aiEnhanceSummary,
    aiRefineExperience,
    atsAnalysis,
    updateActiveCV,
    callAI
  } = useCV();

  const [activeSection, setActiveSection] = useState<SectionId>('summary');
  const [saving, setSaving] = useState(false);
  const [showJDMatcher, setShowJDMatcher] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [coachInput, setCoachInput] = useState('');
  const [refiningId, setRefiningId] = useState<string | null>(null);

  // Read deep-linked active tab on mount or activeCV changes
  useEffect(() => {
    const targetTab = localStorage.getItem('cv_architect_active_tab');
    if (targetTab) {
      setActiveSection(targetTab as SectionId);
      localStorage.removeItem('cv_architect_active_tab');
    }
  }, [activeCV?.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 's') { e.preventDefault(); setSaving(true); setTimeout(() => setSaving(false), 1800); }
      if (meta && e.key === 'k') { e.preventDefault(); setShowJDMatcher(true); }
      if (meta && e.key === 'p') { e.preventDefault(); onOpenPreview?.(); }
      if (meta && e.key === '/') { e.preventDefault(); setShowShortcuts(v => !v); }
      if (e.key === 'Escape') { setShowJDMatcher(false); setShowExport(false); setShowShortcuts(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!activeCV) {
    return (
      <div className="min-h-screen bg-[#070D1A] flex items-center justify-center text-white font-medium">
        Loading CV project...
      </div>
    );
  }

  const personal = activeCV.personal || { name: '', title: '', email: '', phone: '', location: '', photo: null };
  const summary = activeCV.summary || '';
  const experience = activeCV.experience || [];
  const education = activeCV.education || [];
  const certifications = activeCV.certifications || [];
  const skills = activeCV.skills || [];
  const therapeutic = activeCV.therapeuticAreas || [];
  const references = activeCV.references || [];
  const coachMessages = activeCV.chats || [];
  const languages = activeCV.languages || [];
  const publications = activeCV.publications || [];

  const atsScore = atsAnalysis?.score || 0;

  const triggerSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  const handleStudentToggle = (val: boolean) => {
    updateActiveCV(prev => ({
      ...prev,
      isStudent: val
    }));
  };

  const handleAddSkill = (value?: string) => {
    const v = (value ?? newSkill).trim();
    if (v) addSkill(v);
    setNewSkill('');
  };

  const sendCoach = (overrideText?: string) => {
    const text = typeof overrideText === 'string' ? overrideText.trim() : coachInput.trim();
    if (!text) return;
    sendCoachMessage(text);
    setCoachInput('');
  };

  const clearCoachHistory = () => {
    updateActiveCV(prev => ({
      ...prev,
      chats: [
        { id: 'm-1', role: 'ai', text: "Welcome! I'm your AI CV coach. Let's make your CV exceptionally optimized for Applicant Tracking Systems." }
      ]
    }));
  };

  const handleGenerateCoverLetter = async () => {
    try {
      const cvContextStr = `CV DATA:
Name: ${personal.name}
Title: ${personal.title}
Summary: ${summary}
Experience: ${experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join(' | ')}
Skills: ${skills.join(', ')}`;

      const systemPrompt = `You are a Senior Clinical & Pharmaceutical Career Recruiter.
Generate a high-impact, professionally tailored clinical cover letter matching the user's CV to their target Job Description.
Focus on GCP/GxP compliance, clinical operations, or relevant regulatory benchmarks from their CV.
Keep the cover letter strictly professional, under 400 words, and formatted beautifully with placeholders like [Date], [Hiring Manager Name], [Company Name], and [My Name].
Do not output any markdown code blocks, conversational introductions, or postscript notes. Start directly with the letter.`;

      const prompt = [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `CV TEXT:
${cvContextStr}

TARGET JOB DESCRIPTION:
${activeCV.targetJD || 'General pharmaceutical/clinical operations role.'}`
        }
      ];

      const response = await callAI(prompt);
      updateActiveCV(prev => ({
        ...prev,
        coverLetter: response
      }));
    } catch (e) {
      alert("Failed to generate cover letter. Please check your AI API configurations in Settings.");
    }
  };

  const handleRefineExp = async (id: string, currentDesc: string) => {
    setRefiningId(id);
    await aiRefineExperience(id, currentDesc);
    setRefiningId(null);
  };

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    updateActiveCV(prev => ({
      ...prev,
      languages: (prev.languages || []).map(l => l.id === id ? { ...l, [field]: value } : l)
    }));
  };

  const updatePublication = (id: string, field: keyof Publication, value: string) => {
    updateActiveCV(prev => ({
      ...prev,
      publications: (prev.publications || []).map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleExportClick = (label: string) => {
    setShowExport(false);
    if (!activeCV) return;
    if (label === 'PDF Document') {
      window.print();
    } else if (label === 'JSON / Pharma') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeCV, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${activeCV?.personal?.name?.replace(/\s+/g, '_') || 'CV'}_project.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (label === 'Plain Text') {
      const cleanOrder = activeCV.sectionOrder || (activeCV.isStudent
        ? ['summary', 'education', 'certifications', 'experience', 'skills', 'therapeutic', 'publications', 'languages', 'references']
        : ['summary', 'experience', 'education', 'skills', 'therapeutic', 'certifications', 'publications', 'languages', 'references']);

      const sectionsText = cleanOrder.map(id => {
        switch (id) {
          case 'summary':
            if (!activeCV.summary) return '';
            return `PROFILE SUMMARY\n${activeCV.summary}`;
          case 'therapeutic':
            const activeAreas = (activeCV.therapeuticAreas || []).filter(a => a.selected);
            if (activeAreas.length === 0) return '';
            const niche = activeCV.activeNiche || 'general';
            let labelVal = "THERAPEUTIC SPECIALIZATIONS";
            if (niche === 'tech') labelVal = "TECH VERTICALS";
            else if (niche === 'business') labelVal = "BUSINESS VERTICALS";
            else if (niche === 'creative') labelVal = "CREATIVE FIELDS";
            else if (niche === 'general') labelVal = "FOCUS VERTICALS";
            const formatted = activeAreas.map(a => {
              const trans = translateArea(a.id, niche);
              return `${trans.name} (${a.trials} ${trans.suffix})`;
            }).join(', ');
            return `${labelVal}\n${formatted}`;
          case 'experience':
            if (activeCV.experience.length === 0) return '';
            const expLabel = activeCV.isStudent ? "PROJECTS & INTERNSHIPS" : "EXPERIENCE";
            const expList = activeCV.experience.map(e => `${e.role} at ${e.company} (${e.period})\n${e.description}`).join('\n\n');
            return `${expLabel}\n${expList}`;
          case 'education':
            if (activeCV.education.length === 0) return '';
            const eduList = activeCV.education.map(ed => `${ed.degree} - ${ed.institution} (${ed.period})`).join('\n');
            return `EDUCATION\n${eduList}`;
          case 'skills':
            if (activeCV.skills.length === 0) return '';
            return `SKILLS\n${activeCV.skills.join(', ')}`;
          case 'certifications':
            if (activeCV.certifications.length === 0) return '';
            const certList = activeCV.certifications.map(c => `${c.name} - ${c.issuer} (${c.year})`).join('\n');
            return `CERTIFICATIONS\n${certList}`;
          case 'publications':
            if (!activeCV.publications || activeCV.publications.length === 0) return '';
            const pubList = activeCV.publications.map(p => `"${p.title}" - ${p.journal} (${p.year})`).join('\n');
            return `PUBLICATIONS\n${pubList}`;
          case 'languages':
            if (!activeCV.languages || activeCV.languages.length === 0) return '';
            const langList = activeCV.languages.map(l => `${l.name} (${l.level})`).join('\n');
            return `LANGUAGES\n${langList}`;
          case 'references':
            if (!activeCV.references || activeCV.references.length === 0) return '';
            const refList = activeCV.references.map(r => `${r.name} - ${r.role}, ${r.company} (${r.email})`).join('\n');
            return `REFERENCES\n${refList}`;
          default:
            return '';
        }
      }).filter(Boolean).join('\n\n');

      const textContent = `${activeCV.personal.name}\n${activeCV.personal.title}\nEmail: ${activeCV.personal.email} | Phone: ${activeCV.personal.phone} | Location: ${activeCV.personal.location}\n\n${sectionsText}`;
      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent.trim());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${activeCV.personal.name.replace(/\s+/g, '_') || 'CV'}.txt`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (label === 'Word (.docx)') {
      const cleanOrder = activeCV.sectionOrder || (activeCV.isStudent
        ? ['summary', 'education', 'certifications', 'experience', 'skills', 'therapeutic', 'publications', 'languages', 'references']
        : ['summary', 'experience', 'education', 'skills', 'therapeutic', 'certifications', 'publications', 'languages', 'references']);

      const sectionsHtml = cleanOrder.map(id => {
        switch (id) {
          case 'summary':
            if (!activeCV.summary) return '';
            return `<h2>Profile</h2><p>${activeCV.summary}</p>`;
          case 'therapeutic':
            const activeAreas = (activeCV.therapeuticAreas || []).filter(a => a.selected);
            if (activeAreas.length === 0) return '';
            const niche = activeCV.activeNiche || 'general';
            let labelVal = "Therapeutic Specializations";
            if (niche === 'tech') labelVal = "Tech Verticals";
            else if (niche === 'business') labelVal = "Business Verticals";
            else if (niche === 'creative') labelVal = "Creative Fields";
            else if (niche === 'general') labelVal = "Focus Verticals";
            const formatted = activeAreas.map(a => {
              const trans = translateArea(a.id, niche);
              return `${trans.name} (${a.trials} ${trans.suffix})`;
            }).join(', ');
            return `<h2>${labelVal}</h2><p>${formatted}</p>`;
          case 'experience':
            if (activeCV.experience.length === 0) return '';
            const expLabel = activeCV.isStudent ? "Projects & Internships" : "Experience";
            const expList = activeCV.experience.map(e => `
              <div class="job">
                <p class="job-title">${e.role}</p>
                <p class="job-company">${e.company} &mdash; ${e.period}</p>
                <p>${e.description}</p>
              </div>
            `).join('');
            return `<h2>${expLabel}</h2>${expList}`;
          case 'education':
            if (activeCV.education.length === 0) return '';
            const eduList = activeCV.education.map(ed => `
              <p><strong>${ed.degree}</strong> &mdash; ${ed.institution} (${ed.period})</p>
            `).join('');
            return `<h2>Education</h2>${eduList}`;
          case 'skills':
            if (activeCV.skills.length === 0) return '';
            return `<h2>Skills</h2><p>${activeCV.skills.join(', ')}</p>`;
          case 'certifications':
            if (activeCV.certifications.length === 0) return '';
            const certList = activeCV.certifications.map(c => `
              <p><strong>${c.name}</strong> &mdash; ${c.issuer} (${c.year})</p>
            `).join('');
            return `<h2>Certifications</h2>${certList}`;
          case 'publications':
            if (!activeCV.publications || activeCV.publications.length === 0) return '';
            const pubList = activeCV.publications.map(p => `
              <p><strong>"${p.title}"</strong> &mdash; ${p.journal} (${p.year})</p>
            `).join('');
            return `<h2>Publications</h2>${pubList}`;
          case 'languages':
            if (!activeCV.languages || activeCV.languages.length === 0) return '';
            const langList = activeCV.languages.map(l => `
              <p><strong>${l.name}</strong> (${l.level})</p>
            `).join('');
            return `<h2>Languages</h2>${langList}`;
          case 'references':
            if (!activeCV.references || activeCV.references.length === 0) return '';
            const refList = activeCV.references.map(r => `
              <p><strong>${r.name}</strong> &mdash; ${r.role}, ${r.company} (${r.email})</p>
            `).join('');
            return `<h2>References</h2>${refList}`;
          default:
            return '';
        }
      }).filter(Boolean).join('');

      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><title>${activeCV.personal.name} CV</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; }
          h1 { font-size: 20pt; font-weight: bold; margin-bottom: 2px; }
          h2 { font-size: 13pt; font-weight: bold; border-bottom: 1px solid #000; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; }
          p { margin: 4px 0; }
          .job { margin-bottom: 10px; }
          .job-title { font-weight: bold; }
          .job-company { font-style: italic; }
        </style>
        </head>
        <body>
          <h1>${activeCV.personal.name}</h1>
          <p><strong>${activeCV.personal.title}</strong></p>
          <p>${activeCV.personal.email} | ${activeCV.personal.phone} | ${activeCV.personal.location}</p>
          ${sectionsHtml}
        </body>
        </html>
      `;
      const dataStr = "data:application/msword;charset=utf-8," + encodeURIComponent(htmlContent.trim());
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${activeCV.personal.name.replace(/\s+/g, '_') || 'CV'}.doc`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }
  };

  return (
    <div className="min-h-screen bg-[#070D1A] flex flex-col">
      <Toolbar
        name={personal.name}
        atsScore={atsScore}
        saving={saving}
        showExport={showExport}
        onBack={onBack}
        onSave={triggerSave}
        onEnhance={aiEnhanceSummary}
        onOpenPreview={() => onOpenPreview?.()}
        onOpenJD={() => setShowJDMatcher(true)}
        onToggleExport={() => setShowExport(v => !v)}
        onToggleShortcuts={() => setShowShortcuts(v => !v)}
        onExportSelect={handleExportClick}
      />

      <div className="flex-1 flex overflow-hidden" style={{ maxHeight: 'calc(100vh - 64px)' }}>
        <SectionNav
          activeSection={activeSection}
          onSelect={setActiveSection}
          skills={skills}
          experience={experience}
          education={education}
          summary={summary}
          personal={personal}
          certifications={certifications}
          therapeutic={therapeutic}
          references={references}
        />

        <main className="flex-1 overflow-y-auto px-6 py-6 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="max-w-2xl mx-auto"
            >
              <SectionHeader id={activeSection} />
              <div className="mt-6">
                {activeSection === 'personal' && (
                  <PersonalSection
                    personal={personal}
                    photo={personal.photo}
                    isStudent={!!activeCV.isStudent}
                    onStudentToggle={handleStudentToggle}
                    onPhoto={photoVal => updatePersonalInfo({ photo: photoVal })}
                    onChange={updatePersonalInfo}
                  />
                )}
                {activeSection === 'summary' && (
                  <SummarySection summary={summary} onChange={updateSummary} onEnhance={aiEnhanceSummary} isLoading={isLoadingAI} />
                )}
                {activeSection === 'experience' && (
                  <ExperienceSection experience={experience} onAdd={addExperience} onRemove={removeExperience} onUpdate={updateExperience} onRefine={handleRefineExp} isLoadingId={refiningId} />
                )}
                {activeSection === 'education' && (
                  <EducationSection education={education} onAdd={addEducation} onRemove={removeEducation} onUpdate={updateEducation} />
                )}
                {activeSection === 'skills' && (
                  <SkillsSection skills={skills} newSkill={newSkill} onNewSkill={setNewSkill} onAdd={() => handleAddSkill()} onRemove={removeSkill} />
                )}
                {activeSection === 'therapeutic' && (
                  <TherapeuticSection areas={therapeutic} onToggle={toggleTherapeuticArea} />
                )}
                {activeSection === 'certifications' && (
                  <CertificationsSection certifications={certifications} onAdd={addCertification} onRemove={removeCertification} onUpdate={updateCertification} />
                )}
                {activeSection === 'publications' && (
                  <PublicationsSection publications={publications} onAdd={addPublication} onRemove={removePublication} onUpdate={updatePublication} />
                )}
                {activeSection === 'languages' && (
                  <LanguagesSection languages={languages} onAdd={addLanguage} onRemove={removeLanguage} onUpdate={updateLanguage} />
                )}
                {activeSection === 'references' && (
                  <ReferencesSection references={references} onAdd={addReference} onRemove={removeReference} onUpdate={updateReference} />
                )}
                {activeSection === 'coverletter' && (
                  <CoverLetterSection
                    coverLetter={activeCV.coverLetter || ''}
                    onChange={(val) => updateActiveCV(prev => ({ ...prev, coverLetter: val }))}
                    onGenerate={handleGenerateCoverLetter}
                    isLoading={isLoadingAI}
                    targetJD={activeCV.targetJD || ''}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        <aside className="w-[340px] flex-shrink-0 border-l border-white/[0.06] overflow-y-auto flex flex-col gap-0">
          <AICoach messages={coachMessages} input={coachInput} onInput={setCoachInput} onSend={sendCoach} isLoading={isLoadingAI} onClear={clearCoachHistory} />
          <LiveInsights atsScore={atsScore} skills={skills} />
        </aside>
      </div>

      {/* ── Modals ───────────────────────────── */}
      <AnimatePresence>
        {showJDMatcher && (
          <JDMatcherModal
            skills={skills}
            onAddSkill={(s) => addSkill(s)}
            onClose={() => setShowJDMatcher(false)}
          />
        )}
        {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Toolbar
══════════════════════════════════════════════ */
function Toolbar({
  name, atsScore, saving, showExport,
  onBack, onSave, onEnhance, onOpenPreview, onOpenJD, onToggleExport, onToggleShortcuts, onExportSelect,
}: {
  name: string; atsScore: number; saving: boolean; showExport: boolean;
  onBack: () => void; onSave: () => void; onEnhance: () => void;
  onOpenPreview: () => void; onOpenJD: () => void; onToggleExport: () => void; onToggleShortcuts: () => void;
  onExportSelect: (label: string) => void;
}) {
  return (
    <header className="h-16 flex-shrink-0 bg-[#070D1A]/95 backdrop-blur-xl border-b border-white/[0.07] flex items-center px-5 gap-4 sticky top-0 z-50">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[#475569] hover:text-white transition-colors text-sm font-medium group">
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      <div className="w-px h-5 bg-white/10" />

      <div className="flex flex-col min-w-0">
        <span className="text-white font-semibold text-sm leading-none truncate">{name}</span>
        <span className="text-[#334155] text-[10px] mt-0.5 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {saving ? 'Saving…' : 'Auto-saved · just now'}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* JD Matcher */}
        <button
          onClick={onOpenJD}
          className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border border-[#1E3A8A]/40 bg-[#1E3A8A]/15 text-blue-300 hover:bg-[#1E3A8A]/25 transition-all"
        >
          <ScanSearch className="w-4 h-4" />
          JD Matcher
          <kbd className="hidden lg:inline text-[10px] font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-[#64748B]">⌘K</kbd>
        </button>

        {/* ATS Score pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#22C55E]/8 border border-[#22C55E]/25">
          <div className="relative w-6 h-6">
            <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(34,197,94,0.15)" strokeWidth="2.5" />
              <circle cx="12" cy="12" r="9" fill="none" stroke="#22C55E" strokeWidth="2.5"
                strokeDasharray={`${2 * Math.PI * 9}`}
                strokeDashoffset={`${2 * Math.PI * 9 * (1 - atsScore / 100)}`}
                strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[#22C55E] text-sm font-bold">{atsScore}%</span>
          <span className="text-[#22C55E]/60 text-xs">ATS</span>
        </div>

        <button onClick={onEnhance}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}>
          <Wand2 className="w-4 h-4" />
          AI Enhance
        </button>

        <button onClick={onOpenPreview}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-white/10 text-[#64748B] hover:text-white hover:border-white/20 transition-all">
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <button onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-white/10 text-[#64748B] hover:text-white hover:border-white/20 transition-all">
          <Save className="w-4 h-4" />
        </button>

        {/* Export dropdown */}
        <div className="relative">
          <button onClick={onToggleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/10 transition-all">
            <Download className="w-4 h-4" />
            Export
            <ChevronDown className={`w-3 h-3 transition-transform ${showExport ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showExport && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#0B1220]/98 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
              >
                <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#475569] border-b border-white/[0.06]">Export Format</div>
                {[
                  { icon: <FileType2 className="w-4 h-4 text-[#EF4444]" />, label: 'PDF Document', sub: 'ATS-optimized · Recommended', badge: 'Best' },
                  { icon: <FileText className="w-4 h-4 text-blue-400" />,    label: 'Word (.docx)',  sub: 'Editable format',           badge: null },
                  { icon: <FileCode2 className="w-4 h-4 text-[#22C55E]" />,  label: 'JSON / Pharma', sub: 'Veeva Vault compatible',    badge: null },
                  { icon: <FileText className="w-4 h-4 text-[#F59E0B]" />,   label: 'Plain Text',    sub: 'Maximum ATS compatibility', badge: null },
                ].map((opt, i) => (
                  <button key={i}
                    onClick={() => onExportSelect(opt.label)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-colors text-left">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                      {opt.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs font-semibold flex items-center gap-1.5">
                        {opt.label}
                        {opt.badge && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/25">{opt.badge}</span>}
                      </div>
                      <div className="text-[10px] text-[#475569] mt-0.5">{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={onToggleShortcuts}
          className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl border border-white/10 text-[#64748B] hover:text-white hover:border-white/20 transition-all"
          title="Keyboard shortcuts (⌘/)">
          <Command className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════
   Section Nav
══════════════════════════════════════════════ */
function SectionNav({
  activeSection, onSelect, skills, experience, education, summary, personal, certifications, therapeutic, references
}: {
  activeSection: SectionId; onSelect: (id: SectionId) => void;
  skills: string[]; experience: Experience[]; education: Education[];
  summary: string; personal: { name: string; email: string };
  certifications: Certification[];
  therapeutic: typeof THERAPEUTIC_AREAS;
  references: Reference[];
}) {
  const { activeCV, updateActiveCV } = useCV();
  
  const orderedSections = useMemo(() => {
    const rawOrder = activeCV?.sectionOrder || (activeCV?.isStudent
      ? ['personal', 'summary', 'education', 'certifications', 'experience', 'skills', 'therapeutic', 'publications', 'languages', 'references']
      : ['personal', 'summary', 'experience', 'education', 'skills', 'therapeutic', 'certifications', 'publications', 'languages', 'references']);
    
    // Ensure all sections are valid
    const cleanOrder = rawOrder.filter(s => SECTIONS.includes(s as SectionId)) as SectionId[];
    // Lock personal at the top
    const personalIdx = cleanOrder.indexOf('personal');
    if (personalIdx !== -1) {
      cleanOrder.splice(personalIdx, 1);
    }
    cleanOrder.unshift('personal');
    return cleanOrder;
  }, [activeCV?.isStudent, activeCV?.sectionOrder]);

  const handleMoveSection = (id: SectionId, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCV || !updateActiveCV) return;

    const currentOrder = [...orderedSections];
    const index = currentOrder.indexOf(id);
    if (index === -1 || id === 'personal') return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    // Keep 'personal' locked at index 0
    if (targetIndex < 1 || targetIndex >= currentOrder.length) return;

    // Swap elements
    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    updateActiveCV(prev => ({
      ...prev,
      sectionOrder: currentOrder
    }));
  };

  const dynamicMeta = useMemo(() => {
    let experienceLabel = 'Experience';
    let experienceDesc = 'Work history';
    if (activeCV?.isStudent) {
      experienceLabel = 'Projects & Internships';
      experienceDesc = 'Academic & Personal projects';
    }

    const niche = activeCV?.activeNiche || 'general';
    let therapeuticLabel = 'Therapeutic';
    let therapeuticIcon = <Microscope className="w-4 h-4" />;
    let therapeuticDesc = 'Disease areas';

    if (niche === 'tech') {
      therapeuticLabel = 'Tech Verticals';
      therapeuticIcon = <FileCode2 className="w-4 h-4" />;
      therapeuticDesc = 'Core tech domains';
    } else if (niche === 'business') {
      therapeuticLabel = 'Business Verticals';
      therapeuticIcon = <BarChart3 className="w-4 h-4" />;
      therapeuticDesc = 'Strategic niches';
    } else if (niche === 'creative') {
      therapeuticLabel = 'Creative Fields';
      therapeuticIcon = <Sparkles className="w-4 h-4" />;
      therapeuticDesc = 'Channels & mediums';
    } else if (niche === 'general') {
      therapeuticLabel = 'Focus Verticals';
      therapeuticIcon = <Target className="w-4 h-4" />;
      therapeuticDesc = 'Key focus areas';
    }

    return {
      ...sectionMeta,
      experience: { label: experienceLabel, icon: <Briefcase className="w-4 h-4" />, description: experienceDesc },
      therapeutic: { label: therapeuticLabel, icon: therapeuticIcon, description: therapeuticDesc }
    };
  }, [activeCV?.isStudent, activeCV?.activeNiche]);

  const completion: Record<SectionId, boolean> = {
    personal: !!personal.name && !!personal.email,
    summary: summary.split(' ').length >= 30,
    experience: experience.length > 0 && experience.every(e => e.role && e.company),
    education: education.length > 0,
    skills: skills.length >= 6,
    therapeutic: therapeutic.some(a => a.selected),
    certifications: certifications.length > 0,
    publications: true,
    languages: true,
    references: references.length > 0 && references.every(r => r.name),
    coverletter: true,
  };

  const completedCount = Object.values(completion).filter(Boolean).length;
  const pct = Math.round((completedCount / SECTIONS.length) * 100);

  return (
    <nav className="w-56 flex-shrink-0 border-r border-white/[0.06] flex flex-col py-4 overflow-y-auto bg-[#070D1A]">
      <div className="px-4 mb-5">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#64748B] text-xs font-medium">Completion</span>
            <span className="text-white text-xs font-bold">{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #1E3A8A, #22C55E)' }}
              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }} />
          </div>
          <div className="text-[#334155] text-[10px] mt-1.5">{completedCount}/{SECTIONS.length} sections done</div>
        </div>
      </div>

      <div className="px-3 space-y-0.5">
        {orderedSections.map((id, i) => {
          const active = id === activeSection;
          const done = completion[id];
          return (
            <div key={id}
              className={`group w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                active
                  ? 'bg-gradient-to-r from-[#1E3A8A]/40 to-[#22C55E]/15 border border-[#22C55E]/20 text-white'
                  : 'text-[#475569] hover:bg-white/[0.04] hover:text-[#94A3B8]'
              }`}
              onClick={() => onSelect(id)}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  active ? 'bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] text-white'
                         : done ? 'bg-[#22C55E]/15 text-[#22C55E]'
                                : 'bg-white/[0.05] text-[#334155] group-hover:bg-white/[0.08]'
                }`}>
                  {done && !active ? <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" /> : dynamicMeta[id].icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold leading-none">{dynamicMeta[id].label}</div>
                  <div className="text-[10px] text-[#334155] mt-0.5 truncate">{dynamicMeta[id].description}</div>
                </div>
              </div>
              
              {id !== 'personal' && (
                <div className="hidden group-hover:flex items-center gap-0.5">
                  <button
                    disabled={orderedSections.indexOf(id) <= 1}
                    onClick={(e) => handleMoveSection(id, 'up', e)}
                    className="p-1 rounded text-[#475569] hover:text-[#22C55E] hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move section up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={orderedSections.indexOf(id) >= orderedSections.length - 1}
                    onClick={(e) => handleMoveSection(id, 'down', e)}
                    className="p-1 rounded text-[#475569] hover:text-[#22C55E] hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    title="Move section down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {(id === 'personal' || !active) && (
                <span className="text-[10px] text-[#1E3A8A] font-mono w-4 text-right flex-shrink-0 group-hover:hidden">
                  {i + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════ */
function SectionHeader({ id }: { id: SectionId }) {
  const { activeCV } = useCV();
  const isStudent = activeCV?.isStudent;
  const niche = activeCV?.activeNiche || 'general';

  let label = sectionMeta[id].label;
  let icon = sectionMeta[id].icon;
  let description = sectionMeta[id].description;

  if (id === 'experience' && isStudent) {
    label = 'Projects & Internships';
    description = 'Academic & Personal projects';
  } else if (id === 'therapeutic') {
    if (niche === 'tech') {
      label = 'Tech Verticals';
      icon = <FileCode2 className="w-4 h-4" />;
      description = 'Core tech domains';
    } else if (niche === 'business') {
      label = 'Business Verticals';
      icon = <BarChart3 className="w-4 h-4" />;
      description = 'Strategic niches';
    } else if (niche === 'creative') {
      label = 'Creative Fields';
      icon = <Sparkles className="w-4 h-4" />;
      description = 'Channels & mediums';
    } else if (niche === 'general') {
      label = 'Focus Verticals';
      icon = <Target className="w-4 h-4" />;
      description = 'Key focus areas';
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}>
        {icon}
      </div>
      <div>
        <h2 className="text-white font-bold text-xl leading-none">{label}</h2>
        <p className="text-[#475569] text-sm mt-1">{description}</p>
      </div>
      <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#22C55E]/8 border border-[#22C55E]/20 text-[#22C55E] text-xs font-medium">
        <Sparkles className="w-3 h-3" />
        AI Optimized
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Personal — with photo upload
══════════════════════════════════════════════ */
function PersonalSection({ personal, photo, isStudent, onStudentToggle, onPhoto, onChange }: {
  personal: { name: string; title: string; email: string; phone: string; location: string };
  photo: string | null;
  isStudent: boolean;
  onStudentToggle: (v: boolean) => void;
  onPhoto: (v: string | null) => void;
  onChange: (f: Partial<typeof personal>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => onPhoto(ev.target?.result as string);
    r.readAsDataURL(f);
  };
  const initials = personal.name.split(' ').filter(Boolean).slice(0, 2).map(s => s[0]).join('').toUpperCase();

  return (
    <div className="space-y-5">
      {/* Photo */}
      <div className="flex items-center gap-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#22C55E]/30 flex items-center justify-center"
            style={{ background: photo ? 'transparent' : 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}>
            {photo
              ? <img src={photo} alt="profile" className="w-full h-full object-cover" />
              : <span className="text-white font-bold text-xl">{initials || 'CV'}</span>}
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white flex items-center justify-center shadow-lg shadow-[#22C55E]/30 transition-all">
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-semibold">Profile Photo</div>
          <div className="text-[#475569] text-xs mt-1">Optional · Hidden in ATS exports for compliance</div>
          {photo && (
            <button onClick={() => onPhoto(null)}
              className="mt-2 text-[10px] font-medium text-[#EF4444] hover:underline">Remove photo</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
          <input className={inputBase} value={personal.name} onChange={e => onChange({ name: e.target.value })} placeholder="Dr. Sarah Chen" />
        </div>
        <div>
          <label className="block text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Professional Title</label>
          <input className={inputBase} value={personal.title} onChange={e => onChange({ title: e.target.value })} placeholder="Senior Clinical Research Associate" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Email</label>
            <input className={inputBase} type="email" value={personal.email} onChange={e => onChange({ email: e.target.value })} />
          </div>
          <div>
            <label className="block text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Phone</label>
            <input className={inputBase} value={personal.phone} onChange={e => onChange({ phone: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="block text-[#64748B] text-xs font-semibold uppercase tracking-wider mb-2">Location</label>
          <input className={inputBase} value={personal.location} onChange={e => onChange({ location: e.target.value })} placeholder="Boston, MA" />
        </div>
      </div>

      {/* Student Mode Switch Card */}
      <div className="mt-4 p-4 rounded-2xl border border-[#22C55E]/15 bg-[#22C55E]/5 flex items-center justify-between">
        <div className="flex gap-3 items-center min-w-0">
          <GraduationCap className="w-5 h-5 text-[#22C55E] flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-white text-xs font-semibold">Student & Graduate Mode Layout</span>
            <span className="text-[10px] text-gray-400">Rearranges sections to lift Education/Certifications above experience block.</span>
          </div>
        </div>
        
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => onStudentToggle(!isStudent)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            isStudent ? 'bg-[#22C55E]' : 'bg-white/10'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              isStudent ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}

function SummarySection({ summary, onChange, onEnhance, isLoading }: {
  summary: string; onChange: (v: string) => void; onEnhance: () => void; isLoading: boolean;
}) {
  const words = summary.trim().split(/\s+/).filter(Boolean).length;
  const ok = words >= 30 && words <= 80;
  return (
    <div className="space-y-3">
      <div className="relative">
        <textarea className={`${inputBase} min-h-[160px] pr-4`} value={summary}
          onChange={e => onChange(e.target.value)}
          placeholder="Describe your professional background, key achievements, and core competencies…" />
        <button
          onClick={onEnhance}
          disabled={isLoading}
          className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white transition-all disabled:opacity-40"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
          {isLoading ? 'Enhancing...' : 'AI Enhance Summary'}
        </button>
      </div>
      <div className="flex items-center gap-3">
        {ok ? <CheckCircle2 className="w-4 h-4 text-[#22C55E] flex-shrink-0" /> : <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0" />}
        <span className={`text-xs font-medium ${ok ? 'text-[#22C55E]' : 'text-[#F59E0B]'}`}>
          {words} words · {ok ? 'Optimal range (30–80)' : words < 30 ? 'Too short — add more detail' : 'Too long — trim for ATS'}
        </span>
      </div>
    </div>
  );
}

function ExperienceSection({ experience, onAdd, onRemove, onUpdate, onRefine, isLoadingId }: {
  experience: Experience[]; onAdd: () => void;
  onRemove: (id: string) => void; onUpdate: (id: string, field: keyof Experience, value: string) => void;
  onRefine: (id: string, currentDesc: string) => void;
  isLoadingId: string | null;
}) {
  const { activeCV } = useCV();
  const isStudent = activeCV?.isStudent;

  return (
    <div className="space-y-4">
      {experience.map((exp, idx) => (
        <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] flex items-center justify-center">
                <Briefcase className="w-3 h-3 text-white" />
              </div>
              <span className="text-white text-sm font-semibold">{isStudent ? `Project / Internship ${idx + 1}` : `Position ${idx + 1}`}</span>
            </div>
            <button onClick={() => onRemove(exp.id)} className="text-[#334155] hover:text-[#EF4444] transition-colors p-1 rounded-lg hover:bg-[#EF4444]/10">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">{isStudent ? 'Role / Contribution' : 'Role'}</label>
              <input className={inputBase} value={exp.role} onChange={e => onUpdate(exp.id, 'role', e.target.value)} placeholder={isStudent ? "Lead Developer / Researcher" : "Senior CRA"} />
            </div>
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">{isStudent ? 'Project Name / Organization' : 'Company'}</label>
              <input className={inputBase} value={exp.company} onChange={e => onUpdate(exp.id, 'company', e.target.value)} placeholder={isStudent ? "Open Source App / University Lab" : "Pfizer Inc."} />
            </div>
          </div>
          <div>
            <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Period</label>
            <input className={inputBase} value={exp.period} onChange={e => onUpdate(exp.id, 'period', e.target.value)} placeholder="2022 — Present" />
          </div>
          <div>
            <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Description</label>
            <div className="relative">
              <textarea className={`${inputBase} min-h-[100px] pr-28`} value={exp.description} onChange={e => onUpdate(exp.id, 'description', e.target.value)} placeholder="Describe your key achievements with quantifiable impact…" />
              <button
                onClick={() => onRefine(exp.id, exp.description)}
                disabled={isLoadingId !== null}
                className="absolute right-3 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1E3A8A] hover:bg-[#1E3A8A]/85 text-white transition-all disabled:opacity-40"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
                {isLoadingId === exp.id ? 'Refining...' : 'AI Refine'}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
      <button onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-[#22C55E] text-sm font-medium hover:border-[#22C55E]/40 hover:bg-[#22C55E]/5 transition-all">
        <Plus className="w-4 h-4" />Add Experience
      </button>
    </div>
  );
}

function EducationSection({ education, onAdd, onRemove, onUpdate }: {
  education: Education[]; onAdd: () => void;
  onRemove: (id: string) => void; onUpdate: (id: string, field: keyof Education, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      {education.map((ed, idx) => (
        <motion.div key={ed.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] flex items-center justify-center">
                <GraduationCap className="w-3 h-3 text-white" />
              </div>
              <span className="text-white text-sm font-semibold">Degree {idx + 1}</span>
            </div>
            <button onClick={() => onRemove(ed.id)} className="text-[#334155] hover:text-[#EF4444] transition-colors p-1 rounded-lg hover:bg-[#EF4444]/10">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Degree</label>
              <input className={inputBase} value={ed.degree} onChange={e => onUpdate(ed.id, 'degree', e.target.value)} placeholder="M.S. Pharmaceutical Sciences" />
            </div>
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Institution</label>
              <input className={inputBase} value={ed.institution} onChange={e => onUpdate(ed.id, 'institution', e.target.value)} placeholder="Johns Hopkins University" />
            </div>
          </div>
          <div>
            <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Period</label>
            <input className={inputBase} value={ed.period} onChange={e => onUpdate(ed.id, 'period', e.target.value)} placeholder="2017 — 2019" />
          </div>
        </motion.div>
      ))}
      <button onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-[#22C55E] text-sm font-medium hover:border-[#22C55E]/40 hover:bg-[#22C55E]/5 transition-all">
        <Plus className="w-4 h-4" />Add Education
      </button>
    </div>
  );
}

function SkillsSection({ skills, newSkill, onNewSkill, onAdd, onRemove }: {
  skills: string[]; newSkill: string; onNewSkill: (v: string) => void;
  onAdd: () => void; onRemove: (s: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {skills.map(s => (
            <motion.span key={s} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-[#22C55E]/25 bg-[#1E3A8A]/20 text-white">
              {s}
              <button onClick={() => onRemove(s)} className="text-[#334155] hover:text-[#EF4444] transition-colors opacity-0 group-hover:opacity-100 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2">
        <input className={`${inputBase} flex-1`} placeholder="Add a skill (e.g. CDISC SDTM)" value={newSkill}
          onChange={e => onNewSkill(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())} />
        <button onClick={onAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}>
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="rounded-xl bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 p-4">
        <div className="text-xs text-[#64748B] font-medium mb-2 flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-[#22C55E]" />
          Suggested Pharma Keywords
        </div>
        <div className="flex flex-wrap gap-2">
          {['GxP', 'EMA Guidelines', 'CAPA', 'SOP Development', 'Phase IV'].filter(s => !skills.includes(s)).map(s => (
            <button key={s} onClick={() => onNewSkill(s)}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium border border-white/10 text-[#64748B] hover:border-[#22C55E]/40 hover:text-[#22C55E] transition-all">
              + {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NEW · Therapeutic Areas
══════════════════════════════════════════════ */
function TherapeuticSection({ areas, onToggle }: {
  areas: typeof THERAPEUTIC_AREAS;
  onToggle: (id: string) => void;
}) {
  const { activeCV } = useCV();
  const niche = activeCV?.activeNiche || 'general';

  const selectedCount = areas.filter(a => a.selected).length;
  const totalTrials = areas.filter(a => a.selected).reduce((s, a) => s + a.trials, 0);

  // Dynamic titles and labels depending on the active niche!
  let bannerTitle = "Specialization Profile";
  let bannerTotalText = "cumulative trials across selected therapeutic areas";
  let bannerIcon = <Microscope className="w-12 h-12 text-[#22C55E]/30" />;
  let tipText = "Recruiters filter by therapeutic specialization. Select your top 2–3 areas of expertise for best targeting.";

  if (niche === 'tech') {
    bannerTitle = "Tech Domains Profile";
    bannerTotalText = "projects built under selected technologies";
    bannerIcon = <FileCode2 className="w-12 h-12 text-[#22C55E]/30" />;
    tipText = "Select your top 2–3 architectural domains. High-performance parsers group applicants based on these specialization clusters.";
  } else if (niche === 'business') {
    bannerTitle = "Business Verticals Profile";
    bannerTotalText = "engagements conducted across selected domains";
    bannerIcon = <BarChart3 className="w-12 h-12 text-[#22C55E]/30" />;
    tipText = "Recruiters filter by functional consulting verticals. Select your top areas of strategic focus.";
  } else if (niche === 'creative') {
    bannerTitle = "Creative Focus Profile";
    bannerTotalText = "campaigns and launches executed";
    bannerIcon = <Sparkles className="w-12 h-12 text-[#22C55E]/30" />;
    tipText = "Pick your main creative mediums and marketing channels for optimized portfolio targeting.";
  } else if (niche === 'general') {
    bannerTitle = "Focus Verticals Profile";
    bannerTotalText = "initiatives led in chosen competencies";
    bannerIcon = <Target className="w-12 h-12 text-[#22C55E]/30" />;
    tipText = "Recruiters search for key functional areas. Select your top focus fields to rank higher in search results.";
  }

  return (
    <div className="space-y-5">
      {/* Summary banner */}
      <div className="rounded-2xl border border-[#22C55E]/20 bg-gradient-to-br from-[#1E3A8A]/15 to-[#22C55E]/8 p-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#22C55E] font-semibold">{bannerTitle}</div>
            <div className="text-white text-2xl font-bold mt-1">{selectedCount} Selected</div>
            <div className="text-[#94A3B8] text-xs mt-1">{totalTrials} {bannerTotalText}</div>
          </div>
          {bannerIcon}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {areas.map((area, i) => {
          const trans = translateArea(area.id, niche);
          return (
            <motion.button
              key={area.id}
              onClick={() => onToggle(area.id)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`group relative rounded-2xl border p-4 text-left transition-all overflow-hidden ${
                area.selected
                  ? 'border-[#22C55E]/40 bg-gradient-to-br from-[#1E3A8A]/25 to-[#22C55E]/10'
                  : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
              }`}>
              {area.selected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-[#070D1A]" />
                </div>
              )}
              <div className="text-2xl mb-2">{trans.icon}</div>
              <div className={`text-sm font-semibold ${area.selected ? 'text-white' : 'text-[#94A3B8]'}`}>{trans.name}</div>
              {area.selected && area.trials > 0 && (
                <div className="text-[10px] text-[#22C55E] font-mono mt-1">{area.trials} {trans.suffix} logged</div>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="rounded-xl bg-[#F59E0B]/8 border border-[#F59E0B]/20 p-3 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#CBD5E1]">
          <span className="font-semibold text-[#F59E0B]">Tip:</span> {tipText}
        </div>
      </div>
    </div>
  );
}

function CertificationsSection({ certifications, onAdd, onRemove, onUpdate }: {
  certifications: Certification[]; onAdd: () => void;
  onRemove: (id: string) => void; onUpdate: (id: string, field: keyof Certification, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      {certifications.map((c, idx) => (
        <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
          className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
          <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/25 flex items-center justify-center flex-shrink-0">
            <Award className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1">Name</label>
              <input className={inputBase} value={c.name} onChange={e => onUpdate(c.id, 'name', e.target.value)} placeholder="CCRA, GCP…" />
            </div>
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1">Year</label>
              <input className={inputBase} value={c.year} onChange={e => onUpdate(c.id, 'year', e.target.value)} placeholder="2023" />
            </div>
          </div>
          <button onClick={() => onRemove(c.id)} className="text-[#334155] hover:text-[#EF4444] transition-colors p-1 flex-shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
      <button onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-[#22C55E] text-sm font-medium hover:border-[#22C55E]/40 hover:bg-[#22C55E]/5 transition-all">
        <Plus className="w-4 h-4" />Add Certification
      </button>
    </div>
  );
}

function PublicationsSection({ publications, onAdd, onRemove, onUpdate }: {
  publications: Publication[];
  onAdd: (title: string, journal: string, year: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Publication, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      {publications.map((p, idx) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
          className="flex items-start gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <div className="w-8 h-8 rounded-xl bg-[#1E3A8A]/20 border border-[#1E3A8A]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
            <FlaskConical className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1 grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1">Title</label>
              <input className={inputBase} value={p.title} onChange={e => onUpdate(p.id, 'title', e.target.value)} placeholder="Risk-Based Monitoring in Phase III Oncology Trials" />
            </div>
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1">Year</label>
              <input className={inputBase} value={p.year} onChange={e => onUpdate(p.id, 'year', e.target.value)} placeholder="2024" />
            </div>
            <div className="col-span-3 mt-1">
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1">Journal / Publisher</label>
              <input className={inputBase} value={p.journal} onChange={e => onUpdate(p.id, 'journal', e.target.value)} placeholder="Journal of Clinical Research" />
            </div>
          </div>
          <button onClick={() => onRemove(p.id)} className="text-[#334155] hover:text-[#EF4444] transition-colors p-1 flex-shrink-0 mt-5">
            <Trash2 className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
      <button onClick={() => onAdd("", "", "")}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-[#22C55E] text-sm font-medium hover:border-[#22C55E]/40 hover:bg-[#22C55E]/5 transition-all">
        <Plus className="w-4 h-4" />Add Publication
      </button>
    </div>
  );
}

function LanguagesSection({ languages, onAdd, onRemove, onUpdate }: {
  languages: Language[];
  onAdd: (name: string, level: string, pct: number) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof Language, value: any) => void;
}) {
  const colors: Record<string, string> = { Native: '#22C55E', Fluent: '#2563EB', Professional: '#F59E0B', Conversational: '#64748B' };
  return (
    <div className="space-y-4">
      {languages.map((l, i) => (
        <motion.div key={l.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1">Language</label>
              <input className={inputBase} value={l.name} onChange={e => onUpdate(l.id, 'name', e.target.value)} placeholder="English" />
            </div>
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1">Proficiency</label>
              <select
                className={`${inputBase} w-36`}
                value={l.level}
                onChange={e => {
                  const val = e.target.value;
                  const pct = val === 'Native' ? 100 : val === 'Fluent' ? 85 : val === 'Professional' ? 70 : 50;
                  onUpdate(l.id, 'level', val);
                  onUpdate(l.id, 'pct', pct);
                }}
              >
                <option value="Native">Native</option>
                <option value="Fluent">Fluent</option>
                <option value="Professional">Professional</option>
                <option value="Conversational">Conversational</option>
              </select>
            </div>
            <button onClick={() => onRemove(l.id)} className="text-[#334155] hover:text-[#EF4444] transition-colors p-1 flex-shrink-0 mt-5">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ background: colors[l.level] || '#22C55E' }}
              initial={{ width: 0 }} animate={{ width: `${l.pct}%` }} transition={{ duration: 0.8 }} />
          </div>
        </motion.div>
      ))}
      <button onClick={() => onAdd("", "Professional", 70)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-[#22C55E] text-sm font-medium hover:border-[#22C55E]/40 hover:bg-[#22C55E]/5 transition-all">
        <Plus className="w-4 h-4" />Add Language
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NEW · References
══════════════════════════════════════════════ */
function ReferencesSection({ references, onAdd, onRemove, onUpdate }: {
  references: Reference[]; onAdd: () => void;
  onRemove: (id: string) => void; onUpdate: (id: string, field: keyof Reference, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-[#1E3A8A]/10 border border-[#1E3A8A]/20 p-3 flex items-start gap-2.5">
        <Users className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-[#CBD5E1]">
          References are kept private until requested. Pharma recruiters typically request 2–3 referees who can attest to GCP compliance and trial leadership.
        </div>
      </div>

      {references.map((r, idx) => (
        <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
          className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#1E3A8A]/20 border border-[#1E3A8A]/30 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-white text-sm font-semibold">Referee {idx + 1}</div>
                <div className="text-[10px] text-[#475569]">Confidential · revealed on request</div>
              </div>
            </div>
            <button onClick={() => onRemove(r.id)} className="text-[#334155] hover:text-[#EF4444] transition-colors p-1 rounded-lg hover:bg-[#EF4444]/10">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Full Name</label>
              <input className={inputBase} value={r.name} onChange={e => onUpdate(r.id, 'name', e.target.value)} placeholder="Dr. Marcus Holloway" />
            </div>
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Role</label>
              <input className={inputBase} value={r.role} onChange={e => onUpdate(r.id, 'role', e.target.value)} placeholder="Director, Clinical Operations" />
            </div>
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Company</label>
              <input className={inputBase} value={r.company} onChange={e => onUpdate(r.id, 'company', e.target.value)} placeholder="Pfizer Inc." />
            </div>
            <div>
              <label className="block text-[#64748B] text-[10px] font-semibold uppercase tracking-wider mb-1.5">Email</label>
              <input className={inputBase} type="email" value={r.email} onChange={e => onUpdate(r.id, 'email', e.target.value)} placeholder="m.holloway@example.com" />
            </div>
          </div>
        </motion.div>
      ))}
      <button onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-white/15 text-[#22C55E] text-sm font-medium hover:border-[#22C55E]/40 hover:bg-[#22C55E]/5 transition-all">
        <Plus className="w-4 h-4" />Add Reference
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   AI Coach
══════════════════════════════════════════════ */
function AICoach({ messages, input, onInput, onSend, isLoading, onClear }: {
  messages: CoachMessage[]; input: string;
  onInput: (v: string) => void; onSend: (overrideText?: string) => void;
  isLoading: boolean; onClear: () => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const suggestions = [
    { label: "💡 Audit Keywords", prompt: "Perform a quick keyword audit and suggest missing skills for my target niche." },
    { label: "✍️ Refine Summary", prompt: "Critique and rewrite my professional summary to make it stand out." },
    { label: "📊 Spot Gaps", prompt: "Analyze my experience bullets and point out any compliance/trial metric gaps." }
  ];

  function formatMessage(text: string) {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      if (trimmed.startsWith('###') || trimmed.startsWith('####')) {
        const headerText = trimmed.replace(/^#+\s*/, '');
        return (
          <div key={idx} className="font-bold text-white text-xs mt-2 mb-1 uppercase tracking-wider text-[#22C55E]">
            {headerText}
          </div>
        );
      }

      const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ');
      const bulletText = isBullet ? trimmed.replace(/^[-*•]\s*/, '') : trimmed;

      const parts = bulletText.split('**');
      const nodes = parts.map((part, i) => 
        i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
      );

      if (isBullet) {
        return (
          <div key={idx} className="pl-4 relative mb-1 text-[11px] leading-relaxed text-[#CBD5E1] before:content-['•'] before:absolute before:left-1 before:text-[#22C55E] before:font-bold">
            {nodes}
          </div>
        );
      }

      return (
        <div key={idx} className="mb-1 text-[11px] leading-relaxed text-[#CBD5E1]">
          {nodes}
        </div>
      );
    });
  }

  return (
    <div className="flex flex-col border-b border-white/[0.06]" style={{ height: 420 }}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #22C55E, #1E3A8A)' }}>
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm leading-none">AI CV Coach</div>
          <div className="text-[#334155] text-[10px] mt-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] inline-block animate-pulse" />
            Active Optimization Coach
          </div>
        </div>
        <button
          onClick={onClear}
          title="Clear Chat History"
          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0 bg-[#070D1A]/20">
        {messages.map(m => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && (
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#1E3A8A] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                <Brain className="w-2.5 h-2.5 text-white" />
              </div>
            )}
            <div className={`max-w-[85%] px-3 py-2.5 rounded-2xl text-[11px] leading-relaxed ${
              m.role === 'user'
                ? 'bg-[#1E3A8A]/40 text-white border border-[#1E3A8A]/50 rounded-tr-sm shadow-sm'
                : 'bg-white/[0.04] text-[#CBD5E1] border border-white/[0.06] rounded-tl-sm shadow-sm'
            }`}>
              {m.role === 'user' ? m.text : formatMessage(m.text)}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#1E3A8A] flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
              <Brain className="w-2.5 h-2.5 text-white animate-pulse" />
            </div>
            <div className="bg-white/[0.04] text-[#64748B] border border-white/[0.06] rounded-tl-sm px-3.5 py-3 rounded-2xl text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestion Chips */}
      {!isLoading && (
        <div className="flex gap-2 px-3 pt-2 pb-1 overflow-x-auto scrollbar-none flex-shrink-0 border-t border-white/[0.03]">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => onSend(s.prompt)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#22C55E]/15 bg-[#22C55E]/5 text-gray-300 hover:text-white hover:bg-[#22C55E]/15 hover:border-[#22C55E]/30 transition-all text-[9px] font-medium whitespace-nowrap"
            >
              <Sparkles className="w-2 h-2 text-[#22C55E]" />
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2 px-4 py-3 border-t border-white/[0.06] flex-shrink-0">
        <input
          disabled={isLoading}
          className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-xs placeholder:text-[#334155] focus:outline-none focus:border-[#22C55E]/40 transition-all disabled:opacity-40"
          placeholder={isLoading ? "Coach is thinking..." : "Ask the coach..."} value={input} onChange={e => onInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !isLoading && (e.preventDefault(), onSend())} />
        <button onClick={() => onSend()} disabled={isLoading || !input.trim()}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 hover:opacity-90 transition-all disabled:opacity-30"
          style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Live Insights
══════════════════════════════════════════════ */
function LiveInsights({ atsScore, skills }: { atsScore: number; skills: string[] }) {
  const checks = [
    { id: 'i-1', pass: true,  text: 'Strong action verbs detected',   detail: 'Led, Reduced, Authored' },
    { id: 'i-2', pass: true,  text: `${skills.length} pharma keywords`, detail: 'GCP, CDISC, ICH-E6 matched' },
    { id: 'i-3', pass: false, text: 'Add metrics to Experience #2',   detail: 'Missing quantifiable impact' },
    { id: 'i-4', pass: false, text: 'Consider adding GxP terminology', detail: 'Boosts ATS score by ~8%' },
  ];

  return (
    <div className="px-4 py-4 flex flex-col gap-3 flex-1">
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <BarChart3 className="w-4 h-4 text-[#22C55E]" />
            Live Insights
          </div>
          <span className="text-[#22C55E] font-bold text-sm">{atsScore}%</span>
        </div>
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #1E3A8A, #22C55E)' }}
            initial={{ width: 0 }} animate={{ width: `${atsScore}%` }} transition={{ duration: 1 }} />
        </div>
        <div className="flex justify-between text-[10px] text-[#334155] mt-1.5">
          <span>ATS Compatibility</span>
          <span className="text-[#22C55E]">↑ +12% this session</span>
        </div>
      </div>

      <div className="space-y-2">
        {checks.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
              c.pass ? 'bg-[#22C55E]/[0.04] border-[#22C55E]/15 hover:bg-[#22C55E]/[0.07]'
                     : 'bg-[#F59E0B]/[0.04] border-[#F59E0B]/15 hover:bg-[#F59E0B]/[0.07]'
            }`}>
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${c.pass ? 'bg-[#22C55E]/15' : 'bg-[#F59E0B]/15'}`}>
              {c.pass ? <CheckCircle2 className="w-3 h-3 text-[#22C55E]" /> : <AlertCircle className="w-3 h-3 text-[#F59E0B]" />}
            </div>
            <div>
              <div className={`text-xs font-medium leading-none ${c.pass ? 'text-[#CBD5E1]' : 'text-[#E2E8F0]'}`}>{c.text}</div>
              <div className="text-[10px] text-[#475569] mt-0.5">{c.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   NEW · Job Description Matcher Modal
══════════════════════════════════════════════ */
function JDMatcherModal({ skills, onAddSkill, onClose }: {
  skills: string[]; onAddSkill: (s: string) => void; onClose: () => void;
}) {
  const [jdText, setJdText] = useState('');
  const [analyzed, setAnalyzed] = useState(false);

  const sampleJD = `We're seeking a Senior Clinical Research Associate to lead Phase II/III oncology trials. Required experience: GCP, FDA 21 CFR Part 11, CDISC SDTM, Veeva Vault, risk-based monitoring, IRB submissions, eTMF management, IND/NDA filings, GxP compliance, EMA guidelines, CAPA processes, SOP development, vendor oversight, and Phase IV post-marketing surveillance.`;

  const analysis = useMemo(() => {
    const text = (jdText || '').toLowerCase();
    const candidates = [
      'GCP', 'FDA 21 CFR Part 11', 'CDISC SDTM', 'Veeva Vault', 'Risk-Based Monitoring',
      'IRB Submissions', 'eTMF Management', 'IND Filings', 'NDA Filings', 'GxP', 'EMA Guidelines',
      'CAPA', 'SOP Development', 'Vendor Oversight', 'Phase IV', 'Pharmacovigilance',
      'Clinical Trial Management', 'Medidata Rave', 'ICH-E6 (R2)', 'Protocol Development'
    ];
    const found = candidates.filter(k => text.includes(k.toLowerCase()));
    const matched = found.filter(k => skills.some(s => s.toLowerCase() === k.toLowerCase()));
    const missing = found.filter(k => !skills.some(s => s.toLowerCase() === k.toLowerCase()));
    const score = found.length === 0 ? 0 : Math.round((matched.length / found.length) * 100);
    return { found, matched, missing, score };
  }, [jdText, skills]);

  const handleAnalyze = () => { if (jdText.trim().length > 30) setAnalyzed(true); };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-3xl max-h-[88vh] rounded-3xl bg-[#0B1220] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-5 border-b border-white/[0.07]">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}>
            <ScanSearch className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-lg leading-none">JD Matcher</div>
            <div className="text-[#64748B] text-xs mt-1">Paste a pharma role description — we'll surface missing keywords for ATS optimization</div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-white/[0.05] flex items-center justify-center text-[#64748B] hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {!analyzed ? (
            <>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider">Job Description</label>
                  <button onClick={() => setJdText(sampleJD)} className="text-[10px] text-[#22C55E] hover:underline font-medium">Try a sample CRA role →</button>
                </div>
                <textarea
                  value={jdText}
                  onChange={e => setJdText(e.target.value)}
                  placeholder="Paste the full job description here — including required skills, qualifications, and therapeutic area focus…"
                  className={`${inputBase} min-h-[260px] font-mono text-xs leading-relaxed`}
                />
                <div className="flex items-center justify-between mt-2 text-[10px] text-[#475569]">
                  <span>{jdText.length} characters</span>
                  <span>{jdText.length < 30 ? 'Need at least 30 characters' : 'Ready to analyze'}</span>
                </div>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={jdText.trim().length < 30}
                className="w-full py-3 rounded-2xl text-white font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1E3A8A, #22C55E)' }}
              >
                <span className="inline-flex items-center gap-2"><Wand2 className="w-4 h-4" />Analyze Match</span>
              </button>
            </>
          ) : (
            <>
              {/* Score */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1E3A8A]/20 to-[#22C55E]/10 border border-[#22C55E]/25 p-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <motion.circle cx="50" cy="50" r="42" fill="none" stroke="#22C55E" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 42}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - analysis.score / 100) }}
                        transition={{ duration: 1.2, ease: 'easeOut' }} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-white font-bold text-2xl leading-none">{analysis.score}<span className="text-sm text-[#94A3B8]">%</span></span>
                      <span className="text-[9px] text-[#22C55E] mt-1 uppercase tracking-wider">Match</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-lg">
                      {analysis.score >= 80 ? 'Excellent fit'
                        : analysis.score >= 60 ? 'Strong candidate'
                        : analysis.score >= 40 ? 'Moderate match — improvements needed'
                        : 'Significant gap — tailor your CV'}
                    </div>
                    <div className="text-[#94A3B8] text-sm mt-1">
                      {analysis.matched.length} of {analysis.found.length} required keywords already in your CV
                    </div>
                    <div className="flex gap-2 mt-3">
                      <div className="px-3 py-1.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 text-[#22C55E] text-[10px] font-semibold">
                        ✓ {analysis.matched.length} matched
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/25 text-[#F59E0B] text-[10px] font-semibold">
                        ⚠ {analysis.missing.length} missing
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing keywords */}
              {analysis.missing.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[#E2E8F0] text-sm font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-[#F59E0B]" />
                      Missing Keywords — One-click add to Skills
                    </div>
                    <button
                      onClick={() => analysis.missing.forEach(s => onAddSkill(s))}
                      className="text-[10px] font-semibold text-[#22C55E] hover:underline">Add all →</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missing.map(s => (
                      <button key={s} onClick={() => onAddSkill(s)}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F59E0B]/8 border border-[#F59E0B]/25 text-[#F59E0B] hover:bg-[#22C55E]/10 hover:border-[#22C55E]/40 hover:text-[#22C55E] transition-all">
                        <Plus className="w-3 h-3" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched keywords */}
              {analysis.matched.length > 0 && (
                <div>
                  <div className="text-[#E2E8F0] text-sm font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    Already Matched
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matched.map(s => (
                      <span key={s}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#22C55E]/10 border border-[#22C55E]/25 text-[#22C55E]">
                        <CheckCircle2 className="w-3 h-3" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => { setAnalyzed(false); setJdText(''); }}
                className="w-full py-3 rounded-2xl text-[#94A3B8] font-medium border border-white/10 hover:bg-white/[0.04] hover:text-white transition-all">
                Analyze another role
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   NEW · Shortcuts Modal
══════════════════════════════════════════════ */
function ShortcutsModal({ onClose }: { onClose: () => void }) {
  const shortcuts = [
    { keys: ['⌘', 'K'], label: 'Open JD Matcher' },
    { keys: ['⌘', 'S'], label: 'Save CV' },
    { keys: ['⌘', 'P'], label: 'Toggle preview' },
    { keys: ['⌘', '/'], label: 'Show shortcuts' },
    { keys: ['Esc'],     label: 'Close any panel' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-[#0B1220] border border-white/10 shadow-2xl shadow-black/60 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.07]">
          <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
            <Command className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-base leading-none">Keyboard Shortcuts</div>
            <div className="text-[#64748B] text-xs mt-1">Move faster through your CV build</div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-[#64748B] hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] transition-colors">
              <span className="text-[#CBD5E1] text-sm">{s.label}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((k, j) => (
                  <kbd key={j} className="text-xs font-mono bg-white/[0.06] border border-white/10 text-white px-2 py-1 rounded-lg min-w-[28px] text-center">{k}</kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════
   NEW · Cover Letter Section Component
══════════════════════════════════════════════ */
function CoverLetterSection({
  coverLetter, onChange, onGenerate, isLoading, targetJD
}: {
  coverLetter: string; onChange: (val: string) => void;
  onGenerate: () => void; isLoading: boolean; targetJD: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-3">
        <h3 className="text-sm font-semibold text-white">Generate Tailored Clinical Cover Letter</h3>
        <p className="text-xs text-[#64748B]">
          AI will scan your clinical research experience and align it directly to the requirements of the job description you pasted in the JD Matcher.
        </p>
        
        {!targetJD.trim() && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Please open the **JD Matcher** in the top toolbar and paste a target Job Description first to ensure maximum AI tailoring.
            </p>
          </div>
        )}

        <button
          onClick={onGenerate}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-semibold bg-gradient-to-r from-[#1E3A8A] to-[#22C55E] hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          <Wand2 className="w-4 h-4" />
          {isLoading ? "Generating with AI..." : "Generate Cover Letter"}
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cover Letter Text</label>
          {coverLetter && (
            <button
              onClick={handleCopy}
              className="text-xs text-[#22C55E] hover:underline flex items-center gap-1"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          )}
        </div>
        <textarea
          rows={15}
          value={coverLetter}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your professional cover letter will appear here..."
          className="w-full rounded-2xl border border-white/[0.08] bg-[#070D1A] p-4 text-sm text-gray-300 placeholder-gray-600 focus:border-[#22C55E] focus:outline-none"
        />
      </div>
    </div>
  );
}
