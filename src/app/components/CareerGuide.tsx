import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, Award, BookOpen, Compass, Target,
  ChevronRight, Clock, Lightbulb, Sparkles, Briefcase,
  Users, Check, ExternalLink, Linkedin, Laptop, Globe,
  Rocket, ArrowUpRight, Flame, HelpCircle
} from 'lucide-react';
import { Chip, LinearProgress } from '@mui/material';

type Tab = 'linkedin' | 'courses' | 'portfolio' | 'networking';

interface ResourceLink {
  name: string;
  url: string;
  description: string;
  badge?: string;
  isFree?: boolean;
}

interface ResourceCategory {
  title: string;
  icon: React.ReactNode;
  accent: string;
  links: ResourceLink[];
}

export function CareerGuide() {
  const [activeTab, setActiveTab] = useState<Tab>('linkedin');
  
  // Checklist states saved to localStorage
  const [linkedinChecklist, setLinkedinChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('student_linkedin_check');
    return saved ? JSON.parse(saved) : {
      photo: false,
      banner: false,
      headline: false,
      about: false,
      experience: false,
      skills: false,
      url: false,
    };
  });

  const [portfolioChecklist, setPortfolioChecklist] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('student_portfolio_check');
    return saved ? JSON.parse(saved) : {
      git: false,
      projects: false,
      readme: false,
      live: false,
      cv: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('student_linkedin_check', JSON.stringify(linkedinChecklist));
  }, [linkedinChecklist]);

  useEffect(() => {
    localStorage.setItem('student_portfolio_check', JSON.stringify(portfolioChecklist));
  }, [portfolioChecklist]);

  const toggleLinkedin = (key: string) => {
    setLinkedinChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePortfolio = (key: string) => {
    setPortfolioChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Progress computations
  const linkedinProgress = Math.round(
    (Object.values(linkedinChecklist).filter(Boolean).length / Object.keys(linkedinChecklist).length) * 100
  );

  const portfolioProgress = Math.round(
    (Object.values(portfolioChecklist).filter(Boolean).length / Object.keys(portfolioChecklist).length) * 100
  );

  // Tabs definitions
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'linkedin', label: 'LinkedIn Masterclass', icon: <Linkedin className="w-4 h-4 text-[#0A66C2]" /> },
    { id: 'courses', label: 'Course Directories', icon: <Laptop className="w-4 h-4 text-[#22C55E]" /> },
    { id: 'portfolio', label: 'Portfolio Guide', icon: <Globe className="w-4 h-4 text-purple-400" /> },
    { id: 'networking', label: 'Jobs & Internships', icon: <Rocket className="w-4 h-4 text-amber-400" /> },
  ];

  // Course sites data
  const courseCategories: ResourceCategory[] = [
    {
      title: 'Technical & Coding Skills',
      icon: <Laptop className="w-5 h-5 text-blue-400" />,
      accent: 'border-blue-500/25 bg-blue-500/5',
      links: [
        { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', description: '100% Free interactive certifications in Web Development, QA, Data Science, and Machine Learning.', badge: 'Highly Recommended', isFree: true },
        { name: 'Coursera', url: 'https://www.coursera.org', description: 'University-backed professional specializations from Google, IBM, Stanford. Audit courses for free.', badge: 'Certificates Available', isFree: false },
        { name: 'edX', url: 'https://www.edx.org', description: 'Elite higher-education courses from MIT, Harvard, and Berkeley. Perfect for advanced computer science.', isFree: false },
      ]
    },
    {
      title: 'Business, Design & Soft Skills',
      icon: <Award className="w-5 h-5 text-emerald-400" />,
      accent: 'border-emerald-500/25 bg-emerald-500/5',
      links: [
        { name: 'LinkedIn Learning', url: 'https://www.linkedin.com/learning', description: 'Industry-standard courses for professional software (Excel, Figma, Jira) and critical workplace communications.', badge: 'Integrates with Profile', isFree: false },
        { name: 'Google Career Certificates', url: 'https://grow.google/certificates', description: 'Highly-rated programs in Project Management, UX Design, Data Analytics, and cybersecurity.', badge: 'Job Network Access', isFree: false },
        { name: 'Udemy', url: 'https://www.udemy.com', description: 'Affordable, task-oriented deep-dives on specific frameworks (Next.js, Python scripting, AWS setup).', isFree: false },
      ]
    },
    {
      title: 'Academic & Open Education',
      icon: <BookOpen className="w-5 h-5 text-purple-400" />,
      accent: 'border-purple-500/25 bg-purple-500/5',
      links: [
        { name: 'Harvard CS50', url: 'https://pll.harvard.edu/course/cs50-introduction-computer-science', description: 'The absolute gold-standard introduction to computer science and programming. Highly engaging.', badge: 'Free Lectures', isFree: true },
        { name: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu', description: 'Direct access to syllabi, lecture slides, and exams for nearly all of MIT\'s engineering catalog.', isFree: true },
        { name: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', description: 'Sleek, direct interactive tutorials covering Python, SQL, and introductory Deep Learning networks.', isFree: true },
      ]
    }
  ];

  // Opportunities data
  const internshipCategories: ResourceCategory[] = [
    {
      title: 'Student Internships Directories',
      icon: <Briefcase className="w-5 h-5 text-amber-400" />,
      accent: 'border-amber-500/25 bg-amber-500/5',
      links: [
        { name: 'Handshake', url: 'https://joinhandshake.com', description: 'The premier recruitment network for university students. Directly matches you with verified recruiters targeting your major.', badge: 'College Standard', isFree: true },
        { name: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs', description: 'Filter specifically for "Internships" and "Entry-Level" roles. Set up daily alerts for fresh postings.', isFree: true },
        { name: 'WayUp', url: 'https://www.wayup.com', description: 'Dedicated portal matching early-career candidates with Fortune 500 internships and clinical traineeships.', isFree: true },
      ]
    },
    {
      title: 'Open Source & Collaborative Programs',
      icon: <Users className="w-5 h-5 text-pink-400" />,
      accent: 'border-pink-500/25 bg-pink-500/5',
      links: [
        { name: 'Google Summer of Code', url: 'https://summerofcode.withgoogle.com', description: 'Highly prestigious global stipend program matching students with major open-source organizations.', badge: 'Elite CV Boost', isFree: true },
        { name: 'MLH Fellowships', url: 'https://fellowship.majorleaguehacking.com', description: '12-week educational internship program for software engineers and product designers.', isFree: true },
        { name: 'GitHub Student Pack', url: 'https://education.github.com/pack', description: 'Massive student benefits pack providing free domain names, hosting credits, and developer tools.', badge: 'Essential Pack', isFree: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1E3A8A]/10 text-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Header Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#1E3A8A]/40 to-[#22C55E]/10 border border-white/10 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
            <GraduationCap className="w-32 h-32 text-[#22C55E]" />
          </div>
          
          <div className="flex items-center gap-2 text-[#22C55E] text-xs font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Student Career Accelerator Studio</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Student Resource Hub</h1>
          <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
            Skip the legacy clutter. Here is your targeted master guide to landing top-tier internships and jobs. Master LinkedIn, build high-impact portfolios, gain credentials, and connect with global recruiters.
          </p>
        </motion.div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center gap-1 mb-8 border-b border-white/[0.08]">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold tracking-wide transition-all relative ${
                activeTab === t.id ? 'text-[#22C55E]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.icon}
              {t.label}
              {activeTab === t.id && (
                <motion.div 
                  layoutId="guide-tab-underline" 
                  className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-gradient-to-r from-[#1E3A8A] to-[#22C55E]" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Content Rendering */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            
            {/* 1. LINKEDIN MASTERCLASS */}
            {activeTab === 'linkedin' && (
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Left side: Checklist & Progress */}
                <div className="md:col-span-2 rounded-2xl bg-white/[0.02] border border-white/5 p-6 backdrop-blur-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                          <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                          Profile Optimization Checklist
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">Complete these tasks to reach "All-Star" ranking on LinkedIn.</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[#22C55E] text-lg font-extrabold">{linkedinProgress}%</span>
                        <div className="text-[10px] text-gray-500 font-semibold uppercase">Progress</div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <LinearProgress 
                        variant="determinate" 
                        value={linkedinProgress} 
                        sx={{
                          height: 6, 
                          borderRadius: 3, 
                          bgcolor: 'rgba(255,255,255,0.05)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(90deg, #1E3A8A, #22C55E)'
                          }
                        }} 
                      />
                    </div>

                    <div className="space-y-3.5">
                      {[
                        { key: 'photo', title: 'High-Impact Headshot', desc: 'Use a high-contrast professional profile photo with a clean background.' },
                        { key: 'banner', title: 'Clean Branded Banner', desc: 'Custom canvas background showing your university logos or tech stack/portfolio screenshot.' },
                        { key: 'headline', title: 'Calculated Headline Formula', desc: 'Formula: Major @ University | Core Skills (e.g. React/Next.js) | Active Project or Target Role.' },
                        { key: 'about', title: 'The 3-Paragraph Pitch (About)', desc: 'Para 1: Your focus and drive. Para 2: Top projects/achievements. Para 3: Call to action (relocation/roles).' },
                        { key: 'experience', title: 'Quantified Projects & Leadership', desc: 'Treat hackathons and school projects like actual jobs. Add quantitative metrics (e.g. 95% accuracy).' },
                        { key: 'skills', title: 'Target Skills Listing', desc: 'Insert at least 15 technical and soft skills to pass automatic recruiter searches.' },
                        { key: 'url', title: 'Custom Vanity URL', desc: 'Turn `/in/your-name-8a902b1` into a clean, clickable `/in/your-name` link.' },
                      ].map(item => (
                        <button
                          key={item.key}
                          onClick={() => toggleLinkedin(item.key)}
                          className="w-full flex items-start gap-3.5 p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left group"
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 mt-0.5 transition-all ${
                            linkedinChecklist[item.key] 
                              ? 'bg-[#22C55E] border-[#22C55E] text-white' 
                              : 'border-white/20 group-hover:border-white/40'
                          }`}>
                            {linkedinChecklist[item.key] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="text-white text-sm font-semibold group-hover:text-[#22C55E] transition-colors">{item.title}</div>
                            <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side: Strategy & Formulas */}
                <div className="space-y-6">
                  
                  {/* Headline formulas card */}
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl" />
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-400" />
                      Headline Formulas That Convert
                    </h3>
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Developer Track</div>
                        <p className="text-xs text-gray-200 font-mono italic leading-relaxed">
                          "Computer Science Major @ MIT | Full-Stack Dev (React/Go) | Winner, CS Hackathon 2026 | Seeking SWE Internships"
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1">Business/Marketing Track</div>
                        <p className="text-xs text-gray-200 font-mono italic leading-relaxed">
                          "Marketing Senior @ UT Austin | Digital Strategy Lead | Managed $15k Student Ad Budget | Seeking Performance Roles"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn Networking Rules */}
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Alumni Outreach Guide
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed mb-3">
                      Do not send generic connection requests. Pitch a 15-minute scientific/career learning question to alumni of your target firm.
                    </p>
                    <div className="p-3.5 rounded-xl bg-[#22C55E]/5 border border-[#22C55E]/10">
                      <div className="text-[10px] text-[#22C55E] font-bold uppercase tracking-wider mb-1">Gold Script template</div>
                      <p className="text-[11px] text-gray-300 italic leading-relaxed">
                        "Hi [Alum Name], I saw you graduated from [Uni] and now work at [Company]. I am studying [Major] and would love to ask you one quick question about [Specialization] over an informal 15-min zoom call!"
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. COURSE ACADEMIES */}
            {activeTab === 'courses' && (
              <div className="grid md:grid-cols-3 gap-6">
                {courseCategories.map((cat, idx) => (
                  <div key={idx} className={`rounded-2xl border ${cat.accent} p-5 backdrop-blur-xl flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {cat.icon}
                        <h3 className="text-sm font-extrabold tracking-wide text-white uppercase">{cat.title}</h3>
                      </div>
                      
                      <div className="space-y-4">
                        {cat.links.map((link, lIdx) => (
                          <div key={lIdx} className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="text-white text-sm font-bold">{link.name}</span>
                              <Chip 
                                label={link.badge || (link.isFree ? '100% Free' : 'Paid/Audit')} 
                                size="small" 
                                sx={{
                                  height: 18,
                                  fontSize: '9px',
                                  bgcolor: link.isFree ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)',
                                  color: link.isFree ? '#22C55E' : '#94A3B8',
                                  border: link.isFree ? '1px solid rgba(34,197,94,0.25)' : 'none'
                                }} 
                              />
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed mb-3">{link.description}</p>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#22C55E] hover:underline"
                            >
                              Explore Academy
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. PORTFOLIO GUIDE */}
            {activeTab === 'portfolio' && (
              <div className="grid md:grid-cols-3 gap-6">
                
                {/* Left part: Checklist & Steps */}
                <div className="md:col-span-2 rounded-2xl bg-white/[0.02] border border-white/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold flex items-center gap-2">
                        <Globe className="w-5 h-5 text-purple-400" />
                        Portfolio Project Blueprint
                      </h2>
                      <p className="text-xs text-gray-400 mt-1">Implement these strategies to present your skills interactively.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[#22C55E] text-lg font-extrabold">{portfolioProgress}%</span>
                      <div className="text-[10px] text-gray-500 font-semibold uppercase">Progress</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <LinearProgress 
                      variant="determinate" 
                      value={portfolioProgress} 
                      sx={{
                        height: 6, 
                        borderRadius: 3, 
                        bgcolor: 'rgba(255,255,255,0.05)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #1E3A8A, #22C55E)'
                        }
                      }} 
                    />
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { key: 'git', title: 'Structured GitHub Profile', desc: 'Create a customized pinned repository layout showcasing your absolute best clean code or reports.' },
                      { key: 'projects', title: '3 Diverse Showcase Projects', desc: 'Build 3 target projects that solve actual real-world business, clinical, or software problems.' },
                      { key: 'readme', title: 'Professional README Specifications', desc: 'Every project must contain a detailed markdown explaining the Goal, Technology Stack, and Live link.' },
                      { key: 'live', title: 'Live Hosted Demos', desc: 'Deploy your projects (using Vercel or Netlify) so recruiters can click them instantly without downloading code.' },
                      { key: 'cv', title: 'ResumeIQ Link Integration', desc: 'Place your clean, exported ResumeIQ PDF download link directly on your portfolio site.' },
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={() => togglePortfolio(item.key)}
                        className="w-full flex items-start gap-3.5 p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all text-left group"
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border flex-shrink-0 mt-0.5 transition-all ${
                          portfolioChecklist[item.key] 
                            ? 'bg-[#22C55E] border-[#22C55E] text-white' 
                            : 'border-white/20 group-hover:border-white/40'
                        }`}>
                          {portfolioChecklist[item.key] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-white text-sm font-semibold group-hover:text-[#22C55E] transition-colors">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right side: Hosting & Quick Tips */}
                <div className="space-y-6">
                  
                  {/* Hosting services */}
                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 backdrop-blur-xl">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                      <Laptop className="w-4 h-4 text-purple-400" />
                      Free Deployment & Hosting Platforms
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'GitHub Pages', desc: 'Best for basic HTML/CSS portfolios and static sites.', url: 'https://pages.github.com' },
                        { name: 'Vercel', desc: 'The leading platform for React, Next.js, and modern APIs.', url: 'https://vercel.com' },
                        { name: 'Netlify', desc: 'Seamless Git-to-deploy hosting with easy setup.', url: 'https://www.netlify.com' }
                      ].map((plat, pIdx) => (
                        <div key={pIdx} className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xs font-bold text-white">{plat.name}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">{plat.desc}</div>
                          </div>
                          <a href={plat.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-[#22C55E]/15 text-[#22C55E] transition-all">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic showcase hint */}
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-xl">
                    <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-orange-400" />
                      The README Standard
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Recruiters will rarely clone your repository. The README file is your landing page. Include:
                    </p>
                    <ul className="text-xs text-gray-300 mt-2 space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>A 2-sentence value proposition of the system.</li>
                      <li>High-resolution screenshot or GIF.</li>
                      <li>Direct link to the active hosted website.</li>
                    </ul>
                  </div>

                </div>

              </div>
            )}

            {/* 4. JOBS & INTERNSHIPS */}
            {activeTab === 'networking' && (
              <div className="grid md:grid-cols-2 gap-6">
                {internshipCategories.map((cat, idx) => (
                  <div key={idx} className={`rounded-2xl border ${cat.accent} p-6 backdrop-blur-xl`}>
                    <div className="flex items-center gap-2.5 mb-5">
                      {cat.icon}
                      <h3 className="text-base font-bold text-white tracking-wide">{cat.title}</h3>
                    </div>

                    <div className="space-y-4">
                      {cat.links.map((link, lIdx) => (
                        <div key={lIdx} className="p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between gap-3 mb-1.5">
                              <span className="text-white text-sm font-bold flex items-center gap-1">
                                {link.name}
                              </span>
                              {link.badge && (
                                <Chip 
                                  label={link.badge} 
                                  size="small" 
                                  sx={{
                                    height: 18,
                                    fontSize: '9px',
                                    bgcolor: 'rgba(245,158,11,0.15)',
                                    color: '#F59E0B',
                                    border: '1px solid rgba(245,158,11,0.25)'
                                  }} 
                                />
                              )}
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed mb-4">{link.description}</p>
                          </div>
                          <div>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#22C55E] hover:underline"
                            >
                              Launch Channel
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
