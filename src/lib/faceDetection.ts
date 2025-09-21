// On-device face detection using OpenCV.js (WebAssembly)
// This is a simplified example. For production, use a more robust pipeline and error handling.

export async function loadOpenCV(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).cv) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = '/opencv.js';
    script.async = true;
    script.onload = () => {
      // Wait for OpenCV to be ready
      (window as any).cv['onRuntimeInitialized'] = () => resolve();
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export async function detectFaceFromVideo(video: HTMLVideoElement): Promise<Uint8ClampedArray | null> {
  await loadOpenCV();
  const cv = (window as any).cv;
  const cap = new cv.VideoCapture(video);
  const frame = new cv.Mat(video.height, video.width, cv.CV_8UC4);
  cap.read(frame);
  // Convert to gray
  const gray = new cv.Mat();
  cv.cvtColor(frame, gray, cv.COLOR_RGBA2GRAY);
  // Load Haar cascade (ensure haarcascade_frontalface_default.xml is available)
  const faceCascade = new cv.CascadeClassifier();
  await new Promise((res) => {
    faceCascade.load('haarcascade_frontalface_default.xml');
    res(null);
  });
  const faces = new cv.RectVector();
  faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0);
  if (faces.size() > 0) {
    const faceRect = faces.get(0);
    const faceMat = gray.roi(faceRect);
    // Return raw pixel data (for embedding extraction, send to backend)
    const imageData = new Uint8ClampedArray(faceMat.data);
    frame.delete();
    gray.delete();
    faceMat.delete();
    faces.delete();
    faceCascade.delete();
    return imageData;
  }
  frame.delete();
  gray.delete();
  faces.delete();
  faceCascade.delete();
  return null;
}
