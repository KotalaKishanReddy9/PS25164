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
  const logsEndRef = useRef<HTMLDivElement>(null);

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
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const sendAlert = () => {
    const alertMessage = {
      id: Date.now().toString(),
      message: `ALERT: Manual alert triggered by ${user.name}`,
      timestamp: new Date(),
      type: 'error' as const
    };
    setLogs(prev => [...prev, alertMessage]);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Camera className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Security Dashboard</h1>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-100">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Assistant {assistantStatus}</span>
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
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    {user.role}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={onShowProfile}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Profile Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Camera className="w-6 h-6 text-blue-600" />
                    Camera Feed
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live</span>
                  </div>
                </div>
              </div>
              
              <div className="aspect-video bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Camera Feed Simulation</p>
                    <p className="text-gray-400">Live video stream would appear here</p>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Map className="w-5 h-5 text-green-600" />
                  Density Map
                </h3>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current Occupancy</span>
                    <span className="text-lg font-bold text-gray-900">{densityData.current}/{densityData.max}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(densityData.current / densityData.max) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Zone Distribution:</div>
                  {densityData.zones.map((zone, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{zone}</span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alert Button */}
            <button
              onClick={sendAlert}
              className="w-full p-4 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
            >
              <Bell className="w-5 h-5" />
              Send Alert
            </button>
          </div>
        </div>

        {/* Live Chat/Logs */}
        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Live Activity Logs
              </h3>
            </div>
            
            <div className="h-64 overflow-y-auto p-4 space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    log.type === 'error' ? 'bg-red-500' : 
                    log.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900">{log.message}</div>
                    <div className="text-xs text-gray-500">{log.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
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