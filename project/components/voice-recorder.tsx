'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Square, Play, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface VoiceRecorderProps {
  onRecordingComplete: (audioData: string) => void;
}

export function VoiceRecorder({ onRecordingComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const requestPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
    } catch (err) {
      setHasPermission(false);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          onRecordingComplete(base64Audio);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setHasRecording(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setHasRecording(false);
    setRecordingTime(0);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasPermission === null) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Microphone Access</CardTitle>
          <CardDescription>
            We need access to your microphone to analyze your voice
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={requestPermission} className="w-full">
            <Mic className="w-4 h-4 mr-2" />
            Enable Microphone
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasPermission === false) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Microphone Permission Denied</CardTitle>
          <CardDescription>
            Please enable microphone access in your browser settings to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={requestPermission} variant="outline" className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-6"
    >
      <div className="relative">
        <motion.div
          animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
          className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
            isRecording ? 'bg-red-500' : 'bg-primary'
          }`}
        >
          <Mic className="w-12 h-12 text-white" />
        </motion.div>
        
        {isRecording && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-background border rounded-full px-3 py-1"
          >
            <span className="text-sm font-mono">{formatTime(recordingTime)}</span>
          </motion.div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">
          {!hasRecording && !isRecording && 'Ready to record'}
          {isRecording && 'Recording your voice...'}
          {hasRecording && 'Recording complete!'}
        </h3>
        <p className="text-muted-foreground">
          {!hasRecording && !isRecording && 'Tell us how you\'re feeling today'}
          {isRecording && 'Speak naturally about your current mood'}
          {hasRecording && 'We\'ll analyze your voice for emotional cues'}
        </p>
      </div>

      <div className="flex gap-2 justify-center">
        {!hasRecording && !isRecording && (
          <Button onClick={startRecording} size="lg" className="px-8">
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
        )}
        
        {isRecording && (
          <Button onClick={stopRecording} size="lg" variant="destructive" className="px-8">
            <Square className="w-4 h-4 mr-2" />
            Stop Recording
          </Button>
        )}
        
        {hasRecording && (
          <Button onClick={resetRecording} variant="outline" size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Record Again
          </Button>
        )}
      </div>
    </motion.div>
  );
}