import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, Check } from 'lucide-react';
import { cameraService } from '@/services/cameraService';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  title?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  title = "Capture Photo"
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        cameraService.stopCamera(stream);
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      if (videoRef.current) {
        const mediaStream = await cameraService.startCamera(videoRef.current);
        setStream(mediaStream);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Camera access failed');
    }
  };

  const handleCapture = async () => {
    if (!videoRef.current || !stream) return;
    
    setIsCapturing(true);
    try {
      const imageData = await cameraService.capturePhoto(videoRef.current);
      onCapture(imageData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Photo capture failed');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleClose = () => {
    if (stream) {
      cameraService.stopCamera(stream);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={startCamera}>Try Again</Button>
            </div>
          ) : (
            <>
              <div className="relative mb-4 bg-muted rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  playsInline
                  muted
                />
                <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none" />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  onClick={handleCapture} 
                  disabled={isCapturing || !stream}
                  className="flex-1"
                >
                  {isCapturing ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Capture
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};