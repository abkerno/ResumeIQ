import React, { useState, useMemo, useEffect } from 'react';
import { useCV } from '../context/CVContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap, TrendingUp, Award, BookOpen, Compass, Target,
  ChevronRight, Clock, BarChart3, Lightbulb, Sparkles, Briefcase,
  DollarSign, Users, X, Check, MapPin, Sparkle, PlusCircle, CheckSquare, Square
} from 'lucide-react';
import { Button, Chip, LinearProgress, TextField, Drawer } from '@mui/material';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

type Tab = 'paths' | 'salary' | 'skills' | 'articles';

interface CareerPath {
  id: string;
  title: string;
  current: string;
  next: string;
  growth: string;
  timeframe: string;
  matchScore: number;
  accent: string;
  steps: string[];
}

const paths: CareerPath[] = [
  {
    id: 'path-cra-cpm',
    title: 'CRA → Clinical Project Manager',
    current: 'Senior Clinical Research Associate',
    next: 'Clinical Project Manager',
    growth: '+38% salary',
    timeframe: '12–18 months',
    matchScore: 87,
    accent: '#22C55E',
    steps: [
      'Lead 2+ multi-site Phase III trials end-to-end',
      'Earn PMP or ACRP-CP certification',
      'Build vendor & CRO oversight portfolio',
      'Mentor 3+ junior CRAs',
    ],
  },
  {
    id: 'path-reg-dir',
    title: 'Regulatory Specialist → Director',
    current: 'Regulatory Affairs Specialist',
    next: 'Director, Regulatory Strategy',
    growth: '+72% salary',
    timeframe: '3–5 years',
    matchScore: 74,
    accent: '#3B82F6',
    steps: [
      'Lead a successful NDA or BLA submission',
      'Develop FDA & EMA dual-pathway expertise',
      'Manage cross-functional regulatory teams',
      'Pursue RAC certification (Drugs)',
    ],
  },
  {
    id: 'path-msl-medlead',
    title: 'MSL → Medical Director',
    current: 'Medical Science Liaison',
    next: 'Therapeutic Area Medical Director',
    growth: '+58% salary',
    timeframe: '4–6 years',
    matchScore: 81,
    accent: '#EC4899',
    steps: [
      'Establish KOL network in your therapeutic area',
      'Author 5+ peer-reviewed publications',
      'Lead advisory boards and scientific symposia',
      'Develop launch readiness experience',
    ],
  },
];

const LOCAL_ROADMAP_PRESETS: Record<string, { milestone: string; timeframe: string; details: string; tasks: string[] }[]> = {
  'path-cra-cpm': [
    {
      milestone: 'Phase III Trial Ownership & SIV Launch',
      timeframe: 'Month 1 — 4',
      details: 'Transition from routine site-level monitoring to protocol-level oversight.',
      tasks: [
        'Shadow the Lead CPM during Phase III oncology trial startup meetings.',
        'Lead drafting of the Site Initiation Visit (SIV) checklist & monitoring plan.',
        'Enroll in protocol development workshop at ACRP.'
      ]
    },
    {
      milestone: 'ACRP-CP / PMP Exam Qualification',
      timeframe: 'Month 5 — 8',
      details: 'Acquire structured project management credentials and log operational hours.',
      tasks: [
        'Study PMBOK Guide chapters on stakeholders and resource risk management.',
        'Log 3,500 hours of clinical project operations in project tracker.',
        'Apply for and pass the Project Management Professional (PMP) certification.'
      ]
    },
    {
      milestone: 'CRO Oversight & SLA Audits',
      timeframe: 'Month 9 — 12',
      details: 'Establish a robust portfolio of vendor management and clinical trial metrics audits.',
      tasks: [
        'Audit 3 comprehensive CRO site monitoring files to verify eTMF compliance.',
        'Lead quarterly sponsor-CRO key performance indicator (KPI) alignment review.',
        'Standardize 2 clinical service level agreements (SLAs) for vendor onboarding.'
      ]
    },
    {
      milestone: 'Trial Leadership & Mentoring',
      timeframe: 'Month 13 — 18',
      details: 'Demonstrate active lead operational authority and cross-functional team coordination.',
      tasks: [
        'Mentor 3 junior Clinical Research Associates in GxP site auditing techniques.',
        'Coordinate cross-functional trial initiation timelines between clinical operations and CMC.',
        'Present site activation efficiency findings to senior clinical director.'
      ]
    }
  ],
  'path-reg-dir': [
    {
      milestone: 'IND/NDA submission Lead Role',
      timeframe: 'Month 1 — 12',
      details: 'Take ownership of regulatory dossier compilation and FDA review coordination.',
      tasks: [
        'Lead compiling of CMC Module 3 section for upcoming BLA/NDA filing.',
        'Coordinate answers to FDA Information Requests within strict 48-hour timelines.',
        'Conduct regulatory pre-submission advice reviews with agency inspectors.'
      ]
    },
    {
      milestone: 'RAC Strategic Certification',
      timeframe: 'Month 13 — 24',
      details: 'Secure elite certification validating deep US/EU pharmaceutical law strategies.',
      tasks: [
        'Study RAPS Regulatory Affairs Certification Drugs study syllabus.',
        'Attend international regulatory harmonization seminars covering ICH guidelines.',
        'Sit and pass the RAC (Drugs) examination successfully.'
      ]
    },
    {
      milestone: 'Cross-functional Regulatory Strategy',
      timeframe: 'Year 3 — 4',
      details: 'Formulate dual-pathway FDA/EMA pipeline architectures for pipeline biopharma products.',
      tasks: [
        'Author the FDA PSP & EMA PIP pediatric drug study strategies by Phase II.',
        'Direct CMC stability protocols to align with diverse regional regulatory climates.',
        'Mentor junior regulatory associates in CTD formatting and dossiers submissions.'
      ]
    },
    {
      milestone: 'Executive Director Transition',
      timeframe: 'Year 5',
      details: 'Assume comprehensive portfolio leadership and executive submission strategy authority.',
      tasks: [
        'Manage 4 active drug pipelines submissions portfolios end-to-end.',
        'Present corporate regulatory pipeline projections directly to executive board.',
        'Land promotion to Director of Regulatory Strategy.'
      ]
    }
  ],
  'path-msl-medlead': [
    {
      milestone: 'KOL Scientific Network Expansion',
      timeframe: 'Month 1 — 12',
      details: 'Build and cement top-tier clinical investigator relationships within specialized niches.',
      tasks: [
        'Establish advisory board networks with 15 oncology key opinion leaders (KOLs).',
        'Identify 5 national trial investigators for upcoming Phase II trials.',
        'Present corporate pre-clinical data at 3 major scientific symposia.'
      ]
    },
    {
      milestone: 'Peer-Reviewed Publication Leadership',
      timeframe: 'Month 13 — 24',
      details: 'Lead publication planning to optimize clinical product scientific visibility.',
      tasks: [
        'Author 3 clinical study manuscripts for publication in peer-reviewed journals.',
        'Present 2 oral clinical abstracts at ASCO or equivalent congresses.',
        'Draft medical information newsletters explaining novel drug pathways.'
      ]
    },
    {
      milestone: 'Launch Readiness Coordination',
      timeframe: 'Year 3 — 4',
      details: 'Interface with marketing and clinical operations to architect scientific launch portfolios.',
      tasks: [
        'Train medical science liaisons in key product launch data portfolios.',
        'Review corporate educational slide decks to ensure 100% compliance with FDA medical guidelines.',
        'Lead launch science advisory boards and capture clinical trial insights.'
      ]
    },
    {
      milestone: 'Therapeutic Area Director Transition',
      timeframe: 'Year 5 — 6',
      details: 'Take absolute scientific and clinical advisory authority over specialized disease portfolios.',
      tasks: [
        'Direct a team of 10 field Medical Science Liaisons (MSLs).',
        'Approve clinical trial protocols and medical strategy roadmaps.',
        'Assume full Therapeutic Area Medical Director position.'
      ]
    }
  ]
};

