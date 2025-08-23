'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { EmotionResult } from '@/lib/types';

interface MoodCardProps {
  emotion: EmotionResult;
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  stressed: '😰',
  excited: '🤩',
  calm: '😌',
  neutral: '😐',
  angry: '😠',
  surprised: '😲',
};

const moodColors: Record<string, string> = {
  happy: 'text-yellow-500',
  sad: 'text-blue-500',
  stressed: 'text-red-500',
  excited: 'text-purple-500',
  calm: 'text-blue-400',
  neutral: 'text-gray-500',
  angry: 'text-red-600',
  surprised: 'text-orange-500',
};

export function MoodCard({ emotion }: MoodCardProps) {
  const confidencePercentage = Math.round(emotion.confidence * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2">
            <span className="text-4xl">
              {moodEmojis[emotion.mood] || '😐'}
            </span>
            <span className="capitalize">{emotion.mood}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Confidence</span>
              <Badge variant="outline">{confidencePercentage}%</Badge>
            </div>
            <Progress value={confidencePercentage} className="h-2" />
          </div>
          
          {emotion.details && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Detection Details</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                {Object.entries(emotion.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <span>{typeof value === 'number' ? `${Math.round(value * 100)}%` : value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}