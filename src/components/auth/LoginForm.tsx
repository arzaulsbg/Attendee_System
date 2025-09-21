import React, { useState } from 'react';
import { CameraCapture } from '@/components/shared/CameraCapture';
import { uploadProfileImageBase64 } from '@/services/storageService';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

interface LoginFormProps {
  onToggleMode: () => void;
  isRegisterMode: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode, isRegisterMode }) => {
  const { login, register, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'student' as const,
    department: '',
    studentId: '',
    facultyId: '',
    phone: '',
    faceImageUrl: '',
  });
  const [showCamera, setShowCamera] = useState(false);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [uploadingFace, setUploadingFace] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegisterMode) {
        if (!faceImage) {
          toast({
            title: "Face Required",
            description: "Please capture your face to complete registration.",
            variant: "destructive",
          });
          return;
        }
        setUploadingFace(true);
        // Upload to FastAPI backend
        const url = await uploadProfileImageBase64(faceImage);
        setFormData(prev => ({ ...prev, faceImageUrl: url }));
        setUploadingFace(false);
        await register({ ...formData, faceImageUrl: url });
        toast({
          title: "Registration Successful",
          description: "Welcome to Smart Attendance System!",
        });
      } else {
        await login(formData.email, formData.password);
        toast({
          title: "Login Successful",
          description: "Welcome back to Smart Attendance System!",
        });
      }
    } catch (error) {
      setUploadingFace(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    }
  };
  const handleFaceCapture = (imageData: string) => {
    setFaceImage(imageData);
    setShowCamera(false);
  };
  const handleRemoveFace = () => {
    setFaceImage(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <Card className="shadow-elevated border-0 bg-gradient-card">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Smart Attendance
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isRegisterMode ? 'Create your account to get started' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={isRegisterMode ? 'register' : 'login'} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger 
                  value="login" 
                  onClick={() => !isRegisterMode || onToggleMode()}
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  onClick={() => isRegisterMode || onToggleMode()}
                  className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegisterMode && (
                  <>
                    <div className="space-y-2">
                      <Label>Face Capture</Label>
                      {faceImage ? (
                        <div className="flex flex-col items-center gap-2">
                          <img src={faceImage} alt="Face Preview" className="w-32 h-32 rounded-full object-cover border" />
                          <Button type="button" variant="outline" onClick={handleRemoveFace} disabled={uploadingFace}>Remove</Button>
                        </div>
                      ) : (
                        <Button type="button" onClick={() => setShowCamera(true)} disabled={uploadingFace}>
                          Capture Face
                        </Button>
                      )}
                    </div>
      {showCamera && (
        <CameraCapture
          onCapture={handleFaceCapture}
          onClose={() => setShowCamera(false)}
          title="Capture Your Face"
        />
      )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="transition-all duration-200 focus:shadow-glow"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                  {!isRegisterMode && (
                    <p className="text-xs text-muted-foreground">
                      Demo: student@demo.com, faculty@demo.com, admin@demo.com
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                      {isRegisterMode ? 'Create Account' : 'Sign In'}
                    </div>
                  )}
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};