const ARTICLE_DETAILS: Record<string, { title: string; category: string; readTime: string; accent: string; subtitle: string; content: string; checklist: string[] }> = {
  'art-1': {
    title: 'Decoding Risk-Based Monitoring in 2026',
    category: 'Clinical Operations',
    readTime: '6 min read',
    accent: '#22C55E',
    subtitle: 'Adaptive RBQM Frameworks & Protocol Deviation Controls',
    content: `Risk-Based Monitoring (RBM) has transitioned from an innovative pilot methodology to an FDA and EMA compliance mandate under ICH E6(R2) and the emerging R3 guidelines. Rather than relying on standard 100% Source Data Verification (SDV) which is both slow and error-prone, modern clinical operations leverage centralized monitoring dashboards to assess investigational site health in real time. By identifying Critical to Quality (CtQ) factors during protocol design, clinical project managers can establish statistical thresholds for Key Risk Indicators (KRIs) such as enrollment rates, screen failure ratios, and protocol deviation frequencies.

Centralized monitoring teams analyze statistical anomalies across multi-center global trials to target resources where they are needed most. For example, if a site shows an unusually low rate of adverse event reporting compared to historical cohorts, this triggers a targeted on-site monitoring visit or a focused eTMF audit. Implementing a risk-based clinical quality management system (RBQM) not only reduces trial operational budgets by up to 30%, but also significantly improves patient safety and data integrity by mitigating compliance risks before they lead to regulatory audit findings during NDA submissions.`,
    checklist: [
      "Establish Critical to Quality (CtQ) parameters during protocol drafting.",
      "Define statistical thresholds for Key Risk Indicators (KRIs) like screen failures.",
      "Maintain a centralized dashboard integrating EDC and eTMF risk flags.",
      "Conduct targeted, trigger-based on-site monitoring instead of high-frequency SDV."
    ]
  },
  'art-2': {
    title: 'FDA vs EMA: Navigating Dual Submissions',
    category: 'Regulatory',
    readTime: '9 min read',
    accent: '#3B82F6',
    subtitle: 'Harmonizing Dossiers, CMC Specifications, & Pediatric Plans',
    content: `Filing dossier applications simultaneously with the FDA and the European Medicines Agency (EMA) requires a masterclass in regulatory strategy. Although the Common Technical Document (CTD) format provides a unified structural shell across Modules 1 to 5, the technical specifications, pediatric requirements, and chemistry manufacturing controls (CMC) remain highly divergent between the two jurisdictions. 

In Module 1 (Administrative Information), sponsors must tailor application letters to meet distinct regional legal requirements. A critical strategic challenge lies in harmonizing the Pediatric Study Plan (PSP) for the FDA with the Pediatric Investigation Plan (PIP) for the EMA. The EMA often demands pediatric assessments earlier in the clinical development cycle, whereas the FDA may grant deferrals more readily. In Module 3 (Quality/CMC), differences in stability testing parameters and regulatory definitions of active pharmaceutical ingredients (APIs) can trigger restrictive Information Requests (IRs) if not planned during pre-IND strategy sessions. Developing a dual-submission bridge protocol ensures data packages satisfy both agencies' stringent criteria.`,
    checklist: [
      "Conduct a gap analysis between FDA PSP and EMA PIP requirements by Phase II.",
      "Align eCTD Module 3 stability data to satisfy both regional climates.",
      "Establish a rapid-response team to address FDA Information Requests (IRs) and EMA Day-120 list of questions.",
      "Harmonize the Clinical Study Reports (CSR) to ICH E3 standards to ensure cross-acceptability."
    ]
  },
  'art-3': {
    title: 'The Rise of Decentralized Trials',
    category: 'Innovation',
    readTime: '7 min read',
    accent: '#A855F7',
    subtitle: 'eConsent, Home Health Nursing, & Wearable DHT Integrations',
    content: `Decentralized Clinical Trials (DCTs) represent the most significant shift in clinical research paradigms in decades. By integrating electronic Informed Consent (eConsent), home health nursing, local clinical laboratory networks, and wearable Digital Health Technologies (DHTs), trial sponsors can recruit and retain highly diverse patient populations globally. This direct-to-patient approach dramatically lowers the logistical burden of participating in clinical trials, particularly in rare disease indications where patients are geographically dispersed.

However, DCT execution presents unique compliance and technical challenges. Centralized operations managers must manage a complex web of remote data collection points, ensuring that all DHT devices are validated for data integrity and comply with FDA 21 CFR Part 11 and GDPR requirements. Telemedicine visits must be documented with the same level of GxP compliance as on-site clinical assessments. Furthermore, direct-to-patient drug logistics require secure temperature-controlled supply chains to guarantee that investigational products remain within validated ranges during transit and home storage.`,
    checklist: [
      "Draft DCT-specific standard operating procedures (SOPs) for remote patient management.",
      "Deploy validated, FDA Part 11 compliant eConsent and eCOA/ePRO platforms.",
      "Coordinate secure, temperature-monitored direct-to-patient (DtP) product supply lines.",
      "Establish centralized data monitoring pipelines to filter DHT noise from therapeutic signal."
    ]
  },
  'art-4': {
    title: 'Pharma Salary Benchmarks: 2026 Edition',
    category: 'Career',
    readTime: '5 min read',
    accent: '#F59E0B',
    subtitle: 'Compensation Trends, Base Scales, Equity, & Local Premiums',
    content: `The life sciences talent market in 2026 continues to experience robust compensation demand, driven by massive investments in clinical-stage oncology, immunology, and cell/gene therapies. Average base salaries across clinical operations, regulatory strategy, and quality management have risen by 4-6% annually, with localized hot spots in key biotechnology hubs (San Francisco, Boston, Zurich) commanding significant premiums.

In addition to base compensation, professional recruitment packages feature comprehensive sign-on bonuses, performance-related bonuses (ranging from 10% to 25% of base), and equity options. In early-to-mid stage biotech companies, equity grants represent a critical component of total compensation, typically ranging from 0.05% to 0.5% depending on role seniority. Understanding localized salary ranges, cost-of-living indexations, and the balance between base salary and long-term equity options is essential for life science professionals negotiating new career steps in a competitive market.`,
    checklist: [
      "Research regional cost-of-living premiums before negotiating relocations.",
      "Evaluate the vesting schedule (standard 4-year, 1-year cliff) for all equity grants.",
      "Benchmark salary expectations against current therapeutic area demand (e.g. mRNA, oncology).",
      "Confirm performance-based bonus structures and historical payout ratios in writing."
    ]
  },
  'art-5': {
    title: 'Building a Standout Pharma CV',
    category: 'CV Strategy',
    readTime: '8 min read',
    accent: '#EC4899',
    subtitle: 'Keyword Density, Layout Parsing, & Quantitative Metric Design',
    content: `In the pharmaceutical and clinical research industries, hiring managers and recruiters scan hundreds of resumes daily, often filtering them through automated Applicant Tracking Systems (ATS) like Workday or Taleo. A generic resume that lists basic daily duties is no longer competitive. To stand out, professional life sciences CVs must be structured around quantitative trial metrics and dense clinical-tech keywords.

To optimize your CV for ATS parsing, avoid multi-column layouts, graphics, or non-standard fonts. Instead, focus on inserting standard industry terminology (e.g., GxP, CRO oversight, FDA inspections, eTMF, CAPA) in natural contexts. For every professional position listed, convert general descriptions into high-impact bullet points that show scope, size, and outcomes. Instead of writing "monitored oncology sites", state "Orchestrated site-level clinical monitoring for 5 Phase III oncology trials across 14 high-volume investigational sites, maintaining a 98% eTMF compliance rating". This tells both the ATS and the recruiter exactly what you can deliver.`,
    checklist: [
      "Use clean, single-column, standard A4 layout styles to ensure 100% ATS readability.",
      "Surface key technical skills (Veeva Vault, CDISC SDTM) at the top of your resume.",
      "Structure every experience bullet with a strong action verb and a quantitative metric.",
      "Audit your CV to ensure all critical GxP compliance keywords are naturally integrated."
    ]
  },
  'art-6': {
    title: 'GxP Certifications That Move the Needle',
    category: 'Education',
    readTime: '4 min read',
    accent: '#22C55E',
    subtitle: 'CCRA, RAC, CQA, and PMP Certifications Evaluated',
    content: `Professional certifications are a popular way for clinical, regulatory, and quality specialists to demonstrate expertise and stand out in the job pool. However, not all certifications are created equal. Some carry significant weight with biotech hiring managers, while others are viewed as low-value cash grabs that offer little career acceleration.

For clinical operations professionals, the ACRP Certified Clinical Research Associate (CCRA) or the SOCRA Certified Clinical Research Professional (CCRP) are gold standards that validate field monitoring expertise. In regulatory affairs, the Regulatory Affairs Certification (RAC) awarded by RAPS is highly regarded, particularly for mid-to-senior strategy roles. In quality operations, the ASQ Certified Quality Auditor (CQA) is the primary benchmark for GMP/GCP systems auditing. Finally, the Project Management Professional (PMP) certification from PMI is an excellent, highly versatile asset for those transitioning from monitoring into clinical project management, demonstrating structured budget and stakeholder alignment.`,
    checklist: [
      "Select certifications that align to target job listings (e.g. RAC for regulatory leads).",
      "Ensure you meet the active clinical experience hours required before applying.",
      "Balance academic certifications with practical on-the-job projects and trials.",
      "Utilize employer training budgets to sponsor fees and study materials."
    ]
  }
};

