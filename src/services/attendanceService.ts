import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc,
  orderBy,
  limit,
  Timestamp 
} from 'firebase/firestore';
import { AttendanceRecord, ClassSession } from '@/types/auth';
import { LocationCoordinates } from './locationService';

export interface AttendanceService {
  markAttendance: (
    studentId: string,
    classId: string,
    location: LocationCoordinates,
    faceVerified: boolean,
    qrScanned: boolean
  ) => Promise<void>;
  getStudentAttendance: (studentId: string) => Promise<AttendanceRecord[]>;
  getClassAttendance: (classId: string) => Promise<AttendanceRecord[]>;
  createClassSession: (
    facultyId: string,
    subject: string,
    location: LocationCoordinates,
    duration: number
  ) => Promise<string>;
  getActiveClassSessions: (facultyId?: string) => Promise<ClassSession[]>;
}

class AttendanceServiceImpl implements AttendanceService {
  async markAttendance(
    studentId: string,
    classId: string,
    location: LocationCoordinates,
    faceVerified: boolean,
    qrScanned: boolean
  ): Promise<void> {
    try {
      const attendanceRecord: Omit<AttendanceRecord, 'id'> = {
        studentId,
        classId,
        timestamp: new Date(),
        status: 'present',
        location,
        faceVerified,
        qrScanned,
      };

      await addDoc(collection(db, 'attendance'), {
        ...attendanceRecord,
        timestamp: Timestamp.fromDate(attendanceRecord.timestamp),
      });
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw new Error('Failed to mark attendance');
    }
  }

  async getStudentAttendance(studentId: string): Promise<AttendanceRecord[]> {
    try {
      const q = query(
        collection(db, 'attendance'),
        where('studentId', '==', studentId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as AttendanceRecord[];
    } catch (error) {
      console.error('Error fetching student attendance:', error);
      return [];
    }
  }

  async getClassAttendance(classId: string): Promise<AttendanceRecord[]> {
    try {
      const q = query(
        collection(db, 'attendance'),
        where('classId', '==', classId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as AttendanceRecord[];
    } catch (error) {
      console.error('Error fetching class attendance:', error);
      return [];
    }
  }

  async createClassSession(
    facultyId: string,
    subject: string,
    location: LocationCoordinates,
    duration: number = 60
  ): Promise<string> {
    try {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + duration * 60000);
      
      const classSession: Omit<ClassSession, 'id' | 'attendanceRecords'> = {
        facultyId,
        subject,
        date: startTime,
        startTime: startTime.toTimeString().substring(0, 5),
        endTime: endTime.toTimeString().substring(0, 5),
        qrCode: `${facultyId}-${subject}-${Date.now()}`,
        location: {
          ...location,
          radius: 50, // 50 meters radius
        },
      };

      const docRef = await addDoc(collection(db, 'classes'), {
        ...classSession,
        date: Timestamp.fromDate(classSession.date),
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating class session:', error);
      throw new Error('Failed to create class session');
    }
  }

  async getActiveClassSessions(facultyId?: string): Promise<ClassSession[]> {
    try {
      let q = query(
        collection(db, 'classes'),
        orderBy('date', 'desc'),
        limit(10)
      );

      if (facultyId) {
        q = query(
          collection(db, 'classes'),
          where('facultyId', '==', facultyId),
          orderBy('date', 'desc'),
          limit(10)
        );
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        attendanceRecords: [],
      })) as ClassSession[];
    } catch (error) {
      console.error('Error fetching class sessions:', error);
      return [];
    }
  }
}

export const attendanceService = new AttendanceServiceImpl();