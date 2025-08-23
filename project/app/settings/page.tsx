'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/theme-toggle';
import { Settings, Palette, Key, Bell, Shield, Download } from 'lucide-react';

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    spotify: '',
    youtube: ''
  });

  const [preferences, setPreferences] = useState({
    autoSave: true,
    notifications: true,
    animations: true,
    dataCollection: false
  });

  const [theme, setTheme] = useState({
    preset: 'calm',
    customColors: {
      primary: '#6C5CE7',
      accent: '#00D1B2'
    }
  });

  const handleApiKeyChange = (service: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [service]: value }));
  };

  const handlePreferenceChange = (setting: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [setting]: value }));
  };

  const exportData = () => {
    // Mock export functionality
    const data = {
      sessions: [],
      preferences,
      apiKeys: { ...apiKeys, openai: '***', spotify: '***', youtube: '***' }
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vibesense-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your VibeSense experience and manage integrations
          </p>
        </motion.div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Configure your general app preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Auto-save sessions</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically save your mood scan results
                      </p>
                    </div>
                    <Switch
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => handlePreferenceChange('autoSave', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Enable notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about mood insights and recommendations
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications}
                      onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Enable animations</Label>
                      <p className="text-sm text-muted-foreground">
                        Show smooth transitions and micro-interactions
                      </p>
                    </div>
                    <Switch
                      checked={preferences.animations}
                      onCheckedChange={(checked) => handlePreferenceChange('animations', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>
                    Export your data and manage storage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={exportData} className="w-full md:w-auto">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Download all your sessions, preferences, and settings as JSON
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme & Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the visual appearance of VibeSense
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Dark mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>

                  <div className="space-y-2">
                    <Label>Theme Preset</Label>
                    <Select value={theme.preset} onValueChange={(value) => setTheme(prev => ({ ...prev, preset: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="calm">Calm - Soft blues and greens</SelectItem>
                        <SelectItem value="energetic">Energetic - Vibrant oranges and reds</SelectItem>
                        <SelectItem value="focus">Focus - Clean grays and purples</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {theme.preset === 'custom' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={theme.customColors.primary}
                            onChange={(e) => setTheme(prev => ({
                              ...prev,
                              customColors: { ...prev.customColors, primary: e.target.value }
                            }))}
                            className="w-16 h-10"
                          />
                          <Input
                            value={theme.customColors.primary}
                            onChange={(e) => setTheme(prev => ({
                              ...prev,
                              customColors: { ...prev.customColors, primary: e.target.value }
                            }))}
                            placeholder="#6C5CE7"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Accent Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={theme.customColors.accent}
                            onChange={(e) => setTheme(prev => ({
                              ...prev,
                              customColors: { ...prev.customColors, accent: e.target.value }
                            }))}
                            className="w-16 h-10"
                          />
                          <Input
                            value={theme.customColors.accent}
                            onChange={(e) => setTheme(prev => ({
                              ...prev,
                              customColors: { ...prev.customColors, accent: e.target.value }
                            }))}
                            placeholder="#00D1B2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    API Integrations
                  </CardTitle>
                  <CardDescription>
                    Connect VibeSense with external services for enhanced functionality
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>OpenAI API Key (GPT-5)</Label>
                    <Input
                      type="password"
                      placeholder="sk-..."
                      value={apiKeys.openai}
                      onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Required for advanced mood analysis and personalized recommendations
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Spotify Client ID</Label>
                    <Input
                      type="password"
                      placeholder="Enter your Spotify Client ID"
                      value={apiKeys.spotify}
                      onChange={(e) => handleApiKeyChange('spotify', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Connect to Spotify for personalized playlist recommendations
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>YouTube API Key</Label>
                    <Input
                      type="password"
                      placeholder="Enter your YouTube Data API key"
                      value={apiKeys.youtube}
                      onChange={(e) => handleApiKeyChange('youtube', e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Access YouTube playlists and music videos
                    </p>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">🔧 Developer Note</h4>
                    <p className="text-sm text-muted-foreground">
                      These integrations are currently using mock endpoints. 
                      See the README for instructions on implementing real API connections.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>
                    Control your data privacy and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Anonymous analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Help improve VibeSense by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch
                      checked={preferences.dataCollection}
                      onCheckedChange={(checked) => handlePreferenceChange('dataCollection', checked)}
                    />
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Data Handling</h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Your photos and audio are processed locally and never stored</p>
                      <p>• Mood analysis results are saved locally in your browser</p>
                      <p>• No personal data is sent to third parties without consent</p>
                      <p>• You can export or delete all your data at any time</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full md:w-auto">
                    Clear All Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}