import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { AttendanceRecord, User } from '@/types/auth';

export interface ExportService {
  exportToCSV: (data: any[], filename: string) => void;
  exportToExcel: (data: any[], filename: string) => void;
  exportToPDF: (data: any[], title: string, filename: string) => void;
}

class ExportServiceImpl implements ExportService {
  exportToCSV(data: any[], filename: string): void {
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  exportToExcel(data: any[], filename: string): void {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    
    XLSX.writeFile(wb, `${filename}.xlsx`);
  }

  exportToPDF(data: any[], title: string, filename: string): void {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 20, 20);
    
    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
    
    // Add data
    let yPosition = 50;
    doc.setFontSize(12);
    
    if (data.length === 0) {
      doc.text('No data available', 20, yPosition);
    } else {
      // Add headers
      const headers = Object.keys(data[0]);
      doc.text(headers.join(' | '), 20, yPosition);
      yPosition += 10;
      
      // Add data rows
      data.forEach((row, index) => {
        if (yPosition > 270) { // Start new page if needed
          doc.addPage();
          yPosition = 20;
        }
        
        const values = headers.map(header => String(row[header] || ''));
        doc.text(values.join(' | '), 20, yPosition);
        yPosition += 10;
      });
    }
    
    doc.save(`${filename}.pdf`);
  }

  // Specific formatting methods for attendance data
  formatAttendanceForExport(records: AttendanceRecord[], users: User[] = []): any[] {
    const userMap = new Map(users.map(user => [user.id, user]));
    
    return records.map(record => ({
      'Student ID': record.studentId,
      'Student Name': userMap.get(record.studentId)?.name || 'Unknown',
      'Class ID': record.classId,
      'Date': record.timestamp.toLocaleDateString(),
      'Time': record.timestamp.toLocaleTimeString(),
      'Status': record.status,
      'Face Verified': record.faceVerified ? 'Yes' : 'No',
      'QR Scanned': record.qrScanned ? 'Yes' : 'No',
      'Location': record.location ? 
        `${record.location.latitude.toFixed(6)}, ${record.location.longitude.toFixed(6)}` : 
        'N/A'
    }));
  }

  formatUsersForExport(users: User[]): any[] {
    return users.map(user => ({
      'ID': user.id,
      'Name': user.name,
      'Email': user.email,
      'Role': user.role,
      'Department': user.department || 'N/A',
      'Student ID': user.studentId || 'N/A',
      'Faculty ID': user.facultyId || 'N/A',
      'Phone': user.phone || 'N/A',
      'Created Date': user.createdAt.toLocaleDateString(),
      'Last Login': user.lastLogin?.toLocaleDateString() || 'Never'
    }));
  }
}

export const exportService = new ExportServiceImpl();