const articles = [
  {
    id: 'art-1',
    title: 'Decoding Risk-Based Monitoring in 2026',
    category: 'Clinical Operations',
    readTime: '6 min read',
    accent: '#22C55E',
    excerpt: 'How adaptive RBM frameworks are reshaping site monitoring strategies and reducing protocol deviations by 40%+.',
  },
  {
    id: 'art-2',
    title: 'FDA vs EMA: Navigating Dual Submissions',
    category: 'Regulatory',
    readTime: '9 min read',
    accent: '#3B82F6',
    excerpt: 'A practitioner\'s guide to harmonizing dossiers, bridging studies, and accelerating global approvals.',
  },
  {
    id: 'art-3',
    title: 'The Rise of Decentralized Trials',
    category: 'Innovation',
    readTime: '7 min read',
    accent: '#A855F7',
    excerpt: 'eConsent, wearables, and direct-to-patient logistics are redefining patient-centric trial design.',
  },
  {
    id: 'art-4',
    title: 'Pharma Salary Benchmarks: 2026 Edition',
    category: 'Career',
    readTime: '5 min read',
    accent: '#F59E0B',
    excerpt: 'Comprehensive compensation data across CRO, biotech, and big pharma — by role and region.',
  },
  {
    id: 'art-5',
    title: 'Building a Standout Pharma CV',
    category: 'CV Strategy',
    readTime: '8 min read',
    accent: '#EC4899',
    excerpt: 'Quantify impact, surface keywords, and structure experience the way pharma recruiters scan.',
  },
  {
    id: 'art-6',
    title: 'GxP Certifications That Move the Needle',
    category: 'Education',
    readTime: '4 min read',
    accent: '#22C55E',
    excerpt: 'Which credentials hiring managers actually look for — and which are a waste of money.',
  },
];

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'paths', label: 'Career Paths', icon: <Compass className="w-4 h-4" /> },
  { id: 'salary', label: 'Salary Insights', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'skills', label: 'Skill Gap', icon: <Target className="w-4 h-4" /> },
  { id: 'articles', label: 'Library', icon: <BookOpen className="w-4 h-4" /> },
];

