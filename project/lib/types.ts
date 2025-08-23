export interface EmotionResult {
  mood: 'happy' | 'sad' | 'stressed' | 'neutral' | 'excited' | 'calm' | 'angry' | 'surprised';
  confidence: number;
  details?: Record<string, any>;
}

export interface MoodRefinement {
  refinedMood: string;
  reasoning: string;
  suggestions: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  trackCount: number;
  duration: string;
  source: 'Spotify' | 'YouTube' | 'Apple Music';
  genre?: string;
  previewUrl?: string;
}

export interface EmotionDetectionRequest {
  imageBase64?: string;
  audioBase64?: string;
  textInput?: string;
}

export interface MoodRefinementRequest {
  mood: string;
  contextText?: string;
  userProfile?: Record<string, any>;
}