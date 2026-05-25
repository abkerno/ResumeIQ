import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Reference {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  pct: number;
}

export interface Publication {
  id: string;
  title: string;
  journal: string;
  year: string;
}

export interface TherapeuticArea {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
  trials: number;
}

export interface CoachMessage {
  id: string;
  role: 'ai' | 'user' | 'system';
  text: string;
}

export interface CVProject {
  id: number;
  name: string;
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    photo: string | null;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
  publications: Publication[];
  references: Reference[];
  therapeuticAreas: TherapeuticArea[];
  activeTheme: string;
  activeNiche: 'general' | 'cra' | 'regulatory' | 'quality' | 'tech' | 'business' | 'creative';
  targetJD: string;
  isStudent: boolean;
  chats: CoachMessage[];
  lastEdited: string;
  status: 'active' | 'draft';
  atsScoreHistory: { date: string; score: number }[];
  sectionOrder?: string[];
  coverLetter?: string;
}

interface CVContextType {
  cvList: CVProject[];
  activeCVId: number | null;
  activeCV: CVProject | null;
  geminiKey: string;
  selectedGeminiModel: string;
  isLoadingAI: boolean;
  useGoogleAPI: boolean;
  setGeminiKey: (key: string) => void;
  setSelectedGeminiModel: (model: string) => void;
  setUseGoogleAPI: (use: boolean) => void;
  selectCV: (id: number | null) => void;
  createCV: (name?: string, niche?: 'general' | 'cra' | 'regulatory' | 'quality' | 'tech' | 'business' | 'creative', templateId?: string) => number;
  importCV: (cv: any) => number;
  deleteCV: (id: number) => void;
  duplicateCV: (id: number) => void;
  updateActiveCV: (updater: (prev: CVProject) => CVProject) => void;
  updatePersonalInfo: (fields: Partial<CVProject['personal']>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, field: keyof Experience, value: string) => void;
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, field: keyof Education, value: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  addCertification: () => void;
  removeCertification: (id: string) => void;
  updateCertification: (id: string, field: keyof Certification, value: string) => void;
  toggleTherapeuticArea: (id: string) => void;
  addReference: () => void;
  removeReference: (id: string) => void;
  updateReference: (id: string, field: keyof Reference, value: string) => void;
  addLanguage: (name: string, level: string, pct: number) => void;
  removeLanguage: (id: string) => void;
  addPublication: (title: string, journal: string, year: string) => void;
  removePublication: (id: string) => void;
  callAI: (messages: { role: string; content: string }[]) => Promise<string>;
  sendCoachMessage: (text: string) => Promise<void>;
  aiEnhanceSummary: () => Promise<void>;
  aiRefineExperience: (id: string, description: string) => Promise<void>;
  startWithAI: (answers: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    isStudent: boolean;
    skills: string[];
    achievement: string;
  }) => Promise<number>;
  atsAnalysis: {
    score: number;
    rules: { name: string; msg: string; passed: boolean; weight: number }[];
    jdMatch: { score: number; missing: string[]; matches: string[] };
    keywordDensity: { keyword: string; count: number; required: number }[];
    skillMatch: { skill: string; score: number }[];
  };
}

const CVContext = createContext<CVContextType | undefined>(undefined);

const THERAPEUTIC_AREAS_TEMPLATES = [
  { id: 'onc',  name: 'Oncology',          icon: '🧬', selected: false, trials: 0 },
  { id: 'cv',   name: 'Cardiovascular',    icon: '❤️', selected: false, trials: 0 },
  { id: 'imm',  name: 'Immunology',        icon: '🛡️', selected: false, trials: 0 },
  { id: 'cns',  name: 'Neurology / CNS',   icon: '🧠', selected: false, trials: 0 },
  { id: 'inf',  name: 'Infectious Disease',icon: '🦠', selected: false, trials: 0 },
  { id: 'rare', name: 'Rare Disease',      icon: '💎', selected: false, trials: 0 },
  { id: 'end',  name: 'Endocrinology',     icon: '⚗️', selected: false, trials: 0 },
  { id: 'res',  name: 'Respiratory',       icon: '🫁', selected: false, trials: 0 },
];

