import { motion } from 'motion/react';
import { Sparkles, Brain, Target, ShieldCheck, Microscope, Database, Users, Mail, Linkedin, GraduationCap, Code, Handshake, Plus } from 'lucide-react';

export function About() {
  const stats = [
    { label: 'Clinical Placements', value: '14,200+' },
    { label: 'ATS Success Rate', value: '99.4%' },
    { label: 'Compliance Audits Run', value: '180K+' },
  ];

  const features = [
    {
      title: 'Life Science Compliance Engine',
      description: 'Custom ATS parameters customized specifically for Pfizer, Novartis, Roche, and major CRO parsing clusters.',
      icon: <Microscope className="w-5 h-5 text-[#22C55E]" />,
    },
    {
      title: 'Privacy-First Architecture',
      description: 'Zero-persistence cloud pipeline. All resumes, personal details, and clinical data are processed entirely in-memory and client-side.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-400" />,
    },
    {
      title: 'Dynamic GxP Keyword Injector',
      description: 'Advanced real-time parsing to align work histories with FDA 21 CFR Part 11, ICH-GCP, cGMP, and local regulatory criteria.',
      icon: <Brain className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1E3A8A]/10 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Animated Hero Header */}
        <div className="relative text-center mb-16">
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#22C55E]/10 to-transparent blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#22C55E]/20 bg-[#22C55E]/5 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#22C55E]" />
            <span className="text-[#22C55E] text-xs font-semibold uppercase tracking-wider">About ResumeIQ</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
          >
            ResumeIQ
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl font-bold text-[#22C55E] mb-6 tracking-wide"
          >
            Smart CVs. Better Careers.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed"
          >
            ResumeIQ is an AI-powered platform that helps students and professionals create smart, modern, and ATS-friendly resumes with ease. The platform is designed to simplify career growth through intelligent tools, clean design, and professional resume optimization.
          </motion.p>
        </div>

        {/* Developer Spotlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mb-16 p-8 rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/20 border border-white/10 hover:border-white/20 transition-all shadow-2xl overflow-hidden group"
        >
          {/* Subtle green ambient light */}
          <div className="absolute right-0 top-0 w-60 h-60 bg-[#22C55E]/5 blur-3xl pointer-events-none rounded-full" />
          
          <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Developer Avatar Placeholder/Badge */}
            <div className="relative shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#22C55E] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[#22C55E]/20">
              YI
              <div className="absolute -bottom-1 -right-1 p-1 rounded-lg bg-[#0F172A] border border-white/10 text-[#22C55E]">
                <Code className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className="text-2xl font-bold text-white">Yousef Ibrahim Jaber Abdellatif</h3>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 uppercase tracking-wider">
                    Developer & Creator
                  </span>
                </div>
                
                <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  Pharmacy Student, AI Enthusiast, & Creative Developer
                </p>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                Developed using modern **vibe coding methodologies**, ResumeIQ was crafted by Yousef out of a passion for building innovative digital solutions that seamlessly combine cutting-edge technology, aesthetic web design, and optimized user experiences.
              </p>

              {/* Action Contact buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="mailto:y.abdellatif2048@su.edu.eg"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Mail className="w-4 h-4 text-[#22C55E]" />
                  y.abdellatif2048@su.edu.eg
                </a>
                
                <a
                  href="https://www.linkedin.com/in/youssef-ibrahim-gaber-abdellatif/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3Bny7tGKPzS7KSGLcsO8KfUg%3D%3D"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-blue-300 hover:text-white hover:bg-[#0A66C2]/20 transition-all"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid: Mission and Platform */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/10 border border-white/10 shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-[#22C55E]" />
              Our Mission
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              To bridge the gap between world-class clinical talent and leading global pharma sponsors. We remove parsing bottlenecks by transforming legacy experience into highly structured, context-rich career records that highlight GCP compliance, clinical trial phases, and regulatory mastery.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We empower clinical specialists, QA managers, MSLs, and researchers to design high-impact dossiers that speak directly to ATS engines like Workday, Taleo, and specialized GxP talent acquisition frameworks.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-[#111827]/90 to-[#1E3A8A]/10 border border-white/10 shadow-xl flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-400" />
                The ResumeIQ Difference
              </h2>
              <div className="space-y-4">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1 p-1 rounded-lg bg-white/5 border border-white/10 shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white mb-0.5">{f.title}</h4>
                      <p className="text-xs text-gray-400 leading-normal">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur"
            >
              <div className="text-3xl md:text-5xl font-black text-[#22C55E] mb-2">{s.value}</div>
              <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-widest font-bold">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Partners Showcase & Sponsors Capture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-[#111827]/90 via-[#0B1220] to-[#1E3A8A]/10 border border-white/10 shadow-xl"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
              <Handshake className="w-6 h-6 text-[#22C55E]" />
              Ecosystem Partners & Sponsors
            </h3>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              ResumeIQ is proudly supported by active pharmaceutical student federations, creative technology groups, and strategic sponsors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* EPSF Sinai */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-white/[0.015] text-center"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center mb-4 p-2">
                <img
                  src="/EPSF-Sinai.png"
                  alt="EPSF Sinai"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <h4 className="font-bold text-sm text-white mb-0.5">EPSF Sinai</h4>
              <p className="text-[10px] text-[#22C55E] font-semibold uppercase tracking-wider mb-2">Egyptian Pharmaceutical Students' Federation</p>
              <p className="text-xs text-gray-400 leading-normal">
                Connecting Sinai pharmacy students with advanced AI career technologies and professional dossier auditing frameworks.
              </p>
            </motion.div>

            {/* Helha */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-white/5 bg-white/[0.015] text-center"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center mb-4 p-2">
                <img
                  src="/helha.png"
                  alt="حلها (Helha)"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <h4 className="font-bold text-sm text-white mb-0.5">حلها (Helha)</h4>
              <p className="text-[10px] text-[#22C55E] font-semibold uppercase tracking-wider mb-2">Creative Solution Partner</p>
              <p className="text-xs text-gray-400 leading-normal">
                Collaborating on digital strategy and candidate assistance services to deliver smart professional opportunities.
              </p>
            </motion.div>

            {/* Capture CTA */}
            <motion.a
              href="mailto:y.abdellatif2048@su.edu.eg?subject=ResumeIQ%20Partnership%20/%20Sponsorship"
              whileHover={{ scale: 1.02, borderColor: 'rgba(34, 197, 94, 0.4)' }}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-dashed border-[#22C55E]/30 bg-[#22C55E]/5 text-center group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-[#22C55E]/10 border border-[#22C55E]/30 mb-4 group-hover:bg-[#22C55E]/20 transition-all">
                <Plus className="w-6 h-6 text-[#22C55E] animate-pulse" />
              </div>
              <h4 className="font-bold text-sm text-[#22C55E] mb-0.5 group-hover:underline">Become a Partner / Sponsor</h4>
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Ecosystem Growth</p>
              <p className="text-xs text-gray-400 leading-normal">
                Partner with Yousef and ResumeIQ to support student developers, expand parsing intelligence, and co-sponsor live career features.
              </p>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
