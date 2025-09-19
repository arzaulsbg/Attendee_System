import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { 
  QrCode, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  User,
  BookOpen,
  Download,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  MapPin
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClassSession {
  id: string;
  subject: string;
  date: string;
  time: string;
  studentsPresent: number;
  totalStudents: number;
  qrGenerated: boolean;
  status: 'active' | 'completed' | 'upcoming';
}

interface StudentAttendance {
  id: string;
  name: string;
  studentId: string;
  status: 'present' | 'absent' | 'late';
  timestamp?: string;
  faceVerified: boolean;
  location?: string;
}

export const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'live' | 'students' | 'reports'>('overview');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  
  const [todayClasses] = useState<ClassSession[]>([
    {
      id: '1',
      subject: 'Data Structures',
      date: '2024-01-15',
      time: '09:00 AM',
      studentsPresent: 28,
      totalStudents: 32,
      qrGenerated: true,
      status: 'completed'
    },
    {
      id: '2', 
      subject: 'Database Systems',
      date: '2024-01-15',
      time: '11:00 AM',
      studentsPresent: 15,
      totalStudents: 30,
      qrGenerated: true,
      status: 'active'
    },
    {
      id: '3',
      subject: 'Software Engineering',
      date: '2024-01-15', 
      time: '02:00 PM',
      studentsPresent: 0,
      totalStudents: 25,
      qrGenerated: false,
      status: 'upcoming'
    }
  ]);

  const [liveAttendance] = useState<StudentAttendance[]>([
    { id: '1', name: 'Alice Johnson', studentId: 'CS2024001', status: 'present', timestamp: '11:05 AM', faceVerified: true, location: 'Room 203' },
    { id: '2', name: 'Bob Smith', studentId: 'CS2024002', status: 'present', timestamp: '11:03 AM', faceVerified: true, location: 'Room 203' },
    { id: '3', name: 'Carol Davis', studentId: 'CS2024003', status: 'late', timestamp: '11:12 AM', faceVerified: true, location: 'Room 203' },
    { id: '4', name: 'David Wilson', studentId: 'CS2024004', status: 'absent', faceVerified: false },
  ]);

  const generateQRCode = async (classId: string) => {
    try {
      // Mock QR generation
      const mockQR = `QR_${classId}_${Date.now()}`;
      setQrCode(mockQR);
      toast({
        title: "QR Code Generated",
        description: "Students can now scan to mark attendance",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive",
      });
    }
  };

  const markStudentManually = (studentId: string, status: 'present' | 'absent') => {
    toast({
      title: "Attendance Updated",
      description: `Student marked as ${status}`,
    });
  };

  const exportReport = (format: 'csv' | 'excel' | 'pdf') => {
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-success/10 text-success border-success/20';
      case 'absent': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'late': return 'bg-warning/10 text-warning border-warning/20';
      case 'active': return 'bg-primary/10 text-primary border-primary/20';
      case 'completed': return 'bg-muted text-muted-foreground border-border';
      case 'upcoming': return 'bg-secondary/10 text-secondary border-secondary/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const tabButtons = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'live', label: 'Live Class', icon: Eye },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'reports', label: 'Reports', icon: Download },
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
                <h1 className="text-xl font-bold">Faculty Dashboard</h1>
                <p className="text-white/80 text-sm">{user?.name} • Faculty ID: {user?.facultyId || 'N/A'}</p>
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
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-muted rounded-lg">
          {tabButtons.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeTab === id ? "default" : "ghost"}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 ${activeTab === id ? 'bg-white shadow-sm' : ''}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-muted-foreground">Today's Classes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">43</div>
                      <div className="text-sm text-muted-foreground">Present Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">12</div>
                      <div className="text-sm text-muted-foreground">Late Arrivals</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm text-muted-foreground">Defaulters</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Today's Classes
                </CardTitle>
                <CardDescription>Manage your class sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayClasses.map((class_) => (
                    <div key={class_.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{class_.subject}</h3>
                          <p className="text-sm text-muted-foreground">{class_.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="font-medium">{class_.studentsPresent}/{class_.totalStudents}</div>
                          <div className="text-xs text-muted-foreground">Present</div>
                        </div>
                        
                        <Badge className={getStatusColor(class_.status)}>
                          {class_.status}
                        </Badge>

                        <div className="flex gap-2">
                          {!class_.qrGenerated && class_.status !== 'completed' && (
                            <Button size="sm" onClick={() => generateQRCode(class_.id)} className="bg-gradient-primary">
                              <QrCode className="w-4 h-4 mr-1" />
                              Generate QR
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => setActiveTab('live')}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Class Tab */}
        {activeTab === 'live' && (
          <div className="space-y-8">
            {/* QR Code Section */}
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  Class QR Code
                </CardTitle>
                <CardDescription>Students scan this code to mark attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8">
                  {qrCode ? (
                    <div className="text-center">
                      <div className="w-48 h-48 bg-white border-4 border-primary rounded-xl flex items-center justify-center mb-4 shadow-elevated">
                        <QrCode className="w-24 h-24 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">QR Code: {qrCode}</p>
                      <Button className="mt-4 bg-gradient-primary" onClick={() => generateQRCode('current')}>
                        Regenerate QR
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center mb-4">
                        <QrCode className="w-24 h-24 text-muted-foreground" />
                      </div>
                      <Button className="bg-gradient-primary" onClick={() => generateQRCode('current')}>
                        Generate QR Code
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Live Attendance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
                      Live Attendance
                    </CardTitle>
                    <CardDescription>Real-time attendance tracking</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <span className="text-sm text-success">Live</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {liveAttendance.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          student.status === 'present' ? 'bg-success/10' : 
                          student.status === 'late' ? 'bg-warning/10' : 'bg-destructive/10'
                        }`}>
                          {student.status === 'present' ? 
                            <CheckCircle2 className="w-5 h-5 text-success" /> :
                            student.status === 'late' ?
                            <Clock className="w-5 h-5 text-warning" /> :
                            <XCircle className="w-5 h-5 text-destructive" />
                          }
                        </div>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.studentId}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {student.timestamp && (
                          <div className="text-sm text-muted-foreground">
                            {student.timestamp}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1">
                          {student.faceVerified && (
                            <Badge variant="outline" className="text-xs">
                              Face ✓
                            </Badge>
                          )}
                          {student.location && (
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              Location ✓
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markStudentManually(student.id, 'present')}
                            className="text-success hover:bg-success/10"
                          >
                            <UserCheck className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markStudentManually(student.id, 'absent')}
                            className="text-destructive hover:bg-destructive/10"
                          >
                            <UserX className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                Export Reports
              </CardTitle>
              <CardDescription>Download attendance reports in various formats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button onClick={() => exportReport('csv')} className="bg-gradient-primary h-20 flex-col">
                  <Download className="w-6 h-6 mb-2" />
                  Export CSV
                </Button>
                <Button onClick={() => exportReport('excel')} variant="outline" className="h-20 flex-col">
                  <Download className="w-6 h-6 mb-2" />
                  Export Excel
                </Button>
                <Button onClick={() => exportReport('pdf')} variant="outline" className="h-20 flex-col">
                  <Download className="w-6 h-6 mb-2" />
                  Export PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};