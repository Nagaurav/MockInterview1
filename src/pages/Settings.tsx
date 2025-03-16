import React from 'react';
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Languages,
  Volume2,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';

function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg bg-background border border-accent"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg bg-background border border-accent"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                className="w-full px-4 py-2 rounded-lg bg-background border border-accent"
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span>Email Notifications</span>
              <div className="w-11 h-6 bg-accent rounded-full relative cursor-pointer">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-5" />
              </div>
            </label>
            <label className="flex items-center justify-between">
              <span>Interview Reminders</span>
              <div className="w-11 h-6 bg-accent rounded-full relative cursor-pointer">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-5" />
              </div>
            </label>
            <label className="flex items-center justify-between">
              <span>Performance Reports</span>
              <div className="w-11 h-6 bg-accent rounded-full relative cursor-pointer">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-5" />
              </div>
            </label>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="font-medium text-primary">Current Plan: Pro</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your subscription renews on April 1, 2024
              </p>
            </div>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </h2>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 text-left bg-background rounded-lg hover:bg-accent transition-colors">
              Change Password
            </button>
            <button className="w-full px-4 py-2 text-left bg-background rounded-lg hover:bg-accent transition-colors">
              Two-Factor Authentication
            </button>
            <button className="w-full px-4 py-2 text-left bg-background rounded-lg hover:bg-accent transition-colors">
              Connected Devices
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-secondary rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Preferences
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                <span>Theme</span>
              </div>
              <select className="bg-background border border-accent rounded-lg px-3 py-1">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                <span>Language</span>
              </div>
              <select className="bg-background border border-accent rounded-lg px-3 py-1">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                <span>Sound Effects</span>
              </div>
              <div className="w-11 h-6 bg-accent rounded-full relative cursor-pointer">
                <div className="absolute left-0 w-6 h-6 bg-primary rounded-full transform translate-x-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;