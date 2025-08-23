'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, Music, Brain, Download, Share2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface SavedSession {
  id: string;
  date: string;
  mood: string;
  confidence: number;
  refinedMood: string;
  reasoning: string;
  playlistCount: number;
  imageUrl?: string;
}

export default function LibraryPage() {
  const [sessions, setSessions] = useState<SavedSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');

  useEffect(() => {
    // Mock data - in real app this would come from localStorage or database
    const mockSessions: SavedSession[] = [
      {
        id: '1',
        date: '2024-01-20',
        mood: 'happy',
        confidence: 0.92,
        refinedMood: 'energetic',
        reasoning: 'Your positive energy suggests you\'re ready to tackle challenges',
        playlistCount: 3,
        imageUrl: '/api/placeholder/150/150'
      },
      {
        id: '2',
        date: '2024-01-19',
        mood: 'calm',
        confidence: 0.87,
        refinedMood: 'centered',
        reasoning: 'Your peaceful state is perfect for deep work and learning',
        playlistCount: 2
      },
      {
        id: '3',
        date: '2024-01-18',
        mood: 'stressed',
        confidence: 0.83,
        refinedMood: 'focused-calm',
        reasoning: 'Your stress indicates high engagement. Let\'s redirect this energy',
        playlistCount: 4
      },
      {
        id: '4',
        date: '2024-01-17',
        mood: 'excited',
        confidence: 0.95,
        refinedMood: 'dynamic',
        reasoning: 'Your excitement shows great potential energy for creative activities',
        playlistCount: 3
      },
      {
        id: '5',
        date: '2024-01-16',
        mood: 'neutral',
        confidence: 0.74,
        refinedMood: 'balanced',
        reasoning: 'Your balanced state provides flexibility to choose direction mindfully',
        playlistCount: 2
      }
    ];
    setSessions(mockSessions);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.reasoning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.mood.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMood === 'all' || session.mood === filterMood;
    return matchesSearch && matchesFilter;
  });

  const moodEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    stressed: '😰',
    excited: '🤩',
    calm: '😌',
    neutral: '😐',
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Your Vibe Library</h1>
              <p className="text-muted-foreground">
                Explore your mood journey and saved sessions
              </p>
            </div>
            <Link href="/studio">
              <Button size="lg" className="mt-4 md:mt-0">
                New Mood Scan
                <Brain className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search your sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="all">All Moods</option>
              <option value="happy">Happy</option>
              <option value="calm">Calm</option>
              <option value="stressed">Stressed</option>
              <option value="excited">Excited</option>
              <option value="neutral">Neutral</option>
              <option value="sad">Sad</option>
            </select>
          </div>
        </motion.div>

        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">
                          {session.mood}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {moodEmojis[session.mood] || '😐'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium capitalize">{session.refinedMood}</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(session.confidence * 100)}% confidence
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.reasoning}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Music className="w-4 h-4" />
                        {session.playlistCount} playlists generated
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteSession(session.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredSessions.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Brain className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No sessions found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm || filterMood !== 'all' 
                      ? 'Try adjusting your search or filter.'
                      : 'Start your first mood scan to build your library.'
                    }
                  </p>
                  <Link href="/studio">
                    <Button>Start Mood Scan</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Mood Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-muted-foreground">Coming Soon</h3>
                    <p className="text-muted-foreground">
                      Track your mood patterns and insights over time
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Happy', 'Calm', 'Stressed', 'Excited'].map((mood, index) => (
                      <div key={mood} className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl mb-2">{moodEmojis[mood.toLowerCase()]}</div>
                        <p className="font-medium">{mood}</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 30 + 10)}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playlists">
            <Card>
              <CardHeader>
                <CardTitle>Saved Playlists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Music className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your Mood Playlists</h3>
                  <p className="text-muted-foreground mb-6">
                    All your generated playlists will appear here
                  </p>
                  <Link href="/studio">
                    <Button>Generate Playlists</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}