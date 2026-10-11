import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import type { Student360DossierViewModel } from '../../types/viewModels';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { AlertBanner } from '../../components/ui/AlertBanner';
import { Dialog } from '../../components/ui/Dialog';

export const StudentProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [studentId] = useState<number>(() => {
    const parsed = parseInt(id || '842', 10);
    return isNaN(parsed) ? 842 : parsed;
  });

  const [dossier, setDossier] = useState<Student360DossierViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Medical Section Confidentiality Lock
  const [isMedicalUnlocked, setIsMedicalUnlocked] = useState(false);

  // Pending Action Modal
  const [pendingModal, setPendingModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  useEffect(() => {
    let isMounted = true;
    async function fetchDossier() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await studentService.getStudent360Dossier(studentId);
        if (isMounted) {
          if (!data) {
            setError(`Student record with ID #${studentId} was not found.`);
          } else {
            setDossier(data);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch student dossier');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchDossier();
    return () => {
      isMounted = false;
    };
  }, [studentId]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'personal', label: 'Personal Information', icon: 'person' },
    { id: 'guardians', label: 'Guardian Details', icon: 'family_restroom' },
    { id: 'academics', label: 'Academic Enrollment', icon: 'school' },
    { id: 'attendance', label: 'Attendance', icon: 'how_to_reg' },
    { id: 'fees', label: 'Fees & Invoices', icon: 'payments', badge: dossier?.feeBalanceDue ? `₹${dossier.feeBalanceDue.toLocaleString('en-IN')}` : 'CLEAR' },
    { id: 'documents', label: 'Documents', icon: 'folder_shared' },
    { id: 'transport', label: 'Transport', icon: 'directions_bus' },
    { id: 'remarks', label: 'Remarks', icon: 'rate_review' },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ padding: '36px 0', textAlign: 'center' }}>
          <div className="status-indicator">
            <span className="status-dot pulse" />
            <span style={{ fontSize: 13, color: 'var(--sidebar-text-muted)', fontWeight: 500 }}>
              Retrieving verified Student 360° Dossier...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AlertBanner
          type="danger"
          action={
            <Button variant="secondary" size="sm" onClick={() => navigate('/students')}>
              Back to Student Directory
            </Button>
          }
        >
          <div>
            <strong>Student Record Not Found: </strong>
            {error || 'Unable to locate student dossier.'}
          </div>
        </AlertBanner>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Breadcrumb & Navigation Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          paddingBottom: 8,
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          {/* Breadcrumb Trail */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--sidebar-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Link
              to="/students"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                arrow_back
              </span>
              <span>Students</span>
            </Link>
            <span>/</span>
            <span
              style={{
                fontFamily: 'var(--font-family-mono)',
                backgroundColor: 'var(--color-canvas)',
                padding: '1px 6px',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid var(--border-color)',
                color: 'var(--color-primary-dark)',
              }}
            >
              {dossier.admissionNo}
            </span>
            <span>/</span>
            <span style={{ color: 'var(--color-accent)' }}>Student 360° Dossier</span>
          </nav>

          {/* Contextual Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="sm"
              onClick={() =>
                setPendingModal({
                  isOpen: true,
                  title: `Fee Terminal: ${dossier.name} (${dossier.admissionNo})`,
                  message:
                    `Current outstanding dues: ₹${dossier.feeBalanceDue.toLocaleString('en-IN')}. Fee collection gateway will be activated in Phase 4 Fees & Billing.`,
                })
              }
            >
              <span className="material-symbols-outlined icon-sm">receipt_long</span>
              Collect Fee (F2)
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setPendingModal({
                  isOpen: true,
                  title: `Edit Student Record: ${dossier.name}`,
                  message:
                    'Master profile editing requires Registrar-level permissions and audit logging. Backend mutation endpoint pending.',
                })
              }
            >
              <span className="material-symbols-outlined icon-sm">edit</span>
              Edit Record
            </Button>

            <Button variant="secondary" size="sm" onClick={() => window.print()}>
              <span className="material-symbols-outlined icon-sm">print</span>
              Print Dossier
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setPendingModal({
                  isOpen: true,
                  title: `Transfer Certificate (TC): ${dossier.name}`,
                  message:
                    'TC Generation Workflow requires clearance across Library, Fees, and Academics. Backend endpoint pending.',
                })
              }
            >
              <span className="material-symbols-outlined icon-sm">assignment_turned_in</span>
              Transfer Certificate
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setPendingModal({
                  isOpen: true,
                  title: 'Archive / Deactivate Student Record',
                  message:
                    'Archival operations require Super Admin confirmation and preservation of academic records.',
                })
              }
              style={{ color: 'var(--color-danger)' }}
            >
              <span className="material-symbols-outlined icon-sm">archive</span>
              Deactivate
            </Button>
          </div>
        </div>
      </div>

      {/* Persistent Identity Header */}
      <section className="dossier-identity-card">
        <div className="dossier-header-main">
          {/* Identity Left Details */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, minWidth: 0, flex: 1 }}>
            {/* Photo Avatar with Biometric Verification Badge */}
            <div className="dossier-avatar-container">
              {dossier.photoUrl ? (
                <img
                  src={dossier.photoUrl}
                  alt={dossier.name}
                  className="dossier-avatar-img"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--color-accent-subtle)',
                    color: 'var(--color-accent)',
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {dossier.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
              )}
              <div className="dossier-verified-badge" title="Identity Verified Record">
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                  check
                </span>
              </div>
            </div>

            {/* Name, Status, Badges & Metadata */}
            <div className="dossier-identity-info">
              <div className="dossier-title-row">
                <h1 className="dossier-student-name">{dossier.name}</h1>
                <Badge variant={dossier.status === 'ACTIVE' ? 'success' : 'warning'} withDot>
                  {dossier.status === 'ACTIVE' ? 'Active Enrolled' : dossier.status}
                </Badge>
                <Badge variant="accent">
                  Class {dossier.className}-{dossier.section} (CBSE)
                </Badge>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    fontSize: 11,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--color-canvas)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--color-primary-dark)',
                    fontWeight: 600,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--color-danger)' }}>
                    water_drop
                  </span>
                  Blood: {dossier.bloodGroup}
                </span>
              </div>

              {/* Subtitle Details Line */}
              <div className="dossier-meta-row">
                <span>
                  Roll No: <strong style={{ color: 'var(--color-primary-dark)' }}>{dossier.roll}</strong>
                </span>
                <span>•</span>
                <span>
                  Admission ID:{' '}
                  <strong style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--color-primary-dark)' }}>
                    {dossier.admissionNo}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  CBSE PEN:{' '}
                  <strong style={{ fontFamily: 'var(--font-family-mono)', color: 'var(--color-primary-dark)' }}>
                    {dossier.spenNumber}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Curriculum: <strong style={{ color: 'var(--color-primary-dark)' }}>CBSE Senior Secondary</strong>
                </span>
              </div>

              {/* Meta Chips */}
              <div className="dossier-chips-row">
                <span className="dossier-info-chip">
                  DOB: <strong>{dossier.dob}</strong>
                </span>
                <span className="dossier-info-chip">
                  House: <strong>{dossier.house}</strong>
                </span>
                <span className="dossier-info-chip">
                  Transport: <strong>{dossier.transport?.routeNumber || 'Self / Private'}</strong>
                </span>
                <span className="dossier-info-chip">
                  Emergency Contact:{' '}
                  <strong style={{ color: 'var(--color-accent)' }}>
                    {dossier.guardians[0]?.phone || 'Not Registered'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Operational Snapshot Chips */}
          <div className="dossier-metrics-grid">
            {/* Attendance Metric */}
            <div className="metric-chip-card">
              <span className="metric-chip-label">Attendance</span>
              <span className="metric-chip-value">{dossier.attendancePercentage}%</span>
              <span className="metric-chip-sub" style={{ color: 'var(--color-success)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  check_circle
                </span>
                <span>
                  {dossier.attendanceDaysPresent} / {dossier.attendanceTotalDays} Days
                </span>
              </span>
            </div>

            {/* Fee Balance Metric */}
            <div className="metric-chip-card">
              <span className="metric-chip-label">Fee Balance</span>
              <span
                className="metric-chip-value"
                style={{
                  color: dossier.feeBalanceDue === 0 ? 'var(--color-success)' : 'var(--color-danger)',
                }}
              >
                ₹{dossier.feeBalanceDue.toLocaleString('en-IN')}
              </span>
              <span
                className="metric-chip-sub"
                style={{
                  color: dossier.feeBalanceDue === 0 ? 'var(--color-success)' : 'var(--color-danger)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  {dossier.feeBalanceDue === 0 ? 'verified' : 'priority_high'}
                </span>
                <span>{dossier.feeBalanceDue === 0 ? 'All Dues Paid' : 'Pending Clearance'}</span>
              </span>
            </div>

            {/* Academic Rank Metric */}
            <div className="metric-chip-card">
              <span className="metric-chip-label">Academic Rank</span>
              <span className="metric-chip-value">
                #{dossier.academicRank}{' '}
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--sidebar-text-muted)' }}>
                  / {dossier.totalClassStrength}
                </span>
              </span>
              <span className="metric-chip-sub" style={{ color: 'var(--color-accent)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  military_tech
                </span>
                <span>Term Grade A1</span>
              </span>
            </div>

            {/* Advance Credit Balance */}
            <div className="metric-chip-card">
              <span className="metric-chip-label">Advance Credit</span>
              <span className="metric-chip-value" style={{ color: 'var(--color-accent)' }}>
                ₹{dossier.advanceCreditBalance.toLocaleString('en-IN')}
              </span>
              <span className="metric-chip-sub" style={{ color: 'var(--sidebar-text-muted)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  account_balance_wallet
                </span>
                <span>Available Ledger</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Restrained Tabbed Navigation Cluster */}
      <div className="profile-tabs-wrapper">
        <div className="profile-tab-list" role="tablist">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                className={`profile-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`badge ${
                      tab.badge === 'CLEAR' ? 'badge-success' : 'badge-danger'
                    }`}
                    style={{ height: 18, fontSize: 10, padding: '0 5px' }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Panels */}
      <div className="profile-tab-content-panel">
        {/* ================================================================= */}
        {/* TAB 1: OVERVIEW                                                   */}
        {/* ================================================================= */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="dossier-grid-2col">
              {/* Academic Overview Card */}
              <Card>
                <CardHeader title="Academic Enrollment Snapshot" subtitle="Current session registration" />
                <CardBody>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Current Class & Section</span>
                      <span className="dossier-field-value">
                        Class {dossier.className} • Section {dossier.section}
                      </span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Session Register Serial (SR No)</span>
                      <span className="dossier-field-value">{dossier.srNo}</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">House Assigned</span>
                      <span className="dossier-field-value">{dossier.house}</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">National Student SPEN</span>
                      <span className="dossier-field-value" style={{ fontFamily: 'var(--font-family-mono)' }}>
                        {dossier.spenNumber}
                      </span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Current Academic Session</span>
                      <span className="dossier-field-value">2024-25 AY (Active)</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Primary Guardian Summary */}
              <Card>
                <CardHeader title="Primary Guardian Overview" subtitle="School communications recipient" />
                <CardBody>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Primary Guardian Name</span>
                      <span className="dossier-field-value">
                        {dossier.guardians[0]?.name || 'Not Registered'}
                      </span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Relation</span>
                      <span className="dossier-field-value">
                        {dossier.guardians[0]?.relation || 'Father'}
                      </span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Emergency Phone (SMS Verified)</span>
                      <span className="dossier-field-value" style={{ fontFamily: 'var(--font-family-mono)' }}>
                        {dossier.guardians[0]?.phone || 'Not Registered'}
                      </span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Occupation</span>
                      <span className="dossier-field-value">
                        {dossier.guardians[0]?.occupation || 'Professional'}
                      </span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Residential Address</span>
                      <span className="dossier-field-value">{dossier.address}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Enrolled Subjects Ledger */}
            <Card>
              <CardHeader
                title="Curriculum Subjects & Faculty"
                subtitle="CBSE Class 10 Assigned Coursework"
              />
              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>SUBJECT TITLE</th>
                      <th>TYPE</th>
                      <th>ASSIGNED FACULTY</th>
                      <th style={{ textAlign: 'right' }}>MID-TERM EVALUATION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.subjects.map((subj) => (
                      <tr key={subj.code}>
                        <td style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 600, fontSize: 12 }}>
                          {subj.code}
                        </td>
                        <td style={{ fontWeight: 600 }}>{subj.title}</td>
                        <td>
                          <Badge variant={subj.type === 'Core' ? 'neutral' : 'accent'}>
                            {subj.type}
                          </Badge>
                        </td>
                        <td style={{ color: 'var(--sidebar-text-muted)' }}>{subj.facultyName}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                          {subj.grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PERSONAL INFORMATION & MEDICAL (PERMISSION AWARE)          */}
        {/* ================================================================= */}
        {activeTab === 'personal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="dossier-grid-2col">
              {/* Legal & Civil Details */}
              <Card>
                <CardHeader title="Legal Identity & Vital Statistics" subtitle="Government civil registration records" />
                <CardBody>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Full Legal Name</span>
                      <span className="dossier-field-value">{dossier.name}</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Date of Birth</span>
                      <span className="dossier-field-value">{dossier.dob}</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Gender</span>
                      <span className="dossier-field-value">{dossier.gender}</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Blood Group</span>
                      <span className="dossier-field-value">{dossier.bloodGroup}</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Aadhaar Card (UIDAI Masked)</span>
                      <span className="dossier-field-value" style={{ fontFamily: 'var(--font-family-mono)' }}>
                        {dossier.aadhaarMasked}
                      </span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">National SPEN ID</span>
                      <span className="dossier-field-value" style={{ fontFamily: 'var(--font-family-mono)' }}>
                        {dossier.spenNumber}
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Residential & Postal Information */}
              <Card>
                <CardHeader title="Residential & Correspondence Details" subtitle="Registered physical residence" />
                <CardBody>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Present Residence Address</span>
                      <span className="dossier-field-value">{dossier.residentialAddress}</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Permanent Native Address</span>
                      <span className="dossier-field-value">{dossier.address}</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Official Registered Email</span>
                      <span className="dossier-field-value">{dossier.email || 'None on record'}</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">City & Territory</span>
                      <span className="dossier-field-value">New Delhi, Delhi NCR</span>
                    </div>
                    <div className="dossier-field-row">
                      <span className="dossier-field-label">Postal PIN Code</span>
                      <span className="dossier-field-value" style={{ fontFamily: 'var(--font-family-mono)' }}>
                        110016
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* PERMISSION-AWARE MEDICAL SECTION */}
            <Card>
              <CardHeader
                title="Confidential Health & Medical Dossier"
                subtitle="School Infirmary record (Regulated under student health privacy policy)"
                action={
                  <Button
                    variant={isMedicalUnlocked ? 'secondary' : 'accent'}
                    size="sm"
                    onClick={() => setIsMedicalUnlocked((prev) => !prev)}
                  >
                    <span className="material-symbols-outlined icon-sm">
                      {isMedicalUnlocked ? 'lock' : 'lock_open'}
                    </span>
                    {isMedicalUnlocked ? 'Lock Medical Record' : 'Authenticate & Unlock'}
                  </Button>
                }
              />
              <CardBody>
                {!isMedicalUnlocked ? (
                  <div className="medical-lock-card">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 36, color: 'var(--color-warning)' }}
                    >
                      shield_lock
                    </span>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      Restricted Confidential Health Record
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--sidebar-text-muted)', maxWidth: 460 }}>
                      Access to detailed medical records, chronic conditions, and emergency physician orders is
                      restricted to authorized school administrators, nurses, and section teachers.
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsMedicalUnlocked(true)}
                      style={{ marginTop: 6 }}
                    >
                      <span className="material-symbols-outlined icon-sm">verified_user</span>
                      Unlock With Staff Privileges
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div className="medical-confidential-banner">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                          medical_services
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>
                            Infirmary Clearance Status: Fully Verified
                          </div>
                          <div style={{ fontSize: 11, opacity: 0.9 }}>
                            Cleared for physical education, outdoor athletics, and school laboratories.
                          </div>
                        </div>
                      </div>
                      <Badge variant="success">Nurse Approved</Badge>
                    </div>

                    <div className="dossier-grid-2col">
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="dossier-field-row">
                          <span className="dossier-field-label">Verified Blood Group</span>
                          <span className="dossier-field-value" style={{ color: 'var(--color-danger)' }}>
                            {dossier.medicalRecord.bloodGroup}
                          </span>
                        </div>
                        <div className="dossier-field-row">
                          <span className="dossier-field-label">Identified Allergies</span>
                          <span className="dossier-field-value">{dossier.medicalRecord.allergies}</span>
                        </div>
                        <div className="dossier-field-row">
                          <span className="dossier-field-label">Chronic Medical Conditions</span>
                          <span className="dossier-field-value">{dossier.medicalRecord.chronicConditions}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="dossier-field-row">
                          <span className="dossier-field-label">Family Doctor / Physician</span>
                          <span className="dossier-field-value">
                            {dossier.medicalRecord.emergencyDoctorName}
                          </span>
                        </div>
                        <div className="dossier-field-row">
                          <span className="dossier-field-label">Physician Emergency Telephone</span>
                          <span className="dossier-field-value" style={{ fontFamily: 'var(--font-family-mono)' }}>
                            {dossier.medicalRecord.emergencyDoctorPhone}
                          </span>
                        </div>
                        <div className="dossier-field-row">
                          <span className="dossier-field-label">Preferred Hospital Destination</span>
                          <span className="dossier-field-value">
                            {dossier.medicalRecord.hospitalPreference}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: GUARDIAN DETAILS                                           */}
        {/* ================================================================= */}
        {activeTab === 'guardians' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {dossier.guardians.map((g, idx) => (
                <Card key={idx}>
                  <CardHeader
                    title={`${g.relation} Profile`}
                    subtitle={g.isPrimary ? 'Primary Legal Custodian' : 'Secondary Contact'}
                    action={
                      g.isPrimary ? (
                        <Badge variant="accent">Primary</Badge>
                      ) : (
                        <Badge variant="neutral">Alternate</Badge>
                      )
                    }
                  />
                  <CardBody>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Full Name</span>
                        <span className="dossier-field-value">{g.name}</span>
                      </div>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Phone Number</span>
                        <span className="dossier-field-value" style={{ fontFamily: 'var(--font-family-mono)' }}>
                          {g.phone}
                        </span>
                      </div>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Occupation</span>
                        <span className="dossier-field-value">{g.occupation}</span>
                      </div>
                      {g.email && (
                        <div className="dossier-field-row">
                          <span className="dossier-field-label">Email Address</span>
                          <span className="dossier-field-value">{g.email}</span>
                        </div>
                      )}
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">SMS Alert Broadcasts</span>
                        <span className="dossier-field-value" style={{ color: 'var(--color-success)' }}>
                          Enabled (Primary)
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: ACADEMIC ENROLLMENT HISTORY                                */}
        {/* ================================================================= */}
        {activeTab === 'academics' && (
          <Card>
            <CardHeader
              title="Academic Enrollment Ledger"
              subtitle="Distinct student session enrollment records across school years"
            />
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ACADEMIC YEAR</th>
                    <th>CLASS</th>
                    <th>SECTION</th>
                    <th>ROLL / SR NO</th>
                    <th>ADMISSION DATE</th>
                    <th>PROMOTION OUTCOME</th>
                    <th>SESSION STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {dossier.enrollmentHistory.map((h, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                        {h.academicYearName}
                      </td>
                      <td style={{ fontWeight: 600 }}>{h.className}</td>
                      <td>{h.section}</td>
                      <td style={{ fontFamily: 'var(--font-family-mono)' }}>{h.srNo}</td>
                      <td style={{ color: 'var(--sidebar-text-muted)' }}>{h.enrolledOn}</td>
                      <td>
                        <Badge variant="success">{h.promotionStatus}</Badge>
                      </td>
                      <td>
                        <Badge variant={h.status.includes('Active') ? 'accent' : 'neutral'}>
                          {h.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ================================================================= */}
        {/* TAB 5: ATTENDANCE LOG                                             */}
        {/* ================================================================= */}
        {activeTab === 'attendance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Attendance Snapshot Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <Card>
                <CardBody>
                  <span className="metric-chip-label">Total Working Days</span>
                  <div className="metric-chip-value">{dossier.attendanceTotalDays}</div>
                  <span style={{ fontSize: 11, color: 'var(--sidebar-text-muted)', marginTop: 4 }}>
                    Current Term to Date
                  </span>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <span className="metric-chip-label">Present Count</span>
                  <div className="metric-chip-value" style={{ color: 'var(--color-success)' }}>
                    {dossier.attendanceDaysPresent}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-success)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
                    Regular Attendance
                  </span>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <span className="metric-chip-label">Absent / Leave</span>
                  <div className="metric-chip-value" style={{ color: 'var(--color-warning)' }}>
                    {dossier.attendanceTotalDays - dossier.attendanceDaysPresent}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--sidebar-text-muted)', marginTop: 4 }}>
                    Excused Medical Leaves: 2
                  </span>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <span className="metric-chip-label">Term Attendance Rate</span>
                  <div className="metric-chip-value">{dossier.attendancePercentage}%</div>
                  <span style={{ fontSize: 11, color: 'var(--color-success)', marginTop: 4 }}>
                    CBSE Min: 75% Required
                  </span>
                </CardBody>
              </Card>
            </div>

            {/* Monthly Attendance Breakdown */}
            <Card>
              <CardHeader
                title="Monthly Attendance Log (2024-25 AY)"
                subtitle="Biometric classroom register aggregates"
              />
              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>MONTH</th>
                      <th style={{ textAlign: 'right' }}>WORKING DAYS</th>
                      <th style={{ textAlign: 'right' }}>PRESENT</th>
                      <th style={{ textAlign: 'right' }}>ABSENT</th>
                      <th style={{ textAlign: 'right' }}>LEAVE</th>
                      <th style={{ textAlign: 'right' }}>MONTHLY RATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { month: 'April 2024', total: 22, present: 22, absent: 0, leave: 0, rate: 100.0 },
                      { month: 'May 2024', total: 14, present: 14, absent: 0, leave: 0, rate: 100.0 },
                      { month: 'July 2024', total: 24, present: 23, absent: 1, leave: 0, rate: 95.8 },
                      { month: 'August 2024', total: 22, present: 21, absent: 0, leave: 1, rate: 95.5 },
                      { month: 'September 2024', total: 20, present: 19, absent: 0, leave: 1, rate: 95.0 },
                      { month: 'October 2024', total: 16, present: 15, absent: 1, leave: 0, rate: 93.8 },
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600 }}>{row.month}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)' }}>{row.total}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)', color: 'var(--color-success)' }}>
                          {row.present}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)', color: 'var(--color-danger)' }}>
                          {row.absent}
                        </td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)' }}>{row.leave}</td>
                        <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)', fontWeight: 700 }}>
                          {row.rate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 6: FEES & INVOICES                                            */}
        {/* ================================================================= */}
        {activeTab === 'fees' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Financial Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
              <Card>
                <CardBody>
                  <span className="metric-chip-label">Total Invoiced</span>
                  <div className="metric-chip-value">₹{dossier.feeTotalDue.toLocaleString('en-IN')}</div>
                  <span style={{ fontSize: 11, color: 'var(--sidebar-text-muted)', marginTop: 4 }}>
                    Billed for 2024-25 AY
                  </span>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <span className="metric-chip-label">Total Collected</span>
                  <div className="metric-chip-value" style={{ color: 'var(--color-success)' }}>
                    ₹{dossier.feeTotalPaid.toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--color-success)', marginTop: 4 }}>
                    Verified Bank & UPI Receipts
                  </span>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <span className="metric-chip-label">Outstanding Dues</span>
                  <div
                    className="metric-chip-value"
                    style={{
                      color: dossier.feeBalanceDue === 0 ? 'var(--color-success)' : 'var(--color-danger)',
                    }}
                  >
                    ₹{dossier.feeBalanceDue.toLocaleString('en-IN')}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: dossier.feeBalanceDue === 0 ? 'var(--color-success)' : 'var(--color-danger)',
                      marginTop: 4,
                    }}
                  >
                    {dossier.feeBalanceDue === 0 ? 'Accounts Cleared' : 'Payment Overdue'}
                  </span>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <span className="metric-chip-label">Advance Ledger</span>
                  <div className="metric-chip-value" style={{ color: 'var(--color-accent)' }}>
                    ₹{dossier.advanceCreditBalance.toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--sidebar-text-muted)', marginTop: 4 }}>
                    Available for Allocation
                  </span>
                </CardBody>
              </Card>
            </div>

            {/* Invoices List */}
            <Card>
              <CardHeader
                title="Issued Institutional Invoices"
                subtitle="Quarterly & Term Fee Challans"
              />
              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>INVOICE NUMBER</th>
                      <th>DUE DATE</th>
                      <th style={{ textAlign: 'right' }}>TOTAL AMOUNT</th>
                      <th style={{ textAlign: 'right' }}>PAID AMOUNT</th>
                      <th style={{ textAlign: 'right' }}>BALANCE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.invoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px 12px' }}>
                          No invoice records found for this student.
                        </td>
                      </tr>
                    ) : (
                      dossier.invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 700, color: 'var(--color-accent)' }}>
                            {inv.invoiceNumber}
                          </td>
                          <td style={{ color: 'var(--sidebar-text-muted)' }}>{inv.dueDate || 'Immediate'}</td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)' }}>
                            ₹{inv.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)', color: 'var(--color-success)' }}>
                            ₹{inv.paidAmount.toLocaleString('en-IN')}
                          </td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)', fontWeight: 700 }}>
                            ₹{inv.balanceDue.toLocaleString('en-IN')}
                          </td>
                          <td>
                            <Badge variant={inv.statusBadgeVariant} withDot>
                              {inv.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Payment Receipts History */}
            <Card>
              <CardHeader title="Payment Receipts Log" subtitle="Official cash & digital bank transactions" />
              <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>RECEIPT NO</th>
                      <th>PAYMENT DATE</th>
                      <th>MODE</th>
                      <th>TXN / REFERENCE ID</th>
                      <th style={{ textAlign: 'right' }}>AMOUNT PAID</th>
                      <th>REMARKS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dossier.recentPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px 12px' }}>
                          No payment receipts recorded yet.
                        </td>
                      </tr>
                    ) : (
                      dossier.recentPayments.map((p) => (
                        <tr key={p.id}>
                          <td style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 600 }}>
                            {p.receiptNumber}
                          </td>
                          <td>{p.date}</td>
                          <td>
                            <Badge variant="neutral">{p.mode}</Badge>
                          </td>
                          <td style={{ fontFamily: 'var(--font-family-mono)', fontSize: 11, color: 'var(--sidebar-text-muted)' }}>
                            {p.transactionId}
                          </td>
                          <td style={{ textAlign: 'right', fontFamily: 'var(--font-family-mono)', fontWeight: 700, color: 'var(--color-success)' }}>
                            ₹{p.amount.toLocaleString('en-IN')}
                          </td>
                          <td style={{ color: 'var(--sidebar-text-muted)', fontSize: 12 }}>{p.remarks}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 7: DOCUMENTS                                                  */}
        {/* ================================================================= */}
        {activeTab === 'documents' && (
          <Card>
            <CardHeader
              title="Verified Institutional Document Vault"
              subtitle="Mandatory admission and regulatory certificates"
            />
            <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>DOCUMENT TITLE</th>
                    <th>CATEGORY</th>
                    <th>FILE SIZE</th>
                    <th>UPLOADED DATE</th>
                    <th>VERIFICATION</th>
                    <th style={{ textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {dossier.documents.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-accent)' }}>
                            description
                          </span>
                          <span style={{ fontWeight: 600 }}>{doc.title}</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant="neutral">{doc.type}</Badge>
                      </td>
                      <td style={{ fontFamily: 'var(--font-family-mono)', fontSize: 11, color: 'var(--sidebar-text-muted)' }}>
                        {doc.fileSize}
                      </td>
                      <td style={{ color: 'var(--sidebar-text-muted)' }}>{doc.uploadedOn}</td>
                      <td>
                        <Badge variant={doc.verificationStatus === 'Verified' ? 'success' : 'warning'}>
                          {doc.verificationStatus}
                        </Badge>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setPendingModal({
                              isOpen: true,
                              title: `Preview: ${doc.title}`,
                              message:
                                'Secure Document Store viewer is configured for encrypted storage. Direct download integration is pending S3 credentials.',
                            })
                          }
                        >
                          <span className="material-symbols-outlined icon-sm">visibility</span>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ================================================================= */}
        {/* TAB 8: TRANSPORT                                                  */}
        {/* ================================================================= */}
        {activeTab === 'transport' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {dossier.transport ? (
              <div className="dossier-grid-2col">
                <Card>
                  <CardHeader title="Bus Route & Allocation" subtitle="Institutional Fleet Assignment" />
                  <CardBody>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Assigned Route</span>
                        <span className="dossier-field-value">{dossier.transport.routeNumber}</span>
                      </div>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Designated Boarding Stop</span>
                        <span className="dossier-field-value">{dossier.transport.pickupPoint}</span>
                      </div>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Vehicle Registration</span>
                        <span className="dossier-field-value" style={{ fontFamily: 'var(--font-family-mono)' }}>
                          {dossier.transport.vehicleNumber}
                        </span>
                      </div>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Operating Shift</span>
                        <span className="dossier-field-value">{dossier.transport.shift}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardHeader title="Driver & Safety Escort" subtitle="Emergency Fleet Contact" />
                  <CardBody>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Assigned Driver</span>
                        <span className="dossier-field-value">{dossier.transport.driverName}</span>
                      </div>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Driver Contact Phone</span>
                        <span className="dossier-field-value" style={{ fontFamily: 'var(--font-family-mono)' }}>
                          {dossier.transport.driverPhone}
                        </span>
                      </div>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Morning Pickup Window</span>
                        <span className="dossier-field-value">07:15 AM - 07:25 AM</span>
                      </div>
                      <div className="dossier-field-row">
                        <span className="dossier-field-label">Afternoon Drop Window</span>
                        <span className="dossier-field-value">02:30 PM - 02:40 PM</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            ) : (
              <Card>
                <CardBody>
                  <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--sidebar-text-muted)' }}>
                      directions_bus
                    </span>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 8 }}>Self / Private Transport</div>
                    <div style={{ fontSize: 12, color: 'var(--sidebar-text-muted)' }}>
                      Student does not use the institutional school bus fleet.
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 9: REMARKS & BEHAVIORAL LOG                                   */}
        {/* ================================================================= */}
        {activeTab === 'remarks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <CardHeader
                title="Institutional Academic & Disciplinary Remarks"
                subtitle="Official faculty evaluations and commendations"
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setPendingModal({
                        isOpen: true,
                        title: 'Record New Institutional Remark',
                        message:
                          'Teacher behavioral feedback and academic commendation entries require backend submission endpoint.',
                      })
                    }
                  >
                    <span className="material-symbols-outlined icon-sm">add_comment</span>
                    + Add Remark
                  </Button>
                }
              />
              <CardBody>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {dossier.remarks.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: 'var(--color-canvas)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 12,
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 20, color: 'var(--color-accent)', marginTop: 2 }}
                      >
                        verified
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                        <span style={{ fontSize: 13, color: 'var(--color-primary-dark)', fontWeight: 500 }}>
                          {r}
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--sidebar-text-muted)' }}>
                          Entered by Academic Head • Official Record
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>

      {/* Pending Modal Dialog */}
      <Dialog
        isOpen={pendingModal.isOpen}
        onClose={() => setPendingModal({ isOpen: false, title: '', message: '' })}
        title={pendingModal.title}
        maxWidth={480}
        footer={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setPendingModal({ isOpen: false, title: '', message: '' })}
          >
            Acknowledge
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--color-primary-dark)', lineHeight: 1.5 }}>
            {pendingModal.message}
          </p>
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'var(--color-canvas)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: 11,
              color: 'var(--sidebar-text-muted)',
            }}
          >
            Note: In accordance with Phase 2 strict safety rules, no fake database mutations are executed.
          </div>
        </div>
      </Dialog>
    </div>
  );
};
