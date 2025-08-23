'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebcamCapture } from '@/components/webcam-capture';
import { VoiceRecorder } from '@/components/voice-recorder';
import { MoodCard } from '@/components/mood-card';
import { ResultCard } from '@/components/result-card';
import { PlaylistCard } from '@/components/playlist-card';
import { OrbAnimation } from '@/components/orb-animation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Mic, Type, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EmotionService } from '@/lib/services/emotion';
import { MoodService } from '@/lib/services/mood';
import { PlaylistService } from '@/lib/services/playlist';
import type { EmotionResult, MoodRefinement, Playlist } from '@/lib/types';

type StudioStep = 'input' | 'analyzing' | 'results';

export default function StudioPage() {
  const [step, setStep] = useState<StudioStep>('input');
  const [inputMode, setInputMode] = useState<'text' | 'camera' | 'voice'>('camera');
  const [textInput, setTextInput] = useState('');
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(null);
  const [moodRefinement, setMoodRefinement] = useState<MoodRefinement | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { toast } = useToast();

  const handleImageCapture = async (imageData: string) => {
    setStep('analyzing');
    
    try {
      // Mock analysis delay for demo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const emotion = await EmotionService.detectEmotion({ imageBase64: imageData });
      setEmotionResult(emotion);
      
      const refinement = await MoodService.refineMood({
        mood: emotion.mood,
        contextText: textInput || undefined,
      });
      setMoodRefinement(refinement);
      
      const playlistData = await PlaylistService.getPlaylists(refinement.refinedMood);
      setPlaylists(playlistData);
      
      setStep('results');
      
      toast({
        title: "Mood detected!",
        description: `You're feeling ${emotion.mood} today.`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again.",
        variant: "destructive",
      });
      setStep('input');
    }
  };

  const handleVoiceCapture = async (audioData: string) => {
    setStep('analyzing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const emotion = await EmotionService.detectEmotion({ audioBase64: audioData });
      setEmotionResult(emotion);
      
      const refinement = await MoodService.refineMood({
        mood: emotion.mood,
        contextText: textInput || undefined,
      });
      setMoodRefinement(refinement);
      
      const playlistData = await PlaylistService.getPlaylists(refinement.refinedMood);
      setPlaylists(playlistData);
      
      setStep('results');
      
      toast({
        title: "Voice analyzed!",
        description: `Detected mood: ${emotion.mood}`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again.",
        variant: "destructive",
      });
      setStep('input');
    }
  };

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) {
      toast({
        title: "No input",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    setStep('analyzing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const emotion = await EmotionService.detectEmotion({ textInput });
      setEmotionResult(emotion);
      
      const refinement = await MoodService.refineMood({
        mood: emotion.mood,
        contextText: textInput,
      });
      setMoodRefinement(refinement);
      
      const playlistData = await PlaylistService.getPlaylists(refinement.refinedMood);
      setPlaylists(playlistData);
      
      setStep('results');
      
      toast({
        title: "Text analyzed!",
        description: `Detected mood: ${emotion.mood}`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again.",
        variant: "destructive",
      });
      setStep('input');
    }
  };

  const resetStudio = () => {
    setStep('input');
    setEmotionResult(null);
    setMoodRefinement(null);
    setPlaylists([]);
    setTextInput('');
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      emotionResult ? `mood-gradient-${emotionResult.mood}` : ''
    }`}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-primary" />
            VibeSense Studio
          </h1>
          <p className="text-muted-foreground">
            {step === 'input' && 'Choose how you want to share your vibe'}
            {step === 'analyzing' && 'Analyzing your mood...'}
            {step === 'results' && 'Here\'s what we found'}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Input Mode Selector */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Choose Your Input Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Button
                      variant={inputMode === 'text' ? 'default' : 'outline'}
                      onClick={() => setInputMode('text')}
                      className="h-20 flex-col"
                    >
                      <Type className="w-6 h-6 mb-2" />
                      Type Your Thoughts
                    </Button>
                    <Button
                      variant={inputMode === 'camera' ? 'default' : 'outline'}
                      onClick={() => setInputMode('camera')}
                      className="h-20 flex-col"
                    >
                      <Camera className="w-6 h-6 mb-2" />
                      Take a Selfie
                    </Button>
                    <Button
                      variant={inputMode === 'voice' ? 'default' : 'outline'}
                      onClick={() => setInputMode('voice')}
                      className="h-20 flex-col"
                    >
                      <Mic className="w-6 h-6 mb-2" />
                      Voice Note
                    </Button>
                  </div>

                  {/* Text Input */}
                  {inputMode === 'text' && (
                    <div className="space-y-4">
                      <Input
                        placeholder="How are you feeling today? Describe your mood..."
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="text-lg"
                      />
                      <Button 
                        onClick={handleTextAnalysis}
                        className="w-full"
                        disabled={!textInput.trim()}
                      >
                        Analyze My Mood
                      </Button>
                    </div>
                  )}

                  {/* Camera Input */}
                  {inputMode === 'camera' && (
                    <WebcamCapture onCapture={handleImageCapture} />
                  )}

                  {/* Voice Input */}
                  {inputMode === 'voice' && (
                    <VoiceRecorder onRecordingComplete={handleVoiceCapture} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center min-h-[60vh]"
            >
              <OrbAnimation />
              <h2 className="text-2xl font-semibold mt-8 mb-4">Sensing your vibe...</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Our AI is analyzing your input to understand your current mood and emotional state.
              </p>
            </motion.div>
          )}

          {step === 'results' && emotionResult && moodRefinement && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Vibe Analysis</h2>
                <Button onClick={resetStudio} variant="outline">
                  New Analysis
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <MoodCard emotion={emotionResult} />
                  <ResultCard refinement={moodRefinement} />
                </div>
                <div className="lg:col-span-2">
                  <PlaylistCard playlists={playlists} mood={moodRefinement.refinedMood} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}