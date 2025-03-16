import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Brain,
  Sun,
  Moon,
  User,
  LayoutDashboard,
  Video,
  BarChart3,
  Settings,
  Sliders,
  Cloud,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../App';

function Layout() {
  const [isDark, setIsDark] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-secondary border-r border-secondary">
        <div className="flex items-center gap-2 px-6 h-16">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">InterviewAI</span>
        </div>
        <nav className="px-4 mt-8">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/video-bot"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/video-bot')
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <Video className="h-5 w-5" />
            <span>AI Interview</span>
          </Link>
          <Link
            to="/analysis"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/analysis')
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Analysis</span>
          </Link>
          <Link
            to="/custom-modes"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/custom-modes')
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <Sliders className="h-5 w-5" />
            <span>Custom Modes</span>
          </Link>
          <Link
            to="/recordings"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/recordings')
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            }`}
          >
            <Cloud className="h-5 w-5" />
            <span>Recordings</span>
          </Link>
          <hr className="my-4 border-secondary" />
          <button 
            onClick={handleSettingsClick}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full hover:bg-accent"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-red-500 hover:bg-accent"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Navigation */}
        <div className="h-16 border-b border-secondary px-8 flex items-center justify-end gap-4">
          <LanguageSelector />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                <User className="h-5 w-5" />
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-secondary rounded-lg shadow-lg py-1">
                <button 
                  onClick={handleSettingsClick}
                  className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors"
                >
                  Profile Settings
                </button>
                <button 
                  onClick={handleSettingsClick}
                  className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors"
                >
                  Notification Settings
                </button>
                <button 
                  onClick={handleSettingsClick}
                  className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors"
                >
                  Subscription
                </button>
                <hr className="my-1 border-secondary" />
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-red-500 hover:bg-secondary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;