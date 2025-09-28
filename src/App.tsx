import React, { useState, useEffect } from 'react';
import UserProfile from './components/UserProfile';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import { User } from 'lucide-react';

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Check for existing session
    const sessionUserId = sessionStorage.getItem('session_user_id');
    const isUserLoggedIn = sessionStorage.getItem('is_logged_in') === 'true';
    
    if (sessionUserId && isUserLoggedIn) {
      const users = JSON.parse(localStorage.getItem('app_users') || '[]');
      const currentUser = users.find((u: any) => u.id === sessionUserId);
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
      }
    }
    
    // Always ensure demo users exist
    const demoUsers = [
      {
        id: 'demo-user-1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'admin',
        faceImage: null
      },
      {
        id: 'demo-user-2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'password123',
        role: 'operator',
        faceImage: null
      },
      {
        id: 'demo-user-3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        password: 'password123',
        role: 'viewer',
        faceImage: null
      }
    ];
    
    // Always create/update demo users to ensure they exist
    localStorage.setItem('app_users', JSON.stringify(demoUsers));
  }, []);

  const handleLogin = (loggedInUser: any) => {
    setUser(loggedInUser);
    setIsLoggedIn(true);
    sessionStorage.setItem('session_user_id', loggedInUser.id);
    sessionStorage.setItem('is_logged_in', 'true');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('session_user_id');
    sessionStorage.removeItem('is_logged_in');
    setUser(null);
    setIsLoggedIn(false);
    setShowProfile(false);
  };

  const handleUserUpdate = (updatedUser: any) => {
    setUser(updatedUser);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoginForm onLogin={handleLogin} />
      </div>
    );
  }

  if (showProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
            <button
              onClick={() => setShowProfile(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          
          <UserProfile 
            user={user} 
            onLogout={handleLogout}
            onUpdate={handleUserUpdate}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard 
        user={user} 
        onLogout={handleLogout}
        onShowProfile={() => setShowProfile(true)}
      />
    </div>
  );
}

export default App;