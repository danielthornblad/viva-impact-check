import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import AnalysisResult from './components/AnalysisResult';
import HeroSection from './components/HeroSection';
import AdTypeSelector from './components/AdTypeSelector';
import ContextForm from './components/ContextForm';
import AnalyzeButton from './components/AnalyzeButton';
import LoadingOverlay from './components/LoadingOverlay';
import ProgressIndicator from './components/ProgressIndicator';
import Footer from './components/Footer';

const AdAnalyzerUI = () => {

  React.useEffect(() => {
    // Skapa en style-tagg för animationer
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
    
    // Cleanup
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [adType, setAdType] = useState('video');
  const [platform, setPlatform] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
      alert(
        adType === 'video'
          ? 'Ogiltig videotyp. Tillåtna format: MP4, MOV, AVI.'
          : 'Ogiltig bildtyp. Tillåtna format: JPG, PNG, GIF.'
      );
      return false;
    }

    if (file.size > maxSize) {
      alert(
        adType === 'video'
          ? 'Videon får max vara 100MB.'
          : 'Bilden får max vara 10MB.'
      );
      return false;
    }

    setUploadedFile(file);
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateFile(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateFile(file);
    }
  };

  const startAnalysis = async () => {
    if (!canAnalyze || !uploadedFile) return;

    const webhookUrl = process.env.REACT_APP_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      alert('Miljövariabeln REACT_APP_N8N_WEBHOOK_URL saknas. Kan inte skicka analysförfrågan.');
      return;
    }

    try {
      setAnalyzing(true);
      setAnalysisResult(null);

      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('adType', adType);
      formData.append('platform', platform);
      formData.append('targetAudience', targetAudience);
      formData.append('fileName', uploadedFile.name);
      formData.append('fileSize', uploadedFile.size);
      formData.append('fileType', uploadedFile.type);
      formData.append('timestamp', Date.now().toString());

      if (process.env.NODE_ENV !== 'production') {
        console.log('Skickar till n8n:', {
          fileName: uploadedFile.name,
          adType, platform, targetAudience
        });
      }

      // Din riktiga n8n webhook URL
      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`N8N failed: ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
      setAnalyzing(false);

      if (process.env.NODE_ENV !== 'production') {
        console.log('N8N response:', result);
      }

    } catch (error) {
      console.error('N8N test failed:', error);
      setAnalyzing(false);
      alert(`N8N anslutning misslyckades: ${error.message}`);
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

  const canAnalyze = uploadedFile && platform && targetAudience;

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      <div style={{ maxWidth: '896px', margin: '0 auto', padding: '48px 24px' }}>
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
          }}
        />
        
        <ContextForm
          platform={platform}
          setPlatform={setPlatform}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
          platforms={platforms}
        />

        <AnalyzeButton
          canAnalyze={canAnalyze}
          analyzing={analyzing}
          startAnalysis={startAnalysis}
        />

        {/* Laddningsindikator - visas endast när analyzing är true */}
        {analyzing && <LoadingOverlay adType={adType} />}



        <AnalysisResult analysisResult={analysisResult} />

        <ProgressIndicator
          adType={adType}
          uploadedFile={uploadedFile}
          platform={platform}
          targetAudience={targetAudience}
        />
      </div>

      <Footer />
    </div>
  );
};
function App() {
return <AdAnalyzerUI />;
}
export default App;
