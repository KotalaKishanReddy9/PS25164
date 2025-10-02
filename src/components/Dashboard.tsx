import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Map, 
  User, 
  LogOut, 
  Settings, 
  AlertTriangle, 
  Send, 
  Activity,
  Users,
  Shield,
  Eye,
  Bell,
  MessageSquare,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface DashboardProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    faceImage?: string;
  };
  onLogout: () => void;
  onShowProfile: () => void;
}

function Dashboard({ user, onLogout, onShowProfile }: DashboardProps) {
  const [logs, setLogs] = useState<Array<{id: string, message: string, timestamp: Date, type: 'info' | 'warning' | 'error'}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [assistantStatus, setAssistantStatus] = useState('working');
  const [densityData, setDensityData] = useState({ 
    current: 23, 
    max: 50, 
    zones: [
      { name: 'Zone 1 (Left)', count: 8, color: 'bg-blue-500' },
      { name: 'Zone 2 (Top Right)', count: 7, color: 'bg-green-500' },
      { name: 'Zone 3 (Bottom Right)', count: 8, color: 'bg-purple-500' }
    ]
  });
  const [criticalAlert, setCriticalAlert] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [videoSource, setVideoSource] = useState<'youtube' | 'file' | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    // Simulate AI analysis logs
    const interval = setInterval(() => {
      if (isAnalyzing) {
        const aiMessages = [
          { message: 'AI: Motion detected in Zone 1 (Left half)', type: 'info' as const },
          { message: 'AI: Person entered Zone 2 (Top Right)', type: 'info' as const },
          { message: 'AI: High density detected in Zone 3 (Bottom Right)', type: 'warning' as const },
          { message: 'AI: Unusual activity pattern in Zone 1', type: 'warning' as const },
          { message: 'AI: Person count updated across all zones', type: 'info' as const },
          { message: 'AI: Zone analysis complete - all zones monitored', type: 'info' as const },
          { message: 'AI: Crowd formation detected in Zone 2', type: 'warning' as const },
          { message: 'AI: Normal traffic flow in Zone 1', type: 'info' as const }
        ];
        
        const randomMessage = aiMessages[Math.floor(Math.random() * aiMessages.length)];
        setLogs(prev => [...prev, {
          id: Date.now().toString(),
          ...randomMessage,
          timestamp: new Date()
        }].slice(-50));
      }
    }, 2000);

    // Simulate real-time system logs
    const systemInterval = setInterval(() => {
      const systemMessages = [
        { message: 'System: Camera feed stable', type: 'info' as const },
        { message: 'System: AI model processing frame', type: 'info' as const },
        { message: 'System: Network connection optimal', type: 'info' as const }
      ];
      
      const randomMessage = systemMessages[Math.floor(Math.random() * systemMessages.length)];
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        ...randomMessage,
        timestamp: new Date()
      }].slice(-50)); // Keep only last 50 logs
    }, 5000);

    // Simulate AI-driven density updates
    const densityInterval = setInterval(() => {
      if (isAnalyzing) {
        const zone1 = Math.floor(Math.random() * 15) + 1;
        const zone2 = Math.floor(Math.random() * 12) + 1;
        const zone3 = Math.floor(Math.random() * 10) + 1;
        
        setDensityData(prev => ({
          ...prev,
          current: zone1 + zone2 + zone3,
          zones: [
            { name: 'Zone 1 (Left)', count: zone1, color: 'bg-blue-500' },
            { name: 'Zone 2 (Top Right)', count: zone2, color: 'bg-green-500' },
            { name: 'Zone 3 (Bottom Right)', count: zone3, color: 'bg-purple-500' }
          ]
        }));
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(systemInterval);
      clearInterval(densityInterval);
    };
  }, [isAnalyzing]);

  useEffect(() => {
    // Only auto-scroll logs if user is at bottom, not the entire page
    if (isAtBottom && logsEndRef.current && logsContainerRef.current) {
      const container = logsContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [logs, isAtBottom]);

  // Check if user is at bottom of logs container only
  const checkIfAtBottom = () => {
    const container = logsContainerRef.current;
    if (!container) return true;
    
    const threshold = 20;
    const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
    return atBottom;
  };

  // Handle scroll events for logs container only
  const handleLogsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent event bubbling
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
  };

  const startAnalysis = () => {
    if (!youtubeUrl.trim() || !getYouTubeEmbedUrl(youtubeUrl.trim())) {
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        message: 'Error: Please enter a valid YouTube URL or upload a video file',
        timestamp: new Date(),
        type: 'error'
      }]);
      return;
    }
    
    setIsAnalyzing(true);
    setShowUrlInput(false);
    setShowFileUpload(false);
    setLogs(prev => [...prev, {
      id: Date.now().toString(),
      message: `AI: Starting analysis of video feed from ${videoSource === 'file' ? 'uploaded file' : 'YouTube'}`,
      timestamp: new Date(),
      type: 'info'
    }, {
      id: (Date.now() + 1).toString(),
      message: 'AI: Initializing zone detection (Zone 1: Left, Zone 2: Top Right, Zone 3: Bottom Right)',
      timestamp: new Date(),
      type: 'info'
    }]);
  };

  const clearYouTubeUrl = () => {
    setYoutubeUrl('');
    setVideoSource(null);
  };

  const stopAnalysis = () => {
    setIsAnalyzing(false);
    setLogs(prev => [...prev, {
      id: Date.now().toString(),
      message: 'AI: Analysis stopped by user',
      timestamp: new Date(),
      type: 'info'
    }]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a video file
      if (!file.type.startsWith('video/')) {
        setLogs(prev => [...prev, {
          id: Date.now().toString(),
          message: 'Error: Please select a valid video file',
          timestamp: new Date(),
          type: 'error'
        }]);
        return;
      }

      // Check file size (limit to 100MB)
      if (file.size > 100 * 1024 * 1024) {
        setLogs(prev => [...prev, {
          id: Date.now().toString(),
          message: 'Error: File size too large. Please select a file smaller than 100MB',
          timestamp: new Date(),
          type: 'error'
        }]);
        return;
      }

      const url = URL.createObjectURL(file);
      setUploadedVideo(url);
      setUploadedFileName(file.name);
      setVideoSource('file');
      setYoutubeUrl(''); // Clear YouTube URL if file is uploaded
      
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        message: `System: Video file "${file.name}" uploaded successfully`,
        timestamp: new Date(),
        type: 'info'
      }]);
    }
  };

  const clearUploadedVideo = () => {
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo);
    }
    setUploadedVideo(null);
    setUploadedFileName('');
    setVideoSource(null);
  };

  const clearYouTubeUrl = () => {
    setYoutubeUrl('');
    setVideoSource(null);
  };

  // Critical alert effect
  useEffect(() => {
    if (criticalAlert) {
      const timer = setTimeout(() => {
        setCriticalAlert(false);
      }, 5000); // Alert lasts 5 seconds
      return () => clearTimeout(timer);
    }
  }, [criticalAlert]);

  const sendAlert = () => {
    const alertMessage = {
      id: Date.now().toString(),
      message: `ALERT: Manual alert triggered by ${user.name}`,
      timestamp: new Date(),
      type: 'error' as const
    };
    setLogs(prev => [...prev, alertMessage]);
  };

  const sendCriticalAlert = () => {
    setCriticalAlert(true);
    const criticalMessage = {
      id: Date.now().toString(),
      message: `🚨 CRITICAL ALERT: Security breach detected! Immediate action required!`,
      timestamp: new Date(),
      type: 'error' as const
    };
    setLogs(prev => [...prev, criticalMessage]);
    // Force scroll to show critical alert by setting to bottom
    setIsAtBottom(true);
    setTimeout(() => {
      if (logsContainerRef.current) {
        logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        message: `${user.name}: ${newMessage}`,
        timestamp: new Date(),
        type: 'info' as const
      };
      setLogs(prev => [...prev, message]);
      setNewMessage('');
      // Auto-scroll to show new message
      setIsAtBottom(true);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    try {
      // More comprehensive YouTube URL parsing
      let videoId = null;
      
      // Handle different YouTube URL formats
      const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
        /(?:youtu\.be\/)([^&\n?#]+)/,
        /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
        /(?:youtube\.com\/v\/)([^&\n?#]+)/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          videoId = match[1];
          break;
        }
      }
      
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=1&rel=0&modestbranding=1&enablejsapi=1`;
      }
      
      // Handle different YouTube URL formats
      const patterns = [
        /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
        /(?:youtu\.be\/)([^&\n?#]+)/,
        /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
        /(?:youtube\.com\/v\/)([^&\n?#]+)/
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
          videoId = match[1];
          break;
        }
      }
      
      if (videoId && videoId[1]) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=0&controls=1&rel=0&modestbranding=1&enablejsapi=1`;
      }
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
    }
    return null;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'operator': return <Settings className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'operator': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      criticalAlert 
        ? 'bg-red-600' 
        : 'bg-gray-50'
    }`}>
      {/* Critical Alert Overlay */}
      {criticalAlert && (
        <div className="fixed inset-0 z-50 bg-red-600/95 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white animate-pulse">
            <div className="text-8xl mb-4">🚨</div>
            <h1 className="text-6xl font-bold mb-4">CRITICAL ALERT</h1>
            <p className="text-2xl">Security breach detected - Immediate action required</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`shadow-sm border-b transition-all duration-500 ${
        criticalAlert 
          ? 'bg-red-700 border-red-800' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Camera className={`w-8 h-8 transition-colors duration-500 ${
                  criticalAlert ? 'text-white' : 'text-blue-600'
                }`} />
                <h1 className={`text-2xl font-bold transition-colors duration-500 ${
                  criticalAlert ? 'text-white' : 'text-gray-900'
                }`}>Security Dashboard</h1>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all duration-500 ${
                criticalAlert 
                  ? 'bg-red-800 text-white' 
                  : 'bg-green-100'
              }`}>
                <Activity className={`w-4 h-4 transition-colors duration-500 ${
                  criticalAlert ? 'text-white' : 'text-green-600'
                }`} />
                <span className={`text-sm font-medium transition-colors duration-500 ${
                  criticalAlert ? 'text-white' : 'text-green-800'
                }`}>Assistant {assistantStatus}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={user.faceImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3B82F6&color=fff&size=40`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="text-right">
                  <div className={`text-sm font-medium transition-colors duration-500 ${
                    criticalAlert ? 'text-white' : 'text-gray-900'
                  }`}>{user.name}</div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={onShowProfile}
                  className={`p-2 rounded-lg transition-colors ${
                    criticalAlert 
                      ? 'text-white hover:text-red-200 hover:bg-red-800' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title="Profile Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={onLogout}
                  className={`p-2 rounded-lg transition-colors ${
                    criticalAlert 
                      ? 'text-white hover:text-red-200 hover:bg-red-800' 
                      : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera Feed */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-500 ${
              criticalAlert 
                ? 'bg-red-700 border-red-800' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-bold flex items-center gap-2 transition-colors duration-500 ${
                    criticalAlert ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Camera className={`w-6 h-6 transition-colors duration-500 ${
                      criticalAlert ? 'text-white' : 'text-blue-600'
                    }`} />
                    AI-Powered Camera Feed
                  </h2>
                  <div className="flex items-center gap-4">
                    {!showUrlInput && !showFileUpload && !isAnalyzing && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setShowUrlInput(true);
                            setShowFileUpload(false);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Add YouTube URL
                        </button>
                        <button
                          onClick={() => {
                            setShowFileUpload(true);
                            setShowUrlInput(false);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Upload Video File
                        </button>
                      </div>
                    )}
                    {isAnalyzing && (
                      <button
                        onClick={stopAnalysis}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                      >
                        <Pause className="w-3 h-3" />
                        Stop Analysis
                      </button>
                    )}
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isAnalyzing ? 'animate-pulse bg-green-500' : 'bg-gray-400'
                      } ${criticalAlert ? 'bg-white' : ''}`}></div>
                      <span className={`text-sm transition-colors duration-500 ${
                        criticalAlert ? 'text-white' : 'text-gray-600'
                      }`}>{isAnalyzing ? 'AI Analyzing' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
                
                {showUrlInput && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="url"
                      value={youtubeUrl}
                      onChange={(e) => {
                        setYoutubeUrl(e.target.value);
                        setVideoSource('youtube');
                        clearUploadedVideo();
                      }}
                      placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
                      className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={startAnalysis}
                      className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Play className="w-4 h-4" />
                      Start Analysis
                    </button>
                    <button
                      onClick={() => {
                        setShowUrlInput(false);
                        clearYouTubeUrl();
                      }}
                      className="px-3 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                
                {showFileUpload && (
                  <div className="mt-4">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      <button
                        onClick={() => {
                          setShowFileUpload(false);
                          clearUploadedVideo();
                        }}
                        className="px-3 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                    
                    {uploadedVideo && (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-800">File ready: {uploadedFileName}</span>
                        </div>
                        <button
                          onClick={startAnalysis}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                        >
                          <Play className="w-4 h-4" />
                          Start Analysis
                        </button>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Supported formats: MP4, WebM, AVI, MOV, etc. Maximum file size: 100MB
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`aspect-video relative overflow-hidden transition-all duration-500 ${
                criticalAlert ? 'bg-red-900' : 'bg-gray-900'
              }`}>
                {youtubeUrl.trim() && getYouTubeEmbedUrl(youtubeUrl.trim()) ? (
                  <div className="relative w-full h-full">
                    <iframe
                      src={getYouTubeEmbedUrl(youtubeUrl.trim()) || ''}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      title="AI Camera Analysis Video"
                      title="AI Camera Analysis Video"
                    ></iframe>
                    
                    {/* Zone Overlays */}
                    {isAnalyzing && (
                      <>
                        {/* Zone 1 - Left Half */}
                        <div className="absolute top-0 left-0 w-1/2 h-full border-2 border-blue-500 bg-blue-500/10 flex items-center justify-center">
                          <div className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                            Zone 1: {densityData.zones[0].count} people
                          </div>
                        </div>
                        
                        {/* Zone 2 - Top Right */}
                        <div className="absolute top-0 right-0 w-1/2 h-1/2 border-2 border-green-500 bg-green-500/10 flex items-center justify-center">
                          <div className="bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                            Zone 2: {densityData.zones[1].count} people
                          </div>
                        </div>
                        
                        {/* Zone 3 - Bottom Right */}
                        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 border-2 border-purple-500 bg-purple-500/10 flex items-center justify-center">
                          <div className="bg-purple-500 text-white px-2 py-1 rounded text-sm font-bold">
                            Zone 3: {densityData.zones[2].count} people
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br flex items-center justify-center transition-all duration-500 ${
                    criticalAlert 
                      ? 'from-red-800 to-red-900' 
                      : 'from-gray-800 to-gray-900'
                  }`}>
                    <div className="text-center text-white">
                      <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">AI-Powered Camera Feed</p>
                      <p className={`transition-colors duration-500 ${
                        criticalAlert ? 'text-red-200' : 'text-gray-400'
                      }`}>Add a YouTube URL to start AI analysis</p>
                      {youtubeUrl.trim() && !getYouTubeEmbedUrl(youtubeUrl.trim()) && (
                        <p className="text-red-400 text-sm mt-2">
                          Invalid YouTube URL. Please check the link and try again.
                        </p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Overlay Info */}
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                  <div className="text-sm">AI Camera Analysis - 3 Zone Detection</div>
                  <div className="text-xs text-gray-300">
                    Source: {videoSource === 'file' ? `File: ${uploadedFileName}` : 'YouTube'}
                  </div>
                  <div className="text-xs text-gray-300">{new Date().toLocaleTimeString()}</div>
                </div>
                
                <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                  <div className="text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {densityData.current} people detected
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Density Map */}
            <div className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-500 ${
              criticalAlert 
                ? 'bg-red-700 border-red-800' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-4 border-b transition-colors duration-500 ${
                criticalAlert ? 'border-red-800' : 'border-gray-200'
              }`}>
                <h3 className={`text-lg font-bold flex items-center gap-2 transition-colors duration-500 ${
                  criticalAlert ? 'text-white' : 'text-gray-900'
                }`}>
                  <Map className={`w-5 h-5 transition-colors duration-500 ${
                    criticalAlert ? 'text-white' : 'text-green-600'
                  }`} />
                  Density Map
                </h3>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm transition-colors duration-500 ${
                      criticalAlert ? 'text-red-200' : 'text-gray-600'
                    }`}>Current Occupancy</span>
                    <span className={`text-lg font-bold transition-colors duration-500 ${
                      criticalAlert ? 'text-white' : 'text-gray-900'
                    }`}>{densityData.current}/{densityData.max}</span>
                  </div>
                  <div className={`w-full rounded-full h-2 transition-colors duration-500 ${
                    criticalAlert ? 'bg-red-800' : 'bg-gray-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        criticalAlert ? 'bg-white' : 'bg-blue-600'
                      }`}
                      style={{ width: `${(densityData.current / densityData.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className={`text-sm font-medium transition-colors duration-500 ${
                    criticalAlert ? 'text-red-200' : 'text-gray-700'
                  }`}>AI Zone Analysis:</div>
                  {densityData.zones.map((zone, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className={`transition-colors duration-500 ${
                        criticalAlert ? 'text-red-200' : 'text-gray-600'
                      }`}>{zone.name}: {zone.count}</span>
                      <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                        criticalAlert ? 'bg-white' : zone.color
                      }`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alert Button */}
            <div className="space-y-3">
              <button
                onClick={sendAlert}
                className="w-full p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                <Bell className="w-5 h-5" />
                Send Alert
              </button>
              
              <button
                onClick={sendCriticalAlert}
                className="w-full p-4 bg-red-800 text-white rounded-2xl hover:bg-red-900 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm animate-pulse"
              >
                <AlertTriangle className="w-5 h-5" />
                CRITICAL ALERT
              </button>
            </div>
          </div>
        </div>

        {/* Live Chat/Logs */}
        <div className="mt-6">
          <div className={`rounded-2xl shadow-sm border overflow-hidden transition-all duration-500 ${
            criticalAlert 
              ? 'bg-red-700 border-red-800' 
              : 'bg-white border-gray-200'
          }`}>
            <div className={`p-4 border-b transition-colors duration-500 ${
              criticalAlert ? 'border-red-800' : 'border-gray-200'
            }`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 transition-colors duration-500 ${
                criticalAlert ? 'text-white' : 'text-gray-900'
              }`}>
                    onChange={(e) => {
                      setYoutubeUrl(e.target.value);
                      setVideoSource('youtube');
                    }}
                    placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)"
                }`} />
                Live Activity Logs
              </h3>
              {!isAtBottom && (
                <button
                  onClick={() => {
                    setIsAtBottom(true);
                    if (logsContainerRef.current) {
                      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
                    }
                  }}
                  className={`mt-2 px-3 py-1 text-xs rounded-full transition-colors ${
                      clearYouTubeUrl();
                      ? 'bg-red-800 text-white hover:bg-red-900' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  ↓ New messages
                </button>
              )}
            </div>
            
            <div 
              ref={logsContainerRef}
              onScroll={handleLogsScroll}
              className="h-64 overflow-y-auto p-4 space-y-2"
              style={{ scrollBehavior: 'smooth' }}
            >
              {logs.map((log) => (
                <div key={log.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  criticalAlert 
                    ? 'hover:bg-red-800' 
                    : 'hover:bg-gray-50'
                }`}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    criticalAlert 
                      ? 'bg-white' 
                      : log.type === 'error' ? 'bg-red-500' : 
                        log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm transition-colors duration-500 ${
                      criticalAlert ? 'text-white' : 'text-gray-900'
                    }`}>{log.message}</div>
                    <div className={`text-xs transition-colors duration-500 ${
                      criticalAlert ? 'text-red-200' : 'text-gray-500'
                    }`}>{log.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
            
            <div className={`p-4 border-t transition-colors duration-500 ${
              criticalAlert ? 'border-red-800' : 'border-gray-200'
            }`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-500 ${
                    criticalAlert 
                      ? 'bg-red-800 border-red-600 text-white placeholder-red-300 focus:ring-white' 
                      : 'bg-white border-gray-200 text-gray-900 focus:ring-blue-500'
                  }`}
                />
                <button
                  onClick={sendMessage}
                  className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                    criticalAlert 
                      ? 'bg-red-800 hover:bg-red-900' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;