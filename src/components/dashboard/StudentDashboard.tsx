import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Camera, 
  QrCode, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  User,
  BookOpen,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AttendanceStats {
  overall: number;
  present: number;
  absent: number;
  late: number;
  subjects: Array<{
    name: string;
    percentage: number;
    present: number;
    total: number;
    status: 'good' | 'warning' | 'danger';
  }>;
}

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [attendanceStats] = useState<AttendanceStats>({
    overall: 85,
    present: 68, 
    absent: 8,
    late: 4,
    subjects: [
      { name: 'Data Structures', percentage: 92, present: 23, total: 25, status: 'good' },
      { name: 'Database Systems', percentage: 88, present: 22, total: 25, status: 'good' },
      { name: 'Software Engineering', percentage: 76, present: 19, total: 25, status: 'warning' },
      { name: 'Computer Networks', percentage: 68, present: 17, total: 25, status: 'danger' },
    ]
  });

  const handleQRScan = async () => {
    setIsScanning(true);
    try {
      // Mock QR scanning process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "QR Code Scanned Successfully",
        description: "Face verification required to mark attendance",
      });
      
      // Trigger face verification
      handleFaceVerification();
    } catch (error) {
      toast({
        title: "QR Scan Failed",
        description: "Please try again or contact your instructor",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFaceVerification = async () => {
    try {
      // Mock face verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Attendance Marked Successfully",
        description: "You are now marked present for today's class",
        className: "bg-success text-success-foreground",
      });
    } catch (error) {
      toast({
        title: "Face Verification Failed",
        description: "Please ensure good lighting and try again",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-success/10 text-success border-success/20';
      case 'warning': return 'bg-warning/10 text-warning border-warning/20';
      case 'danger': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const quickActions = [
    { icon: QrCode, label: 'Scan QR', action: handleQRScan, color: 'bg-primary', loading: isScanning },
    { icon: Camera, label: 'Face Check', action: handleFaceVerification, color: 'bg-secondary' },
    { icon: MapPin, label: 'Location', action: () => toast({ title: "Location verified" }), color: 'bg-success' },
    { icon: Bell, label: 'Alerts', action: () => toast({ title: "No new alerts" }), color: 'bg-warning' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-elevated">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Welcome back, {user?.name}</h1>
                <p className="text-white/80 text-sm">Student ID: {user?.studentId || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/20">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map(({ icon: Icon, label, action, color, loading }) => (
            <Card key={label} className="hover:shadow-elevated transition-all duration-200 cursor-pointer group" onClick={action}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6 text-white" />
                  )}
                </div>
                <p className="font-medium text-sm">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overall Stats */}
        <Card className="mb-8 bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Overall Attendance
            </CardTitle>
            <CardDescription>Your attendance performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{attendanceStats.overall}%</div>
                <div className="text-sm text-muted-foreground">Overall</div>
                <Progress value={attendanceStats.overall} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success mb-1">{attendanceStats.present}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Present
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-destructive mb-1">{attendanceStats.absent}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Absent
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning mb-1">{attendanceStats.late}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  Late
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject-wise Attendance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Subject-wise Attendance
            </CardTitle>
            <CardDescription>Track your attendance for each subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceStats.subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{subject.name}</h3>
                      <Badge className={getStatusColor(subject.status)}>
                        {subject.percentage}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{subject.present}/{subject.total} classes</span>
                      {subject.status === 'danger' && (
                        <span className="flex items-center gap-1 text-destructive">
                          <AlertTriangle className="w-3 h-3" />
                          Defaulter risk
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-24">
                    <Progress value={subject.percentage} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Classes
            </CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '09:00 AM', subject: 'Data Structures', room: 'Room 101', status: 'present' },
                { time: '11:00 AM', subject: 'Database Systems', room: 'Room 203', status: 'upcoming' },
                { time: '02:00 PM', subject: 'Software Engineering', room: 'Room 105', status: 'upcoming' },
              ].map((class_, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="w-16 text-center">
                    <div className="text-sm font-medium">{class_.time}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{class_.subject}</div>
                    <div className="text-sm text-muted-foreground">{class_.room}</div>
                  </div>
                  <Badge variant={class_.status === 'present' ? 'default' : 'secondary'}>
                    {class_.status === 'present' ? 'Attended' : 'Upcoming'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};