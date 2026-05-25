import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ATSSimulation } from './components/ATSSimulation';
import { Navigation } from './components/Navigation';
import { CVBuilder } from './components/CVBuilder';
import { Templates } from './components/Templates';
import { CareerGuide } from './components/CareerGuide';
import { Preview } from './components/Preview';
import { About } from './components/About';
import { CVProvider, useCV } from './context/CVContext';
import { SettingsModal } from './components/SettingsModal';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1E3A8A',
    },
    secondary: {
      main: '#22C55E',
    },
    error: {
      main: '#EF4444',
    },
    warning: {
      main: '#F59E0B',
    },
    background: {
      default: '#0B1220',
      paper: '#111827',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
});

function AppContent() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showSettings, setShowSettings] = useState(false);
  const { selectCV, createCV, importCV } = useCV();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const importData = params.get('import');
    if (importData) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(importData)));
        if (decoded && typeof decoded === 'object') {
          importCV(decoded);
          // Clear query params to keep URL clean
          window.history.replaceState({}, document.title, window.location.pathname);
          // Redirect directly to preview
          setCurrentPage('preview');
        }
      } catch (e) {
        console.error('Failed to parse shared CV data:', e);
      }
    }
  }, [importCV]);

  const handleGetStarted = () => {
    setCurrentPage('dashboard');
  };

  const handleCreateCV = () => {
    const newId = createCV('New Pharma CV', 'general');
    selectCV(newId);
    setCurrentPage('cv-builder');
  };

  const handleOpenCV = (id: number) => {
    selectCV(id);
    setCurrentPage('cv-builder');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={handleGetStarted} />;

      case 'dashboard':
        return <Dashboard onCreateCV={handleCreateCV} onOpenCV={handleOpenCV} />;

      case 'ats':
        return <ATSSimulation onBack={() => setCurrentPage('dashboard')} />;

      case 'cv-builder':
        return <CVBuilder onBack={() => setCurrentPage('dashboard')} onOpenPreview={() => setCurrentPage('preview')} />;

      case 'preview':
        return <Preview onBack={() => setCurrentPage('cv-builder')} />;

      case 'templates':
        return <Templates onUseTemplate={() => setCurrentPage('cv-builder')} />;

      case 'career':
        return <CareerGuide />;

      case 'about':
        return <About />;

      default:
        return <LandingPage onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <div className="size-full min-h-screen">
      {currentPage !== 'landing' && (
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} onOpenSettings={() => setShowSettings(true)} />
      )}
      <div className={currentPage !== 'landing' ? 'pt-16' : ''}>
        {renderPage()}
      </div>
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default function App() {
  return (
    <CVProvider>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </CVProvider>
  );
}