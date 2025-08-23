import { NextRequest, NextResponse } from 'next/server';
import type { Playlist } from '@/lib/types';

// TODO: REPLACE WITH REAL SPOTIFY/YOUTUBE API
// This is a mock endpoint for demonstration purposes
// Real implementation should integrate with Spotify Web API and YouTube Data API:
//
// Spotify:
// const spotifyResponse = await fetch(`https://api.spotify.com/v1/search?q=${mood}&type=playlist&limit=10`, {
//   headers: {
//     'Authorization': `Bearer ${spotifyAccessToken}`,
//     'Content-Type': 'application/json'
//   }
// });
//
// YouTube:
// const youtubeResponse = await fetch(
//   `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${mood}%20playlist&type=playlist&key=${youtubeApiKey}&maxResults=5`
// );

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mood = searchParams.get('mood') || 'neutral';

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock playlist data based on mood
    const playlistDatabase: Record<string, Playlist[]> = {
      happy: [
        {
          id: 'spotify-happy-1',
          name: 'Good Vibes Only',
          description: 'Uplifting tracks to keep your positive energy flowing',
          trackCount: 50,
          duration: '3h 15m',
          source: 'Spotify',
          genre: 'Pop/Indie',
          previewUrl: 'https://example.com/preview1'
        },
        {
          id: 'youtube-happy-1',
          name: 'Feel-Good Hits',
          description: 'Classic happy songs that never get old',
          trackCount: 32,
          duration: '2h 8m',
          source: 'YouTube',
          genre: 'Classic Rock',
          previewUrl: 'https://example.com/preview2'
        }
      ],
      sad: [
        {
          id: 'spotify-sad-1',
          name: 'Melancholic Moments',
          description: 'Beautiful, contemplative songs for reflective times',
          trackCount: 28,
          duration: '1h 52m',
          source: 'Spotify',
          genre: 'Indie/Alternative',
          previewUrl: 'https://example.com/preview3'
        },
        {
          id: 'apple-sad-1',
          name: 'Rainy Day Acoustics',
          description: 'Gentle acoustic melodies for quiet reflection',
          trackCount: 45,
          duration: '2h 43m',
          source: 'Apple Music',
          genre: 'Acoustic',
          previewUrl: 'https://example.com/preview4'
        }
      ],
      stressed: [
        {
          id: 'spotify-stressed-1',
          name: 'Stress Relief',
          description: 'Calming instrumentals to help you unwind and refocus',
          trackCount: 60,
          duration: '4h 12m',
          source: 'Spotify',
          genre: 'Ambient/Instrumental',
          previewUrl: 'https://example.com/preview5'
        },
        {
          id: 'youtube-stressed-1',
          name: 'Meditation & Focus',
          description: 'Binaural beats and nature sounds for deep relaxation',
          trackCount: 25,
          duration: '3h 30m',
          source: 'YouTube',
          genre: 'Ambient',
          previewUrl: 'https://example.com/preview6'
        }
      ],
      excited: [
        {
          id: 'spotify-excited-1',
          name: 'Energy Boost',
          description: 'High-energy tracks to match your enthusiasm',
          trackCount: 40,
          duration: '2h 35m',
          source: 'Spotify',
          genre: 'Electronic/Dance',
          previewUrl: 'https://example.com/preview7'
        },
        {
          id: 'apple-excited-1',
          name: 'Pump It Up',
          description: 'Motivational anthems for getting things done',
          trackCount: 36,
          duration: '2h 18m',
          source: 'Apple Music',
          genre: 'Hip-Hop/Rock',
          previewUrl: 'https://example.com/preview8'
        }
      ],
      calm: [
        {
          id: 'spotify-calm-1',
          name: 'Peaceful Mind',
          description: 'Serene soundscapes for meditation and focus',
          trackCount: 35,
          duration: '2h 45m',
          source: 'Spotify',
          genre: 'Ambient/New Age',
          previewUrl: 'https://example.com/preview9'
        },
        {
          id: 'youtube-calm-1',
          name: 'Nature Sounds & Soft Piano',
          description: 'Gentle piano melodies mixed with natural ambience',
          trackCount: 22,
          duration: '1h 38m',
          source: 'YouTube',
          genre: 'Classical/Ambient',
          previewUrl: 'https://example.com/preview10'
        }
      ],
      neutral: [
        {
          id: 'spotify-neutral-1',
          name: 'Daily Mix',
          description: 'A balanced mix of genres for any mood',
          trackCount: 50,
          duration: '3h 22m',
          source: 'Spotify',
          genre: 'Mixed',
          previewUrl: 'https://example.com/preview11'
        },
        {
          id: 'apple-neutral-1',
          name: 'Background Vibes',
          description: 'Perfect background music for work or relaxation',
          trackCount: 42,
          duration: '2h 54m',
          source: 'Apple Music',
          genre: 'Chill/Lo-Fi',
          previewUrl: 'https://example.com/preview12'
        }
      ]
    };

    // Get playlists for the requested mood, fallback to neutral
    const moodPlaylists = playlistDatabase[mood] || playlistDatabase.neutral;
    
    // Add some variety by including a cross-mood playlist
    const crossMoodOptions = Object.keys(playlistDatabase)
      .filter(m => m !== mood)
      .slice(0, 1);
    
    if (crossMoodOptions.length > 0) {
      const crossMood = crossMoodOptions[0];
      const crossPlaylist = playlistDatabase[crossMood]?.[0];
      if (crossPlaylist) {
        crossPlaylist.description = `Alternative vibe: ${crossPlaylist.description}`;
        moodPlaylists.push(crossPlaylist);
      }
    }

    return NextResponse.json(moodPlaylists.slice(0, 3)); // Return max 3 playlists
  } catch (error) {
    console.error('Playlist fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    );
  }
}