'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, ExternalLink, Download, Music } from 'lucide-react';
import { useState } from 'react';
import type { Playlist } from '@/lib/types';

interface PlaylistCardProps {
  playlists: Playlist[];
  mood: string;
}

export function PlaylistCard({ playlists, mood }: PlaylistCardProps) {
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);

  const togglePlay = (playlistId: string) => {
    setCurrentPlaying(currentPlaying === playlistId ? null : playlistId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-primary" />
              Curated Playlists
            </div>
            <Badge className="capitalize">{mood}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {playlists.map((playlist, index) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{playlist.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {playlist.trackCount} tracks • {playlist.duration}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {playlist.source}
                    </Badge>
                    {playlist.genre && (
                      <Badge variant="outline" className="text-xs">
                        {playlist.genre}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {playlist.description}
              </p>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => togglePlay(playlist.id)}
                  className="flex-1"
                >
                  {currentPlaying === playlist.id ? (
                    <Pause className="w-4 h-4 mr-1" />
                  ) : (
                    <Play className="w-4 h-4 mr-1" />
                  )}
                  {currentPlaying === playlist.id ? 'Pause' : 'Play'}
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Mock audio player */}
              {currentPlaying === playlist.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-muted/50 rounded p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-primary/20 rounded">
                      <motion.div
                        className="h-full bg-primary rounded"
                        initial={{ width: '0%' }}
                        animate={{ width: '30%' }}
                        transition={{ duration: 2 }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">1:23 / 4:15</span>
                  </div>
                  <p className="text-sm mt-2">Now Playing: Sample Track</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}