export function CareerGuide() {
  const [activeTab, setActiveTab] = useState<Tab>('paths');
  const { activeCV, callAI, addSkill } = useCV();
  
  const userSkills = activeCV?.skills || [];
  const niche = activeCV?.activeNiche || 'general';

  // Article Drawer state
  const [readingArticleId, setReadingArticleId] = useState<string | null>(null);
  const [articleProgress, setArticleProgress] = useState<Record<string, boolean[]>>({});

  // Roadmap Drawer state
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapPath, setRoadmapPath] = useState<CareerPath | null>(null);
  const [roadmapMilestones, setRoadmapMilestones] = useState<{ milestone: string; timeframe: string; details: string; tasks: string[] }[]>([]);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  // Skill Gap study plan state
  const [loadingStudyPlan, setLoadingStudyPlan] = useState(false);
  const [studyPlanSkill, setStudyPlanSkill] = useState<string | null>(null);
  const [studyPlanSyllabus, setStudyPlanSyllabus] = useState<{ week: string; topic: string; details: string; deliverables: string[] }[]>([]);

  // Salary Cost-of-Living adjustment states
  const [targetLocation, setTargetLocation] = useState('Boston, MA');
  const [loadingPulse, setLoadingPulse] = useState(false);
  const [marketPulseCommentary, setMarketPulseCommentary] = useState<string>('Boston remains a primary global hub for oncology and mRNA research, with salaries trading at a 22% premium above national averages.');

  const toastMessage = useMemo(() => {
    return localStorage.getItem('cv_guide_toast') || '';
  }, []);
  const [localToast, setLocalToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3000);
  };

  // 1. Dynamic Cost of Living Index calculation
  const locationIndex = useMemo(() => {
    const loc = targetLocation.toLowerCase();
    if (loc.includes('san francisco') || loc.includes('sf') || loc.includes('bay area') || loc.includes('silicon valley') || loc.includes('zurich') || loc.includes('basel')) return 1.32;
    if (loc.includes('boston') || loc.includes('cambridge') || loc.includes('new york') || loc.includes('ny') || loc.includes('manhattan') || loc.includes('geneva')) return 1.22;
    if (loc.includes('san diego') || loc.includes('la jolla') || loc.includes('seattle')) return 1.15;
    if (loc.includes('carolina') || loc.includes('triangle') || loc.includes('durham') || loc.includes('raleigh') || loc.includes('chicago') || loc.includes('philadelphia')) return 1.05;
    if (loc.includes('london') || loc.includes('uk')) return 0.95;
    return 1.00;
  }, [targetLocation]);

  // 2. Dynamic Skill Gap radar data
  const dynamicSkillRadar = useMemo(() => {
    const hasSkill = (keywords: string[]) => {
      return keywords.some(k => userSkills.some(us => us.toLowerCase().includes(k.toLowerCase())));
    };

    if (niche === 'cra') {
      return [
        { skill: 'Clinical Ops', current: hasSkill(['gcp', 'clinical trial', 'monitoring']) ? 90 : 40, target: 95 },
        { skill: 'Regulatory', current: hasSkill(['fda', 'ema', 'regulatory', 'compliance']) ? 80 : 50, target: 90 },
        { skill: 'Project Mgmt', current: hasSkill(['monitoring', 'etmf', 'lead']) ? 75 : 45, target: 90 },
        { skill: 'Vendor Oversight', current: hasSkill(['vendor', 'cro', 'sponsor']) ? 85 : 40, target: 85 },
        { skill: 'Budgeting', current: hasSkill(['budget', 'contract', 'finance']) ? 50 : 35, target: 80 },
        { skill: 'Leadership', current: hasSkill(['lead', 'mentor', 'train']) ? 80 : 50, target: 90 }
      ];
    } else if (niche === 'regulatory') {
      return [
        { skill: 'Dossier Prep', current: hasSkill(['nda', 'ind', 'bla', 'dossier']) ? 95 : 40, target: 95 },
        { skill: 'FDA Compliance', current: hasSkill(['fda', 'part 11', 'regulations']) ? 90 : 50, target: 95 },
        { skill: 'EMA Guidelines', current: hasSkill(['ema', 'guidelines', 'europe']) ? 80 : 40, target: 90 },
        { skill: 'CMC Protocols', current: hasSkill(['cmc', 'manufacturing', 'control']) ? 85 : 45, target: 85 },
        { skill: 'Submissions', current: hasSkill(['submission', 'filing', 'esctd']) ? 90 : 50, target: 90 },
        { skill: 'Strategy', current: hasSkill(['strategy', 'plan', 'lead']) ? 75 : 45, target: 90 }
      ];
    } else if (niche === 'quality') {
      return [
        { skill: 'GMP Compliance', current: hasSkill(['gmp', 'manufacturing', 'cgmp']) ? 95 : 45, target: 95 },
        { skill: 'CAPA Systems', current: hasSkill(['capa', 'corrective', 'preventive']) ? 90 : 40, target: 95 },
        { skill: 'Auditing', current: hasSkill(['audit', 'inspection', 'readiness']) ? 85 : 50, target: 90 },
        { skill: 'SOP Dev', current: hasSkill(['sop', 'procedure', 'writing']) ? 90 : 55, target: 90 },
        { skill: 'Validation', current: hasSkill(['validation', 'qualification', 'protocol']) ? 80 : 40, target: 85 },
        { skill: 'Leadership', current: hasSkill(['manager', 'lead', 'director']) ? 70 : 40, target: 90 }
      ];
    } else {
      return [
        { skill: 'Pharma Operations', current: hasSkill(['clinical', 'pharma', 'operations']) ? 85 : 50, target: 95 },
        { skill: 'Compliance', current: hasSkill(['gxp', 'compliance', 'standards']) ? 80 : 45, target: 90 },
        { skill: 'R&D/Analytics', current: hasSkill(['research', 'analytics', 'data']) ? 90 : 55, target: 90 },
        { skill: 'Project Ops', current: hasSkill(['project', 'coordination']) ? 70 : 40, target: 85 },
        { skill: 'Documentation', current: hasSkill(['writing', 'sop', 'protocols']) ? 80 : 50, target: 85 },
        { skill: 'Teamwork', current: hasSkill(['communication', 'team', 'cross-functional']) ? 85 : 60, target: 90 }
      ];
    }
  }, [userSkills, niche]);

  // 3. Dynamic Cost-of-Living Salary adjustment
  const salaryDataInfo = useMemo(() => {
    const scaleFactor = locationIndex;
    const adjust = (val: number) => Math.round(val * scaleFactor);

    if (niche === 'cra') {
      return {
        title: `Clinical Operations Track — ${targetLocation} Adjusted USD (k)`,
        target: 'Clinical Project Manager',
        data: [
          { role: 'CRA I', min: adjust(65), max: adjust(85) },
          { role: 'CRA II', min: adjust(80), max: adjust(105) },
          { role: 'Sr. CRA', min: adjust(100), max: adjust(135) },
          { role: 'CPM', min: adjust(130), max: adjust(175) },
          { role: 'Sr. CPM', min: adjust(160), max: adjust(220) },
          { role: 'Director', min: adjust(200), max: adjust(290) },
        ]
      };
    } else if (niche === 'regulatory') {
      return {
        title: `Regulatory Affairs Track — ${targetLocation} Adjusted USD (k)`,
        target: 'Director, Regulatory Strategy',
        data: [
          { role: 'Associate', min: adjust(70), max: adjust(90) },
          { role: 'Specialist', min: adjust(85), max: adjust(110) },
          { role: 'Sr. Spec', min: adjust(105), max: adjust(140) },
          { role: 'Manager', min: adjust(125), max: adjust(165) },
          { role: 'Assoc. Dir', min: adjust(155), max: adjust(210) },
          { role: 'Director', min: adjust(195), max: adjust(275) },
        ]
      };
    } else if (niche === 'quality') {
      return {
        title: `Quality Assurance Track — ${targetLocation} Adjusted USD (k)`,
        target: 'Director, Quality Management',
        data: [
          { role: 'QA Analyst', min: adjust(60), max: adjust(80) },
          { role: 'QA Spec', min: adjust(75), max: adjust(100) },
          { role: 'QA Lead', min: adjust(95), max: adjust(130) },
          { role: 'QA Manager', min: adjust(120), max: adjust(160) },
          { role: 'Sr. Manager', min: adjust(145), max: adjust(200) },
          { role: 'QA Director', min: adjust(185), max: adjust(260) },
        ]
      };
    } else {
      return {
        title: `Pharmaceutical Operations Track — ${targetLocation} Adjusted USD (k)`,
        target: 'Director of Operations',
        data: [
          { role: 'Specialist', min: adjust(65), max: adjust(85) },
          { role: 'Sr. Spec', min: adjust(80), max: adjust(110) },
          { role: 'Lead', min: adjust(100), max: adjust(135) },
          { role: 'Manager', min: adjust(125), max: adjust(170) },
          { role: 'Assoc. Dir', min: adjust(150), max: adjust(205) },
          { role: 'Director', min: adjust(190), max: adjust(270) },
        ]
      };
    }
  }, [niche, locationIndex, targetLocation]);

  // Request AI Market pulse for salary insights
  const handleRequestMarketPulse = async () => {
    setLoadingPulse(true);
    try {
      const prompt = [
        {
          role: 'system',
          content: 'You are a senior pharmaceutical talent consultant. Write a professional, concise 2-sentence recruitment market summary (max 40 words) for the requested city and pharma niche. Focus on average rates, talent supply, and active key therapeutic targets. Do not include markdown or bullet points.'
        },
        {
          role: 'user',
          content: `Pharma Niche: ${niche.toUpperCase()}, Location: ${targetLocation}`
        }
      ];
      const comment = await callAI(prompt);
      setMarketPulseCommentary(comment);
    } catch (e) {
      console.error(e);
      setMarketPulseCommentary(`Life-science hires in ${targetLocation} remain highly competitive due to cluster concentration, with specialty training commanding substantial premiums.`);
    } finally {
      setLoadingPulse(false);
    }
  };

  // Generate Career Roadmap via AI
  const handleBuildRoadmap = async (path: CareerPath) => {
    setRoadmapPath(path);
    setLoadingRoadmap(true);
    setRoadmapMilestones([]);

    try {
      const cvTitle = activeCV?.personal?.title || 'Senior CRA';
      const prompt = [
        {
          role: 'system',
          content: `You are an expert Clinical/Regulatory Development and Career Transition Coach.
Generate a milestone-by-milestone transition roadmap from the user's current role to the target role.
You MUST output ONLY a valid JSON array of 4 objects matching the following schema:
[
  {
    "milestone": "Milestone Title",
    "timeframe": "Month 1 - 3",
    "details": "Explanation of focus and learning objectives.",
    "tasks": [
      "Actionable task item 1 (specific to GCP, FDA or pharma compliance)",
      "Actionable task item 2",
      "Actionable task item 3"
    ]
  }
]
Do not return any markdown wraps, backticks, or descriptions. Return ONLY pure parseable JSON.`
        },
        {
          role: 'user',
          content: `Transition Path: ${path.title}. Current CV Title: ${cvTitle}. Niche: ${niche.toUpperCase()}.`
        }
      ];

      const response = await callAI(prompt);
      let cleanText = response.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/g, '');
      }
      
      const parsed = JSON.parse(cleanText);
      setRoadmapMilestones(parsed);
      
      // Reset checked tasks
      setCheckedTasks({});
    } catch (err) {
      console.error("AI Roadmap creation failed, using preset:", err);
      // Fallback
      const preset = LOCAL_ROADMAP_PRESETS[path.id] || LOCAL_ROADMAP_PRESETS['path-cra-cpm'];
      setRoadmapMilestones(preset);
      setCheckedTasks({});
    } finally {
      setLoadingRoadmap(false);
    }
  };

  // Generate AI Skill Study syllabus
  const handleStartStudyPlan = async (skillName: string) => {
    setStudyPlanSkill(skillName);
    setLoadingStudyPlan(true);
    setStudyPlanSyllabus([]);

    try {
      const prompt = [
        {
          role: 'system',
          content: `You are an elite Pharma GxP and Clinical Operations expert tutor.
Create a highly structured 3-week study guide/syllabus for the target skill.
You MUST output ONLY a valid JSON array of 3 objects matching the following schema:
[
  {
    "week": "Week 1: Core Fundamentals",
    "topic": "Topic Heading",
    "details": "Summary of concepts, SOPs, or frameworks to master.",
    "deliverables": [
      "Practical study deliverable 1 (e.g. read FDA 21 CFR Chapter)",
      "Practical study deliverable 2",
      "Practical study deliverable 3"
    ]
  }
]
Do not return any markdown wraps or backticks. Return ONLY pure parseable JSON.`
        },
        {
          role: 'user',
          content: `Skill/Certification to master: ${skillName}. Niche: ${niche.toUpperCase()}.`
        }
      ];

      const response = await callAI(prompt);
      let cleanText = response.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```json\s*/i, '').replace(/```\s*$/g, '');
      }
      
      const parsed = JSON.parse(cleanText);
      setStudyPlanSyllabus(parsed);
    } catch (err) {
      console.error("AI study syllabus failed, creating a default one:", err);
      // Default
      setStudyPlanSyllabus([
        {
          week: "Week 1: Baseline Protocols",
          topic: `Core Regulations of ${skillName}`,
          details: `Gain fundamental proficiency in ${skillName} regulations, tracing guidelines under FDA 21 CFR guidelines.`,
          deliverables: [
            "Review corporate standard operating procedures (SOPs) on GxP.",
            "Complete 2-hour scientific overview covering regulatory principles.",
            "Write down 10 core technical terms and definition markers."
          ]
        },
        {
          week: "Week 2: Systems Integration",
          topic: `Practical Implementation of ${skillName}`,
          details: `Master software workflows and risk mitigation exercises for clinical settings.`,
          deliverables: [
            "Shadow a senior systems specialist during validation audits.",
            "Map system database requirements against target GCP templates.",
            "Perform sandbox environment logging tasks and resolve 3 errors."
          ]
        },
        {
          week: "Week 3: GxP Audit Verification",
          topic: `Compliance Archiving & Evaluation`,
          details: `Establish final verification parameters and study mock audit inspection files.`,
          deliverables: [
            "Complete a simulated 25-question readiness review quiz.",
            "Submit system setup logs for senior review approval.",
            "Assemble a 2-page operations SOP summarizing learnings."
          ]
        }
      ]);
    } finally {
      setLoadingStudyPlan(false);
    }
  };

  const handleInjectSkill = (sName: string) => {
    addSkill(sName);
    triggerToast(`Successfully injected "${sName}" into your CV skills list!`);
  };

  // Toggle specific milestone task check
  const toggleTask = (taskKey: string) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  // Compute roadmap transition progress percentage
  const roadmapProgress = useMemo(() => {
    if (roadmapMilestones.length === 0) return 0;
    const allTasks = roadmapMilestones.flatMap((m, mIdx) => m.tasks.map((_, tIdx) => `${mIdx}-${tIdx}`));
    if (allTasks.length === 0) return 0;
    const checkedCount = allTasks.filter(k => checkedTasks[k]).length;
    return Math.round((checkedCount / allTasks.length) * 100);
  }, [roadmapMilestones, checkedTasks]);

  // Article reading progress checklist toggle
  const toggleArticleCheck = (artId: string, idx: number) => {
    const curr = articleProgress[artId] || [false, false, false, false];
    const updated = [...curr];
    updated[idx] = !updated[idx];
    setArticleProgress(prev => ({
      ...prev,
      [artId]: updated
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1E3A8A]/10">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 text-[#22C55E] text-sm mb-2">
            <GraduationCap className="w-4 h-4" />
            <span>Pharma Career Intelligence</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Career Guide</h1>
          <p className="text-gray-400">Personalized pathways, salary benchmarks, and skill insights for life-sciences professionals.</p>
        </motion.div>

        {/* Hero stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { id: 'h-1', icon: <Briefcase className="w-5 h-5" />, label: 'Open pharma roles', value: '12,847', accent: '#22C55E' },
            { id: 'h-2', icon: <TrendingUp className="w-5 h-5" />, label: 'Avg. growth (5yr)', value: '+24%', accent: '#3B82F6' },
            { id: 'h-3', icon: <Users className="w-5 h-5" />, label: 'Active mentors', value: '326', accent: '#A855F7' },
            { id: 'h-4', icon: <Award className="w-5 h-5" />, label: 'Certifications mapped', value: '48', accent: '#F59E0B' },
          ].map(s => (
            <div key={s.id} className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${s.accent}22`, color: s.accent }}>{s.icon}</div>
              <div>
                <div className="text-white font-bold text-xl leading-tight">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-white/10">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm transition-all relative ${
                activeTab === t.id ? 'text-[#22C55E]' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.icon}{t.label}
              {activeTab === t.id && (
                <motion.div layoutId="career-tab-underline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-gradient-to-r from-[#1E3A8A] to-[#22C55E]" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Career Paths */}
            {activeTab === 'paths' && (
              <div className="grid lg:grid-cols-3 gap-5">
                {paths.map((p, idx) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/10 border border-white/10 backdrop-blur-xl p-5 relative overflow-hidden"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-20" style={{ background: p.accent }} />
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <Chip label={`${p.matchScore}% match`} size="small" sx={{
                          bgcolor: `${p.accent}22`, color: p.accent, border: `1px solid ${p.accent}55`
                        }} />
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" />{p.timeframe}
                        </div>
                      </div>

                      <h3 className="text-white font-semibold mb-3 text-lg leading-tight">{p.title}</h3>

                      <div className="flex flex-col gap-2 mb-4 text-xs">
                        <div className="flex items-center gap-2 text-gray-400">
                          <span className="text-[10px] text-gray-500 font-semibold uppercase">Current</span>
                          <span className="px-2 py-1 rounded bg-white/5 border border-white/10 truncate max-w-[200px]">{p.current}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-500 font-semibold uppercase">Target</span>
                          <span className="px-2 py-1 rounded text-white font-semibold truncate max-w-[200px]" style={{ background: `${p.accent}33`, border: `1px solid ${p.accent}55` }}>{p.next}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4 text-sm">
                        <TrendingUp className="w-4 h-4" style={{ color: p.accent }} />
                        <span className="font-bold" style={{ color: p.accent }}>{p.growth}</span>
                      </div>

                      <div className="space-y-2.5 mb-6 border-t border-white/5 pt-4">
                        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Key Milestones Needed</div>
                        {p.steps.map((s, i) => (
                          <div key={`${p.id}-step-${i}`} className="flex items-start gap-2.5 text-xs text-gray-300">
                            <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: `${p.accent}22`, color: p.accent }}>{i + 1}</div>
                            <span className="pt-0.5 leading-relaxed">{s}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        fullWidth
                        onClick={() => handleBuildRoadmap(p)}
                        sx={{
                          textTransform: 'none', color: 'white',
                          borderRadius: '12px',
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: '13px',
                          background: `linear-gradient(135deg, #1E3A8A, ${p.accent})`,
                          '&:hover': { opacity: 0.9, boxShadow: `0 0 15px ${p.accent}40` }
                        }}
                      >
                        Build Roadmap
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Salary Insights */}
            {activeTab === 'salary' && (
              <div className="grid lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/10 border border-white/10 backdrop-blur-xl p-6">
                  {/* Location Selector */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">Salary Range Scale</h3>
                      <p className="text-xs text-gray-400">Median compensation scales across clinical, QA, and regulatory niches.</p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <MapPin className="w-4 h-4 text-[#22C55E]" />
                      <TextField
                        size="small"
                        placeholder="E.g. Boston, MA"
                        value={targetLocation}
                        onChange={(e) => setTargetLocation(e.target.value)}
                        sx={{
                          width: '180px',
                          '& .MuiOutlinedInput-root': {
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: 600,
                            borderRadius: '10px',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                            '&:hover fieldset': { borderColor: '#22C55E' },
                            '&.Mui-focused fieldset': { borderColor: '#22C55E' }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick select buttons */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {['San Francisco, CA', 'Boston, MA', 'New York, NY', 'Research Triangle, NC', 'Zurich, Switzerland', 'London, UK'].map((city) => (
                      <button
                        key={city}
                        onClick={() => setTargetLocation(city)}
                        className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                          targetLocation === city
                            ? 'bg-[#22C55E]/15 border-[#22C55E]/30 text-[#22C55E]'
                            : 'bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {city.split(',')[0]}
                      </button>
                    ))}
                  </div>

                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={salaryDataInfo.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E3A8A" opacity={0.15} />
                      <XAxis dataKey="role" stroke="#9CA3AF" style={{ fontSize: '11px', fontWeight: 600 }} />
                      <YAxis stroke="#9CA3AF" style={{ fontSize: '11px', fontWeight: 600 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B1220',
                          border: '1px solid #22C55E',
                          borderRadius: '10px',
                          boxShadow: '0 0 15px rgba(34,197,94,0.15)'
                        }}
                        labelStyle={{ color: '#22C55E', fontWeight: 700 }}
                      />
                      <Bar key="bar-min" dataKey="min" fill="#1E3A8A" name="Min ($k)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                      <Bar key="bar-max" dataKey="max" fill="#22C55E" name="Max ($k)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-4 text-center text-[10px] text-gray-500 font-medium italic">
                    *Ranges are calculated with a regional index multiplier of {locationIndex.toFixed(2)}x.
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  {/* AI Market Pulse card */}
                  <div className="rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/10 border border-white/10 backdrop-blur-xl p-5 relative overflow-hidden flex-1">
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 bg-blue-500" />
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkle className="w-5 h-5 text-blue-400" />
                        <h4 className="text-white font-bold text-sm">AI Market Pulse</h4>
                      </div>
                      <Button
                        size="small"
                        onClick={handleRequestMarketPulse}
                        disabled={loadingPulse}
                        sx={{
                          textTransform: 'none',
                          fontSize: '11px',
                          color: '#22C55E',
                          fontWeight: 600,
                          backgroundColor: 'rgba(34,197,94,0.06)',
                          border: '1px solid rgba(34,197,94,0.15)',
                          borderRadius: '8px',
                          '&:hover': { backgroundColor: 'rgba(34,197,94,0.15)' }
                        }}
                      >
                        {loadingPulse ? 'Analyzing...' : 'Ask AI'}
                      </Button>
                    </div>

                    {loadingPulse ? (
                      <div className="space-y-2 py-4">
                        <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                        <div className="h-4 bg-white/5 rounded animate-pulse w-5/6" />
                        <div className="h-4 bg-white/5 rounded animate-pulse w-4/6" />
                      </div>
                    ) : (
                      <p className="text-xs text-gray-300 leading-relaxed font-medium">
                        "{marketPulseCommentary}"
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'b-1', label: 'Top-paying region', value: targetLocation.split(',')[0], sub: `${locationIndex >= 1.2 ? '+' + Math.round((locationIndex - 1.0) * 100) + '%' : '+0%'} premium`, accent: '#22C55E' },
                      { id: 'b-2', label: 'Hottest specialty', value: niche === 'cra' ? 'Oncology Operations' : niche === 'regulatory' ? 'CMC Dossier Strategy' : 'CAPA Validation', sub: '+34% YoY postings', accent: '#A855F7' },
                      { id: 'b-3', label: 'Equity-rich roles', value: 'Biotech Series B–D', sub: '0.05–0.5% typical', accent: '#F59E0B' },
                    ].map(b => (
                      <div key={b.id} className="rounded-2xl bg-[#111827]/70 border border-white/5 backdrop-blur-xl p-4 shadow-md">
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1 font-bold">{b.label}</div>
                        <div className="text-white font-bold text-md">{b.value}</div>
                        <div className="text-xs mt-0.5 font-semibold" style={{ color: b.accent }}>{b.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Skill Gap */}
            {activeTab === 'skills' && (
              <div className="grid lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/10 border border-white/10 backdrop-blur-xl p-6">
                  <h3 className="text-white font-bold text-lg mb-1">Target Skill Matching Radar</h3>
                  <p className="text-xs text-gray-400 mb-4">Competency mapping against key benchmarks for: {salaryDataInfo.target}</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={dynamicSkillRadar}>
                      <PolarGrid stroke="#1E3A8A" opacity={0.3} />
                      <PolarAngleAxis dataKey="skill" stroke="#9CA3AF" style={{ fontSize: '11px', fontWeight: 600 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9CA3AF" />
                      <Radar key="radar-current" name="Current Profile" dataKey="current" stroke="#22C55E" fill="#22C55E" fillOpacity={0.35} strokeWidth={2} isAnimationActive={false} />
                      <Radar key="radar-target" name="Benchmark Target" dataKey="target" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.12} strokeWidth={2} isAnimationActive={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #22C55E', borderRadius: 8 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  <div className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">Gap-Bridging Recommendations</div>
                  {[
                    { id: 'r-1', skill: niche === 'cra' ? 'Project Management' : niche === 'regulatory' ? 'EMA Guidelines' : 'GMP Auditing', progress: 65, action: niche === 'cra' ? 'PMP Study prep' : niche === 'regulatory' ? 'EU Dossier alignment' : 'cGMP Systems audit', accent: '#22C55E' },
                    { id: 'r-2', skill: niche === 'cra' ? 'Vendor Management' : niche === 'regulatory' ? 'CMC Dossier Prep' : 'CAPA Investigations', progress: 50, action: niche === 'cra' ? 'SLA oversight models' : niche === 'regulatory' ? 'Module 3 specifications' : 'Deviation root-cause', accent: '#F59E0B' },
                    { id: 'r-3', skill: niche === 'cra' ? 'Budgeting' : niche === 'regulatory' ? 'FDA Compliance' : 'SOP Writing', progress: 60, action: niche === 'cra' ? 'Finance metrics for PMs' : niche === 'regulatory' ? 'Part 11 controls' : 'Procedure drafting', accent: '#3B82F6' },
                  ].map(r => {
                    const present = userSkills.some(s => s.toLowerCase() === r.skill.toLowerCase());
                    return (
                      <div key={r.id} className="rounded-xl bg-[#111827]/70 border border-white/5 backdrop-blur-xl p-4 shadow-md transition-all hover:border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-white text-sm font-semibold">{r.skill}</div>
                          {present ? (
                            <span className="text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded">In CV</span>
                          ) : (
                            <button
                              onClick={() => handleInjectSkill(r.skill)}
                              className="text-[9px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded hover:bg-blue-500/25 transition-all"
                            >
                              + Inject Skill
                            </button>
                          )}
                        </div>
                        <LinearProgress variant="determinate" value={r.progress} sx={{
                          height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.06)',
                          '& .MuiLinearProgress-bar': { backgroundColor: r.accent }
                        }} />
                        
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                          <span className="text-[10px] text-gray-500 font-bold">{r.action}</span>
                          <button
                            onClick={() => handleStartStudyPlan(r.skill)}
                            className="text-xs font-bold text-[#22C55E] flex items-center gap-0.5 hover:underline"
                          >
                            Study Plan →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Library / Articles */}
            {activeTab === 'articles' && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {articles.map((a, idx) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setReadingArticleId(a.id)}
                    className="rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/10 border border-white/10 backdrop-blur-xl overflow-hidden cursor-pointer group shadow-lg"
                  >
                    <div className="h-32 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #0B1220, ${a.accent}35)` }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white/20 group-hover:scale-110 transition-transform group-hover:text-white/40" />
                      </div>
                      <Chip label={a.category} size="small" sx={{
                        position: 'absolute', top: 12, left: 12,
                        bgcolor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(8px)',
                        border: `1px solid ${a.accent}55`, fontSize: '9px', fontWeight: 600
                      }} />
                    </div>
                    <div className="p-5">
                      <h4 className="text-white font-bold mb-2 leading-snug group-hover:text-[#22C55E] transition-colors">{a.title}</h4>
                      <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed">{a.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gray-500" />{a.readTime}</div>
                        <span style={{ color: a.accent }} className="font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                          Read Full Article →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slide-Over drawers ───────────────────── */}

      {/* 1. Article Reader Drawer */}
      <Drawer
        anchor="right"
        open={readingArticleId !== null}
        onClose={() => setReadingArticleId(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '550px' },
            backgroundColor: '#0F172A',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {readingArticleId && (() => {
          const detail = ARTICLE_DETAILS[readingArticleId];
          const checks = detail?.checklist || [];
          const progress = articleProgress[readingArticleId] || [false, false, false, false];
          const checkedCount = progress.filter(Boolean).length;
          const readPct = checks.length > 0 ? Math.round((checkedCount / checks.length) * 100) : 0;

          return (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Cover Banner */}
              <div className="h-44 shrink-0 relative flex items-end p-6" style={{ background: `linear-gradient(180deg, rgba(15,23,42,0) 0%, #0F172A 100%), linear-gradient(135deg, #0B1220, ${detail?.accent}60)` }}>
                <button
                  onClick={() => setReadingArticleId(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/40 border border-white/10 hover:bg-black/60 flex items-center justify-center text-gray-300 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-black/40 text-white border" style={{ borderColor: `${detail?.accent}44` }}>
                    {detail?.category}
                  </span>
                  <h2 className="text-white font-bold text-xl mt-3 leading-tight">{detail?.title}</h2>
                  <p className="text-[11px] text-gray-400 mt-1 font-semibold">{detail?.subtitle}</p>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                <div className="text-sm text-gray-300 leading-relaxed space-y-4 font-medium">
                  {detail?.content.split('\n\n').map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                {/* Checklist segment */}
                <div className="border-t border-white/10 pt-5 mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-white font-bold text-sm">Strategic Operations Checklist</h4>
                      <p className="text-[10px] text-gray-500">Master the procedural steps discussed in the guide</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-[#22C55E]">{readPct}% done</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {checks.map((check, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleArticleCheck(readingArticleId, idx)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          progress[idx]
                            ? 'bg-[#22C55E]/5 border-[#22C55E]/20 text-[#22C55E]'
                            : 'bg-white/[0.02] border-white/5 text-gray-300 hover:border-white/10'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {progress[idx] ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-gray-500" />}
                        </div>
                        <span className="text-xs font-semibold leading-relaxed">{check}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom footer */}
              <div className="h-16 shrink-0 border-t border-white/5 bg-black/20 flex items-center justify-between px-6">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{detail?.readTime} guide</span>
                </div>
                <Button
                  onClick={() => setReadingArticleId(null)}
                  variant="contained"
                  sx={{
                    textTransform: 'none',
                    bgcolor: '#22C55E',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '10px',
                    px: 3,
                    '&:hover': { bgcolor: '#16A34A' }
                  }}
                >
                  Mark Completed
                </Button>
              </div>
            </div>
          );
        })()}
      </Drawer>

      {/* 2. Career Roadmap Drawer */}
      <Drawer
        anchor="right"
        open={roadmapPath !== null}
        onClose={() => setRoadmapPath(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '550px' },
            backgroundColor: '#0F172A',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {roadmapPath && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header section */}
            <div className="p-6 border-b border-white/10 shrink-0 relative bg-black/20">
              <button
                onClick={() => setRoadmapPath(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-2">
                <Compass className="w-4 h-4" />
                <span>Custom Roadmap Generator</span>
              </div>
              <h2 className="text-white font-bold text-xl leading-snug">{roadmapPath.title}</h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Transition plan architected based on active CV qualifications.</p>
              
              {/* Transition Progress */}
              {roadmapMilestones.length > 0 && (
                <div className="mt-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
                    <span className="text-gray-400">Transition Readiness</span>
                    <span className="text-[#22C55E]">{roadmapProgress}% Ready</span>
                  </div>
                  <LinearProgress variant="determinate" value={roadmapProgress} sx={{
                    height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.06)',
                    '& .MuiLinearProgress-bar': { backgroundColor: '#22C55E' }
                  }} />
                  <div className="text-[10px] text-gray-500 mt-1.5">Check off milestones tasks as you complete them in your professional operations.</div>
                </div>
              )}
            </div>

            {/* Scrollable roadmap stepper */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {loadingRoadmap ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-t-[#22C55E] border-white/5 animate-spin" />
                  <p className="text-xs text-gray-400 font-semibold tracking-wide animate-pulse">AI is architecting your custom roadmap milestones...</p>
                </div>
              ) : (
                <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8">
                  {roadmapMilestones.map((m, mIdx) => (
                    <div key={mIdx} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute left-[-33px] top-0 w-6 h-6 rounded-full bg-[#0F172A] border-2 border-[#22C55E] flex items-center justify-center text-[10px] font-bold text-[#22C55E] shadow-lg shadow-[#22C55E]/10">
                        {mIdx + 1}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-white font-bold text-sm leading-tight">{m.milestone}</h4>
                          <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/25 shrink-0 ml-2">
                            {m.timeframe}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3.5 leading-relaxed font-semibold">{m.details}</p>

                        {/* Task checklist */}
                        <div className="space-y-2">
                          {m.tasks.map((task, tIdx) => {
                            const tKey = `${mIdx}-${tIdx}`;
                            const isDone = !!checkedTasks[tKey];
                            return (
                              <div
                                key={tIdx}
                                onClick={() => toggleTask(tKey)}
                                className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                                  isDone
                                    ? 'bg-[#22C55E]/5 border-[#22C55E]/15 text-[#22C55E]'
                                    : 'bg-white/[0.01] border-white/5 text-gray-300 hover:border-white/10'
                                }`}
                              >
                                <div className="shrink-0 mt-0.5">
                                  {isDone ? <Check className="w-3.5 h-3.5 text-[#22C55E] stroke-[3]" /> : <div className="w-3.5 h-3.5 rounded border border-gray-600 shrink-0" />}
                                </div>
                                <span className="leading-relaxed font-semibold">{task}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stepper footer */}
            <div className="h-16 shrink-0 border-t border-white/5 bg-black/20 flex items-center justify-end px-6">
              <Button
                onClick={() => setRoadmapPath(null)}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: '#9CA3AF',
                  fontSize: '12px',
                  borderRadius: '10px',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.2)', color: 'white' }
                }}
              >
                Close Roadmap
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* 3. Skill Gap Study Planner Drawer */}
      <Drawer
        anchor="right"
        open={studyPlanSkill !== null}
        onClose={() => setStudyPlanSkill(null)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: '550px' },
            backgroundColor: '#0F172A',
            borderLeft: '1px solid rgba(255,255,255,0.08)',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        {studyPlanSkill && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header section */}
            <div className="p-6 border-b border-white/10 shrink-0 relative bg-black/20">
              <button
                onClick={() => setStudyPlanSkill(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-2">
                <Target className="w-4 h-4" />
                <span>AI Study Guide Planner</span>
              </div>
              <h2 className="text-white font-bold text-xl leading-snug">Syllabus: {studyPlanSkill}</h2>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">Week-by-week dynamic syllabus constructed to optimize CV technical skills.</p>

              {/* CV Inject Action */}
              <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                <span className="text-xs text-gray-300 font-semibold">Integrate this skill directly into your active CV skills tab:</span>
                <Button
                  size="small"
                  onClick={() => handleInjectSkill(studyPlanSkill)}
                  startIcon={<PlusCircle className="w-4 h-4" />}
                  sx={{
                    textTransform: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    bgcolor: 'rgba(59, 130, 246, 0.15)',
                    color: '#60A5FA',
                    border: '1px solid rgba(59, 130, 246, 0.25)',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.3)' }
                  }}
                >
                  Quick Inject
                </Button>
              </div>
            </div>

            {/* Syllabus Scroll content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {loadingStudyPlan ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 rounded-full border-4 border-t-[#22C55E] border-white/5 animate-spin" />
                  <p className="text-xs text-gray-400 font-semibold tracking-wide animate-pulse">AI is mapping out your week-by-week study syllabus...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {studyPlanSyllabus.map((week, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded">
                          {week.week}
                        </span>
                        <Lightbulb className="w-4 h-4 text-[#22C55E]" />
                      </div>
                      
                      <h4 className="text-white font-bold text-sm mb-1.5 leading-snug">{week.topic}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed mb-3.5 font-semibold">{week.details}</p>

                      <div className="space-y-2 border-t border-white/5 pt-3">
                        <div className="text-[9px] font-bold uppercase tracking-wider text-gray-500">Weekly Deliverables</div>
                        {week.deliverables.map((item, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2 text-[11px] text-gray-300">
                            <Check className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stepper footer */}
            <div className="h-16 shrink-0 border-t border-white/5 bg-black/20 flex items-center justify-end px-6">
              <Button
                onClick={() => setStudyPlanSkill(null)}
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: '#9CA3AF',
                  fontSize: '12px',
                  borderRadius: '10px',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.2)', color: 'white' }
                }}
              >
                Close Planner
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Global Guide Toast alert */}
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm p-4 rounded-xl border bg-[#1C3A27]/85 border-[#22C55E]/30 text-white backdrop-blur-xl shadow-2xl flex items-start gap-3"
          >
            <div className="p-1 rounded bg-[#22C55E]/20 text-[#22C55E] shrink-0 mt-0.5">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">CV Guide Update</div>
              <div className="text-xs font-semibold leading-relaxed mt-0.5">{localToast}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
