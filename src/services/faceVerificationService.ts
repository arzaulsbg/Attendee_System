export interface FaceVerificationService {
  verifyFace: (liveImageData: string, storedImageUrl: string, userId: string) => Promise<boolean>;
  enrollFace: (imageData: string, userId: string) => Promise<void>;
}

class FaceVerificationServiceImpl implements FaceVerificationService {
  private readonly API_BASE_URL = 'https://your-face-api.com'; // Replace with actual API

  async verifyFace(liveImageData: string, storedImageUrl: string, userId: string): Promise<boolean> {
    try {
      // Real API call: send both live image and stored image URL
      const response = await fetch(`${this.API_BASE_URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          live_image: liveImageData,
          stored_image_url: storedImageUrl,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Face verification failed');
      }

      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Face verification error:', error);
      return false;
    }
  }

  async enrollFace(imageData: string, userId: string): Promise<void> {
    try {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(`${this.API_BASE_URL}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Face enrollment failed');
      }
    } catch (error) {
      console.error('Face enrollment error:', error);
      // Mock success for demo
    }
  }
}

export const faceVerificationService = new FaceVerificationServiceImpl();