import React, { useCallback, useEffect, useState } from 'react';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import HeroSection from './components/HeroSection';
import AdTypeSelector from './components/AdTypeSelector';
import ContextForm from './components/ContextForm';
import AnalyzeButton from './components/AnalyzeButton';
import LoadingOverlay from './components/LoadingOverlay';
import ProgressIndicator from './components/ProgressIndicator';
import Footer from './components/Footer';
import ErrorBanner from './components/ErrorBanner';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import Header from './components/Header';
import { useAuth } from './providers/AuthProvider';
import './App.css';

const AdAnalyzerUI = ({ header = null }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.3; }
        33% { opacity: 0.6; }
        66% { opacity: 1; }
      }
      .rotating {
        animation: spin 2s linear infinite;
      }
      .pulsing-1 {
        animation: pulse 1.5s ease-in-out infinite;
        animation-delay: 0s;
      }
      .pulsing-2 {
        animation: pulse 1.5s ease-in-out infinite;
        animation-delay: 0.3s;
      }
      .pulsing-3 {
        animation: pulse 1.5s ease-in-out infinite;
        animation-delay: 0.6s;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [adType, setAdType] = useState('video');
  const [platform, setPlatform] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [adObjective, setAdObjective] = useState('');
  const [isContextModeOn, setIsContextModeOn] = useState(false);
  const [ctaText, setCtaText] = useState('');
  const [postText, setPostText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (analysisResult) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [analysisResult]);

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = {
      video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
      image: ['image/jpeg', 'image/png', 'image/gif']
    };

    const maxSize = adType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;

    if (!allowedTypes[adType].includes(file.type)) {
      setErrorMessage(
        adType === 'video'
          ? 'Ogiltig videotyp. Tillåtna format: MP4, MOV, AVI.'
          : 'Ogiltig bildtyp. Tillåtna format: JPG, PNG, GIF.'
      );
      return false;
    }

    if (file.size > maxSize) {
      setErrorMessage(
        adType === 'video'
          ? 'Videon får max vara 100MB.'
          : 'Bilden får max vara 10MB.'
      );
      return false;
    }

    setErrorMessage('');
    setUploadedFile(file);
    return true;
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      validateFile(file);
    }
  };

  const handleFileSelect = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      validateFile(file);
    }
  };

  const startAnalysis = async () => {
    if (!canAnalyze || !uploadedFile) return;

    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      setErrorMessage('Miljövariabeln VITE_N8N_WEBHOOK_URL saknas. Kan inte skicka analysförfrågan.');
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisResult(null);
      setErrorMessage('');

      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('adType', adType);
      formData.append('platform', platform);
      formData.append('adObjective', adObjective);
      formData.append('targetAudience', targetAudience);
      formData.append('fileName', uploadedFile.name);
      formData.append('fileSize', uploadedFile.size);
      formData.append('fileType', uploadedFile.type);
      formData.append('timestamp', Date.now().toString());

      if (import.meta.env.DEV) {
        console.log('Skickar till n8n:', {
          fileName: uploadedFile.name,
          adType,
          platform,
          adObjective,
          targetAudience
        });
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`N8N failed: ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      setAnalyzing(false);

      if (import.meta.env.DEV) {
        console.log('N8N response:', result);
      }
    } catch (error) {
      console.error('N8N test failed:', error);
      setAnalyzing(false);
      setErrorMessage(`N8N anslutning misslyckades: ${error.message}`);
    }
  };

  const platforms = [
    'Facebook/Meta',
    'Instagram',
    'Google Ads',
    'YouTube',
    'LinkedIn',
    'TikTok',
    'Twitter/X',
    'Snapchat'
  ];

  const canAnalyze = uploadedFile && platform && targetAudience && adObjective;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      {header}

      <main style={{ flexGrow: 1 }}>
        {analysisResult === null ? (
          <>
            <HeroSection />

            <div style={{ maxWidth: '896px', margin: '0 auto', padding: '48px 24px' }}>
              <ErrorBanner message={errorMessage} />
              <AdTypeSelector adType={adType} setAdType={setAdType} />

              <FileUpload
                adType={adType}
                dragActive={dragActive}
                uploadedFile={uploadedFile}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
                handleFileSelect={handleFileSelect}
                onRemoveFile={() => {
                  setUploadedFile(null);
                  setAnalysisResult(null);
                  setErrorMessage('');
                }}
              />

              <ContextForm
                adObjective={adObjective}
                setAdObjective={setAdObjective}
                isContextModeOn={isContextModeOn}
                setIsContextModeOn={setIsContextModeOn}
                ctaText={ctaText}
                setCtaText={setCtaText}
                postText={postText}
                setPostText={setPostText}
                platform={platform}
                setPlatform={setPlatform}
                targetAudience={targetAudience}
                setTargetAudience={setTargetAudience}
                platforms={platforms}
              />

              <AnalyzeButton canAnalyze={canAnalyze} analyzing={analyzing} startAnalysis={startAnalysis} />

              {analyzing && <LoadingOverlay adType={adType} />}

              <ProgressIndicator
                adType={adType}
                uploadedFile={uploadedFile}
                platform={platform}
                adObjective={adObjective}
                targetAudience={targetAudience}
              />
            </div>
          </>
        ) : (
          <div style={{ maxWidth: '896px', margin: '0 auto', padding: '48px 24px' }}>
            <AnalysisResult analysisResult={analysisResult} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  const { isAuthenticated, isLoading, isAuthPaused, user } = useAuth();
  const [activeView, setActiveView] = useState('app');

  const canAccessAdmin = Array.isArray(user?.roles) && user.roles.includes('admin');

  useEffect(() => {
    if (!canAccessAdmin && activeView === 'admin') {
      setActiveView('app');
    }
  }, [activeView, canAccessAdmin]);

  const handleNavigate = useCallback(
    (view) => {
      if (view === 'admin' && !canAccessAdmin) {
        setActiveView('app');
        return;
      }
      setActiveView(view);
    },
    [canAccessAdmin]
  );

  if (isLoading) {
    return <div className="app-loading-state">Verifierar Google-session...</div>;
  }

  if (!isAuthenticated && !isAuthPaused) {
    return <Login />;
  }

  const header = (
    <Header
      canAccessAdmin={canAccessAdmin}
      activeView={activeView}
      onNavigate={handleNavigate}
    />
  );

  const pausedBanner = isAuthPaused ? (
    <div className="auth-paused-banner">
      Autentisering är pausad. Backend-anrop kring inloggning hoppar över verifiering tills läget
      avaktiveras.
    </div>
  ) : null;

  if (activeView === 'admin') {
    return (
      <>
        {pausedBanner}
        <AdminUsers header={header} onNavigate={handleNavigate} />
      </>
    );
  }

  return (
    <>
      {pausedBanner}
      <AdAnalyzerUI header={header} />
    </>
  );
};

export default App;
