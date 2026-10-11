/**
 * School OS — Student Domain Service
 * Handles Student Directory queries (with search, filter, sort, pagination)
 * and Student 360° Profile Dossier resolution.
 */

import type {
  StudentDirectoryQueryParams,
  StudentDirectoryQueryResult,
  StudentDirectoryItemViewModel,
  Student360DossierViewModel,
  SubjectGradeItem,
  GuardianContactItem,
  EnrollmentHistoryItem,
  StudentDocumentItem,
  TransportDetails,
  StudentMedicalRecord,
} from '../types/viewModels';
import {
  mockDataProvider,
  MOCK_STUDENT_ATTENDANCE_MAP,
  MOCK_STUDENT_TRANSPORT_MAP,
} from './mockDataProvider';
import { mapInvoiceToViewModel, mapPaymentToViewModel } from '../utils/mappers';
import { SYSTEM_CONFIG } from '../config/env';

export const studentService = {
  /**
   * List students with filtering, search, sorting, and pagination
   */
  async listStudents(
    params: StudentDirectoryQueryParams
  ): Promise<StudentDirectoryQueryResult> {
    if (!SYSTEM_CONFIG.isDevMockMode) {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        pageSize: params.pageSize.toString(),
        ...(params.search ? { search: params.search } : {}),
        ...(params.className ? { className: params.className } : {}),
        ...(params.section ? { section: params.section } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.feeStatus ? { feeStatus: params.feeStatus } : {}),
      });

      const response = await fetch(`${SYSTEM_CONFIG.apiBaseUrl}/students?${queryParams}`);
      if (!response.ok) {
        throw new Error(`Failed to list students [HTTP ${response.status}]: ${response.statusText}`);
      }
      return response.json();
    }

    // Explicit Development Mock Mode Resolution
    const allStudents = await mockDataProvider.getStudents();
    const allInvoices = await Promise.all(
      allStudents.map((s) => mockDataProvider.getInvoicesForStudent(s.id))
    );

    // Build directory items with derived domain relationships
    let items: StudentDirectoryItemViewModel[] = allStudents.map((s, index) => {
      const studentInvoices = allInvoices[index] || [];
      const totalBilled = studentInvoices.reduce((acc, inv) => acc + Number(inv.total), 0);
      const totalPaid = studentInvoices.reduce((acc, inv) => acc + Number(inv.paid), 0);
      const balance = Math.max(0, totalBilled - totalPaid);

      let feeStatus: StudentDirectoryItemViewModel['feeStatus'] = 'Paid';
      let feeStatusVariant: StudentDirectoryItemViewModel['feeStatusVariant'] = 'success';

      if (balance > 0 && totalPaid > 0) {
        feeStatus = 'Partial';
        feeStatusVariant = 'warning';
      } else if (balance > 0) {
        feeStatus = 'Dues';
        feeStatusVariant = 'danger';
      }

      const attRecord = MOCK_STUDENT_ATTENDANCE_MAP[s.id] || { present: 110, total: 118 };
      const attPercent = Number(((attRecord.present / attRecord.total) * 100).toFixed(1));
      const transport = MOCK_STUDENT_TRANSPORT_MAP[s.id]?.route || 'Self / Private';

      let statusVariant: StudentDirectoryItemViewModel['statusVariant'] = 'success';
      if (s.status === 'TC') statusVariant = 'warning';
      else if (s.status === 'WITHDRAWN') statusVariant = 'neutral';

      return {
        id: s.id,
        admissionNo: s.admission_no || `ADM-${s.id}`,
        spenNumber: s.spen_number,
        name: s.name,
        className: s.class_assigned,
        section: s.section,
        roll: s.roll,
        srNo: parseInt(s.roll, 10) || s.id,
        parentName: s.parent,
        parentPhone: s.father_phone || '',
        feeStatus,
        feeStatusVariant,
        attendancePercentage: attPercent,
        transportRoute: transport,
        status: (s.status as 'ACTIVE' | 'TC' | 'WITHDRAWN') || 'ACTIVE',
        statusVariant,
        photoUrl: s.photo,
      };
    });

    // Apply Filter: Search Query (Name, Admission No, SPEN)
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      items = items.filter(
        (it) =>
          it.name.toLowerCase().includes(q) ||
          it.admissionNo.toLowerCase().includes(q) ||
          it.spenNumber.toLowerCase().includes(q) ||
          it.parentName.toLowerCase().includes(q) ||
          it.parentPhone.includes(q)
      );
    }

    // Apply Filter: Class
    if (params.className && params.className !== 'ALL') {
      items = items.filter((it) => it.className === params.className);
    }

    // Apply Filter: Section
    if (params.section && params.section !== 'ALL') {
      items = items.filter((it) => it.section === params.section);
    }

    // Apply Filter: Status
    if (params.status && params.status !== 'ALL') {
      items = items.filter((it) => it.status === params.status);
    }

    // Apply Filter: Fee Status
    if (params.feeStatus && params.feeStatus !== 'ALL') {
      items = items.filter((it) => it.feeStatus === params.feeStatus);
    }

    // Apply Sorting
    const sortField = params.sortBy || 'name';
    const sortDir = params.sortDirection === 'desc' ? -1 : 1;

    items.sort((a, b) => {
      if (sortField === 'name') return a.name.localeCompare(b.name) * sortDir;
      if (sortField === 'admissionNo') return a.admissionNo.localeCompare(b.admissionNo) * sortDir;
      if (sortField === 'roll') return (parseInt(a.roll, 10) - parseInt(b.roll, 10)) * sortDir;
      if (sortField === 'attendance') return (a.attendancePercentage - b.attendancePercentage) * sortDir;
      if (sortField === 'feeStatus') return a.feeStatus.localeCompare(b.feeStatus) * sortDir;
      return 0;
    });

    const totalCount = items.length;
    const pageSize = params.pageSize || 10;
    const page = Math.max(1, params.page || 1);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginatedItems,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Get Student 360° Profile Dossier
   */
  async getStudent360Dossier(
    studentId: number,
    academicYearId = 1
  ): Promise<Student360DossierViewModel | null> {
    if (!SYSTEM_CONFIG.isDevMockMode) {
      const response = await fetch(`${SYSTEM_CONFIG.apiBaseUrl}/students/${studentId}/dossier`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to fetch student dossier [HTTP ${response.status}]: ${response.statusText}`);
      }
      return response.json();
    }

    // Development Mock Mode Resolution
    const [student, enrollment, history, invoices, payments, advance] = await Promise.all([
      mockDataProvider.getStudentById(studentId),
      mockDataProvider.getStudentEnrollment(studentId, academicYearId),
      mockDataProvider.getEnrollmentHistory(studentId),
      mockDataProvider.getInvoicesForStudent(studentId),
      mockDataProvider.getPaymentsForStudent(studentId),
      mockDataProvider.getAdvancePayment(studentId),
    ]);

    if (!student) return null;

    // Derived Financials
    const totalBilled = invoices.reduce((acc, inv) => acc + Number(inv.total), 0);
    const totalPaid = invoices.reduce((acc, inv) => acc + Number(inv.paid), 0);
    const balanceDue = Math.max(0, totalBilled - totalPaid);
    const advanceCredit = advance ? Number(advance.balance) : 0;

    // Derived Attendance
    const attInfo = MOCK_STUDENT_ATTENDANCE_MAP[studentId] || { present: 112, total: 118 };
    const attPercentage = Number(((attInfo.present / attInfo.total) * 100).toFixed(1));

    // Curriculum & Enrolled Subjects
    const subjects: SubjectGradeItem[] = [
      { code: 'ENG-301', title: 'English Core', facultyName: 'Mrs. Aruna Roy (PGT)', grade: 'A1 (94%)', type: 'Core' },
      { code: 'MAT-041', title: 'Mathematics Standard', facultyName: 'Mr. Rajesh Kaushik (PGT)', grade: 'A2 (89%)', type: 'Core' },
      { code: 'SCI-086', title: 'Science (Physics / Chem / Bio)', facultyName: 'Dr. Sunita Sen (PGT)', grade: 'A1 (92%)', type: 'Core' },
      { code: 'SST-087', title: 'Social Science (Hist / Civ / Geo)', facultyName: 'Mrs. N. Swaminathan (TGT)', grade: 'A1 (95%)', type: 'Core' },
      { code: 'HIN-002', title: 'Hindi Course A', facultyName: 'Dr. R.K. Pandey (TGT)', grade: 'B1 (82%)', type: 'Core' },
      { code: 'INF-402', title: student.optional_subject || 'Information Technology', facultyName: 'Mr. V. Saxena (TGT)', grade: 'A1 (98%)', type: 'Elective' },
    ];

    // Guardians & Contacts
    const guardians: GuardianContactItem[] = [
      {
        relation: 'Father',
        name: student.father_name || student.parent,
        phone: student.father_phone || '+91 98102 34567',
        occupation: student.father_occupation || 'Professional',
        isPrimary: true,
        email: student.email || 'guardian@gmail.com',
      },
      {
        relation: 'Mother',
        name: student.mother_name || 'Dr. Sunita Sharma',
        phone: student.mother_phone || '+91 98102 34568',
        occupation: student.mother_occupation || 'Academic',
        isPrimary: false,
      },
      {
        relation: 'Emergency Guardian Contact',
        name: `${student.father_name || student.parent} (Mobile Primary)`,
        phone: student.father_phone || '+91 98102 34567',
        occupation: 'Emergency Contact (Verified)',
        isPrimary: false,
      },
    ];

    // Enrollment History
    const enrollmentHistory: EnrollmentHistoryItem[] = history.map((h) => ({
      academicYearName: h.academic_year_id === 1 ? '2024-25 AY' : '2023-24 AY',
      className: `Class ${h.class_name}`,
      section: `Section ${h.section}`,
      srNo: h.sr_no,
      status: h.is_active ? 'Active Enrolled' : h.deactivation_reason || 'Promoted',
      enrolledOn: h.created_at ? h.created_at.split('T')[0] : '2024-04-01',
      promotionStatus: h.promotion_status || 'Promoted',
    }));

    // Transport Details
    const transportInfo = MOCK_STUDENT_TRANSPORT_MAP[studentId];
    const transport: TransportDetails | null = transportInfo
      ? {
          routeNumber: transportInfo.route,
          pickupPoint: transportInfo.pickup,
          vehicleNumber: 'DL-01-EA-4412 (Eicher 42-Seater)',
          driverName: transportInfo.driver,
          driverPhone: transportInfo.phone,
          shift: 'Morning (07:15 AM) & Afternoon (02:15 PM)',
        }
      : null;

    // Documents
    const documents: StudentDocumentItem[] = [
      { id: 'doc-1', title: 'Birth Certificate (Municipal Corp)', type: 'PDF Document', fileSize: '1.2 MB', uploadedOn: '2024-04-05', verificationStatus: 'Verified' },
      { id: 'doc-2', title: 'Aadhaar Identity Verification Copy', type: 'Scanned Document', fileSize: '850 KB', uploadedOn: '2024-04-05', verificationStatus: 'Verified' },
      { id: 'doc-3', title: 'Previous School Transfer Certificate (TC)', type: 'Original TC', fileSize: '1.8 MB', uploadedOn: '2024-04-06', verificationStatus: 'Verified' },
      { id: 'doc-4', title: 'Annual Health & Fitness Certificate', type: 'Medical Record', fileSize: '920 KB', uploadedOn: '2024-04-08', verificationStatus: 'Verified' },
    ];

    // Confidential Medical Record (Permission Protected)
    const medicalRecord: StudentMedicalRecord = {
      bloodGroup: student.blood_group || 'O+',
      allergies: 'Mild seasonal dust allergy. No known penicillin or food allergies.',
      chronicConditions: 'None reported. Cleared for all institutional athletic competitions.',
      emergencyDoctorName: 'Dr. R.K. Bhalla (Apollo Clinics)',
      emergencyDoctorPhone: '+91 98110 33445',
      hospitalPreference: 'Max Multi-Speciality Hospital, Saket',
      verifiedByNurse: true,
    };

    // Remarks
    const remarks = [
      'House Captain Nominee for Tagore House (Blue) for academic session 2024-25.',
      'Represented school in Zonal Inter-School Science Exhibition (Rank 1).',
      'Fee accounts ledger fully verified. Advance credit available in school account.',
    ];

    return {
      id: student.id,
      admissionNo: student.admission_no || `ADM-${student.id}`,
      spenNumber: student.spen_number,
      name: student.name,
      className: student.class_assigned,
      section: student.section,
      roll: student.roll,
      srNo: enrollment?.sr_no || parseInt(student.roll, 10) || 1,
      house: student.house,
      dob: student.dob || '2009-08-14',
      gender: student.gender,
      status: student.status,
      photoUrl: student.photo,
      bloodGroup: student.blood_group || 'O+',
      aadhaarMasked: student.aadhar_number,
      address: student.address,
      residentialAddress: student.residential_address,
      email: student.email,

      // Snapshot Metrics
      attendancePercentage: attPercentage,
      attendanceDaysPresent: attInfo.present,
      attendanceTotalDays: attInfo.total,
      feeTotalDue: totalBilled,
      feeTotalPaid: totalPaid,
      feeBalanceDue: balanceDue,
      academicRank: student.id === 842 ? 4 : student.id === 1163 ? 1 : 12,
      totalClassStrength: 42,
      advanceCreditBalance: advanceCredit,

      // Tabbed Sections
      subjects,
      guardians,
      enrollmentHistory,
      invoices: invoices.map(mapInvoiceToViewModel),
      recentPayments: payments.map(mapPaymentToViewModel),
      transport,
      documents,
      medicalRecord,
      remarks,
    };
  },
};
