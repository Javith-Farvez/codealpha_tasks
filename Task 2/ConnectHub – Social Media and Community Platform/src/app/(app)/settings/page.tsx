'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="max-w-2xl mx-auto border-r border-border min-h-screen">
      {/* Header */}
      <div className="sticky top-0 backdrop-blur-xl bg-background/80 border-b border-border px-6 py-4 z-40">
        <h2 className="font-display font-bold text-xl">Settings</h2>
      </div>

      {/* Settings Content */}
      <div className="p-6 space-y-8">
        {/* Theme Settings */}
        <div>
          <h3 className="font-display font-bold text-lg mb-4">Appearance</h3>
          <div className="space-y-3">
            <label className="block text-sm font-medium mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    if (mounted) setTheme(id);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    mounted && theme === id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="border-t border-border pt-8">
          <h3 className="font-display font-bold text-lg mb-4">Privacy & Safety</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium text-sm">Private Account</p>
                <p className="text-xs text-foreground/60">Require approval for new followers</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition">
              <input type="checkbox" className="w-4 h-4" />
              <div>
                <p className="font-medium text-sm">Allow Messages</p>
                <p className="text-xs text-foreground/60">Let anyone send you direct messages</p>
              </div>
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="border-t border-border pt-8">
          <h3 className="font-display font-bold text-lg mb-4">Notifications</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium text-sm">Push Notifications</p>
                <p className="text-xs text-foreground/60">Get notified about likes and comments</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-secondary/50 cursor-pointer transition">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <div>
                <p className="font-medium text-sm">Email Notifications</p>
                <p className="text-xs text-foreground/60">Receive email updates about your account</p>
              </div>
            </label>
          </div>
        </div>

        {/* Account Settings */}
        <div className="border-t border-border pt-8">
          <h3 className="font-display font-bold text-lg mb-4">Account</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Download Your Data
            </Button>
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
              Delete Account
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-8 text-xs text-foreground/60">
          <p>ConnectHub v1.0.0</p>
          <p>© 2026 ConnectHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
