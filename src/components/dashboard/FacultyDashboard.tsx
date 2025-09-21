import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { QRGenerator } from '@/components/shared/QRGenerator';
import { attendanceService } from '@/services/attendanceService';
import { locationService } from '@/services/locationService';
import { exportService } from '@/services/exportService';
import { ClassSession, AttendanceRecord } from '@/types/auth';
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
  const [currentClassQR, setCurrentClassQR] = useState<string>('');
  const [classSessions, setClassSessions] = useState<ClassSession[]>([]);
  const [liveAttendance, setLiveAttendance] = useState<AttendanceRecord[]>([]);
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [newClassData, setNewClassData] = useState({
    subject: '',
    duration: 60
  });
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    if (user) {
      loadClassSessions();
    }
  }, [user]);

  useEffect(() => {
    if (selectedClass) {
      loadLiveAttendance();
      const interval = setInterval(loadLiveAttendance, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedClass]);

  const loadClassSessions = async () => {
    if (!user) return;
    try {
      const sessions = await attendanceService.getActiveClassSessions(user.id);
      setClassSessions(sessions);
    } catch (error) {
      console.error('Error loading class sessions:', error);
    }
  };

  const loadLiveAttendance = async () => {
    if (!selectedClass) return;
    try {
      const records = await attendanceService.getClassAttendance(selectedClass);
      setLiveAttendance(records);
    } catch (error) {
      console.error('Error loading live attendance:', error);
    }
  };

  const createNewClass = async () => {
    if (!user || !newClassData.subject) return;
    
    setIsCreatingClass(true);
    try {
      const location = await locationService.getCurrentLocation();
      const classId = await attendanceService.createClassSession(
        user.id,
        newClassData.subject,
        location,
        newClassData.duration
      );
      
      const qrData = `${user.id}-${newClassData.subject}-${Date.now()}`;
      setCurrentClassQR(qrData);
      setSelectedClass(classId);
      
      toast({
        title: "Class Created Successfully",
        description: "QR code generated. Students can now mark attendance.",
      });
      
      loadClassSessions();
      setNewClassData({ subject: '', duration: 60 });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create class session",
        variant: "destructive",
      });
    } finally {
      setIsCreatingClass(false);
    }
  };

  const refreshQRCode = () => {
    if (user && selectedClass) {
      const qrData = `${user.id}-${selectedClass}-${Date.now()}`;
      setCurrentClassQR(qrData);
      toast({
        title: "QR Code Refreshed",
        description: "New QR code generated for security",
      });
    }
  };

  const exportAttendanceReport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (!selectedClass) return;
    
    try {
      const records = await attendanceService.getClassAttendance(selectedClass);
      const formattedData = exportService.formatAttendanceForExport(records);
      const filename = `attendance-${selectedClass}-${new Date().toISOString().split('T')[0]}`;
      
      switch (format) {
        case 'csv':
          exportService.exportToCSV(formattedData, filename);
          break;
        case 'excel':
          exportService.exportToExcel(formattedData, filename);
          break;
        case 'pdf':
          exportService.exportToPDF(formattedData, 'Attendance Report', filename);
          break;
      }
      
      toast({
        title: "Export Successful",
        description: `${format.toUpperCase()} report downloaded`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to generate report",
        variant: "destructive",
      });
    }
  };
  
  const [todayClasses] = useState<ClassSession[]>([
    {
      id: '1',
      facultyId: 'fac-001',
      subject: 'Data Structures',
      date: new Date('2024-01-15'),
      startTime: '09:00',
      endTime: '10:00',
      qrCode: 'QR1',
      location: { latitude: 0, longitude: 0, radius: 50 },
      attendanceRecords: [],
      studentsPresent: 28,
      totalStudents: 32,
      qrGenerated: true
    },
    {
      id: '2',
      facultyId: 'fac-001',
      subject: 'Database Systems',
      date: new Date('2024-01-15'),
      startTime: '10:30',
      endTime: '11:30',
      qrCode: 'QR2',
      location: { latitude: 0, longitude: 0, radius: 50 },
      attendanceRecords: [],
      studentsPresent: 15,
      totalStudents: 30,
      qrGenerated: true
    },
    {
      id: '3',
      facultyId: 'fac-001',
      subject: 'Software Engineering',
      date: new Date('2024-01-15'),
      startTime: '12:00',
      endTime: '13:00',
      qrCode: 'QR3',
      location: { latitude: 0, longitude: 0, radius: 50 },
      attendanceRecords: [],
      studentsPresent: 0,
      totalStudents: 25,
      qrGenerated: false
    }
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

            {/* Create New Class Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Create New Class
                </CardTitle>
                <CardDescription>Start a new class session with QR code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Enter subject name"
                      value={newClassData.subject}
                      onChange={(e) => setNewClassData({ ...newClassData, subject: e.target.value })}
                    />
                  </div>
                  <div className="w-32">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newClassData.duration}
                      onChange={(e) => setNewClassData({ ...newClassData, duration: parseInt(e.target.value) || 60 })}
                    />
                  </div>
                  <Button 
                    onClick={createNewClass}
                    disabled={!newClassData.subject || isCreatingClass}
                    className="bg-gradient-primary"
                  >
                    {isCreatingClass ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Class
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Today's Classes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Recent Classes
                </CardTitle>
                <CardDescription>Manage your class sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classSessions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No class sessions found. Create your first class to get started.
                    </div>
                  ) : (
                    classSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{session.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              {session.date.toLocaleDateString()} • {session.startTime} - {session.endTime}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-medium">{session.attendanceRecords?.length || 0}</div>
                            <div className="text-xs text-muted-foreground">Present</div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setSelectedClass(session.id);
                                setCurrentClassQR(session.qrCode);
                                setActiveTab('live');
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Live
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Class Tab */}
        {activeTab === 'live' && (
          <div className="space-y-8">
            {/* QR Code Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                {currentClassQR ? (
                  <QRGenerator
                    data={currentClassQR}
                    title="Class QR Code"
                    onRefresh={refreshQRCode}
                    refreshable={true}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-primary" />
                        Class QR Code
                      </CardTitle>
                      <CardDescription>Create a class first to generate QR code</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <Button onClick={() => setActiveTab('overview')} className="bg-gradient-primary">
                        Create New Class
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Live Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-primary" />
                    Live Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Present</span>
                      <span className="font-semibold text-success">{liveAttendance.filter(r => r.status === 'present').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Late</span>
                      <span className="font-semibold text-warning">{liveAttendance.filter(r => r.status === 'late').length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Records</span>
                      <span className="font-semibold">{liveAttendance.length}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                    <Button size="sm" variant="outline" onClick={() => exportAttendanceReport('csv')}>
                      <Download className="w-4 h-4 mr-1" />
                      CSV
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportAttendanceReport('excel')}>
                      <Download className="w-4 h-4 mr-1" />
                      Excel
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => exportAttendanceReport('pdf')}>
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                  {liveAttendance.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No attendance records yet. Students will appear here as they mark attendance.
                    </div>
                  ) : (
                    liveAttendance.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            record.status === 'present' ? 'bg-success/10' : 
                            record.status === 'late' ? 'bg-warning/10' : 'bg-destructive/10'
                          }`}>
                            {record.status === 'present' ? 
                              <CheckCircle2 className="w-5 h-5 text-success" /> :
                              record.status === 'late' ?
                              <Clock className="w-5 h-5 text-warning" /> :
                              <XCircle className="w-5 h-5 text-destructive" />
                            }
                          </div>
                          <div>
                            <div className="font-medium">Student {record.studentId}</div>
                            <div className="text-sm text-muted-foreground">
                              {record.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {record.faceVerified && (
                              <Badge variant="outline" className="text-xs">
                                Face ✓
                              </Badge>
                            )}
                            {record.qrScanned && (
                              <Badge variant="outline" className="text-xs">
                                QR ✓
                              </Badge>
                            )}
                            {record.location && (
                              <Badge variant="outline" className="text-xs">
                                <MapPin className="w-3 h-3 mr-1" />
                                Location ✓
                              </Badge>
                            )}
                          </div>
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
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