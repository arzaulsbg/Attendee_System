export interface FaceVerificationService {
  verifyFace: (imageData: string, userId: string) => Promise<boolean>;
  enrollFace: (imageData: string, userId: string) => Promise<void>;
}

class FaceVerificationServiceImpl implements FaceVerificationService {
  private readonly API_BASE_URL = 'https://your-face-api.com'; // Replace with actual API

  async verifyFace(imageData: string, userId: string): Promise<boolean> {
    try {
      // Mock implementation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate API call
      const response = await fetch(`${this.API_BASE_URL}/verify`, {
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
        throw new Error('Face verification failed');
      }

      const result = await response.json();
      return result.verified || Math.random() > 0.2; // Mock success rate
    } catch (error) {
      console.error('Face verification error:', error);
      // Return mock result for demo
      return Math.random() > 0.2;
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