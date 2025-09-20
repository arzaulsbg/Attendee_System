export interface CameraService {
  startCamera: (videoElement: HTMLVideoElement) => Promise<MediaStream>;
  capturePhoto: (videoElement: HTMLVideoElement) => Promise<string>;
  stopCamera: (stream: MediaStream) => void;
}

class CameraServiceImpl implements CameraService {
  async startCamera(videoElement: HTMLVideoElement): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      videoElement.srcObject = stream;
      await videoElement.play();
      
      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw new Error('Camera access denied or not available');
    }
  }

  async capturePhoto(videoElement: HTMLVideoElement): Promise<string> {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Canvas context not available');
    }

    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }

  stopCamera(stream: MediaStream): void {
    stream.getTracks().forEach(track => track.stop());
  }
}

export const cameraService = new CameraServiceImpl();