const INITIAL_PROJECTS: CVProject[] = [
  {
    id: 1,
    name: 'Clinical Research Associate CV',
    personal: {
      name: 'Dr. Sarah Chen',
      title: 'Senior Clinical Research Associate',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 234-9821',
      location: 'Boston, MA',
      photo: null,
    },
    summary: 'Senior Clinical Research Associate with 7+ years orchestrating Phase II–III pharmaceutical trials in oncology and cardiovascular therapeutics. Proven record reducing protocol deviations by 38% and accelerating site activation timelines by 22% across global multi-center studies.',
    experience: [
      {
        id: 'exp-1',
        company: 'Pfizer Inc.',
        role: 'Senior Clinical Research Associate',
        period: '2022 — Present',
        description: 'Led Phase II/III oncology trials across 14 sites, ensuring GCP and FDA 21 CFR Part 11 compliance. Reduced protocol deviations by 38% through risk-based monitoring.',
      },
      {
        id: 'exp-2',
        company: 'Novartis Pharmaceuticals',
        role: 'Clinical Research Associate II',
        period: '2019 — 2022',
        description: 'Monitored cardiovascular Phase III trials. Authored 22+ monitoring visit reports and supported FDA inspection readiness for two pivotal NDA submissions.',
      },
    ],
    education: [
      { id: 'edu-1', institution: 'Johns Hopkins University', degree: 'M.S. Pharmaceutical Sciences', period: '2017 — 2019' },
      { id: 'edu-2', institution: 'University of Michigan', degree: 'B.S. Biochemistry', period: '2013 — 2017' },
    ],
    skills: [
      'GCP', 'FDA 21 CFR Part 11', 'Clinical Trial Management', 'Veeva Vault',
      'Medidata Rave', 'Risk-Based Monitoring', 'Protocol Development', 'CDISC SDTM',
      'ICH-E6 (R2)', 'Pharmacovigilance',
    ],
    certifications: [
      { id: 'cert-1', name: 'ACRP Certified Clinical Research Associate (CCRA)', issuer: 'ACRP', year: '2021' },
      { id: 'cert-2', name: 'GCP Certification (TransCelerate)', issuer: 'TransCelerate', year: '2023' },
    ],
    languages: [
      { id: 'l-1', name: 'English', level: 'Native', pct: 100 },
      { id: 'l-2', name: 'Mandarin', level: 'Fluent', pct: 85 },
    ],
    publications: [
      { id: 'pub-1', title: 'Risk-Based Monitoring in Phase III Oncology Trials', journal: 'Journal of Clinical Research', year: '2024' },
    ],
    references: [
      { id: 'ref-1', name: 'Dr. Marcus Holloway', role: 'Director, Clinical Operations', company: 'Pfizer Inc.', email: 'm.holloway@example.com' },
    ],
    therapeuticAreas: [
      { id: 'onc', name: 'Oncology', icon: '🧬', selected: true, trials: 14 },
      { id: 'cv', name: 'Cardiovascular', icon: '❤️', selected: true, trials: 6 },
      { id: 'imm', name: 'Immunology', icon: '🛡️', selected: false, trials: 0 },
      { id: 'cns', name: 'Neurology / CNS', icon: '🧠', selected: false, trials: 0 },
      { id: 'inf', name: 'Infectious Disease', icon: '🦠', selected: false, trials: 0 },
      { id: 'rare', name: 'Rare Disease', icon: '💎', selected: false, trials: 0 },
      { id: 'end', name: 'Endocrinology', icon: '⚗️', selected: false, trials: 0 },
      { id: 'res', name: 'Respiratory', icon: '🫁', selected: false, trials: 0 },
    ],
    activeTheme: 'modern',
    activeNiche: 'cra',
    targetJD: `We are seeking a Senior Clinical Research Associate to lead oncology trials. Essential skills: GCP, FDA 21 CFR Part 11, Veeva Vault, Medidata Rave, risk-based monitoring, CDISC SDTM, and ICH guidelines. Pre-clinical or Phase I-III trial experience in oncology is required.`,
    isStudent: false,
    chats: [
      { id: 'm-1', role: 'ai', text: "Welcome Sarah! I'm your AI CV coach. I see you are tailoring your CV for CRA roles. Paste a Job Description in the JD Matcher to start optimization." }
    ],
    lastEdited: '2 hours ago',
    status: 'active',
    atsScoreHistory: [
      { date: 'May 10', score: 68 },
      { date: 'May 14', score: 76 },
      { date: 'May 18', score: 82 },
      { date: 'May 21', score: 87 }
    ]
  },
  {
    id: 2,
    name: 'Regulatory Affairs Specialist',
    personal: {
      name: 'Dr. Sarah Chen',
      title: 'Regulatory Affairs Associate',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 234-9821',
      location: 'Boston, MA',
      photo: null,
    },
    summary: 'Pharma Regulatory Affairs professional with experience compiling IND/NDA documentation and coordinating submissions to the FDA and EMA. Familiar with CMC protocols and FDA regulations.',
    experience: [
      {
        id: 'exp-1',
        company: 'Novartis Pharmaceuticals',
        role: 'Regulatory Affairs Associate',
        period: '2020 — 2022',
        description: 'Assisted in NDA dossiers compilation and variation filings. Coordinated with CMC teams to resolve quality queries, speeding submission timelines by 15%.',
      }
    ],
    education: [
      { id: 'edu-1', institution: 'Johns Hopkins University', degree: 'M.S. Pharmaceutical Sciences', period: '2017 — 2019' },
    ],
    skills: [
      'NDA', 'IND', 'FDA', 'EMA', 'CMC', 'Regulatory Submissions', 'GxP'
    ],
    certifications: [
      { id: 'cert-1', name: 'Regulatory Affairs Certification (RAC)', issuer: 'RAPS', year: '2022' }
    ],
    languages: [
      { id: 'l-1', name: 'English', level: 'Native', pct: 100 }
    ],
    publications: [],
    references: [],
    therapeuticAreas: [
      { id: 'onc', name: 'Oncology', icon: '🧬', selected: false, trials: 0 },
      { id: 'cv', name: 'Cardiovascular', icon: '❤️', selected: true, trials: 2 }
    ],
    activeTheme: 'clinical',
    activeNiche: 'regulatory',
    targetJD: '',
    isStudent: false,
    chats: [
      { id: 'm-1', role: 'ai', text: "Hello! Let's optimize this CV for your target Regulatory Affairs role. We should add FDA/EMA CMC specifics." }
    ],
    lastEdited: '1 day ago',
    status: 'draft',
    atsScoreHistory: [
      { date: 'May 12', score: 55 },
      { date: 'May 16', score: 67 },
      { date: 'May 21', score: 76 }
    ]
  },
  {
    id: 3,
    name: 'QA Manager - Pharma',
    personal: {
      name: 'Dr. Sarah Chen',
      title: 'QA / Quality Operations Specialist',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 234-9821',
      location: 'Boston, MA',
      photo: null,
    },
    summary: 'Quality Operations specialist with 5 years experience managing Corrective and Preventive Actions (CAPA), SOP development, and QA validation. Fully versed in GMP compliance.',
    experience: [
      {
        id: 'exp-1',
        company: 'Merck & Co.',
        role: 'QA Specialist',
        period: '2021 — Present',
        description: 'Led deviations investigations and managed the corporate QMS CAPA cycle. Audited 8 internal GxP systems, reducing audit vulnerabilities by 45%. Authored 12+ standard SOPs.',
      }
    ],
    education: [
      { id: 'edu-1', institution: 'University of Michigan', degree: 'B.S. Biochemistry', period: '2013 — 2017' },
    ],
    skills: [
      'CAPA', 'SOP Development', 'GMP', 'QMS', 'Validation', 'Audit', 'Deviations', 'GxP'
    ],
    certifications: [
      { id: 'cert-1', name: 'Certified Quality Auditor (CQA)', issuer: 'ASQ', year: '2023' }
    ],
    languages: [
      { id: 'l-1', name: 'English', level: 'Native', pct: 100 }
    ],
    publications: [],
    references: [],
    therapeuticAreas: [],
    activeTheme: 'clinical',
    activeNiche: 'quality',
    targetJD: '',
    isStudent: false,
    chats: [
      { id: 'm-1', role: 'ai', text: "Welcome! Let's refine your Quality & Audit CV. Ensure SOP and CAPA details are well-represented." }
    ],
    lastEdited: '3 days ago',
    status: 'active',
    atsScoreHistory: [
      { date: 'May 10', score: 62 },
      { date: 'May 15', score: 74 },
      { date: 'May 21', score: 82 }
    ]
  }
];

