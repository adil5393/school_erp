/**
 * School OS — Navigation Architecture Types
 * Strictly contains the 13 approved modules grouped logically.
 * Timetable, Library, Communication, Gate Passes, and Parent/Student Portals are completely excluded.
 */

export type ModuleStatus = 'ready' | 'in_development' | 'disabled';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  status: ModuleStatus;
  badge?: string | number;
  badgeType?: 'default' | 'accent' | 'warning' | 'danger';
}

export interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
}

export const APPROVED_NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    id: 'core',
    label: 'Core Workspaces',
    items: [
      {
        id: 'overview',
        label: 'Dashboard & Overview',
        path: '/',
        icon: 'dashboard',
        status: 'ready',
      },
      {
        id: 'students',
        label: 'Students & Admissions',
        path: '/students',
        icon: 'school',
        status: 'ready',
      },
      {
        id: 'admissions-crm',
        label: 'Admissions CRM',
        path: '/admissions',
        icon: 'person_add',
        status: 'in_development',
        badge: 'CRM',
        badgeType: 'default',
      },
      {
        id: 'fees',
        label: 'Fees & Billing',
        path: '/fees',
        icon: 'payments',
        status: 'ready',
        badge: 'F2',
        badgeType: 'accent',
      },
      {
        id: 'accounts',
        label: 'Accounts & Finance',
        path: '/accounts',
        icon: 'account_balance',
        status: 'in_development',
      },
    ],
  },
  {
    id: 'academic',
    label: 'Academic Operations',
    items: [
      {
        id: 'academics',
        label: 'Academics & Subjects',
        path: '/academics',
        icon: 'menu_book',
        status: 'in_development',
      },
      {
        id: 'attendance',
        label: 'Attendance',
        path: '/attendance',
        icon: 'how_to_reg',
        status: 'in_development',
      },
      {
        id: 'examinations',
        label: 'Examinations & Results',
        path: '/examinations',
        icon: 'assignment',
        status: 'in_development',
      },
    ],
  },
  {
    id: 'operations',
    label: 'Campus & Operations',
    items: [
      {
        id: 'staff',
        label: 'Teachers & Staff',
        path: '/staff',
        icon: 'badge',
        status: 'in_development',
      },
      {
        id: 'payroll',
        label: 'Payroll & Leave',
        path: '/payroll',
        icon: 'event_busy',
        status: 'in_development',
        badge: 2,
        badgeType: 'warning',
      },
      {
        id: 'transport',
        label: 'Transport Fleet',
        path: '/transport',
        icon: 'directions_bus',
        status: 'in_development',
      },
    ],
  },
  {
    id: 'governance',
    label: 'Governance & Settings',
    items: [
      {
        id: 'reports',
        label: 'Reports & Analytics',
        path: '/reports',
        icon: 'analytics',
        status: 'in_development',
      },
      {
        id: 'settings',
        label: 'Administration & Settings',
        path: '/settings',
        icon: 'settings',
        status: 'in_development',
      },
    ],
  },
];
