import QRCode from 'qrcode';
import jsQR from 'jsqr';

export interface QRService {
  generateQR: (data: string) => Promise<string>;
  scanQR: (imageData: ImageData) => string | null;
}

class QRServiceImpl implements QRService {
  async generateQR(data: string): Promise<string> {
    try {
      const qrDataURL = await QRCode.toDataURL(data, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  scanQR(imageData: ImageData): string | null {
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      return code ? code.data : null;
    } catch (error) {
      console.error('Error scanning QR code:', error);
      return null;
    }
  }
}

export const qrService = new QRServiceImpl();