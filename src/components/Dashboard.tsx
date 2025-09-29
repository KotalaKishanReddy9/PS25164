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
  MessageSquare
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
  const [densityData, setDensityData] = useState({ current: 23, max: 50, zones: ['Zone A: 8', 'Zone B: 12', 'Zone C: 3'] });
  const [criticalAlert, setCriticalAlert] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate real-time logs
    const interval = setInterval(() => {
      const messages = [
        { message: 'Motion detected in Zone A', type: 'info' as const },
        { message: 'Person entered restricted area', type: 'warning' as const },
        { message: 'Camera 3 offline', type: 'error' as const },
        { message: 'System scan completed', type: 'info' as const },
        { message: 'High density detected in Zone B', type: 'warning' as const },
        { message: 'All systems operational', type: 'info' as const }
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        ...randomMessage,
        timestamp: new Date()
      }].slice(-50)); // Keep only last 50 logs
    }, 3000);

    // Simulate density updates
    const densityInterval = setInterval(() => {
      setDensityData(prev => ({
        ...prev,
        current: Math.floor(Math.random() * 50) + 1,
        zones: [
          `Zone A: ${Math.floor(Math.random() * 15)}`,
          `Zone B: ${Math.floor(Math.random() * 20)}`,
          `Zone C: ${Math.floor(Math.random() * 10)}`
        ]
      }));
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(densityInterval);
    };
  }, []);

  useEffect(() => {
    // Only auto-scroll if user is at bottom
    if (isAtBottom && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isAtBottom]);

  // Check if user is at bottom of logs
  const checkIfAtBottom = () => {
    const container = logsContainerRef.current;
    if (!container) return true;
    
    const threshold = 10; // pixels from bottom
    const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
    return atBottom;
  };

  // Handle scroll events
  const handleLogsScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
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
      if (logsEndRef.current) {
        logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
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
    }
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
                    Camera Feed
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                      criticalAlert ? 'bg-white' : 'bg-red-500'
                    }`}></div>
                    <span className={`text-sm transition-colors duration-500 ${
                      criticalAlert ? 'text-white' : 'text-gray-600'
                    }`}>Live</span>
                  </div>
                </div>
              </div>
              
              <div className={`aspect-video relative overflow-hidden transition-all duration-500 ${
                criticalAlert ? 'bg-red-900' : 'bg-gray-900'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-br flex items-center justify-center transition-all duration-500 ${
                  criticalAlert 
                    ? 'from-red-800 to-red-900' 
                    : 'from-gray-800 to-gray-900'
                }`}>
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Camera Feed Simulation</p>
                    <p className={`transition-colors duration-500 ${
                      criticalAlert ? 'text-red-200' : 'text-gray-400'
                    }`}>Live video stream would appear here</p>
                  </div>
                </div>
                
                {/* Overlay Info */}
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                  <div className="text-sm">Camera 1 - Main Entrance</div>
                  <div className="text-xs text-gray-300">{new Date().toLocaleTimeString()}</div>
                </div>
                
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
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
                  }`}>Zone Distribution:</div>
                  {densityData.zones.map((zone, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className={`transition-colors duration-500 ${
                        criticalAlert ? 'text-red-200' : 'text-gray-600'
                      }`}>{zone}</span>
                      <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                        criticalAlert ? 'bg-white' : 'bg-blue-500'
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
                <MessageSquare className={`w-5 h-5 transition-colors duration-500 ${
                  criticalAlert ? 'text-white' : 'text-purple-600'
                }`} />
                Live Activity Logs
              </h3>
              {!isAtBottom && (
                <button
                  onClick={() => {
                    setIsAtBottom(true);
                    setTimeout(() => {
                      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className={`mt-2 px-3 py-1 text-xs rounded-full transition-colors ${
                    criticalAlert 
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