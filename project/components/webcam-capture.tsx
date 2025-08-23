'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface WebcamCaptureProps {
  onCapture: (imageData: string) => void;
}

export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const requestPermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
    } catch (err) {
      setHasPermission(false);
    }
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, []);

  const retake = useCallback(() => {
    setCapturedImage(null);
  }, []);

  const analyze = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  }, [capturedImage, onCapture]);

  if (hasPermission === null) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Camera Access</CardTitle>
          <CardDescription>
            We need access to your camera to analyze your facial expressions
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={requestPermission} className="w-full">
            <Camera className="w-4 h-4 mr-2" />
            Enable Camera
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (hasPermission === false) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Camera Permission Denied</CardTitle>
          <CardDescription>
            Please enable camera access in your browser settings to continue
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
      className="space-y-4"
    >
      <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden">
        {!capturedImage ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            mirrored
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: 'user',
            }}
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured selfie"
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Overlay guides */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-primary/30 rounded-full flex items-center justify-center">
            <div className="text-primary/60 text-center">
              <Camera className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Center your face</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        {!capturedImage ? (
          <Button onClick={capture} size="lg" className="px-8">
            <Camera className="w-4 h-4 mr-2" />
            Capture Photo
          </Button>
        ) : (
          <>
            <Button onClick={retake} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake
            </Button>
            <Button onClick={analyze} size="lg" className="px-8">
              Analyze Mood
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}