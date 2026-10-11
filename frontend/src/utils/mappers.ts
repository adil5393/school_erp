/**
 * School OS — Explicit Domain Mappers
 * Converts PostgreSQL persistence models into presentation view models.
 * Bridges actual database schema columns to UI component representations.
 */

import type {
  DbSchoolProfile,
  DbUser,
  DbAcademicYear,
  DbStudent,
  DbStudentSessionEnrollment,
  DbInvoice,
  DbPayment,
  DbAdvancePayment,
} from '../types/database';

import type {
  SchoolProfileViewModel,
  UserViewModel,
  AcademicYearViewModel,
  StudentViewModel,
  InvoiceViewModel,
  PaymentViewModel,
  AdvancePaymentViewModel,
  FeeComponentItem,
} from '../types/viewModels';

export function mapSchoolProfileToViewModel(db: DbSchoolProfile): SchoolProfileViewModel {
  return {
    id: db.id,
    name: db.name,
    affiliationNumber: db.affiliation_number,
    code: db.school_code,
    phone: db.phone,
    email: db.email,
    address: db.address,
    logoUrl: db.logo,
    principalName: db.principal_name,
    establishedYear: db.established_year,
    website: db.website,
  };
}

export function mapUserToViewModel(db: DbUser): UserViewModel {
  const fullName = `${db.first_name} ${db.last_name}`.trim() || db.username;
  const initials =
    (db.first_name?.[0] || '') + (db.last_name?.[0] || db.username?.[0] || 'U');

  const roleDisplayMap: Record<string, string> = {
    admin: 'System Administrator',
    academic_admin: 'Academic Admin',
    cashier: 'Chief Cashier',
    registrar: 'Senior Registrar',
    bursar: 'Bursar',
    teacher: 'Faculty Member',
  };

  return {
    id: db.id,
    username: db.username,
    fullName,
    email: db.email,
    role: db.role,
    roleDisplayName: roleDisplayMap[db.role.toLowerCase()] || db.role,
    initials: initials.toUpperCase(),
    avatarUrl: db.avatar,
    isActive: db.is_active,
    isStaff: db.is_staff,
  };
}

export function mapAcademicYearToViewModel(db: DbAcademicYear): AcademicYearViewModel {
  return {
    id: db.id,
    code: db.name,
    name: `Academic Session ${db.name}`,
    startDate: db.start_date,
    endDate: db.end_date,
    isActive: db.is_active,
    statusLabel: db.is_active ? 'Active' : 'Archived',
  };
}

export function mapStudentToViewModel(
  db: DbStudent,
  enrollment?: DbStudentSessionEnrollment
): StudentViewModel {
  return {
    id: db.id,
    admissionNo: db.admission_no || `ADM-${db.id}`,
    spenNumber: db.spen_number,
    name: db.name,
    classAndSection: `Class ${db.class_assigned}-${db.section}`,
    roll: db.roll,
    house: db.house,
    dob: db.dob || '',
    gender: db.gender,
    bloodGroup: db.blood_group,
    status: db.status,
    parentName: db.parent,
    parentPhone: db.father_phone || '',
    photoUrl: db.photo,
    currentEnrollment: enrollment
      ? {
          srNo: enrollment.sr_no,
          className: enrollment.class_name,
          section: enrollment.section,
          isActive: enrollment.is_active,
          academicYearId: enrollment.academic_year_id,
        }
      : undefined,
  };
}

export function mapInvoiceToViewModel(db: DbInvoice): InvoiceViewModel {
  // Extract fee_components from JSONB
  let components: FeeComponentItem[] = [];
  if (Array.isArray(db.fee_components)) {
    components = db.fee_components.map((c) => ({
      head: c.head || 'Fee Head',
      amount: Number(c.amount || 0),
    }));
  } else if (typeof db.fee_components === 'object' && db.fee_components !== null) {
    components = Object.entries(db.fee_components).map(([head, amount]) => ({
      head,
      amount: Number(amount),
    }));
  }

  const balanceDue = Math.max(0, Number(db.total) - Number(db.paid));
  let status: InvoiceViewModel['status'] = 'PENDING';
  let statusBadgeVariant: InvoiceViewModel['statusBadgeVariant'] = 'warning';

  if (Number(db.paid) >= Number(db.total)) {
    status = 'PAID';
    statusBadgeVariant = 'success';
  } else if (Number(db.paid) > 0) {
    status = 'PARTIAL';
    statusBadgeVariant = 'warning';
  } else if (db.status?.toUpperCase() === 'OVERDUE') {
    status = 'OVERDUE';
    statusBadgeVariant = 'danger';
  }

  return {
    id: db.id,
    invoiceNumber: `#INV-${db.year || '2024'}-${db.id.toString().padStart(4, '0')}`,
    studentId: db.student_id,
    totalAmount: Number(db.total),
    paidAmount: Number(db.paid),
    balanceDue,
    dueDate: db.due_date,
    status,
    statusBadgeVariant,
    feeComponents: components,
    month: db.month,
    year: db.year,
  };
}

export function mapPaymentToViewModel(db: DbPayment): PaymentViewModel {
  return {
    id: db.id,
    receiptNumber: `REC-${db.id.toString().padStart(5, '0')}`,
    invoiceId: db.invoice_id,
    amount: Number(db.amount),
    discountAmount: Number(db.discount_amount),
    discountReason: db.discount_reason,
    mode: db.mode,
    transactionId: db.transaction_id,
    remarks: db.remarks,
    date: db.date,
  };
}

export function mapAdvancePaymentToViewModel(db: DbAdvancePayment): AdvancePaymentViewModel {
  return {
    id: db.id,
    studentId: db.student_id,
    totalAdvance: Number(db.amount),
    availableCreditBalance: Number(db.balance),
    source: db.source,
    referenceNote: db.reference_note,
    date: db.created_at,
  };
}