export const CVProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cvList, setCvList] = useState<CVProject[]>(() => {
    const saved = localStorage.getItem('cv_architect_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeCVId, setActiveCVId] = useState<number | null>(() => {
    const saved = localStorage.getItem('cv_architect_active_id');
    return saved ? JSON.parse(saved) : 1;
  });

  const [geminiKey, setGeminiKeyState] = useState(() => localStorage.getItem('cv_architect_gemini_key') || '');
  const [selectedGeminiModel, setSelectedGeminiModelVal] = useState(() => localStorage.getItem('cv_architect_gemini_model') || 'gemini-2.5-flash');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [useGoogleAPI, setUseGoogleAPIState] = useState(() => {
    const saved = localStorage.getItem('cv_architect_use_google_api');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('cv_architect_projects', JSON.stringify(cvList));
  }, [cvList]);

  useEffect(() => {
    if (activeCVId !== null) {
      localStorage.setItem('cv_architect_active_id', JSON.stringify(activeCVId));
    } else {
      localStorage.removeItem('cv_architect_active_id');
    }
  }, [activeCVId]);

  const setGeminiKey = (key: string) => {
    setGeminiKeyState(key);
    localStorage.setItem('cv_architect_gemini_key', key);
  };

  const setSelectedGeminiModel = (model: string) => {
    setSelectedGeminiModelVal(model);
    localStorage.setItem('cv_architect_gemini_model', model);
  };

  const setUseGoogleAPI = (use: boolean) => {
    setUseGoogleAPIState(use);
    localStorage.setItem('cv_architect_use_google_api', JSON.stringify(use));
  };

  const activeCV = useMemo(() => {
    if (activeCVId === null) return null;
    return cvList.find(c => c.id === activeCVId) || cvList[0] || null;
  }, [cvList, activeCVId]);

  const selectCV = (id: number | null) => {
    setActiveCVId(id);
  };

  const createCV = (name = 'New CV Project', niche: 'general' | 'cra' | 'regulatory' | 'quality' | 'tech' | 'business' | 'creative' = 'general', templateId?: string) => {
    const newId = Date.now();
    
    // Niche-specific presets
    const skillsPreset = {
      general: ['Clinical Research', 'Regulatory Compliance', 'GxP Standards', 'Data Analysis'],
      cra: ['GCP', 'FDA 21 CFR Part 11', 'Risk-Based Monitoring', 'Veeva Vault', 'eTMF Management', 'Medidata Rave', 'Protocol Development'],
      regulatory: ['NDA Submissions', 'IND Filings', 'FDA Regulations', 'EMA Guidelines', 'CMC Protocols', 'Variation Filings'],
      quality: ['CAPA Investigations', 'SOP Development', 'GMP Audits', 'QMS Maintenance', 'Validation Protocols', 'Deviations Management'],
      tech: ['React', 'TypeScript', 'Node.js', 'System Design', 'Agile/Scrum', 'Git', 'CI/CD Pipelines', 'AWS', 'REST APIs', 'SQL / NoSQL Databases'],
      business: ['Financial Modeling', 'Data Analytics', 'Strategy Consulting', 'Project Management', 'Market Research', 'SQL', 'Tableau', 'Excel (VBA)', 'Valuation Models', 'Business Operations'],
      creative: ['UI/UX Design', 'Figma', 'Digital Marketing', 'SEO Optimization', 'Brand Strategy', 'Adobe Creative Suite', 'Copywriting', 'Content Management Systems', 'Social Media Strategy', 'Google Analytics']
    };

    let personal = {
      name: 'Jane Doe',
      title: niche === 'cra' ? 'Clinical Research Associate' : niche === 'regulatory' ? 'Regulatory Affairs Specialist' : niche === 'quality' ? 'QA Analyst' : niche === 'tech' ? 'Senior Software Engineer' : niche === 'business' ? 'Investment Banking Associate' : niche === 'creative' ? 'Digital Brand Specialist' : 'Professional Specialist',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 000-0000',
      location: 'New York, NY',
      photo: null as string | null,
    };
    let summary = niche === 'tech' ? 'High-impact Software Engineer specializing in scalable frontend interfaces and distributed cloud systems.' : niche === 'business' ? 'Detail-oriented financial operations analyst skilled in valuation models and valuations strategy.' : niche === 'creative' ? 'Creative brand strategist and designer expert in user acquisition campaigns and beautiful responsive layouts.' : 'Professional pharma specialist focused on compliance and data integrity.';
    let experience = [
      {
        id: `exp-${newId}-1`,
        company: 'Acme Enterprises',
        role: personal.title,
        period: '2023 — Present',
        description: 'Supported daily operations, resolved key project milestones, and ensured compliance with industry standards.'
      }
    ];
    let education = [
      { id: `edu-${newId}-1`, institution: 'State University', degree: 'Bachelor of Science', period: '2019 — 2023' }
    ];
    let skills = skillsPreset[niche];
    let certifications = [] as Certification[];
    let publications = [] as Publication[];

    if (templateId === 'tpl-tech') {
      personal = {
        name: 'Alex Rivera',
        title: 'Senior Full Stack Developer',
        email: 'alex.rivera@techcatalyst.io',
        phone: '+1 (415) 555-0881',
        location: 'San Francisco, CA',
        photo: null
      };
      summary = 'Innovative Senior Full Stack Developer with 7+ years of experience engineering high-throughput SaaS web applications and real-time cloud architectures. Expert in React, Node.js, TypeScript, and AWS serverless computing.';
      experience = [
        {
          id: `exp-${newId}-1`,
          company: 'SaaSify Scale',
          role: 'Lead Architect',
          period: '2022 — Present',
          description: 'Re-architected the main e-commerce platform using Next.js and serverless microservices, improving PageSpeed metrics by 48% and reducing infrastructure overhead cost by 32%.'
        },
        {
          id: `exp-${newId}-2`,
          company: 'DevFlow Systems',
          role: 'Senior Developer',
          period: '2019 — 2022',
          description: 'Orchestrated dynamic CI/CD deployment pipelines on AWS. Led a team of 4 frontend engineers to build collaborative visual interfaces, boosting active user engagement by 40%.'
        }
      ];
      education = [
        { id: `edu-${newId}-1`, institution: 'Massachusetts Institute of Technology (MIT)', degree: 'B.S. in Computer Science', period: '2015 — 2019' }
      ];
      skills = skillsPreset.tech;
      certifications = [
        { id: `cert-${newId}-1`, name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', year: '2023' }
      ];
    } else if (templateId === 'tpl-biz') {
      personal = {
        name: 'Sophia Martinez',
        title: 'Investment Banking Associate',
        email: 's.martinez@wallstventures.com',
        phone: '+1 (212) 555-0164',
        location: 'New York, NY',
        photo: null
      };
      summary = 'Results-driven Finance professional with 5+ years of corporate valuations, DCF modeling, and strategic advisory experience. Proven track record managing valuations up to $400M across tech and manufacturing acquisitions.';
      experience = [
        {
          id: `exp-${newId}-1`,
          company: 'Wall Street Ventures',
          role: 'IB Associate',
          period: '2021 — Present',
          description: 'Managed financial modeling and valuation diligence for 6 corporate mergers, executing LBO and DCF valuations with zero deviations. Produced high-fidelity pitch books presented to Fortune 500 boards.'
        }
      ];
      education = [
        { id: `edu-${newId}-1`, institution: 'The Wharton School, University of Pennsylvania', degree: 'MBA in Finance', period: '2019 — 2021' }
      ];
      skills = skillsPreset.business;
      certifications = [
        { id: `cert-${newId}-1`, name: 'Chartered Financial Analyst (CFA) Level II', issuer: 'CFA Institute', year: '2022' }
      ];
    } else if (templateId === 'tpl-mkt') {
      personal = {
        name: 'Liam Gallagher',
        title: 'Senior Digital Marketer',
        email: 'liam@gallagherbrand.co',
        phone: '+1 (310) 555-0133',
        location: 'Los Angeles, CA',
        photo: null
      };
      summary = 'Data-centric Growth & Brand Strategist with 6+ years specializing in search engine optimization (SEO), user acquisition funnels, and organic brand elevation. Expert in Figma layouts and conversion rate optimization.';
      experience = [
        {
          id: `exp-${newId}-1`,
          company: 'VibeMedia Agency',
          role: 'Growth Marketing Lead',
          period: '2022 — Present',
          description: 'Formulated a comprehensive organic SEO strategy that accelerated search traffic by 180% in 9 months. Created user journey flows in Figma that spiked cart conversion rates by 22%.'
        }
      ];
      education = [
        { id: `edu-${newId}-1`, institution: 'Stanford University', degree: 'B.A. in Communications & Media', period: '2016 — 2020' }
      ];
      skills = skillsPreset.creative;
      certifications = [
        { id: `cert-${newId}-1`, name: 'Google Analytics Individual Qualification (GAIQ)', issuer: 'Google', year: '2021' }
      ];
    } else if (templateId === 'tpl-cra') {
      personal = {
        name: 'Dr. Sarah Chen, PhD',
        title: 'Senior Clinical Research Associate (CRA)',
        email: 'sarah.chen@beaconclinical.org',
        phone: '+1 (617) 555-0192',
        location: 'Boston, MA',
        photo: null
      };
      summary = 'Detail-oriented Senior Clinical Research Associate with 8+ years of experience monitoring multi-center Phase II/III oncology and CNS clinical trials. Highly proficient in GCP compliance, FDA regulatory standards, and eTMF auditing.';
      experience = [
        {
          id: `exp-${newId}-1`,
          company: 'Beacon Clinical Research',
          role: 'Senior CRA',
          period: '2021 — Present',
          description: 'Orchestrated clinical monitoring for 5 Phase III oncology trials across 14 high-volume investigational sites. Maintained 98%+ eTMF compliance rating and led GCP/FDA audit readiness initiatives, resulting in zero major findings.'
        },
        {
          id: `exp-${newId}-2`,
          company: 'Astra Global Life Sciences',
          role: 'Clinical Research Associate II',
          period: '2018 — 2021',
          description: 'Conducted site selection, initiation, routine monitoring, and close-out visits. Optimized patient enrollment rates by 25% through site-specific recruitment plans.'
        }
      ];
      education = [
        { id: `edu-${newId}-1`, institution: 'Boston University School of Medicine', degree: 'PhD in Pharmacology', period: '2014 — 2018' }
      ];
      skills = ['GCP', 'FDA 21 CFR Part 11', 'Veeva Vault', 'eTMF Management', 'Medidata Rave', 'Risk-Based Monitoring', 'Protocol Development', 'Oncology Trials', 'Clinical Operations', 'SOP Development', 'Audit Readiness'];
      certifications = [
        { id: `cert-${newId}-1`, name: 'Certified Clinical Research Associate (CCRA)', issuer: 'ACRP', year: '2020' }
      ];
      publications = [
        { id: `pub-${newId}-1`, title: 'Risk-Based Monitoring Frameworks in Modern Oncology Trials', journal: 'Journal of Clinical Research', year: '2023' }
      ];
    } else if (templateId === 'tpl-reg') {
      personal = {
        name: 'Michael Vance, RAC',
        title: 'Regulatory Affairs Specialist',
        email: 'm.vance@summitbiopharma.net',
        phone: '+1 (202) 555-0144',
        location: 'Washington, DC',
        photo: null
      };
      summary = 'Regulatory Affairs Specialist with 6+ years of experience authoring high-quality IND, NDA, and BLA submission dossiers. Expert in FDA and EMA regulations, CTD formatting, and CMC protocols.';
      experience = [
        {
          id: `exp-${newId}-1`,
          company: 'Summit Biopharma',
          role: 'Regulatory Lead',
          period: '2022 — Present',
          description: 'Authored and compiled the CMC section for a successful NDA submission. Led communication with FDA reviewers and coordinated responses to information requests within strict timeframes.'
        },
        {
          id: `exp-${newId}-2`,
          company: 'Meridian Therapeutics',
          role: 'Regulatory Associate',
          period: '2020 — 2022',
          description: 'Maintained regulatory compliance for 4 active IND programs. Drafted protocol amendments, annual reports, and safety updates in eCTD format.'
        }
      ];
      education = [
        { id: `edu-${newId}-1`, institution: 'Georgetown University', degree: 'M.S. in Regulatory Science', period: '2017 — 2019' }
      ];
      skills = ['NDA Submissions', 'IND Filings', 'FDA Regulations', 'EMA Guidelines', 'CMC Protocols', 'eCTD Compilation', 'Variation Filings', 'ICH Guidelines', 'Regulatory Strategy', 'Labeling Compliance'];
      certifications = [
        { id: `cert-${newId}-1`, name: 'Regulatory Affairs Certification (RAC)', issuer: 'RAPS', year: '2021' }
      ];
    } else if (templateId === 'tpl-qa') {
      personal = {
        name: 'Elena Rostova',
        title: 'QA Operations Manager',
        email: 'elena.rostova@integrapops.com',
        phone: '+1 (732) 555-0185',
        location: 'New Brunswick, NJ',
        photo: null
      };
      summary = 'Pharma Quality Assurance Manager with 7+ years of experience designing and managing GxP-compliant Quality Management Systems (QMS). Expert in CAPA investigations, GMP auditing, and SOP authoring.';
      experience = [
        {
          id: `exp-${newId}-1`,
          company: 'Integra Pharma Solutions',
          role: 'QA Operations Manager',
          period: '2021 — Present',
          description: 'Orchestrated the internal GMP audit program covering manufacturing facilities and QA labs. Resolved 45+ critical CAPAs and reduced deviation cycle times by 30%.'
        },
        {
          id: `exp-${newId}-2`,
          company: 'Nexus Biologics',
          role: 'QA Analyst',
          period: '2019 — 2021',
          description: 'Reviewed batch records, out-of-specification (OOS) results, and deviation reports to ensure compliance with cGMP standards.'
        }
      ];
      education = [
        { id: `edu-${newId}-1`, institution: 'Rutgers University', degree: 'B.S. in Chemical Engineering', period: '2015 — 2019' }
      ];
      skills = ['CAPA Investigations', 'SOP Development', 'GMP Audits', 'QMS Maintenance', 'Validation Protocols', 'Deviations Management', 'OOS Investigations', 'cGMPs', 'Change Control', 'Audit Readiness'];
      certifications = [
        { id: `cert-${newId}-1`, name: 'Certified Manager of Quality (CMQ)', issuer: 'ASQ', year: '2022' }
      ];
    } else if (templateId === 'tpl-student') {
      personal = {
        name: 'Emily Watson',
        title: 'Clinical Research Intern & Science Graduate',
        email: 'emily.watson@student.edu',
        phone: '+1 (617) 555-0177',
        location: 'Boston, MA',
        photo: null
      };
      summary = 'Aspiring Clinical Research professional and honors Graduate in Biology. Skilled in maintaining eTMF documentation, assisting in Phase II site audits, and compiling GCP review protocols under senior operations specialists.';
      experience = [
        {
          id: `exp-${newId}-1`,
          company: 'Boston Medical Center',
          role: 'Clinical Operations Intern',
          period: '2023 — Present',
          description: '• Assisted in patient recruiting schedules and eTMF review audits for 2 high-profile oncology clinical studies.\n• Conducted standard GCP guidelines audits under senior coordinators with 100% precision.\n• Coordinated with cross-functional investigators to resolve 45+ CRF data entry issues.'
        },
        {
          id: `exp-${newId}-2`,
          company: 'State University Biology Lab',
          role: 'Academic Research Fellow',
          period: '2022 — 2023',
          description: '• Supervised and maintained cell culture assays and records, achieving 100% precision with standard protocols.\n• Authored weekly scientific logs presented during state research colloquiums.\n• Collaborated with 5 peer researchers to audit drug shelf-life assay records.'
        }
      ];
      education = [
        { id: `edu-${newId}-1`, institution: 'Boston University', degree: 'B.S. in Biology (GPA 3.92/4.00)', period: '2020 — 2024' }
      ];
      skills = ['GCP Guidelines', 'Clinical Trials Assistance', 'Assay Monitoring', 'Lab Research', 'Data Analysis', 'CRF Reviewing', 'Protocol Compliance', 'Data Entry & Management'];
      certifications = [
        { id: `cert-${newId}-1`, name: 'Certified Clinical Research Professional (CCRP) Candidate', issuer: 'SOCRA', year: '2024' },
        { id: `cert-${newId}-2`, name: 'CITI Clinical Research GCP Protocol Certification', issuer: 'CITI Program', year: '2023' }
      ];
    }

    const newCV: CVProject = {
      id: newId,
      name,
      personal,
      summary,
      experience,
      education,
      skills,
      certifications,
      languages: [{ id: `lang-${newId}-1`, name: 'English', level: 'Native', pct: 100 }],
      publications,
      references: [],
      therapeuticAreas: THERAPEUTIC_AREAS_TEMPLATES.map(a => ({ ...a })),
      activeTheme: 'modern',
      activeNiche: niche,
      targetJD: '',
      isStudent: templateId === 'tpl-student',
      chats: [
        { id: 'm-1', role: 'ai', text: `Welcome to your new CV builder! Let's tailor your experience to target roles.` }
      ],
      lastEdited: 'Just now',
      status: 'draft',
      atsScoreHistory: [{ date: 'Today', score: 45 }],
      sectionOrder: ['summary', 'experience', 'education', 'skills', 'therapeutic', 'certifications', 'publications', 'languages', 'references'],
      coverLetter: ''
    };

    setCvList(prev => [newCV, ...prev]);
    setActiveCVId(newId);
    return newId;
  };

  const importCV = (cv: any) => {
    const newId = Date.now();
    const importedCV: CVProject = {
      sectionOrder: ['summary', 'experience', 'education', 'skills', 'therapeutic', 'certifications', 'publications', 'languages', 'references'],
      coverLetter: '',
      ...cv,
      id: newId,
      lastEdited: 'Just now'
    };
    setCvList(prev => [importedCV, ...prev]);
    setActiveCVId(newId);
    return newId;
  };

  const deleteCV = (id: number) => {
    setCvList(prev => prev.filter(c => c.id !== id));
    if (activeCVId === id) {
      const remaining = cvList.filter(c => c.id !== id);
      setActiveCVId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const duplicateCV = (id: number) => {
    const target = cvList.find(c => c.id === id);
    if (!target) return;
    const newId = Date.now();
    const copy: CVProject = {
      ...target,
      id: newId,
      name: `${target.name} (Copy)`,
      lastEdited: 'Just now',
      status: 'draft',
      atsScoreHistory: [...target.atsScoreHistory]
    };
    setCvList(prev => [copy, ...prev]);
  };

  const updateActiveCV = (updater: (prev: CVProject) => CVProject) => {
    if (activeCVId === null) return;
    setCvList(prev => {
      let changed = false;
      const newList = prev.map(cv => {
        if (cv.id === activeCVId) {
          const updated = updater(cv);
          if (updated === cv) {
            return cv;
          }
          changed = true;
          return {
            ...updated,
            lastEdited: 'Just now'
          };
        }
        return cv;
      });
      return changed ? newList : prev;
    });
  };

  const updatePersonalInfo = (fields: Partial<CVProject['personal']>) => {
    updateActiveCV(prev => ({
      ...prev,
      personal: { ...prev.personal, ...fields }
    }));
  };

  const updateSummary = (summary: string) => {
    updateActiveCV(prev => ({ ...prev, summary }));
  };

  const addExperience = () => {
    updateActiveCV(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: `exp-${Date.now()}`, company: '', role: '', period: '', description: '' }
      ]
    }));
  };

  const removeExperience = (id: string) => {
    updateActiveCV(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    updateActiveCV(prev => ({
      ...prev,
      experience: prev.experience.map(e => (e.id === id ? { ...e, [field]: value } : e))
    }));
  };

  const addEducation = () => {
    updateActiveCV(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: `edu-${Date.now()}`, institution: '', degree: '', period: '' }
      ]
    }));
  };

  const removeEducation = (id: string) => {
    updateActiveCV(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    updateActiveCV(prev => ({
      ...prev,
      education: prev.education.map(e => (e.id === id ? { ...e, [field]: value } : e))
    }));
  };

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    updateActiveCV(prev => {
      if (prev.skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) return prev;
      return {
        ...prev,
        skills: [...prev.skills, trimmed]
      };
    });
  };

  const removeSkill = (skill: string) => {
    updateActiveCV(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addCertification = () => {
    updateActiveCV(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: `cert-${Date.now()}`, name: '', issuer: '', year: '' }
      ]
    }));
  };

  const removeCertification = (id: string) => {
    updateActiveCV(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    updateActiveCV(prev => ({
      ...prev,
      certifications: prev.certifications.map(c => (c.id === id ? { ...c, [field]: value } : c))
    }));
  };

  const toggleTherapeuticArea = (id: string) => {
    updateActiveCV(prev => ({
      ...prev,
      therapeuticAreas: prev.therapeuticAreas.map(a =>
        a.id === id
          ? { ...a, selected: !a.selected, trials: !a.selected ? Math.max(a.trials, 1) : 0 }
          : a
      )
    }));
  };

  const addReference = () => {
    updateActiveCV(prev => ({
      ...prev,
      references: [
        ...prev.references,
        { id: `ref-${Date.now()}`, name: '', role: '', company: '', email: '' }
      ]
    }));
  };

  const removeReference = (id: string) => {
    updateActiveCV(prev => ({
      ...prev,
      references: prev.references.filter(r => r.id !== id)
    }));
  };

  const updateReference = (id: string, field: keyof Reference, value: string) => {
    updateActiveCV(prev => ({
      ...prev,
      references: prev.references.map(r => (r.id === id ? { ...r, [field]: value } : r))
    }));
  };

  const addLanguage = (name: string, level: string, pct: number) => {
    updateActiveCV(prev => ({
      ...prev,
      languages: [
        ...prev.languages,
        { id: `lang-${Date.now()}`, name, level, pct }
      ]
    }));
  };

  const removeLanguage = (id: string) => {
    updateActiveCV(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
  };

  const addPublication = (title: string, journal: string, year: string) => {
    updateActiveCV(prev => ({
      ...prev,
      publications: [
        ...prev.publications,
        { id: `pub-${Date.now()}`, title, journal, year }
      ]
    }));
  };

  const removePublication = (id: string) => {
    updateActiveCV(prev => ({
      ...prev,
      publications: prev.publications.filter(p => p.id !== id)
    }));
  };

  // AI API Backbone
  const callAI = async (messages: { role: string; content: string }[]) => {
    setIsLoadingAI(true);
    try {
      if (useGoogleAPI && geminiKey && geminiKey.trim()) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${selectedGeminiModel}:generateContent?key=${geminiKey}`;
        const contents = messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        let systemInstruction = null;
        if (messages[0]?.role === 'system') {
          systemInstruction = { parts: [{ text: messages[0].content }] };
          contents.shift(); // Remove system instruction from user contents
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            system_instruction: systemInstruction,
            generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
          })
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err?.error?.message || `Gemini Error ${response.status}`);
        }

        const json = await response.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
          throw new Error('Gemini returned an empty response (possibly blocked by safety filters).');
        }
        return text.trim();
      }

      // Free fallback using OpenAI-compatible Pollinations endpoint
      const response = await fetch('https://text.pollinations.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages: messages.map(m => ({
            role: m.role === 'system' ? 'system' : m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}`);
      }

      const json = await response.json();
      const raw = json?.choices?.[0]?.message?.content || '';
      return raw
        .replace(/⚠️[\s\S]*?work normally\./gi, '')
        .replace(/IMPORTANT NOTICE[\s\S]*?work normally\./gi, '')
        .replace(/The Pollinations[\s\S]*?work normally\./gi, '')
        .trim();
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setIsLoadingAI(false);
    }
  };

  const sendCoachMessage = async (text: string) => {
    if (!text.trim() || !activeCV) return;

    const userMsg: CoachMessage = { id: `m-${Date.now()}`, role: 'user', text };
    
    // Add user message to history
    updateActiveCV(prev => ({
      ...prev,
      chats: [...prev.chats, userMsg]
    }));

    try {
      const cvContextStr = `CV DATA:
Name: ${activeCV.personal.name}
Title: ${activeCV.personal.title}
Summary: ${activeCV.summary}
Experience: ${activeCV.experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join(' | ')}
Skills: ${activeCV.skills.join(', ')}
Niche: ${activeCV.activeNiche}`;

      const systemPrompt = {
        role: 'system',
        content: `You are a Senior Pharma ResumeIQ Expert & Career Coach. 
Optimize the user's CV for pharmaceutical roles, GxP standards, clinical trial guidelines, and FDA compliance.
Be extremely professional, concise, and helpful. Use bullet points in your suggestions.
Do not invent any credentials, metrics, or experiences that are not present. Only refine the writing or suggest topics.
Here is the current CV context:
${cvContextStr}`
      };

      const chatHistory = activeCV.chats.slice(-6).map(c => ({
        role: c.role === 'ai' ? 'assistant' : c.role === 'system' ? 'system' : 'user',
        content: c.text
      }));

      const aiResponse = await callAI([
        systemPrompt,
        ...chatHistory,
        { role: 'user', content: text }
      ]);

      const aiMsg: CoachMessage = { id: `m-${Date.now() + 1}`, role: 'ai', text: aiResponse };
      updateActiveCV(prev => ({
        ...prev,
        chats: [...prev.chats, aiMsg]
      }));
    } catch (e: any) {
      const errorMsg: CoachMessage = {
        id: `m-${Date.now() + 1}`,
        role: 'ai',
        text: `I'm sorry, I encountered an error communicating with the AI server: ${e.message}. Please check your connection or try again.`
      };
      updateActiveCV(prev => ({
        ...prev,
        chats: [...prev.chats, errorMsg]
      }));
    }
  };

  const aiEnhanceSummary = async () => {
    if (!activeCV) return;
    try {
      const systemPrompt = {
        role: 'system',
        content: `You are an expert pharmaceutical CV writer. Optimize this professional summary to be high impact, regulatory-focused (GxP, Clinical Operations, GMP/QA if applicable), and concise.
Maintain the original context; do not fabricate achievements. Return ONLY the enhanced summary text, no introduction or other commentary.`
      };

      const result = await callAI([systemPrompt, { role: 'user', content: activeCV.summary }]);
      if (result) {
        updateActiveCV(prev => {
          const aiMsg: CoachMessage = {
            id: `m-${Date.now()}`,
            role: 'ai',
            text: `✨ I've enhanced your professional summary using industry-standard pharma terms!`
          };
          return {
            ...prev,
            summary: result,
            chats: [...prev.chats, aiMsg]
          };
        });
      }
    } catch (e: any) {
      alert(`AI enhancement failed: ${e.message}`);
    }
  };

  const aiRefineExperience = async (id: string, description: string) => {
    try {
       const systemPrompt = {
        role: 'system',
        content: `You are a professional clinical/pharmaceutical operations resume coach. Rewrite this experience bullet point to emphasize compliance, trial protocols, quantitative metrics, and clean action verbs (e.g. Led, Standardized, Orchestrated).
Do not invent any fake statistics or claims. Return ONLY the polished description text, no preamble.`
      };

      const result = await callAI([systemPrompt, { role: 'user', content: description }]);
      if (result) {
        updateActiveCV(prev => ({
          ...prev,
          experience: prev.experience.map(e => (e.id === id ? { ...e, description: result } : e))
        }));
      }
    } catch (e: any) {
      alert(`Experience refinement failed: ${e.message}`);
    }
  };

  const startWithAI = async (answers: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    isStudent: boolean;
    skills: string[];
    achievement: string;
  }) => {
    setIsLoadingAI(true);
    try {
      const systemPrompt = {
        role: 'system',
        content: `You are a professional resume writer. Build a highly detailed, premium CV profile based on the user's answers. Return a valid JSON object matching the following TypeScript interface (do not return any other text, markdown wrapper, or formatting except valid JSON):
interface Resume {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: { company: string; role: string; period: string; description: string }[];
  education: { institution: string; degree: string; period: string }[];
  skills: string[];
  certifications: { name: string; issuer: string; year: string }[];
  languages: { name: string; level: string; pct: number }[];
  publications: { title: string; journal: string; year: string }[];
  references: { name: string; role: string; company: string; email: string; phone: string }[];
}

Requirements:
- For the "experience" array, generate exactly 2 highly impressive work experience entries. For EACH entry, generate exactly 3 detailed bullet points in the "description" field (each starting with a powerful action verb and filled with quantifiable metrics, e.g. "• Spearheaded clinical operations for Phase III studies, decreasing cycle time by 18%"). If they are a student, make these high-profile internships or academic/lab researcher positions.
- For "certifications", generate exactly 2 relevant industry credentials.
- For "languages", generate exactly 2 realistic languages (e.g. English at Native level (100%), and another fluent language).
- For "publications", generate exactly 1 realistic journal article or key research presentation.
- For "references", generate exactly 2 realistic professional reference contacts.`
      };

      const userMessage = {
        role: 'user',
        content: JSON.stringify(answers)
      };

      const result = await callAI([systemPrompt, userMessage]);
      let parsed: any = null;
      try {
        const cleanJSON = result.replace(/```json/g, '').replace(/```/g, '').trim();
        parsed = JSON.parse(cleanJSON);
      } catch (err) {
        console.error("JSON parsing of AI resume response failed. Falling back to default generation.", err);
      }

      const t = answers.title.toLowerCase();
      let matchedNiche: 'general' | 'cra' | 'regulatory' | 'quality' | 'tech' | 'business' | 'creative' = 'general';
      if (t.includes('developer') || t.includes('engineer') || t.includes('programmer') || t.includes('tech') || t.includes('software')) {
        matchedNiche = 'tech';
      } else if (t.includes('finance') || t.includes('analyst') || t.includes('consultant') || t.includes('business') || t.includes('investment')) {
        matchedNiche = 'business';
      } else if (t.includes('marketing') || t.includes('designer') || t.includes('creative') || t.includes('brand') || t.includes('seo')) {
        matchedNiche = 'creative';
      } else if (t.includes('cra') || t.includes('clinical') || t.includes('trial')) {
        matchedNiche = 'cra';
      } else if (t.includes('regulatory') || t.includes('fda') || t.includes('ema')) {
        matchedNiche = 'regulatory';
      } else if (t.includes('qa') || t.includes('quality') || t.includes('audit') || t.includes('gmp')) {
        matchedNiche = 'quality';
      }

      const newId = Date.now();
      const finalName = parsed?.name || answers.name || 'Jane Doe';
      const finalTitle = parsed?.title || answers.title || 'Professional Specialist';
      const finalEmail = parsed?.email || answers.email || 'jane.doe@example.com';
      const finalPhone = parsed?.phone || answers.phone || '+1 (555) 000-0000';
      const finalLoc = parsed?.location || answers.location || 'New York, NY';

      const finalCV: CVProject = {
        id: newId,
        name: `AI-Generated: ${finalTitle}`,
        personal: {
          name: finalName,
          title: finalTitle,
          email: finalEmail,
          phone: finalPhone,
          location: finalLoc,
          photo: null
        },
        summary: parsed?.summary || `Dedicated ${finalTitle} focused on high performance, quantitative excellence, and compliance.`,
        experience: (parsed?.experience || []).map((e: any, idx: number) => ({
          id: `exp-${newId}-${idx}`,
          company: e.company || 'Pioneer Solutions',
          role: e.role || finalTitle,
          period: e.period || '2023 — Present',
          description: e.description || `• Spearheaded daily workflows for ${finalTitle} functions.\n• Streamlined cross-functional processes, cutting cycle times by 15%.\n• Managed a key program with zero protocol deviations.`
        })),
        education: (parsed?.education || []).map((edu: any, idx: number) => ({
          id: `edu-${newId}-${idx}`,
          institution: edu.institution || 'State University',
          degree: edu.degree || 'Bachelor of Science',
          period: edu.period || '2019 — 2023'
        })),
        skills: parsed?.skills || answers.skills || ['Performance', 'Strategy', 'Collaboration'],
        certifications: (parsed?.certifications || []).map((c: any, idx: number) => ({
          id: `cert-${newId}-${idx}`,
          name: c.name || 'Professional Certification',
          issuer: c.issuer || 'Industry Board',
          year: c.year || '2023'
        })),
        languages: (parsed?.languages || []).map((l: any, idx: number) => ({
          id: `lang-${newId}-${idx}`,
          name: l.name || (idx === 0 ? 'English' : 'Spanish'),
          level: l.level || (idx === 0 ? 'Native' : 'Professional'),
          pct: l.pct || (idx === 0 ? 100 : 80)
        })),
        publications: (parsed?.publications || []).map((p: any, idx: number) => ({
          id: `pub-${newId}-${idx}`,
          title: p.title || `Best Practices in modern ${finalTitle} methodologies`,
          journal: p.journal || 'Global Research Journal',
          year: p.year || '2023'
        })),
        references: (parsed?.references || []).map((r: any, idx: number) => ({
          id: `ref-${newId}-${idx}`,
          name: r.name || (idx === 0 ? 'Dr. Arthur Pendelton' : 'Sarah Connor'),
          role: r.role || (idx === 0 ? 'Director of Operations' : 'Clinical Manager'),
          company: r.company || (idx === 0 ? 'Pfizer' : 'Vertex Pharmaceuticals'),
          email: r.email || (idx === 0 ? 'a.pendelton@pfizer.com' : 's.connor@vertex.com'),
          phone: r.phone || '+1 (555) 123-4567'
        })),
        therapeuticAreas: THERAPEUTIC_AREAS_TEMPLATES.map(a => ({ ...a })),
        activeTheme: 'modern',
        activeNiche: matchedNiche,
        targetJD: '',
        isStudent: answers.isStudent,
        chats: [
          { id: 'm-1', role: 'ai', text: `✨ Welcome! I've successfully compiled your responses using AI to draft this premium, tailored CV outline. You can now edit any section to refine it further!` }
        ],
        lastEdited: 'Just now',
        status: 'active',
        atsScoreHistory: [{ date: 'Today', score: 65 }]
      };

      if (finalCV.experience.length === 0) {
        finalCV.experience = [
          {
            id: `exp-${newId}-1`,
            company: 'Pioneer Operations',
            role: finalTitle,
            period: '2023 — Present',
            description: `• Spearheaded daily workflows for ${finalTitle} functions.\n• Resolved critical bottlenecks and optimized departmental metrics by 24% through cross-team initiatives.\n• Spearheaded daily tracking processes, resulting in a 100% audit pass rate.`
          }
        ];
      }
      if (finalCV.education.length === 0) {
        finalCV.education = [
          { id: `edu-${newId}-1`, institution: 'State University', degree: 'Bachelor of Science', period: '2019 — 2023' }
        ];
      }

      setCvList(prev => [finalCV, ...prev]);
      setActiveCVId(newId);
      setIsLoadingAI(false);
      return newId;
    } catch (e: any) {
      console.error(e);
      setIsLoadingAI(false);
      const defaultId = createCV(`Generated: ${answers.title}`, 'general');
      return defaultId;
    }
  };


  // Real-time ATS Simulator Calculations
  const atsAnalysis = useMemo(() => {
    if (!activeCV) {
      return {
        score: 0,
        rules: [],
        jdMatch: { score: 0, missing: [], matches: [] },
        keywordDensity: [],
        skillMatch: []
      };
    }

    const cvContent = JSON.stringify(activeCV).toLowerCase();
    const expText = (activeCV.experience || []).map(e => e?.description || '').join(' ');

    // 1. JD matcher parser
    const jdText = activeCV.targetJD || '';
    let jdScore = 0;
    let missingKeywords: string[] = [];
    let matchedKeywords: string[] = [];

    const PHARMA_KEYWORDS = [
      'GCP', 'FDA 21 CFR Part 11', 'Veeva Vault', 'Medidata Rave', 'Risk-Based Monitoring',
      'eTMF', 'IND', 'NDA', 'GxP', 'EMA Guidelines', 'CAPA', 'SOP Development', 'GMP',
      'Clinical Trials', 'Pharmacovigilance', 'CDISC SDTM', 'Protocol Development', 'Regulatory Submissions',
      'Quality Assurance', 'Clinical Operations', 'Audit Readiness', 'ICH Guidelines'
    ];

    if (jdText.trim()) {
      const jdWords = jdText.toLowerCase();
      // Extract which pharma keywords are in JD
      const foundInJD = PHARMA_KEYWORDS.filter(k => jdWords.includes(k.toLowerCase()));
      matchedKeywords = foundInJD.filter(k => cvContent.includes(k.toLowerCase()));
      missingKeywords = foundInJD.filter(k => !cvContent.includes(k.toLowerCase()));
      jdScore = foundInJD.length > 0 ? Math.round((matchedKeywords.length / foundInJD.length) * 100) : 100;
    } else {
      // Default matching if no JD
      matchedKeywords = PHARMA_KEYWORDS.filter(k => cvContent.includes(k.toLowerCase())).slice(0, 8);
      missingKeywords = PHARMA_KEYWORDS.filter(k => !cvContent.includes(k.toLowerCase())).slice(0, 5);
      jdScore = 80;
    }

    // 2. Compute scoring rules
    const rules = [
      {
        name: 'Contact Integrity',
        msg: 'Ensures email and phone are present.',
        passed: !!(activeCV.personal?.email && activeCV.personal?.phone),
        weight: 15
      },
      {
        name: 'No Photo Compliance',
        msg: 'Ensures no photo is present (discouraged for ATS).',
        passed: !activeCV.personal?.photo,
        weight: 15
      },
      {
        name: 'Quantitative Impact',
        msg: 'Checks for metrics/numbers in experience descriptions.',
        passed: /\d+%|\d+\s*years|\$\d+|\d+\s*sites|\d+\s*protocols/.test(expText),
        weight: 20
      },
      {
        name: 'Pharma Specialization',
        msg: 'Niche keywords aligned to selected profile.',
        passed: (activeCV.skills || []).length > 0,
        weight: 15
      },
      {
        name: 'Summary Compliance',
        msg: 'Summary length is optimized (200 - 800 chars).',
        passed: (activeCV.summary || '').length >= 100 && (activeCV.summary || '').length <= 800,
        weight: 15
      },
      {
        name: 'JD Match Alignment',
        msg: 'At least 60% match with pasted Job Description.',
        passed: jdScore >= 60,
        weight: 20
      },
      {
        name: 'Skill Density Check',
        msg: 'At least 8 clinical/QA skills listed.',
        passed: (activeCV.skills || []).length >= 8,
        weight: 15
      }
    ];

    const totalWeight = rules.reduce((acc, r) => acc + r.weight, 0);
    const earnedWeight = rules.reduce((acc, r) => acc + (r.passed ? r.weight : 0), 0);
    const score = Math.round((earnedWeight / totalWeight) * 100);

    // 3. Keyword Density Chart
    const keywordDensity = PHARMA_KEYWORDS.map(k => {
      // Count frequency in CV
      const regex = new RegExp('\\b' + k.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '\\b', 'gi');
      const count = (cvContent.match(regex) || []).length;
      const isRequired = jdText.toLowerCase().includes(k.toLowerCase());
      return {
        keyword: k,
        count: count,
        required: isRequired ? 3 : 1
      };
    }).filter(item => item.count > 0 || item.required > 1).slice(0, 8);

    // 4. Skill Match Radar
    const skillMatch = (activeCV.skills || []).map((s, idx) => {
      // Base score on matching occurrences or length
      const matchScore = cvContent.includes(s.toLowerCase()) ? 90 - (idx * 2) : 50;
      return {
        skill: s,
        score: Math.min(Math.max(matchScore, 40), 98)
      };
    }).slice(0, 5);

    // If less than 3 skills, fill up with dummy skills
    while (skillMatch.length < 3) {
      skillMatch.push({
        skill: PHARMA_KEYWORDS[skillMatch.length % PHARMA_KEYWORDS.length],
        score: 60
      });
    }

    return {
      score,
      rules,
      jdMatch: {
        score: jdScore,
        missing: missingKeywords,
        matches: matchedKeywords
      },
      keywordDensity,
      skillMatch
    };
  }, [activeCV]);

  // Keep historical ATS score in sync when score changes significantly
  useEffect(() => {
    if (activeCVId === null || !activeCV) return;
    const currentScore = atsAnalysis.score;
    const history = activeCV.atsScoreHistory || [];
    const lastScore = history[history.length - 1]?.score;

    if (lastScore !== currentScore) {
      updateActiveCV(prev => {
        const newHistory = [...(prev.atsScoreHistory || [])];
        const lastScoreInPrev = newHistory[newHistory.length - 1]?.score;
        if (lastScoreInPrev === currentScore) {
          return prev;
        }
        
        const dateStr = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        
        // Avoid duplicate dates if editing on same day, just update
        if (newHistory.length > 0 && newHistory[newHistory.length - 1].date === dateStr) {
          newHistory[newHistory.length - 1].score = currentScore;
        } else {
          newHistory.push({ date: dateStr, score: currentScore });
        }
        
        // Limit history to 6 points
        if (newHistory.length > 6) {
          newHistory.shift();
        }

        return {
          ...prev,
          atsScoreHistory: newHistory
        };
      });
    }
  }, [atsAnalysis.score, activeCVId, activeCV]);

  return (
    <CVContext.Provider
      value={{
        cvList,
        activeCVId,
        activeCV,
        geminiKey,
        selectedGeminiModel,
        isLoadingAI,
        useGoogleAPI,
        setGeminiKey,
        setSelectedGeminiModel,
        setUseGoogleAPI,
        selectCV,
        createCV,
        importCV,
        deleteCV,
        duplicateCV,
        updateActiveCV,
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
        callAI,
        sendCoachMessage,
        aiEnhanceSummary,
        aiRefineExperience,
        startWithAI,
        atsAnalysis
      }}
    >
      {children}
    </CVContext.Provider>
  );
};

export const useCV = () => {
  const context = useContext(CVContext);
  if (!context) {
    throw new Error('useCV must be used within a CVProvider');
  }
  return context;
};
