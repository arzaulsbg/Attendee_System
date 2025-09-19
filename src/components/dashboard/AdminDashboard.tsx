import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle,
  User,
  Settings,
  LogOut,
  Plus,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Calendar,
  MapPin,
  Shield,
  Activity,
  Clock,
  UserCheck,
  UserX
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalClasses: number;
  avgAttendance: number;
  presentToday: number;
  absentToday: number;
  defaulters: number;
  suspiciousActivity: number;
}

interface Department {
  name: string;
  students: number;
  faculty: number;
  attendance: number;
}

interface SuspiciousActivity {
  id: string;
  type: 'duplicate_location' | 'multiple_faces' | 'time_anomaly';
  description: string;
  timestamp: string;
  studentId: string;
  severity: 'low' | 'medium' | 'high';
}

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'users' | 'security'>('overview');
  
  const [stats] = useState<DashboardStats>({
    totalStudents: 1248,
    totalFaculty: 67,
    totalClasses: 23,
    avgAttendance: 78.5,
    presentToday: 945,
    absentToday: 303,
    defaulters: 89,
    suspiciousActivity: 12
  });

  const [departments] = useState<Department[]>([
    { name: 'Computer Science', students: 456, faculty: 23, attendance: 82.3 },
    { name: 'Electronics', students: 389, faculty: 19, attendance: 76.8 },
    { name: 'Mechanical', students: 234, faculty: 15, attendance: 74.2 },
    { name: 'Civil', students: 169, faculty: 10, attendance: 71.5 },
  ]);

  const [suspiciousActivities] = useState<SuspiciousActivity[]>([
    {
      id: '1',
      type: 'duplicate_location',
      description: 'Multiple students marked present from same GPS coordinates',
      timestamp: '2 hours ago',
      studentId: 'CS2024001',
      severity: 'high'
    },
    {
      id: '2', 
      type: 'multiple_faces',
      description: 'Different faces detected for same student ID',
      timestamp: '4 hours ago',
      studentId: 'ME2024045',
      severity: 'high'
    },
    {
      id: '3',
      type: 'time_anomaly',
      description: 'Attendance marked outside class hours',
      timestamp: '1 day ago',
      studentId: 'EC2024089',
      severity: 'medium'
    },
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const tabButtons = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-white shadow-elevated">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <p className="text-white/80 text-sm">{user?.name} • System Administrator</p>
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.totalStudents}</div>
                      <div className="text-sm text-muted-foreground">Total Students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.totalFaculty}</div>
                      <div className="text-sm text-muted-foreground">Total Faculty</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.avgAttendance}%</div>
                      <div className="text-sm text-muted-foreground">Avg Attendance</div>
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
                      <div className="text-2xl font-bold">{stats.defaulters}</div>
                      <div className="text-sm text-muted-foreground">Defaulters</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Today's Attendance
                  </CardTitle>
                  <CardDescription>Real-time attendance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-success" />
                        <span>Present</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-success">{stats.presentToday}</div>
                        <div className="text-xs text-muted-foreground">
                          {((stats.presentToday / stats.totalStudents) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserX className="w-4 h-4 text-destructive" />
                        <span>Absent</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-destructive">{stats.absentToday}</div>
                        <div className="text-xs text-muted-foreground">
                          {((stats.absentToday / stats.totalStudents) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    <Progress 
                      value={(stats.presentToday / stats.totalStudents) * 100} 
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Department Overview
                  </CardTitle>
                  <CardDescription>Attendance by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{dept.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {dept.students} students • {dept.faculty} faculty
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{dept.attendance}%</div>
                          <Progress value={dept.attendance} className="w-20 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-destructive" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{stats.suspiciousActivity}</div>
                      <div className="text-sm text-muted-foreground">Suspicious Activities</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-warning" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">7</div>
                      <div className="text-sm text-muted-foreground">Location Anomalies</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-muted-foreground">Time Violations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Suspicious Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Suspicious Activity Monitor
                </CardTitle>
                <CardDescription>Recent security alerts and anomalies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suspiciousActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center mt-1">
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{activity.description}</div>
                          <div className="text-sm text-muted-foreground">
                            Student ID: {activity.studentId} • {activity.timestamp}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={getSeverityColor(activity.severity)}>
                          {activity.severity.toUpperCase()}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Investigate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>Comprehensive attendance analytics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Attendance Trends Chart</p>
                      <p className="text-sm text-muted-foreground">Interactive chart coming soon</p>
                    </div>
                  </div>
                  
                  <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Department Distribution</p>
                      <p className="text-sm text-muted-foreground">Interactive chart coming soon</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button className="bg-gradient-primary">
                    <Download className="w-4 h-4 mr-2" />
                    Export Analytics
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Custom Date Range
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage students, faculty, and admin accounts</CardDescription>
                  </div>
                  <Button className="bg-gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <Input placeholder="Search users..." className="max-w-sm" />
                  </div>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4" />
                  <p>User management interface coming soon</p>
                  <p className="text-sm">This will include CRUD operations for all user types</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};