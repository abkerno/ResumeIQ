import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, Brain, Info, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Switch, FormControlLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import { useCV } from '../context/CVContext';

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const {
    geminiKey,
    setGeminiKey,
    selectedGeminiModel,
    setSelectedGeminiModel,
    useGoogleAPI,
    setUseGoogleAPI
  } = useCV();

  const [showKey, setShowKey] = useState(false);
  const [localKey, setLocalKey] = useState(geminiKey);
  const [localModel, setLocalModel] = useState(selectedGeminiModel);
  const [localUseGoogle, setLocalUseGoogle] = useState(useGoogleAPI);

  const handleSave = () => {
    setGeminiKey(localKey);
    setSelectedGeminiModel(localModel);
    setUseGoogleAPI(localUseGoogle);
    onClose();
  };

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
            className="absolute inset-0 bg-[#070D1A]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220]/95 shadow-2xl shadow-black/80 p-6 flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#22C55E] flex items-center justify-center shadow-lg shadow-[#1E3A8A]/35">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">AI Settings</h2>
                  <p className="text-xs text-[#64748B]">Manage your Gemini API integrations</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-5">
              {/* Google API Switch */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Use Google Gemini API</h3>
                  <p className="text-xs text-[#475569] mt-0.5">Use your official API key direct to Google servers</p>
                </div>
                <Switch
                  checked={localUseGoogle}
                  onChange={(e) => setLocalUseGoogle(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#22C55E',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#22C55E',
                    },
                  }}
                />
              </div>

              {localUseGoogle && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* API Key */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" />
                      Gemini API Key
                    </label>
                    <div className="relative">
                      <TextField
                        type={showKey ? 'text' : 'password'}
                        fullWidth
                        size="small"
                        placeholder="AIzaSy..."
                        value={localKey}
                        onChange={(e) => setLocalKey(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#D1D5DB',
                            backgroundColor: '#111827/40',
                            borderRadius: '12px',
                            '& fieldset': { borderColor: '#374151' },
                            '&:hover fieldset': { borderColor: '#22C55E' },
                            '&.Mui-focused fieldset': { borderColor: '#22C55E' },
                          },
                        }}
                      />
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-1">
                      <span className="text-[#475569] flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        Stored securely locally in your browser
                      </span>
                      <a
                        href="https://aistudio.google.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#22C55E] hover:underline flex items-center gap-0.5"
                      >
                        Get free key
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  {/* Model Picker */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Gemini Model
                    </label>
                    <Select
                      fullWidth
                      size="small"
                      value={localModel}
                      onChange={(e) => setLocalModel(e.target.value as string)}
                      sx={{
                        color: '#D1D5DB',
                        backgroundColor: '#111827/40',
                        borderRadius: '12px',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#374151' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#22C55E' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#22C55E' },
                      }}
                    >
                      <MenuItem value="gemini-2.5-flash">gemini-2.5-flash (Gemini 2.5 Flash - Speed)</MenuItem>
                      <MenuItem value="gemini-2.5-pro">gemini-2.5-pro (Gemini 2.5 Pro - Quality)</MenuItem>
                      <MenuItem value="gemini-2.0-flash">gemini-2.0-flash (Gemini 2.0 Flash - Standard)</MenuItem>
                      <MenuItem value="gemini-1.5-flash">gemini-1.5-flash (Gemini 1.5 Flash - Legacy)</MenuItem>
                      <MenuItem value="gemini-1.5-pro">gemini-1.5-pro (Gemini 1.5 Pro - Complex Reasoning)</MenuItem>
                    </Select>
                  </div>
                </motion.div>
              )}

              {!localUseGoogle && (
                <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-blue-300 text-xs flex items-start gap-2.5">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="leading-normal">
                    When Google API is disabled, the platform utilizes our built-in fallback AI services, meaning you don't need a key to experiment.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <Button
                fullWidth
                variant="outlined"
                onClick={onClose}
                sx={{
                  color: '#9CA3AF',
                  borderColor: '#374151',
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': { borderColor: '#4B5563', backgroundColor: 'rgba(255,255,255,0.02)' }
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(135deg, #1E3A8A 0%, #22C55E 100%)',
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': { background: 'linear-gradient(135deg, #1E3A8A 0%, #16A34A 100%)' }
                }}
              >
                Save Settings
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
