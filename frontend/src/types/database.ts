/**
 * School OS — Database Persistence Models
 * Strictly mirrors the actual PostgreSQL tables and columns.
 * DO NOT modify these to match UI mockup labels.
 */

export interface DbSchoolProfile {
  id: number;
  name: string;
  affiliation_number: string;
  phone: string;
  email: string;
  address: string;
  logo: string | null;
  website: string;
  established_year: string;
  principal_name: string;
  school_code: string;
  period_times: Record<string, unknown>;
  affiliation_renewed_upto: string | null;
  block_debug_builds: boolean;
  block_developer_options: boolean;
  block_emulator: boolean;
  block_usb_debugging: boolean;
  lat: number | null;
  lng: number | null;
  max_location_accuracy_meters: number;
  max_location_age_seconds: number;
  radius_meters: number;
  require_native_attendance_app: boolean;
  attendance_zones: unknown[];
  student_attendance_deadline: string | null;
}

export interface DbUser {
  id: number;
  password?: string;
  last_login: string | null;
  is_superuser: boolean;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  role: string;
  avatar: string | null;
  is_staff_portal: boolean;
  access_role_id: number | null;
}

export interface DbAcademicYear {
  id: number;
  name: string;            // e.g. "2024-25"
  start_date: string;      // YYYY-MM-DD
  end_date: string;        // YYYY-MM-DD
  is_active: boolean;      // Defines current active operational session
}

export interface DbStudent {
  id: number;
  name: string;                        // Full name in single column
  class_assigned: string;              // e.g. "10"
  section: string;                     // e.g. "A"
  house: string;                       // e.g. "Tagore"
  stream: string;                      // e.g. "Science" or "General"
  optional_subject: string;
  additional_subject: string;
  roll: string;                        // Class roll string
  admission_no: string | null;         // Actual DB column (corresponds to GR / Admission No)
  admission_date: string | null;
  status: string;                      // e.g. "ACTIVE", "TC", "WITHDRAWN"
  dob: string | null;                  // Actual DB column (YYYY-MM-DD)
  gender: string;                      // "male" | "female"
  blood_group: string;                 // e.g. "O+"
  religion: string;
  category: string;
  aadhar_number: string;
  single_girl_child: boolean;
  specially_abled: boolean;
  ews: boolean;
  address: string;
  residential_address: string;
  email: string | null;
  parent: string;                      // Primary guardian name
  father_name?: string;
  father_phone?: string;
  father_occupation?: string;
  mother_name?: string;
  mother_phone?: string;
  mother_occupation?: string;
  photo: string | null;
  academic_year_id: number | null;
  fee_category_id: number | null;
  spen_number: string;                 // Student PEN
  created_at: string;
  updated_at: string;
}

export interface DbStudentSessionEnrollment {
  id: number;
  sr_no: number;                       // Serial / Register roll number in session
  class_name: string;
  section: string;
  is_active: boolean;
  deactivation_reason: string;
  deactivated_at: string | null;
  academic_year_id: number;
  student_id: number;
  promotion_status: string;
  promotion_exam_name: string;
  promotion_pass_percent: number | null;
  student_type: string;
  created_at: string;
}

export interface DbInvoice {
  id: number;
  total: number;                       // Total due
  paid: number;                        // Amount paid so far
  due_date: string | null;
  status: string;                      // "PAID" | "PENDING" | "OVERDUE"
  fee_components: Record<string, number> | Array<{ head: string; amount: number }>; // Stored as JSONB
  month: number | null;
  year: number | null;
  academic_year_id: number | null;
  student_id: number;
  created_by_id: number | null;
  created_at: string;
}

export interface DbPayment {
  id: number;
  amount: number;                      // Amount paid in this transaction
  discount_amount: number;
  discount_reason: string;
  mode: string;                        // "cash" | "upi" | "neft" | "cheque" | "pos"
  transaction_id: string;              // UTR or transaction ref
  remarks: string;
  date: string;                        // Timestamp with timezone
  invoice_id: number;
  collected_by_id: number | null;
}

export interface DbAdvancePayment {
  id: number;
  amount: number;                      // Advance deposited
  balance: number;                     // Current credit balance available
  source: string;
  reference_note: string;
  created_at: string;
  student_id: number;
  collected_by_id: number | null;
}
