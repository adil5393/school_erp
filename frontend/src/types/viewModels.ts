/**
 * School OS — Frontend View Models
 * Optimized for presentation, tabular display, and user interface components.
 * Separated cleanly from database persistence models.
 */

export interface SchoolProfileViewModel {
  id: number;
  name: string;
  affiliationNumber: string;
  code: string;
  phone: string;
  email: string;
  address: string;
  logoUrl: string | null;
  principalName: string;
  establishedYear: string;
  website: string;
}

export interface UserViewModel {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  roleDisplayName: string;
  initials: string;
  avatarUrl: string | null;
  isActive: boolean;
  isStaff: boolean;
}

export interface AcademicYearViewModel {
  id: number;
  code: string;              // e.g. "2024-25"
  name: string;              // e.g. "Academic Session 2024-25"
  startDate: string;
  endDate: string;
  isActive: boolean;
  statusLabel: 'Active' | 'Archived' | 'Upcoming';
}

export interface StudentViewModel {
  id: number;
  admissionNo: string;
  spenNumber: string;
  name: string;
  classAndSection: string;
  roll: string;
  house: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  status: string;
  parentName: string;
  parentPhone: string;
  photoUrl: string | null;
  currentEnrollment?: {
    srNo: number;
    className: string;
    section: string;
    isActive: boolean;
    academicYearId: number;
  };
}

/**
 * High-density Student Directory Item View Model
 */
export interface StudentDirectoryItemViewModel {
  id: number;
  admissionNo: string;       // Displays actual admission_no (e.g. GR-2024-0842)
  spenNumber: string;        // CBSE SPEN (e.g. 2049281734)
  name: string;              // Full student name
  className: string;         // e.g. "10"
  section: string;           // e.g. "A"
  roll: string;              // Class roll
  srNo: number;              // Session register serial
  parentName: string;
  parentPhone: string;
  feeStatus: 'Paid' | 'Partial' | 'Dues';
  feeStatusVariant: 'success' | 'warning' | 'danger';
  attendancePercentage: number;
  transportRoute: string;    // e.g. "Route 08" or "Self / Private"
  status: 'ACTIVE' | 'TC' | 'WITHDRAWN';
  statusVariant: 'success' | 'warning' | 'neutral';
  photoUrl: string | null;
}

/**
 * Filter and Pagination query parameters
 */
export interface StudentDirectoryQueryParams {
  search?: string;
  academicYearId?: number;
  className?: string;
  section?: string;
  status?: string;
  feeStatus?: string;
  page: number;
  pageSize: number;
  sortBy?: 'name' | 'admissionNo' | 'roll' | 'attendance' | 'feeStatus';
  sortDirection?: 'asc' | 'desc';
}

export interface StudentDirectoryQueryResult {
  items: StudentDirectoryItemViewModel[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Student 360° Profile Comprehensive Dossier View Model
 */
export interface SubjectGradeItem {
  code: string;
  title: string;
  facultyName: string;
  grade: string;
  type: 'Core' | 'Elective' | 'Additional';
}

export interface GuardianContactItem {
  relation: string;
  name: string;
  phone: string;
  occupation: string;
  isPrimary: boolean;
  email?: string;
  aadhaar?: string;
}

export interface EnrollmentHistoryItem {
  academicYearName: string;
  className: string;
  section: string;
  srNo: number;
  status: string;
  enrolledOn: string;
  promotionStatus: string;
}

export interface StudentDocumentItem {
  id: string;
  title: string;
  type: string;
  fileSize: string;
  uploadedOn: string;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
}

export interface TransportDetails {
  routeNumber: string;
  pickupPoint: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  shift: string;
}

export interface StudentMedicalRecord {
  bloodGroup: string;
  allergies: string;
  chronicConditions: string;
  emergencyDoctorName: string;
  emergencyDoctorPhone: string;
  hospitalPreference: string;
  verifiedByNurse: boolean;
}

export interface Student360DossierViewModel {
  id: number;
  admissionNo: string;
  spenNumber: string;
  name: string;
  className: string;
  section: string;
  roll: string;
  srNo: number;
  house: string;
  dob: string;
  gender: string;
  status: string;
  photoUrl: string | null;
  bloodGroup: string;
  aadhaarMasked: string;
  address: string;
  residentialAddress: string;
  email: string | null;

  // Snapshot Metrics
  attendancePercentage: number;
  attendanceDaysPresent: number;
  attendanceTotalDays: number;
  feeTotalDue: number;
  feeTotalPaid: number;
  feeBalanceDue: number;
  academicRank: number;
  totalClassStrength: number;
  advanceCreditBalance: number;

  // Tabbed Sections
  subjects: SubjectGradeItem[];
  guardians: GuardianContactItem[];
  enrollmentHistory: EnrollmentHistoryItem[];
  invoices: InvoiceViewModel[];
  recentPayments: PaymentViewModel[];
  transport: TransportDetails | null;
  documents: StudentDocumentItem[];
  medicalRecord: StudentMedicalRecord;
  remarks: string[];
}

export interface FeeComponentItem {
  head: string;
  amount: number;
}

export interface InvoiceViewModel {
  id: number;
  invoiceNumber: string;
  studentId: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  dueDate: string | null;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
  statusBadgeVariant: 'success' | 'warning' | 'danger' | 'neutral';
  feeComponents: FeeComponentItem[];
  month: number | null;
  year: number | null;
}

export interface PaymentViewModel {
  id: number;
  receiptNumber: string;
  invoiceId: number;
  amount: number;
  discountAmount: number;
  discountReason: string;
  mode: string;
  transactionId: string;
  remarks: string;
  date: string;
}

export interface AdvancePaymentViewModel {
  id: number;
  studentId: number;
  totalAdvance: number;
  availableCreditBalance: number;
  source: string;
  referenceNote: string;
  date: string;
}
