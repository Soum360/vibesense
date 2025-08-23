import { NextRequest, NextResponse } from 'next/server';
import type { EmotionResult } from '@/lib/types';

// TODO: REPLACE WITH REAL DEEPFACE API
// This is a mock endpoint for demonstration purposes
// Real implementation should integrate with DeepFace:
// pip install deepface
// from deepface import DeepFace
// result = DeepFace.analyze(img_path="path/to/image.jpg", actions=['emotion'])

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, audioBase64, textInput } = body;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock emotion detection logic
    let mockResult: EmotionResult;

    if (textInput) {
      // Simple text-based mood detection
      const text = textInput.toLowerCase();
      if (text.includes('happy') || text.includes('great') || text.includes('awesome')) {
        mockResult = {
          mood: 'happy',
          confidence: 0.92,
          details: { text_sentiment: 0.85, keywords_match: 0.9 }
        };
      } else if (text.includes('sad') || text.includes('down') || text.includes('depressed')) {
        mockResult = {
          mood: 'sad',
          confidence: 0.88,
          details: { text_sentiment: 0.15, keywords_match: 0.85 }
        };
      } else if (text.includes('stress') || text.includes('anxious') || text.includes('worried')) {
        mockResult = {
          mood: 'stressed',
          confidence: 0.85,
          details: { text_sentiment: 0.25, keywords_match: 0.8 }
        };
      } else if (text.includes('excited') || text.includes('pumped') || text.includes('energetic')) {
        mockResult = {
          mood: 'excited',
          confidence: 0.9,
          details: { text_sentiment: 0.9, keywords_match: 0.88 }
        };
      } else {
        mockResult = {
          mood: 'neutral',
          confidence: 0.7,
          details: { text_sentiment: 0.5, keywords_match: 0.3 }
        };
      }
    } else {
      // Mock random mood for image/audio input
      const moods = ['happy', 'calm', 'excited', 'neutral', 'stressed'] as const;
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      
      mockResult = {
        mood: randomMood,
        confidence: 0.7 + Math.random() * 0.25, // 70-95% confidence
        details: {
          face_detection: 0.95,
          eye_contact: 0.8,
          facial_landmarks: 0.92,
          emotion_dominant: randomMood,
        }
      };
    }

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('Emotion detection error:', error);
    return NextResponse.json(
      { error: 'Emotion detection failed' },
      { status: 500 }
    );
  }
}