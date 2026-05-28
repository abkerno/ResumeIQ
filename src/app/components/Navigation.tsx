import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, FileText, Target, Settings, LogOut, Sparkles, LayoutGrid, GraduationCap, Eye, Info, Menu, X } from 'lucide-react';
import { Button, IconButton, Avatar } from '@mui/material';

export function Navigation({ currentPage, onNavigate, onOpenSettings }: {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenSettings: () => void;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'cv-builder', label: 'CV Builder', icon: <FileText className="w-5 h-5" /> },
    { id: 'preview', label: 'Preview', icon: <Eye className="w-5 h-5" /> },
    { id: 'ats', label: 'ATS X-Ray', icon: <Target className="w-5 h-5" /> },
    { id: 'templates', label: 'Templates', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'career', label: 'Career Guide', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'about', label: 'About', icon: <Info className="w-5 h-5" /> },
  ];

  return (
    <motion.div
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0B1220]/90 via-[#0F172A]/90 to-[#0B1220]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Modern Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('landing')}
          >
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] flex items-center justify-center shadow-lg shadow-[#22C55E]/20 group-hover:shadow-[#22C55E]/40 transition-all">
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-all" />
            </div>
            <div>
              <div className="font-bold text-white group-hover:text-[#22C55E] transition-colors">ResumeIQ</div>
              <div className="text-xs text-gray-400">2026</div>
            </div>
          </motion.div>

          {/* Desktop Glassmorphic Navigation Menu */}
          <div className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-black/20 backdrop-blur border border-white/5">
            {navItems.map((item) => (
              <motion.div key={item.id} className="relative">
                {currentPage === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    currentPage === item.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              onClick={onOpenSettings}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-[#22C55E]/20 cursor-pointer"
            >
              PU
            </motion.div>
          </div>

          {/* Mobile Navigation Trigger Button */}
          <div className="flex lg:hidden items-center gap-3">
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 bg-black/25 backdrop-blur-xl transition-all"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="lg:hidden absolute top-16 left-0 right-0 z-40 bg-gradient-to-b from-[#0B1220]/95 via-[#0F172A]/95 to-[#0B1220]/95 backdrop-blur-2xl border-b border-white/10 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 border ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-[#1E3A8A] to-[#22C55E] text-white border-white/10 shadow-md shadow-[#22C55E]/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5 border-transparent'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              <div className="h-px bg-white/10 my-2" />

              {/* User Menu mobile items */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] flex items-center justify-center text-sm font-bold text-white shadow-md">
                    PU
                  </div>
                  <div className="text-sm font-semibold text-white">Pharma User</div>
                </div>
                <motion.button
                  onClick={() => {
                    onOpenSettings();
                    setMobileMenuOpen(false);
                  }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 py-1.5 px-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 bg-black/10 transition-all flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-xs font-semibold">Settings</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
