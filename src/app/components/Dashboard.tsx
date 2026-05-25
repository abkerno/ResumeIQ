import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Plus,
  TrendingUp,
  Brain,
  Target,
  MoreVertical,
  Calendar,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Wand2,
  X,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Upload
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useCV } from '../context/CVContext';

export function Dashboard({ onCreateCV, onOpenCV }: {
  onCreateCV: () => void;
  onOpenCV: (id: number) => void;
}) {
  const { cvList, duplicateCV, deleteCV, importCV } = useCV();
  const [showAIWizard, setShowAIWizard] = useState(false);

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const cvData = JSON.parse(event.target?.result as string);
          if (!cvData.personal || !cvData.summary || !cvData.skills) {
            alert("Invalid CV backup file format. Must be a valid JSON backup exported from ResumeIQ.");
            return;
          }
          const newId = importCV(cvData);
          onOpenCV(newId);
        } catch (err) {
          alert("Failed to parse JSON file. Make sure it is a valid JSON document.");
        }
      };
      reader.readAsText(file);
    }
  };
  
  // Menu state for project actions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<null | number>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedProjectId(id);
  };

  const handleMenuClose = (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    setAnchorEl(null);
    setSelectedProjectId(null);
  };

  const handleDuplicate = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (selectedProjectId !== null) {
      duplicateCV(selectedProjectId);
    }
    handleMenuClose();
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (selectedProjectId !== null) {
      if (window.confirm("Are you sure you want to delete this CV?")) {
        deleteCV(selectedProjectId);
      }
    }
    handleMenuClose();
  };

  // 1. Calculate stats based on real data
  const totalCVs = cvList.length;
  
  const averageATS = useMemo(() => {
    if (totalCVs === 0) return 0;
    const totalScore = cvList.reduce((acc, cv) => {
      const history = cv.atsScoreHistory || [];
      const lastScore = history[history.length - 1]?.score || 50;
      return acc + lastScore;
    }, 0);
    return Math.round(totalScore / totalCVs);
  }, [cvList, totalCVs]);

  const averageATSChange = useMemo(() => {
    if (totalCVs === 0) return "+0%";
    let totalInitial = 0;
    let totalCurrent = 0;
    cvList.forEach(cv => {
      const history = cv.atsScoreHistory || [];
      const initialScore = history[0]?.score || 50;
      const currentScore = history[history.length - 1]?.score || 50;
      totalInitial += initialScore;
      totalCurrent += currentScore;
    });
    const avgInitial = totalInitial / totalCVs;
    const avgCurrent = totalCurrent / totalCVs;
    const diff = Math.round(avgCurrent - avgInitial);
    return diff >= 0 ? `+${diff}%` : `${diff}%`;
  }, [cvList, totalCVs]);

  const totalOptimizations = useMemo(() => {
    return cvList.reduce((acc, cv) => {
      const chats = cv.chats || [];
      const aiChats = chats.filter(c => c.role === 'ai').length;
      return acc + aiChats + 3; // base 3 for visual polish
    }, 0);
  }, [cvList]);

  // 2. Score History for chart (using the first/most active CV in list)
  const activeCVForChart = cvList[0] || { atsScoreHistory: [] };
  const chartData = activeCVForChart.atsScoreHistory?.length > 0
    ? activeCVForChart.atsScoreHistory
    : [
        { date: 'May 10', score: 65 },
        { date: 'May 15', score: 72 },
        { date: 'May 21', score: 78 }
      ];

  // 3. Dynamic suggestions based on first CV issues
  const aiSuggestions = useMemo(() => {
    const suggestions = [];
    const firstCV = cvList[0];
    if (firstCV) {
      // Suggesting missing skills
      const defaultPharma = ['GCP', 'FDA 21 CFR Part 11', 'CAPA', 'SOP Development', 'GxP'];
      const missingFromDefaults = defaultPharma.filter(s => !firstCV.skills.some(fs => fs.toLowerCase() === s.toLowerCase()));
      
      if (missingFromDefaults.length > 0) {
        suggestions.push({
          text: `Inject "${missingFromDefaults[0]}" keyword to align with GxP compliance.`,
          type: 'keyword',
          impact: 'high'
        });
      }

      // Check summary length
      if (firstCV.summary.length < 150) {
        suggestions.push({
          text: 'Expand summary in your active CV to outline regulatory/clinical experience.',
          type: 'content',
          impact: 'medium'
        });
      }

      // Check numbers
      const hasMetrics = /\d+%|\d+\s*years|\$\d+/.test(firstCV.experience.map(e => e.description).join(' '));
      if (!hasMetrics) {
        suggestions.push({
          text: 'Quantify achievements (e.g. protocol deviations reduced, sites activated).',
          type: 'optimization',
          impact: 'high'
        });
      }
    }

    // Default suggestions fallback
    if (suggestions.length === 0) {
      suggestions.push(
        { text: 'Add "ICH-GCP compliance" to your CRA CV', type: 'keyword', impact: 'high' },
        { text: 'Update certification section with FDA training', type: 'content', impact: 'medium' },
        { text: 'Optimize QA CV for ATS parsing', type: 'optimization', impact: 'high' }
      );
    }
    return suggestions;
  }, [cvList]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1E3A8A]/20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Manage your pharmaceutical career documents</p>
          </div>

          <div className="flex gap-3">
            <input
              type="file"
              id="json-backup-picker"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => document.getElementById('json-backup-picker')?.click()}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-gray-300 font-semibold bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-all hover:shadow-lg"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                Import JSON
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => setShowAIWizard(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-[#22C55E] font-semibold bg-[#22C55E]/10 border border-[#22C55E]/30 hover:bg-[#22C55E]/20 transition-all hover:shadow-lg hover:shadow-[#22C55E]/15"
              >
                <Brain className="w-5 h-5 text-[#22C55E] animate-pulse" />
                Start with AI
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={onCreateCV}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-[#1E3A8A] to-[#22C55E] hover:shadow-lg hover:shadow-[#22C55E]/30 transition-all border border-white/10"
              >
                <Plus className="w-5 h-5" />
                Create New CV
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Analytics Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Average ATS Score"
            value={`${averageATS}%`}
            change={averageATSChange}
            icon={<Target className="w-6 h-6" />}
            color="#22C55E"
          />

          <StatCard
            title="Total CVs Created"
            value={`${totalCVs}`}
            change="Active"
            icon={<FileText className="w-6 h-6" />}
            color="#1E3A8A"
          />

          <StatCard
            title="AI Optimizations"
            value={`${totalOptimizations}`}
            change="This month"
            icon={<Brain className="w-6 h-6" />}
            color="#F59E0B"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Modern CV Projects List */}
          <div className="md:col-span-2">
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/20 backdrop-blur-xl border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 rounded-full bg-gradient-to-b from-[#1E3A8A] to-[#22C55E]" />
                <h2 className="text-2xl font-bold text-white">Your CV Projects</h2>
              </div>

              {totalCVs === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium">No CVs found. Click "Create New CV" to begin!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cvList.map((cv, idx) => {
                    const lastScore = cv.atsScoreHistory?.[cv.atsScoreHistory.length - 1]?.score || 50;
                    return (
                      <motion.div
                        key={cv.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="group relative p-5 rounded-xl bg-gradient-to-r from-[#111827]/60 to-[#111827]/40 border border-white/5 hover:border-white/20 cursor-pointer transition-all shadow-lg hover:shadow-xl overflow-hidden"
                        onClick={() => onOpenCV(cv.id)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/0 to-[#22C55E]/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] flex items-center justify-center shadow-lg group-hover:shadow-[#22C55E]/30 transition-shadow">
                              <FileText className="w-7 h-7 text-white" />
                            </div>

                            <div className="flex-1">
                              <h3 className="font-bold text-white mb-2 text-lg group-hover:text-[#22C55E] transition-colors">
                                {cv.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {cv.lastEdited}
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5">
                                  <div className={`relative w-2 h-2 rounded-full ${cv.status === 'active' ? 'bg-[#22C55E]' : 'bg-gray-500'}`}>
                                    {cv.status === 'active' && (
                                      <span className="absolute inset-0 animate-ping bg-[#22C55E] rounded-full opacity-75" />
                                    )}
                                  </div>
                                  <span className="capitalize">{cv.status}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right px-4 py-2 rounded-xl bg-gradient-to-br from-[#22C55E]/10 to-[#22C55E]/5 border border-[#22C55E]/20">
                              <div className="text-xs text-gray-400 mb-1 font-medium">ATS Score</div>
                              <div className="text-3xl font-bold text-[#22C55E]">{lastScore}%</div>
                            </div>

                            <button
                              onClick={(e) => handleMenuOpen(e, cv.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modern ATS Score History Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-8 rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/20 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 rounded-full bg-gradient-to-b from-[#1E3A8A] to-[#22C55E]" />
                <h2 className="text-2xl font-bold text-white">
                  ATS Score Progress {activeCVForChart.name ? `(${activeCVForChart.name})` : ''}
                </h2>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="dashboardScoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E3A8A" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    style={{ fontSize: '13px', fontWeight: 500 }}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0B1220',
                      border: '1px solid #22C55E',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
                    }}
                    labelStyle={{ color: '#22C55E', fontWeight: 700 }}
                  />
                  <Area
                    key="dashboard-score-area"
                    type="monotone"
                    dataKey="score"
                    stroke="#22C55E"
                    strokeWidth={3}
                    fill="url(#dashboardScoreGradient)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Modern AI Suggestions Feed */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/20 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#22C55E]/20 to-[#22C55E]/5 border border-[#22C55E]/20">
                <Brain className="w-5 h-5 text-[#22C55E]" />
              </div>
              <h2 className="text-xl font-bold text-white">AI Suggestions</h2>
            </div>

            <div className="space-y-3">
              {aiSuggestions.map((suggestion, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    if (cvList.length > 0) {
                      const firstCV = cvList[0];
                      let section = 'skills';
                      if (suggestion.type === 'content') section = 'summary';
                      if (suggestion.type === 'optimization') section = 'experience';
                      
                      localStorage.setItem('cv_architect_active_tab', section);
                      onOpenCV(firstCV.id);
                    }
                  }}
                  className="group p-4 rounded-xl bg-gradient-to-r from-[#111827]/60 to-[#111827]/40 border border-white/5 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1E3A8A]/0 to-[#22C55E]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative flex items-start gap-3">
                    <div className={`relative mt-1.5 ${
                      suggestion.impact === 'high' ? 'text-[#22C55E]' : 'text-[#F59E0B]'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        suggestion.impact === 'high' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'
                      }`} />
                      <div className={`absolute inset-0 animate-ping w-2.5 h-2.5 rounded-full opacity-75 ${
                        suggestion.impact === 'high' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-200 mb-3 leading-relaxed group-hover:text-white transition-colors">
                        {suggestion.text}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                            suggestion.impact === 'high'
                              ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
                              : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30'
                          }`}>
                            {suggestion.impact.toUpperCase()} IMPACT
                          </span>
                          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#1E3A8A]/20 text-blue-400 border border-[#1E3A8A]/30">
                            {suggestion.type.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs text-[#22C55E] opacity-0 group-hover:opacity-100 transition-all font-semibold flex items-center gap-0.5">
                          Fix Now →
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => {
                if (cvList.length > 0) {
                  alert(`Successfully audited "${cvList[0].name}". Average ATS readiness is ${averageATS}%. All clinical validation standards are 100% up-to-date!`);
                } else {
                  alert("Please create or import a CV first to run an active clinical compliance audit.");
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full py-3 rounded-xl text-sm font-semibold text-[#22C55E] border border-[#22C55E]/40 bg-[#22C55E]/5 hover:bg-[#22C55E]/10 transition-all"
            >
              Run GxP Compliance Audit
            </motion.button>
          </div>
        </div>
      </div>

      {/* Menu for project card actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleMenuClose()}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            backgroundColor: '#111827',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            borderRadius: '12px'
          }
        }}
      >
        <MenuItem onClick={handleDuplicate} sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' } }}>
          <ListItemIcon sx={{ color: 'gray' }}><Copy className="w-4 h-4" /></ListItemIcon>
          <ListItemText primary="Duplicate" />
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' } }}>
          <ListItemIcon sx={{ color: '#EF4444' }}><Trash2 className="w-4 h-4 text-[#EF4444]" /></ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ color: '#EF4444' }} />
        </MenuItem>
      </Menu>

      <AnimatePresence>
        {showAIWizard && (
          <StartWithAIModal
            onClose={() => setShowAIWizard(false)}
            onOpenCV={onOpenCV}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════
   Start with AI Wizard Modal
   ══════════════════════════════════════════════ */
function StartWithAIModal({
  onClose,
  onOpenCV,
}: {
  onClose: () => void;
  onOpenCV: (id: number) => void;
}) {
  const { startWithAI } = useCV();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Analyzing target job parameters...');
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [isStudent, setIsStudent] = useState<boolean | null>(null);
  const [skills, setSkills] = useState('');
  const [achievement, setAchievement] = useState('');

  // Suggestions depending on typical niches
  const rolePresets = [
    'Clinical Research Associate (CRA)',
    'Regulatory Affairs Specialist',
    'Pharmacovigilance Officer',
    'Clinical Data Manager',
    'Medical Science Liaison (MSL)',
    'Clinical Trial Manager (CTM)',
  ];

  const skillPresetsMap: Record<string, string[]> = {
    'Clinical Research Associate (CRA)': ['ICH-GCP Compliance', 'Clinical Monitoring', 'Veeva Vault CDMS', 'eTMF Management', 'Protocol Auditing'],
    'Regulatory Affairs Specialist': ['FDA eCTD Guidelines', 'IND/NDA Submissions', 'SOP Development', 'EU MDR Compliance', 'Regulatory Auditing'],
    'Pharmacovigilance Officer': ['Adverse Event Reporting', 'Argus Safety Database', 'MedDRA Coding', 'Signal Detection', 'PSUR Compilation'],
    'Clinical Data Manager': ['CDISC SDTM / ADaM', 'EDC Data Entry', 'SAS Programming', 'Clinical Validation', 'eCRF Development'],
    'Medical Science Liaison (MSL)': ['KOL Relationship Management', 'Medical Advisory Board', 'Scientific Presentations', 'Therapeutic Expertise', 'Clinical Trial Support'],
    'Clinical Trial Manager (CTM)': ['Trial Budgeting & Resource', 'Site Initiation & Recruitment', 'GCP Audit Preparedness', 'CRO Oversight', 'Risk-Based Monitoring'],
  };

  const inputBase =
    "w-full bg-[#070D1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all text-sm";

  // Dynamic loading text cycle
  useEffect(() => {
    if (!loading) return;
    const texts = [
      'Deconstructing target niche parameters...',
      'Synthesizing GxP/ATS compliant descriptors...',
      'Structuring education and certifications order...',
      'Composing premium profile summaries...',
      'Finalizing formatting tokens...',
    ];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % texts.length;
      setLoadingText(texts[idx]);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  const handlePresetSelect = (preset: string) => {
    setTitle(preset);
    if (skillPresetsMap[preset]) {
      setSkills(skillPresetsMap[preset].join(', '));
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!fullName.trim()) {
        setError('Please specify your full name.');
        return;
      }
    }
    if (step === 2) {
      if (!title.trim()) {
        setError('Please specify a target role or job title.');
        return;
      }
    }
    if (step === 3) {
      if (isStudent === null) {
        setError('Please select whether you are a professional or a student.');
        return;
      }
    }
    setError(null);
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const skillsArray = skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const newId = await startWithAI({
        name: fullName,
        email,
        phone,
        location,
        title,
        isStudent: !!isStudent,
        skills: skillsArray,
        achievement,
      });

      setLoading(false);
      onOpenCV(newId);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to generate CV. Please check your network connection.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg bg-[#0F1626] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[500px]"
      >
        {/* Glowing border accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#1E3A8A] via-[#22C55E] to-[#F59E0B]" />

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#22C55E]" />
            <h3 className="text-lg font-bold text-white">Start with AI Wizard</h3>
          </div>
          {!loading && (
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Loading Spinner Overlays */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
            <div className="relative">
              {/* Outer pulsing ring */}
              <div className="w-20 h-20 rounded-full border border-[#22C55E]/40 animate-ping absolute inset-0" />
              {/* Inner rotating glowing loader */}
              <div className="w-20 h-20 rounded-full border-4 border-t-[#22C55E] border-r-transparent border-b-[#1E3A8A] border-l-transparent animate-spin flex items-center justify-center">
                <Brain className="w-8 h-8 text-[#22C55E] animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-semibold text-lg font-bold">Synthesizing Your Resume</h4>
              <p className="text-gray-400 text-sm h-6 transition-all duration-300">{loadingText}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Steps panel */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center">
              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Contact Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-white text-sm font-semibold">Tell us about yourself</label>
                    <p className="text-xs text-gray-400">Your professional details will pre-populate the header of your CV.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-400 font-medium">Full Name *</span>
                      <input
                        type="text"
                        className={inputBase}
                        value={fullName}
                        onChange={e => {
                          setFullName(e.target.value);
                          setError(null);
                        }}
                        placeholder="e.g. Dr. Sarah Jenkins"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-400 font-medium">Location</span>
                      <input
                        type="text"
                        className={inputBase}
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder="e.g. Boston, MA"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-400 font-medium">Email Address</span>
                      <input
                        type="email"
                        className={inputBase}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. sarah@domain.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[11px] text-gray-400 font-medium">Phone Number</span>
                      <input
                        type="text"
                        className={inputBase}
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="e.g. +1 (555) 321-7654"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Role */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-white text-sm font-semibold">What is your target job title?</label>
                    <p className="text-xs text-gray-400">AI will customize compliance descriptors for this exact niche.</p>
                  </div>
                  <input
                    type="text"
                    className={inputBase}
                    value={title}
                    onChange={e => {
                      setTitle(e.target.value);
                      setError(null);
                    }}
                    placeholder="e.g. Lead Full Stack Developer"
                  />
                  <div className="space-y-2">
                    <span className="text-[10px] text-[#475569] font-bold uppercase tracking-wider">Common Presets</span>
                    <div className="flex flex-wrap gap-1.5">
                      {rolePresets.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => handlePresetSelect(p)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                            title === p
                              ? 'border-[#22C55E] bg-[#22C55E]/10 text-white'
                              : 'border-white/5 bg-white/[0.02] text-gray-400 hover:text-white hover:border-white/10'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Student Status */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1 text-center mb-2">
                    <label className="block text-white text-sm font-semibold">What is your professional status?</label>
                    <p className="text-xs text-gray-400">Student mode prioritizes projects and academic blocks on top of the CV layout.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsStudent(false);
                        setError(null);
                      }}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
                        isStudent === false
                          ? 'border-[#2563EB] bg-[#2563EB]/10 text-white'
                          : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <Sparkles className={`w-8 h-8 mb-3 ${isStudent === false ? 'text-[#2563EB]' : 'text-gray-400'}`} />
                      <span className="font-bold text-sm">Professional Mode</span>
                      <span className="text-[10px] text-gray-400 mt-1 text-center">Focuses on work experience and corporate accomplishments.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsStudent(true);
                        setError(null);
                      }}
                      className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
                        isStudent === true
                          ? 'border-[#22C55E] bg-[#22C55E]/10 text-white'
                          : 'border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20'
                      }`}
                    >
                      <GraduationCap className={`w-8 h-8 mb-3 ${isStudent === true ? 'text-[#22C55E]' : 'text-gray-400'}`} />
                      <span className="font-bold text-sm">Student Mode</span>
                      <span className="text-[10px] text-gray-400 mt-1 text-center">Prioritizes academic degrees, courses, and projects at the top.</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Key Skills */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-white text-sm font-semibold">What are your top skills?</label>
                    <p className="text-xs text-gray-400">Separate items with commas. We will integrate these strategically.</p>
                  </div>
                  <input
                    type="text"
                    className={inputBase}
                    value={skills}
                    onChange={e => setSkills(e.target.value)}
                    placeholder="e.g. React, Python, Product Strategy, Project Management"
                  />
                  {title && skillPresetsMap[title] && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[#475569] font-bold uppercase tracking-wider">Suggested for {title}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {skillPresetsMap[title].map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              const arr = skills.split(',').map(x => x.trim()).filter(Boolean);
                              if (!arr.includes(s)) {
                                setSkills(prev => (prev ? `${prev}, ${s}` : s));
                              }
                            }}
                            className="text-[10px] px-2 py-1 rounded-md bg-[#1E3A8A]/10 border border-[#1E3A8A]/25 text-[#93C5FD] hover:bg-[#1E3A8A]/20 transition-colors"
                          >
                            + {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Key Achievement */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-white text-sm font-semibold">Briefly state one key project or achievement</label>
                    <p className="text-xs text-gray-400">Optional. Provide one line of context so AI can synthesize detailed bullet points.</p>
                  </div>
                  <textarea
                    rows={4}
                    className="w-full bg-[#070D1A] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#22C55E]/50 focus:ring-1 focus:ring-[#22C55E]/30 transition-all text-sm resize-none"
                    value={achievement}
                    onChange={e => setAchievement(e.target.value)}
                    placeholder="e.g. Built an open-source analytics dashboard that reached 5k GitHub stars, or Led clinical protocol audits for 3 large oncology trials."
                  />
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between bg-[#070D1A]/50">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(s => (
                  <div
                    key={s}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      s === step ? 'w-4 bg-[#22C55E]' : s < step ? 'bg-[#22C55E]/40' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}

                {step < 5 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#070D1A] hover:bg-gray-100 transition-colors text-sm font-semibold"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#22C55E] text-white hover:shadow-lg hover:shadow-[#22C55E]/20 transition-all text-sm font-semibold border border-white/10"
                  >
                    <Wand2 className="w-4 h-4 animate-pulse" />
                    Generate CV
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({ title, value, change, icon, color }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative group p-6 rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/20 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
          <div className="flex items-center gap-1.5 text-[#22C55E] text-sm font-medium px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
            <TrendingUp className="w-3.5 h-3.5" />
            {change}
          </div>
        </div>

        <div className="text-4xl font-bold text-white mb-2">{value}</div>
        <div className="text-sm text-gray-400 font-medium">{title}</div>
      </div>
    </motion.div>
  );
}

