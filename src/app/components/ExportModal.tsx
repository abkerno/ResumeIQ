import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Download, FileText, Sparkles, CheckCircle2, ShieldCheck,
  Image, ImageOff, FileCode2, Info, FileType2, Palette
} from 'lucide-react';
import { Switch, MenuItem, Select } from '@mui/material';
import { useCV, CVProject } from '../context/CVContext';
import { themes, ThemeId, AtsSafeContent, ResumeContent, translateArea } from './LivePreview';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { activeCV } = useCV();

  if (!activeCV) return null;

  // State for Designed layout
  const [designedTheme, setDesignedTheme] = useState<ThemeId>(
    (activeCV.activeTheme as ThemeId) || 'modern'
  );
  const [includePhotoDesigned, setIncludePhotoDesigned] = useState(true);

  // State for ATS-Safe layout
  const [includePhotoATS, setIncludePhotoATS] = useState(false);

  // State for Word layout
  const [wordLayout, setWordLayout] = useState<'designed' | 'ats'>('designed');
  const [includePhotoWord, setIncludePhotoWord] = useState(true);

  // State for printable element (dynamic switches when user clicks PDF download)
  const [printLayout, setPrintLayout] = useState<'designed' | 'ats'>('designed');

  // Triggering the print
  const handlePrintPDF = (layout: 'designed' | 'ats') => {
    // 1. Set printable layout state
    setPrintLayout(layout);

    // 2. Small timeout to allow state to propagate and DOM to render the printable-cv container
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Plain Text Export
  const handleExportText = () => {
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
  };

  // Word (.docx / .doc) Export
  const handleExportWord = () => {
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

    const hasPhoto = includePhotoWord && activeCV.personal.photo;

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
        .profile-photo { float: right; margin-left: 20px; border-radius: 50%; border: 1px solid #ccc; }
      </style>
      </head>
      <body>
        ${hasPhoto ? `<img src="${activeCV.personal.photo}" class="profile-photo" width="90" height="90" align="right" />` : ''}
        <h1>${activeCV.personal.name}</h1>
        <p><strong>${activeCV.personal.title}</strong></p>
        <p>${activeCV.personal.email} | ${activeCV.personal.phone} | ${activeCV.personal.location}</p>
        <div style="clear: both;"></div>
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
  };

  const currentThemeObj = themes[designedTheme];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Glassmorphism Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#070D1A]/85 backdrop-blur-md print:hidden"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', duration: 0.45 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]/98 shadow-2xl shadow-black/85 p-6 flex flex-col gap-6 max-h-[90vh] print:hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/35">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">Export Studio</h2>
                  <p className="text-xs text-[#64748B]">Choose your CV layout variations and format rules</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of variations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 overflow-y-auto pr-1">
              
              {/* Option 1: Premium Designed Template */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between gap-4 group hover:border-[#22C55E]/40 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Premium Designed PDF</h3>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/12 text-blue-400 border border-blue-500/20 uppercase tracking-wider font-semibold">Recommended for Humans</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Stunning, multi-colored premium design templates ideal for sending directly via Email, LinkedIn, or directly to hiring executives.
                  </p>

                  <div className="pt-2 space-y-3 border-t border-white/5">
                    {/* Theme selector */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B] font-medium flex items-center gap-1.5">Theme layout:</span>
                      <Select
                        size="small"
                        value={designedTheme}
                        onChange={(e) => setDesignedTheme(e.target.value as ThemeId)}
                        sx={{
                          color: '#D1D5DB',
                          fontSize: '11px',
                          height: '28px',
                          backgroundColor: '#111827/50',
                          borderRadius: '8px',
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.08)' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#22C55E' },
                        }}
                      >
                        <MenuItem value="modern">Modern Professional</MenuItem>
                        <MenuItem value="clinical">Clinical Research</MenuItem>
                        <MenuItem value="executive">Premium Executive</MenuItem>
                        <MenuItem value="neon">Neon Lab Dark</MenuItem>
                      </Select>
                    </div>

                    {/* Photo Toggle */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B] font-medium flex items-center gap-1.5">
                        {includePhotoDesigned ? <Image className="w-3.5 h-3.5 text-[#22C55E]" /> : <ImageOff className="w-3.5 h-3.5 text-gray-500" />}
                        Include Profile Photo
                      </span>
                      <Switch
                        size="small"
                        checked={includePhotoDesigned}
                        onChange={(e) => setIncludePhotoDesigned(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#22C55E' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22C55E' },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePrintPDF('designed')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-semibold bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] hover:opacity-90 active:scale-95 transition-all shadow-md shadow-[#1E3A8A]/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Designed PDF
                </button>
              </div>

              {/* Option 2: ATS-Safe Template */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between gap-4 group hover:border-[#22C55E]/40 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">ATS-Safe PDF</h3>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/25 uppercase tracking-wider font-semibold">Best for Portals</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Standard single-column layout using system fonts. Formatted specifically to yield a 100% parser compatibility score on ATS portals.
                  </p>

                  <div className="pt-2 space-y-3 border-t border-white/5">
                    {/* Photo Toggle */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B] font-medium flex items-center gap-1.5">
                        {includePhotoATS ? <Image className="w-3.5 h-3.5 text-[#22C55E]" /> : <ImageOff className="w-3.5 h-3.5 text-gray-500" />}
                        Include Profile Photo (ATS-Discouraged)
                      </span>
                      <Switch
                        size="small"
                        checked={includePhotoATS}
                        onChange={(e) => setIncludePhotoATS(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#22C55E' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22C55E' },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handlePrintPDF('ats')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-semibold border border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/10 active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download ATS-Safe PDF
                </button>
              </div>

              {/* Option 3: Microsoft Word (.docx) */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between gap-4 group hover:border-[#22C55E]/40 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                        <FileType2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Microsoft Word (.docx)</h3>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10 uppercase tracking-wider font-semibold">Editable</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Completely editable document format compatible with Microsoft Word. Ideal if you need to perform manual custom tweaks offline.
                  </p>

                  <div className="pt-2 space-y-3 border-t border-white/5">
                    {/* Photo Toggle */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#64748B] font-medium flex items-center gap-1.5">
                        {includePhotoWord ? <Image className="w-3.5 h-3.5 text-[#22C55E]" /> : <ImageOff className="w-3.5 h-3.5 text-gray-500" />}
                        Include Profile Photo
                      </span>
                      <Switch
                        size="small"
                        checked={includePhotoWord}
                        onChange={(e) => setIncludePhotoWord(e.target.checked)}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#22C55E' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#22C55E' },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleExportWord}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-semibold bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Editable DOCX
                </button>
              </div>

              {/* Option 4: Plain Text & Pharma JSON */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between gap-4 group hover:border-[#22C55E]/40 transition-all duration-300">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]">
                        <FileCode2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Plain Text / JSON</h3>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/25 uppercase tracking-wider font-semibold">Raw Assets</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Export raw text strings to copy-paste or the complete ResumeIQ JSON project backup file, compatible with Veeva Vault specifications.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleExportText}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-semibold bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] active:scale-95 transition-all"
                  >
                    Raw TXT
                  </button>
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeCV, null, 2));
                      const downloadAnchor = document.createElement('a');
                      downloadAnchor.setAttribute("href", dataStr);
                      downloadAnchor.setAttribute("download", `${activeCV?.personal?.name?.replace(/\s+/g, '_') || 'CV'}_backup.json`);
                      document.body.appendChild(downloadAnchor);
                      downloadAnchor.click();
                      downloadAnchor.remove();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-xs font-semibold bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] active:scale-95 transition-all"
                  >
                    Veeva JSON
                  </button>
                </div>
              </div>

            </div>

            {/* Hint alert */}
            <div className="p-3.5 rounded-2xl border border-[#22C55E]/15 bg-[#22C55E]/5 text-[#22C55E] text-xs flex items-start gap-2.5 mt-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="leading-normal">
                <strong>Recruiter Insight:</strong> It is standard clinical industry compliance to export the <strong>ATS-Safe PDF (No Photo)</strong> when applying online to parsing portals, and the <strong>Premium Designed PDF (With Photo)</strong> when emailing recruiters directly.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Dynamic Printable Elements Rendered In DOM ── */}
      {isOpen && (
        <div className="hidden print:block printable-cv" style={{ background: printLayout === 'ats' ? '#ffffff' : currentThemeObj.bg, color: printLayout === 'ats' ? '#000000' : currentThemeObj.ink, fontFamily: printLayout === 'ats' ? 'Arial, sans-serif' : currentThemeObj.font }}>
          {printLayout === 'ats' ? (
            <AtsSafeContent data={activeCV} includePhoto={includePhotoATS} />
          ) : (
            <ResumeContent
              theme={currentThemeObj}
              data={activeCV}
              device="desktop"
              includePhoto={includePhotoDesigned}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
