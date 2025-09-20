import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Download, RefreshCw } from 'lucide-react';
import { qrService } from '@/services/qrService';

interface QRGeneratorProps {
  data: string;
  title?: string;
  onRefresh?: () => void;
  refreshable?: boolean;
}

export const QRGenerator: React.FC<QRGeneratorProps> = ({
  data,
  title = "QR Code",
  onRefresh,
  refreshable = false
}) => {
  const [qrImageUrl, setQrImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateQR();
  }, [data]);

  const generateQR = async () => {
    setIsGenerating(true);
    try {
      const qrUrl = await qrService.generateQR(data);
      setQrImageUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrImageUrl) return;
    
    const link = document.createElement('a');
    link.href = qrImageUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      generateQR();
    }
  };

  return (
    <Card>
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          {isGenerating ? (
            <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center mx-auto">
              <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : qrImageUrl ? (
            <img 
              src={qrImageUrl} 
              alt="QR Code" 
              className="w-64 h-64 mx-auto rounded-lg border"
            />
          ) : (
            <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center mx-auto">
              <p className="text-muted-foreground">QR Code generation failed</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={downloadQR} disabled={!qrImageUrl}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          {refreshable && (
            <Button variant="outline" onClick={handleRefresh} disabled={isGenerating}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-4 break-all">
          Data: {data}
        </p>
      </CardContent>
    </Card>
  );
};