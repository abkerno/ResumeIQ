import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  FileText,
  Zap,
  Trash2
} from 'lucide-react';
import { Button, TextField, Switch, FormControlLabel } from '@mui/material';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { useCV } from '../context/CVContext';

export function ATSSimulation({ onBack }: { onBack: () => void }) {
  const { activeCV, updateActiveCV, atsAnalysis, callAI } = useCV();
  const [jobDescription, setJobDescription] = useState(activeCV?.targetJD || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedCVText, setUploadedCVText] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setUploadedCVText(text || '');
      setToast({ message: `Successfully parsed CV file: ${file.name}`, type: 'success' });
      setTimeout(() => setToast(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleClearUpload = () => {
    setUploadedFile(null);
    setUploadedCVText(null);
  };
  
  // Real AI parsed results
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{
    score: number;
    matchedKeywords: string[];
    missingKeywords: string[];
    gxpCompliance: { gcp: boolean; fda: boolean; gmp: boolean; capa: boolean; sop: boolean };
    recommendations: { text: string; impact: 'high' | 'medium' | 'low'; potentialIncrease: string }[];
  } | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState('Run ATS Analysis');

  // Sync JD when activeCV changes
  useEffect(() => {
    if (activeCV) {
      setJobDescription(activeCV.targetJD || '');
    }
  }, [activeCV]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setToast({ message: "Please paste a job description first.", type: 'info' });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setAnalyzing(true);
    setAnalysisStatus("Initializing ATS Scanner...");

    const statuses = [
      "Extracting GxP keywords...",
      "Analyzing compliance formatting...",
      "Measuring semantic density...",
      "Generating recommendations..."
    ];
    let statusIdx = 0;
    const statusInterval = setInterval(() => {
      if (statusIdx < statuses.length) {
        setAnalysisStatus(statuses[statusIdx]);
        statusIdx++;
      }
    }, 900);

    try {
      const cvTextStr = uploadedCVText ? uploadedCVText : `
        Name: ${activeCV?.personal?.name}
        Title: ${activeCV?.personal?.title}
        Summary: ${activeCV?.summary}
        Skills: ${activeCV?.skills?.join(', ')}
        Experience: ${activeCV?.experience?.map(e => `${e.role} at ${e.company}: ${e.description}`).join(' | ')}
        Certifications: ${activeCV?.certifications?.map(c => c.name).join(', ')}
      `;

      const prompt = [
        {
          role: 'system',
          content: `You are an expert ATS (Applicant Tracking System) Parser and Pharmaceutical/Clinical Operations CV Evaluator.
Analyze the provided CV text against the pasted Job Description. Perform keyword extraction, GxP validation, and structural readiness scores.
You MUST output ONLY a valid JSON object matching the following structure:
{
  "score": 88,
  "matchedKeywords": ["GCP", "Veeva Vault", "Phase III oncology"],
  "missingKeywords": ["CDISC SDTM", "Risk-Based Monitoring"],
  "gxpCompliance": {
    "gcp": true,
    "fda": true,
    "gmp": false,
    "capa": false,
    "sop": true
  },
  "recommendations": [
    {
      "text": "Add 'Risk-Based Monitoring' and 'CDISC SDTM' to the skills section as they are required by the JD.",
      "impact": "high",
      "potentialIncrease": "+12%"
    },
    {
      "text": "Flesh out Phase I-III metrics under your Pfizer experience role.",
      "impact": "medium",
      "potentialIncrease": "+8%"
    }
  ]
}
Do not output any introductory thoughts, markdown blocks (like \`\`\`json), or postscript notes. Your output must be purely parseable JSON.`
        },
        {
          role: 'user',
          content: `CV TEXT:
${cvTextStr}

JOB DESCRIPTION:
${jobDescription}`
        }
      ];

      const response = await callAI(prompt);
      let cleanText = response.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/g, '');
      }
      
      const parsed = JSON.parse(cleanText);
      clearInterval(statusInterval);
      setAnalysisStatus("Analysis Complete!");
      setAiAnalysisResult(parsed);
      setAnalyzed(true);

      // Save JD and score to activeCV to update global state
      updateActiveCV(prev => {
        const history = [...(prev.atsScoreHistory || [])];
        const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        if (history.length > 0 && history[history.length - 1].date === dateStr) {
          history[history.length - 1].score = parsed.score;
        } else {
          history.push({ date: dateStr, score: parsed.score });
        }
        return {
          ...prev,
          targetJD: jobDescription,
          atsScoreHistory: history.slice(-6)
        };
      });
    } catch (err) {
      console.error("AI ATS analysis failed, falling back to local simulation:", err);
      clearInterval(statusInterval);
      setAnalysisStatus("Running Local Diagnostics...");
      setTimeout(() => {
        setAiAnalysisResult(null); // Fallback to local scanner
        setAnalyzed(true);
        updateActiveCV(prev => ({
          ...prev,
          targetJD: jobDescription
        }));
      }, 800);
    } finally {
      setAnalyzing(false);
      setTimeout(() => setAnalysisStatus("Run ATS Analysis"), 2000);
    }
  };

  const atsScore = aiAnalysisResult ? aiAnalysisResult.score : (atsAnalysis?.score || 0);
  const skillMatchData = atsAnalysis?.skillMatch || [];

  // 1. Calculate Keyword Match Percentage
  const matchedCount = aiAnalysisResult ? aiAnalysisResult.matchedKeywords.length : (atsAnalysis?.jdMatch?.matches?.length || 0);
  const missingCount = aiAnalysisResult ? aiAnalysisResult.missingKeywords.length : (atsAnalysis?.jdMatch?.missing?.length || 0);
  const totalKeywords = matchedCount + missingCount;
  const keywordPct = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 80;

  // 2. Calculate Format Compatibility
  const nonJDRules = (atsAnalysis?.rules || []).filter(r => r.name !== 'JD Match Alignment');
  const passedNonJD = nonJDRules.filter(r => r.passed).length;
  const formatPct = nonJDRules.length > 0 ? Math.round((passedNonJD / nonJDRules.length) * 100) : 85;

  // 3. Calculate Section Structure Completion
  const sectionsCount = 8;
  const completedSections = activeCV ? [
    !!(activeCV.personal?.name && activeCV.personal?.email),
    (activeCV.summary || '').split(' ').length >= 30,
    (activeCV.experience || []).length > 0,
    (activeCV.education || []).length > 0,
    (activeCV.skills || []).length >= 6,
    (activeCV.certifications || []).length > 0,
    (activeCV.therapeuticAreas || []).some(a => a.selected),
    (activeCV.references || []).length > 0
  ].filter(Boolean).length : 0;
  const structurePct = Math.round((completedSections / sectionsCount) * 100);

  // 4. Calculate GxP Compliance
  const cvContentText = JSON.stringify(activeCV || {}).toLowerCase();
  const gxpKeywords = ['gcp', 'fda', 'gmp', 'capa', 'sop'];
  
  const presentGxp = {
    gcp: aiAnalysisResult ? aiAnalysisResult.gxpCompliance.gcp : cvContentText.includes('gcp'),
    fda: aiAnalysisResult ? aiAnalysisResult.gxpCompliance.fda : cvContentText.includes('fda'),
    gmp: aiAnalysisResult ? aiAnalysisResult.gxpCompliance.gmp : cvContentText.includes('gmp'),
    capa: aiAnalysisResult ? aiAnalysisResult.gxpCompliance.capa : cvContentText.includes('capa'),
    sop: aiAnalysisResult ? aiAnalysisResult.gxpCompliance.sop : cvContentText.includes('sop')
  };
  const gxpPct = Math.round(
    (Object.values(presentGxp).filter(Boolean).length / gxpKeywords.length) * 100
  );

  // Dynamic Keyword density data from AI
  const keywordData = useMemo(() => {
    if (aiAnalysisResult) {
      const list = [
        ...aiAnalysisResult.matchedKeywords.map(kw => ({ keyword: kw, count: 2, required: 2 })),
        ...aiAnalysisResult.missingKeywords.slice(0, 4).map(kw => ({ keyword: kw, count: 0, required: 2 }))
      ];
      return list.slice(0, 8);
    }
    return atsAnalysis?.keywordDensity || [];
  }, [aiAnalysisResult, atsAnalysis]);

  // 5. Generate Dynamic Recommendations List
  const suggestions = useMemo(() => {
    if (aiAnalysisResult) {
      return aiAnalysisResult.recommendations;
    }
    const list: { text: string; impact: 'high' | 'medium' | 'low'; potentialIncrease: string }[] = [];
    if (!activeCV) return list;

    // Suggest missing keywords from the JD matcher
    if (atsAnalysis?.jdMatch?.missing?.length > 0) {
      list.push({
        text: `Incorporate missing JD keywords: ${atsAnalysis.jdMatch.missing.slice(0, 3).join(', ')}`,
        impact: 'high',
        potentialIncrease: '+15%'
      });
    }

    // Check contact integrity
    if (!(activeCV.personal?.email && activeCV.personal?.phone)) {
      list.push({
        text: 'Ensure contact email and phone number are fully completed in Personal section',
        impact: 'high',
        potentialIncrease: '+10%'
      });
    }

    // Check quantitative metrics
    const expText = (activeCV.experience || []).map(e => e.description).join(' ');
    const hasMetrics = /\d+%|\d+\s*years|\$\d+|\d+\s*sites|\d+\s*protocols/.test(expText);
    if (!hasMetrics) {
      list.push({
        text: 'Add quantitative trial metrics (e.g. deviation rates, site counts) to experience bullets',
        impact: 'high',
        potentialIncrease: '+12%'
      });
    }

    // Check skills count
    if ((activeCV.skills || []).length < 8) {
      list.push({
        text: 'Inject at least 8 clinical, QA, or regulatory skills to optimize skill density requirements',
        impact: 'medium',
        potentialIncrease: '+8%'
      });
    }

    // Check GxP keywords
    if (gxpPct < 100) {
      const missingGxp = gxpKeywords.filter(k => !presentGxp[k as keyof typeof presentGxp]).map(k => k.toUpperCase());
      if (missingGxp.length > 0) {
        list.push({
          text: `Add core GxP/compliance keywords: ${missingGxp.join(', ')}`,
          impact: 'medium',
          potentialIncrease: '+10%'
        });
      }
    }

    if (list.length === 0) {
      list.push({
        text: 'No critical items found! Your CV is exceptionally optimized for Applicant Tracking Systems.',
        impact: 'low',
        potentialIncrease: '0%'
      });
    }

    return list;
  }, [activeCV, atsAnalysis, gxpPct, aiAnalysisResult, presentGxp]);

  // 6. Auto-Apply compliance details to CV
  const handleAutoApply = () => {
    if (!activeCV) return;
    let appliedSkills: string[] = [];
    let updated = false;

    updateActiveCV(prev => {
      const currentSkills = [...(prev.skills || [])];
      
      // Auto-inject missing keywords
      const missing = aiAnalysisResult ? aiAnalysisResult.missingKeywords : (atsAnalysis?.jdMatch?.missing || []);
      missing.slice(0, 3).forEach(kw => {
        if (!currentSkills.some(s => s.toLowerCase() === kw.toLowerCase())) {
          currentSkills.push(kw);
          appliedSkills.push(kw);
          updated = true;
        }
      });

      // Also make sure missing GxP keywords are included
      gxpKeywords.forEach(k => {
        const hasK = presentGxp[k as keyof typeof presentGxp];
        if (!hasK) {
          const kwUpper = k.toUpperCase();
          if (!currentSkills.some(s => s.toLowerCase() === k)) {
            currentSkills.push(kwUpper);
            appliedSkills.push(kwUpper);
            updated = true;
          }
        }
      });

      if (updated) {
        return {
          ...prev,
          skills: currentSkills
        };
      }
      return prev;
    });

    if (updated) {
      setToast({
        message: `Auto-applied compliance optimizations! Added skills: ${appliedSkills.join(', ')} to your CV.`,
        type: 'success'
      });
      setTimeout(() => setToast(null), 4000);
    } else {
      setToast({
        message: "All critical skills are already present in your CV.",
        type: 'info'
      });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#111827] to-[#1E3A8A]/20">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl border backdrop-blur-xl shadow-2xl flex items-center gap-2.5 ${
              toast.type === 'success'
                ? 'border-[#22C55E]/30 bg-[#22C55E]/10 text-white'
                : 'border-white/10 bg-[#111827]/90 text-gray-300'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            ) : (
              <AlertCircle className="w-4 h-4 text-[#2563EB]" />
            )}
            <span className="text-xs font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBack}
            sx={{ color: '#9CA3AF', mb: 2, textTransform: 'none' }}
          >
            ← Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-white mb-2">ATS X-Ray Engine</h1>
          <p className="text-gray-400">Analyze your CV compatibility with Applicant Tracking Systems</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Job Description Input */}
          <div className="md:col-span-1">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827]/80 to-[#1E3A8A]/10 backdrop-blur-xl border border-white/10">
              {/* Drag and Drop Dropzone */}
              <div className="mb-6">
                <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  Upload Custom CV (Optional)
                </label>
                {!uploadedFile ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all ${
                      dragActive
                        ? 'border-[#22C55E] bg-[#22C55E]/5'
                        : 'border-white/10 bg-[#070D1A]/40 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="file"
                      id="ats-file-upload"
                      className="hidden"
                      accept=".txt,.pdf,.docx"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="ats-file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center text-[#22C55E]">
                        <Zap className="w-5 h-5 animate-pulse" />
                      </div>
                      <span className="text-white text-xs font-semibold">Drag & drop your CV file here</span>
                      <span className="text-gray-500 text-[10px]">Supports .pdf, .docx, .txt (AI-Only Scan)</span>
                      <span className="mt-1 text-xs px-2.5 py-1 rounded bg-[#2563EB]/15 text-[#93C5FD] border border-[#2563EB]/25 hover:bg-[#2563EB]/25 transition-colors font-medium">Browse Files</span>
                    </label>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 flex items-center justify-center text-[#22C55E]">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white text-xs font-semibold truncate leading-none mb-1">{uploadedFile.name}</div>
                        <div className="text-gray-500 text-[9px]">{(uploadedFile.size / 1024).toFixed(1)} KB · AI Scan active</div>
                      </div>
                    </div>
                    <button
                      onClick={handleClearUpload}
                      className="p-1 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#22C55E]" />
                Job Description
              </h2>

              <TextField
                multiline
                rows={12}
                fullWidth
                placeholder="Paste the job description here to analyze match rate..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#D1D5DB',
                    backgroundColor: '#111827/50',
                    '& fieldset': {
                      borderColor: '#374151',
                    },
                    '&:hover fieldset': {
                      borderColor: '#22C55E',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#22C55E',
                    },
                  },
                }}
              />

              <div className="mt-4 space-y-3">
                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#22C55E',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#22C55E',
                        },
                      }}
                    />
                  }
                  label="Pharma-specific analysis"
                  sx={{ color: '#D1D5DB' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      defaultChecked
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: '#22C55E',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: '#22C55E',
                        },
                      }}
                    />
                  }
                  label="GxP compliance check"
                  sx={{ color: '#D1D5DB' }}
                />
              </div>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleAnalyze}
                disabled={analyzing}
                sx={{
                  mt: 4,
                  background: 'linear-gradient(135deg, #1E3A8A 0%, #22C55E 100%)',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1E3A8A 0%, #16A34A 100%)',
                  }
                }}
              >
                {analyzing ? analysisStatus : 'Run ATS Analysis'}
              </Button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="md:col-span-2 space-y-6">
            {/* ATS Score Gauge */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827]/80 to-[#1E3A8A]/10 backdrop-blur-xl border border-white/10 relative overflow-hidden">
              {analyzing && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[#22C55E]/20 to-transparent"
                  animate={{ x: [-1000, 1000] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#22C55E]" />
                  ATS Compatibility Score
                </h2>

                {analyzed && (
                  <div className="flex items-center gap-2 text-[#22C55E]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm">Analysis Complete</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <defs>
                        <linearGradient id="atsScoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#1E3A8A" />
                          <stop offset="100%" stopColor="#22C55E" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#1E3A8A"
                        strokeWidth="12"
                        fill="none"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#atsScoreGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: '0 553' }}
                        animate={{ strokeDasharray: `${(atsScore / 100) * 553} 553` }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-white">{atsScore}</div>
                      <div className="text-sm text-gray-400">out of 100</div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-[#22C55E]">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-semibold">{atsScore >= 75 ? 'Optimized' : 'Needs Optimization'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <ScoreMetric
                    label="Keyword Match"
                    value={`${matchedCount}/${totalKeywords || 10}`}
                    percentage={keywordPct}
                    status={keywordPct >= 85 ? 'excellent' : keywordPct >= 65 ? 'good' : 'warning'}
                  />
                  <ScoreMetric
                    label="Format Compatibility"
                    value={`${formatPct}%`}
                    percentage={formatPct}
                    status={formatPct >= 85 ? 'excellent' : formatPct >= 65 ? 'good' : 'warning'}
                  />
                  <ScoreMetric
                    label="Section Structure"
                    value={`${completedSections}/${sectionsCount}`}
                    percentage={structurePct}
                    status={structurePct >= 85 ? 'excellent' : structurePct >= 65 ? 'good' : 'warning'}
                  />
                  <ScoreMetric
                    label="GxP Compliance"
                    value={`${gxpPct}%`}
                    percentage={gxpPct}
                    status={gxpPct >= 80 ? 'excellent' : gxpPct >= 50 ? 'good' : 'warning'}
                  />
                </div>
              </div>
            </div>

            {/* Keyword Heatmap */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827]/80 to-[#1E3A8A]/10 backdrop-blur-xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Keyword Density Analysis</h2>

              {keywordData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250} key="keyword-chart">
                  <BarChart data={keywordData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E3A8A" opacity={0.2} />
                    <XAxis
                      dataKey="keyword"
                      stroke="#9CA3AF"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #22C55E',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar key="bar-required" dataKey="required" fill="#1E3A8A" name="Required" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    <Bar key="bar-count" dataKey="count" fill="#22C55E" name="Found" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-10 text-gray-500 text-sm">
                  Paste a Job Description and click run analysis to visualize keyword density.
                </div>
              )}
            </div>

            {/* Keyword Parser Insights */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827]/80 to-[#1E3A8A]/10 backdrop-blur-xl border border-white/10 shadow-xl shadow-black/20">
              <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                Keyword Parser Insights
              </h2>
              <div className="space-y-5">
                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Matched Job Keywords ({matchedCount})</h3>
                  <div className="flex flex-wrap gap-2">
                    {(atsAnalysis?.jdMatch?.matches || []).length > 0 ? (
                      (atsAnalysis?.jdMatch?.matches || []).map((m: string) => (
                        <span key={m} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] shadow-sm shadow-[#22C55E]/5 transition-all hover:scale-[1.03]">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">No matched job description keywords detected yet.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Missing Job Keywords ({missingCount})</h3>
                  <div className="flex flex-wrap gap-2">
                    {(atsAnalysis?.jdMatch?.missing || []).length > 0 ? (
                      (atsAnalysis?.jdMatch?.missing || []).map((m: string) => (
                        <span key={m} className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-400 shadow-sm shadow-red-500/5 transition-all hover:scale-[1.03]">
                          {m}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500 italic">No missing keywords! Your CV matches perfectly.</span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">GxP Compliance Keywords Checked</h3>
                  <div className="flex flex-wrap gap-2">
                    {gxpKeywords.map((k: string) => {
                      const present = cvContentText.includes(k);
                      return (
                        <span
                          key={k}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border shadow-sm transition-all hover:scale-[1.03] ${
                            present
                              ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {k.toUpperCase()} {present ? '✓' : '✗'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Match Radar */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827]/80 to-[#1E3A8A]/10 backdrop-blur-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6">Skill Match Radar</h2>

                {skillMatchData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250} key="skill-radar">
                    <RadarChart data={skillMatchData}>
                      <PolarGrid stroke="#1E3A8A" />
                      <PolarAngleAxis
                        dataKey="skill"
                        stroke="#9CA3AF"
                        style={{ fontSize: '11px' }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        stroke="#9CA3AF"
                      />
                      <Radar
                        key="radar-score"
                        name="Match Score"
                        dataKey="score"
                        stroke="#22C55E"
                        fill="#22C55E"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        isAnimationActive={false}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    No skills listed. Please add skills in the CV Builder.
                  </div>
                )}
              </div>

              {/* Improvement Suggestions */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#111827]/80 to-[#1E3A8A]/10 backdrop-blur-xl border border-white/10">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#22C55E]" />
                  AI Recommendations
                </h2>

                <div className="space-y-3">
                  {suggestions.map((s, idx) => (
                    <Suggestion
                      key={idx}
                      text={s.text}
                      impact={s.impact}
                      potentialIncrease={s.potentialIncrease}
                    />
                  ))}
                </div>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleAutoApply}
                  startIcon={<Zap />}
                  sx={{
                    mt: 4,
                    borderColor: '#22C55E',
                    color: '#22C55E',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#16A34A',
                      backgroundColor: 'rgba(34, 197, 94, 0.08)',
                    }
                  }}
                >
                  Auto-Apply Suggestions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-[9999] max-w-md p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 ${
              toast.type === 'success'
                ? 'bg-[#1C3A27]/85 border-[#22C55E]/30 text-white'
                : 'bg-[#1E293B]/85 border-white/10 text-white'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${toast.type === 'success' ? 'bg-[#22C55E]/20 text-[#22C55E]' : 'bg-white/10 text-white'} shrink-0`}>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-0.5">
                {toast.type === 'success' ? 'Optimizations Applied' : 'ATS Scan Alert'}
              </div>
              <div className="text-sm font-medium leading-relaxed">{toast.message}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreMetric({ label, value, percentage, status }: {
  label: string;
  value: string;
  percentage: number;
  status: 'excellent' | 'good' | 'warning';
}) {
  const color = status === 'excellent' ? '#22C55E' : status === 'good' ? '#1D4ED8' : '#F59E0B';

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400 font-medium">{label}</span>
        <span className="font-semibold text-white">{value}</span>
      </div>
      <div className="h-2.5 bg-[#111827] rounded-full overflow-hidden border border-white/[0.04]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full transition-all"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}A0`,
          }}
        />
      </div>
    </div>
  );
}

function Suggestion({ text, impact, potentialIncrease }: {
  text: string;
  impact: 'high' | 'medium' | 'low';
  potentialIncrease: string;
}) {
  const impactColor = impact === 'high' ? '#22C55E' : impact === 'medium' ? '#F59E0B' : '#9CA3AF';

  return (
    <motion.div
      whileHover={{ scale: 1.015, x: 2 }}
      className="p-3.5 rounded-xl bg-[#111827]/40 border border-white/5 hover:border-white/10 transition-all duration-300 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" style={{ color: impactColor }} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-300 font-medium leading-relaxed">{text}</p>
          <div className="flex items-center gap-2 mt-2">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${impactColor}15`, color: impactColor, border: `1px solid ${impactColor}25` }}
            >
              {impact} impact
            </span>
            {potentialIncrease !== '0%' && (
              <span className="text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2 py-0.5 rounded-md border border-[#22C55E]/20">
                {potentialIncrease}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
