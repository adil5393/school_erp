import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ROUTE_LABELS: Record<string, { group: string; name: string }> = {
  '/': { group: 'EXECUTIVE COMMAND', name: 'OVERVIEW & TELEMETRY' },
  '/students': { group: 'STUDENTS & ACADEMICS', name: 'STUDENT DIRECTORY' },
  '/fees': { group: 'FINANCIAL MANAGEMENT', name: 'FEE COLLECTION TERMINAL' },
  '/accounts': { group: 'FINANCIAL MANAGEMENT', name: 'ACCOUNTS & FINANCE' },
  '/academics': { group: 'ACADEMIC OPERATIONS', name: 'ACADEMICS & SUBJECTS' },
  '/attendance': { group: 'ACADEMIC OPERATIONS', name: 'BIOMETRIC ATTENDANCE' },
  '/examinations': { group: 'ACADEMIC OPERATIONS', name: 'EXAMINATIONS & RESULTS' },
  '/staff': { group: 'CAMPUS & OPERATIONS', name: 'TEACHERS & STAFF' },
  '/payroll': { group: 'CAMPUS & OPERATIONS', name: 'PAYROLL & LEAVE' },
  '/transport': { group: 'CAMPUS & OPERATIONS', name: 'TRANSPORT FLEET' },
  '/admissions': { group: 'CORE WORKSPACES', name: 'ADMISSIONS CRM' },
  '/reports': { group: 'GOVERNANCE', name: 'REPORTS & ANALYTICS' },
  '/settings': { group: 'GOVERNANCE', name: 'ADMINISTRATION & SETTINGS' },
  '/dev/design-system': { group: 'DEVELOPER INSPECTION', name: 'SCHEMA & TOKENS' },
};

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const current = ROUTE_LABELS[location.pathname] || {
    group: 'SCHOOL OS',
    name: location.pathname.replace('/', '').toUpperCase() || 'OVERVIEW',
  };

  return (
    <nav className="page-breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">{current.group}</Link>
      <span className="material-symbols-outlined" style={{ fontSize: 13, color: 'var(--border-color-strong)' }}>
        chevron_right
      </span>
      <span style={{ color: 'var(--color-accent)', fontWeight: 700 }}>{current.name}</span>
    </nav>
  );
};
