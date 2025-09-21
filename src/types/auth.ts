export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
  faceImageUrl?: string;
  department?: string;
  studentId?: string;
  facultyId?: string;
  phone?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  timestamp: Date;
  status: 'present' | 'absent' | 'late';
  location?: {
    latitude: number;
    longitude: number;
  };
  faceVerified: boolean;
  qrScanned: boolean;
  markedBy?: string; // faculty ID if manually marked
}

export interface ClassSession {
  qrGenerated: boolean;
  id: string;
  facultyId: string;
  subject: string;
  date: Date;
  startTime: string;
  endTime: string;
  qrCode: string;
  location: {
    latitude: number;
    longitude: number;
    radius: number; // meters
  };
  attendanceRecords: AttendanceRecord[];
  studentsPresent: number;
  totalStudents: number;
}