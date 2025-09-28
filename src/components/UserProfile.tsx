import React, { useEffect, useState, useRef } from 'react';
import { Camera, User, Mail, CreditCard as Edit3, Trash2, Check, X, AlertTriangle, Loader2 } from 'lucide-react';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    faceImage?: string;
  };
  onLogout: () => void;
  onUpdate?: (updatedUser: any) => void;
}

const STORAGE_KEY = 'app_users';

function UserProfile({ user, onLogout, onUpdate }: UserProfileProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role || 'viewer');
  const [faceImage, setFaceImage] = useState(user.faceImage);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const deleteAccount = async () => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]').filter(
        (u: any) => u.id !== user.id
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      sessionStorage.removeItem('session_user_id');
      setMessage('Account deleted successfully');
      setTimeout(() => onLogout(), 1500);
    } catch (error) {
      setMessage('Failed to delete account');
    }
  };

  const save = async () => {
    if (!name.trim() || !email.trim()) {
      setMessage('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const updatedUsers = users.map((u: any) =>
        u.id === user.id ? { ...u, name: name.trim(), email: email.trim(), role, faceImage } : u
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      
      const updatedUser = { ...user, name: name.trim(), email: email.trim(), role, faceImage };
      onUpdate?.(updatedUser);
      
      setEditing(false);
      setMessage('Profile updated successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setName(user.name);
    setEmail(user.email);
    setRole(user.role || 'viewer');
    setFaceImage(user.faceImage);
    setEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Message Banner */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl border-l-4 ${
          message.includes('success') || message.includes('updated') || message.includes('deleted')
            ? 'bg-green-50 border-green-400 text-green-800'
            : 'bg-red-50 border-red-400 text-red-800'
        } transition-all duration-300`}>
          <div className="flex items-center gap-2">
            {message.includes('success') || message.includes('updated') || message.includes('deleted') ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            {message}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group">
              <img
                src={faceImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff&size=112`}
                alt="Profile avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105"
              />
              {editing && (
                <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-gray-500" />
                <h2 className="text-2xl font-bold text-gray-900 truncate">{name}</h2>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 truncate">{email}</span>
              </div>
              
              {!editing && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              )}

              {editing && (
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={save}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing && (
          <div className="p-8 bg-gray-50">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {role === 'admin' && 'Full system access and user management'}
                    {role === 'operator' && 'Monitor and control system operations'}
                    {role === 'viewer' && 'View-only access to system data'}
                  </p>
                </div>
              </div>
              
              <div>
                <FaceEditor faceImage={faceImage} onChange={setFaceImage} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    deleteAccount();
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FaceEditorProps {
  faceImage: string | null | undefined;
  onChange: (image: string | null) => void;
}

function FaceEditor({ faceImage, onChange }: FaceEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [camOn, setCamOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      stopCam();
    };
  }, []);

  const startCam = async () => {
    setIsLoading(true);
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCamOn(true);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCam = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setCamOn(false);
  };

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/jpeg', 0.8);
      onChange(data);
      stopCam();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Picture</h3>
        <p className="text-sm text-gray-600">Take a new photo or remove your current picture</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {!camOn && (
          <button
            onClick={startCam}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            {isLoading ? 'Starting camera...' : 'Start Camera'}
          </button>
        )}

        {camOn && (
          <div className="space-y-3">
            <video
              ref={videoRef}
              className="w-full max-w-sm rounded-xl bg-black shadow-lg"
              autoPlay
              muted
              playsInline
            />
            <div className="flex gap-2">
              <button
                onClick={capture}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Capture Photo
              </button>
              <button
                onClick={stopCam}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                Stop Camera
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        {faceImage && (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Current Picture</p>
              <img
                src={faceImage}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
              />
            </div>
            <button
              onClick={() => onChange(null)}
              className="flex items-center gap-2 px-3 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Remove Picture
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;