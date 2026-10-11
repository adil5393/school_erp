import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
import type { StudentDirectoryQueryResult } from '../../types/viewModels';
import { DirectoryToolbar, type FilterState } from '../../components/students/DirectoryToolbar';
import { BulkActionBar } from '../../components/students/BulkActionBar';
import {
  ColumnVisibilityModal,
  type ColumnConfig,
} from '../../components/students/ColumnVisibilityModal';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { AlertBanner } from '../../components/ui/AlertBanner';

export const StudentDirectoryView: React.FC = () => {
  const navigate = useNavigate();
  const [tableDensity, setTableDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    academicYearId: 1,
    className: 'ALL',
    section: 'ALL',
    status: 'ALL',
    feeStatus: 'ALL',
  });

  // Query & Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'admissionNo' | 'roll' | 'attendance' | 'feeStatus'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Async Data State
  const [queryResult, setQueryResult] = useState<StudentDirectoryQueryResult>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Column Visibility Config State
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'select', label: 'Select Checkbox', visible: true, canToggle: false },
    { id: 'gr_no', label: 'GR / PEN No', visible: true },
    { id: 'student', label: 'Student Name & Photo', visible: true, canToggle: false },
    { id: 'class_sec', label: 'Class & Sec', visible: true },
    { id: 'guardian', label: 'Guardian & Emergency Phone', visible: true },
    { id: 'fee_status', label: 'Fee Status', visible: true },
    { id: 'attendance', label: 'Attendance %', visible: true },
    { id: 'transport', label: 'Transport Route', visible: true },
    { id: 'actions', label: 'Actions', visible: true, canToggle: false },
  ]);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  // Pending Feature Notice Modal State
  const [pendingModal, setPendingModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Load students query
  const loadStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await studentService.listStudents({
        search: filters.search,
        academicYearId: filters.academicYearId,
        className: filters.className,
        section: filters.section,
        status: filters.status,
        feeStatus: filters.feeStatus,
        page,
        pageSize,
        sortBy,
        sortDirection,
      });
      setQueryResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve student directory');
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, pageSize, sortBy, sortDirection]);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Handle Sort Change
  const handleSort = (field: 'name' | 'admissionNo' | 'roll' | 'attendance' | 'feeStatus') => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setPage(1);
  };

  // Handle Filter Change
  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      academicYearId: 1,
      className: 'ALL',
      section: 'ALL',
      status: 'ALL',
      feeStatus: 'ALL',
    });
    setPage(1);
  };

  // Selection Handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.size === queryResult.items.length && queryResult.items.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(queryResult.items.map((it) => it.id)));
    }
  };

  const handleToggleSelectRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Column Visibility Handlers
  const handleToggleColumn = (colId: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === colId && c.canToggle !== false ? { ...c, visible: !c.visible } : c))
    );
  };

  const handleResetColumns = () => {
    setColumns([
      { id: 'select', label: 'Select Checkbox', visible: true, canToggle: false },
      { id: 'gr_no', label: 'GR / PEN No', visible: true },
      { id: 'student', label: 'Student Name & Photo', visible: true, canToggle: false },
      { id: 'class_sec', label: 'Class & Sec', visible: true },
      { id: 'guardian', label: 'Guardian & Emergency Phone', visible: true },
      { id: 'fee_status', label: 'Fee Status', visible: true },
      { id: 'attendance', label: 'Attendance %', visible: true },
      { id: 'transport', label: 'Transport Route', visible: true },
      { id: 'actions', label: 'Actions', visible: true, canToggle: false },
    ]);
  };

  const isColVisible = useMemo(() => {
    const map: Record<string, boolean> = {};
    columns.forEach((c) => {
      map[c.id] = c.visible;
    });
    return map;
  }, [columns]);

  // CSV Export Utility
  const handleExportCsv = (onlySelected = false) => {
    const dataToExport = onlySelected
      ? queryResult.items.filter((it) => selectedIds.has(it.id))
      : queryResult.items;

    if (dataToExport.length === 0) {
      alert('No student records available to export.');
      return;
    }

    const headers = [
      'Admission No',
      'SPEN',
      'Name',
      'Class',
      'Section',
      'Roll',
      'Parent Name',
      'Parent Phone',
      'Fee Status',
      'Attendance %',
      'Transport Route',
      'Status',
    ];

    const rows = dataToExport.map((s) => [
      s.admissionNo,
      s.spenNumber,
      `"${s.name}"`,
      s.className,
      s.section,
      s.roll,
      `"${s.parentName}"`,
      `"${s.parentPhone}"`,
      s.feeStatus,
      s.attendancePercentage,
      `"${s.transportRoute}"`,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student_directory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAllPageSelected =
    queryResult.items.length > 0 && selectedIds.size === queryResult.items.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          paddingBottom: 8,
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--color-primary-dark)',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-family-display)',
              }}
            >
              Student Directory
            </h1>
            <span style={{ fontSize: 12, color: 'var(--sidebar-text-muted)', fontWeight: 500 }}>
              {queryResult.totalCount} active student records found • CBSE Institutional Curriculum
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--color-canvas)',
                border: '1px solid var(--border-color)',
                color: 'var(--color-primary-dark)',
              }}
            >
              Session: 2024-25 AY
            </span>
          </div>
        </div>
      </div>

      {/* Directory Filter Toolbar */}
      <DirectoryToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        density={tableDensity}
        onDensityChange={setTableDensity}
        onOpenColumnConfig={() => setIsColumnModalOpen(true)}
        onExportCsv={() => handleExportCsv(false)}
        onNewAdmission={() =>
          setPendingModal({
            isOpen: true,
            title: 'New Student Admission CRM',
            message:
              'The complete student onboarding and applicant verification lifecycle is scheduled in Phase 3 Admissions CRM. No database records are modified.',
          })
        }
      />

      {/* Bulk Action Bar (Visible when rows selected) */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        totalCount={queryResult.totalCount}
        onClearSelection={() => setSelectedIds(new Set())}
        onExportSelected={() => handleExportCsv(true)}
        onPrintIdCards={() =>
          setPendingModal({
            isOpen: true,
            title: 'Batch ID Card Printing',
            message:
              `Selected ${selectedIds.size} student record(s) queued for institutional PVC ID card generator. Template configuration is pending backend integration.`,
          })
        }
        onSendNotice={() =>
          setPendingModal({
            isOpen: true,
            title: 'Batch SMS / Notification Service',
            message:
              'Communication Module is excluded per Phase 2 guidelines. Gateway integration pending.',
          })
        }
      />

      {/* Error Banner */}
      {error && (
        <AlertBanner
          type="danger"
          action={
            <Button variant="secondary" size="sm" onClick={loadStudents}>
              Retry Query
            </Button>
          }
        >
          <div>
            <strong>Failed to Load Student Records: </strong> {error}
          </div>
        </AlertBanner>
      )}

      {/* High-Density Enterprise Data Table Container */}
      <div
        className="table-container"
        style={{
          boxShadow: 'var(--shadow-2xs)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
        }}
      >
        <table
          className="data-table"
          style={{
            '--table-cell-padding-y': tableDensity === 'compact' ? '6px' : '10px',
            '--table-cell-padding-x': tableDensity === 'compact' ? '8px' : '12px',
          } as React.CSSProperties}
        >
          <thead>
            <tr>
              {/* Select Checkbox Column */}
              {isColVisible['select'] && (
                <th style={{ width: 36, textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={isAllPageSelected}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all students on page"
                  />
                </th>
              )}

              {/* GR / PEN NO */}
              {isColVisible['gr_no'] && (
                <th
                  onClick={() => handleSort('admissionNo')}
                  style={{ cursor: 'pointer' }}
                  title="Sort by Admission Number"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>GR / PEN NO</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {sortBy === 'admissionNo'
                        ? sortDirection === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                        : 'unfold_more'}
                    </span>
                  </div>
                </th>
              )}

              {/* STUDENT NAME & PHOTO */}
              {isColVisible['student'] && (
                <th
                  onClick={() => handleSort('name')}
                  style={{ cursor: 'pointer' }}
                  title="Sort by Student Name"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>STUDENT NAME & PHOTO</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {sortBy === 'name'
                        ? sortDirection === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                        : 'unfold_more'}
                    </span>
                  </div>
                </th>
              )}

              {/* CLASS & SEC */}
              {isColVisible['class_sec'] && (
                <th
                  onClick={() => handleSort('roll')}
                  style={{ cursor: 'pointer' }}
                  title="Sort by Roll / Class"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>CLASS & SEC</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {sortBy === 'roll'
                        ? sortDirection === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                        : 'unfold_more'}
                    </span>
                  </div>
                </th>
              )}

              {/* GUARDIAN & CONTACT */}
              {isColVisible['guardian'] && <th>GUARDIAN & EMERGENCY CONTACT</th>}

              {/* FEE STATUS */}
              {isColVisible['fee_status'] && (
                <th
                  onClick={() => handleSort('feeStatus')}
                  style={{ cursor: 'pointer' }}
                  title="Sort by Fee Status"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>FEE STATUS</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {sortBy === 'feeStatus'
                        ? sortDirection === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                        : 'unfold_more'}
                    </span>
                  </div>
                </th>
              )}

              {/* ATTENDANCE % */}
              {isColVisible['attendance'] && (
                <th
                  onClick={() => handleSort('attendance')}
                  style={{ cursor: 'pointer', textAlign: 'right' }}
                  title="Sort by Attendance Rate"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                    <span>ATTENDANCE %</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {sortBy === 'attendance'
                        ? sortDirection === 'asc'
                          ? 'arrow_upward'
                          : 'arrow_downward'
                        : 'unfold_more'}
                    </span>
                  </div>
                </th>
              )}

              {/* TRANSPORT ROUTE */}
              {isColVisible['transport'] && <th>TRANSPORT ROUTE</th>}

              {/* ACTIONS */}
              {isColVisible['actions'] && <th style={{ textAlign: 'right' }}>ACTIONS</th>}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`loading-${idx}`}>
                  <td colSpan={columns.filter((c) => c.visible).length} style={{ padding: '16px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-canvas)',
                        }}
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div
                          style={{
                            width: '30%',
                            height: 12,
                            backgroundColor: 'var(--color-canvas)',
                            borderRadius: 4,
                          }}
                        />
                        <div
                          style={{
                            width: '50%',
                            height: 10,
                            backgroundColor: 'var(--color-canvas)',
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : queryResult.items.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.filter((c) => c.visible).length}
                  style={{ textAlign: 'center', padding: '48px 24px' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 42, color: 'var(--sidebar-text-muted)' }}
                    >
                      person_search
                    </span>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                      No Matching Students Found
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--sidebar-text-muted)', maxWidth: 360 }}>
                      No student records match your current filter parameters or search keyword. Try adjusting
                      the filters.
                    </div>
                    <Button variant="secondary" size="sm" onClick={handleResetFilters} style={{ marginTop: 8 }}>
                      Clear All Filters
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              // Student Data Rows
              queryResult.items.map((student) => {
                const isSelected = selectedIds.has(student.id);

                return (
                  <tr
                    key={student.id}
                    style={{
                      backgroundColor: isSelected ? 'rgba(30, 64, 175, 0.04)' : undefined,
                      transition: 'background-color 0.1s ease',
                    }}
                  >
                    {/* Select Checkbox */}
                    {isColVisible['select'] && (
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(student.id)}
                          aria-label={`Select ${student.name}`}
                        />
                      </td>
                    )}

                    {/* GR / PEN NO */}
                    {isColVisible['gr_no'] && (
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <a
                          className="admission-id-badge"
                          href={`/students/${student.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/students/${student.id}`);
                          }}
                        >
                          {student.admissionNo}
                        </a>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-family-mono)', color: 'var(--sidebar-text-muted)', marginTop: 2 }}>
                          PEN: {student.spenNumber}
                        </div>
                      </td>
                    )}

                    {/* STUDENT NAME & PHOTO */}
                    {isColVisible['student'] && (
                      <td>
                        <div className="student-meta-cell">
                          <div className="student-avatar">
                            {student.photoUrl ? (
                              <img
                                src={student.photoUrl}
                                alt={student.name}
                                className="student-avatar-img"
                                onError={(e) => {
                                  // Fallback to initials if image fails to load
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <span>
                                {student.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <a
                              className="student-name-link"
                              href={`/students/${student.id}`}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/students/${student.id}`);
                              }}
                            >
                              {student.name}
                            </a>
                            <div className="student-subtext">
                              Roll: {student.roll} • {student.status}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}

                    {/* CLASS & SEC */}
                    {isColVisible['class_sec'] && (
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className="class-badge">
                          {student.className}-{student.section}
                        </span>
                        <div className="student-subtext">CBSE Session</div>
                      </td>
                    )}

                    {/* GUARDIAN & EMERGENCY CONTACT */}
                    {isColVisible['guardian'] && (
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-primary-dark)' }}>
                          {student.parentName}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--font-family-mono)', color: 'var(--sidebar-text-muted)', marginTop: 2 }}>
                          {student.parentPhone}
                        </div>
                      </td>
                    )}

                    {/* FEE STATUS */}
                    {isColVisible['fee_status'] && (
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <Badge variant={student.feeStatusVariant} withDot>
                          {student.feeStatus === 'Paid'
                            ? 'Clear / Settled'
                            : student.feeStatus === 'Partial'
                            ? 'Partial Due'
                            : 'Dues Outstanding'}
                        </Badge>
                      </td>
                    )}

                    {/* ATTENDANCE % */}
                    {isColVisible['attendance'] && (
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ fontFamily: 'var(--font-family-mono)', fontWeight: 700, fontSize: 13 }}>
                          {student.attendancePercentage}%
                        </div>
                        <div className="attendance-mini-bar" style={{ marginLeft: 'auto' }}>
                          <div
                            className="attendance-mini-bar-fill"
                            style={{
                              width: `${Math.min(100, student.attendancePercentage)}%`,
                              backgroundColor:
                                student.attendancePercentage >= 90
                                  ? 'var(--color-success)'
                                  : student.attendancePercentage >= 75
                                  ? 'var(--color-warning)'
                                  : 'var(--color-danger)',
                            }}
                          />
                        </div>
                      </td>
                    )}

                    {/* TRANSPORT ROUTE */}
                    {isColVisible['transport'] && (
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, fontSize: 12 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--sidebar-text-muted)' }}>
                            directions_bus
                          </span>
                          <span>{student.transportRoute}</span>
                        </div>
                      </td>
                    )}

                    {/* ACTIONS */}
                    {isColVisible['actions'] && (
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Student 360° Profile"
                            onClick={() => navigate(`/students/${student.id}`)}
                          >
                            <span className="material-symbols-outlined icon-sm">visibility</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            title="Collect Student Fee (Terminal)"
                            onClick={() =>
                              setPendingModal({
                                isOpen: true,
                                title: `Collect Fee: ${student.name} (${student.admissionNo})`,
                                message:
                                  'The Fee Collection Terminal (F2) will be integrated in Phase 4 Fees & Billing. Backend mutations are not implemented yet.',
                              })
                            }
                          >
                            <span className="material-symbols-outlined icon-sm">receipt_long</span>
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="pagination-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span>
            Showing{' '}
            <strong>
              {queryResult.totalCount === 0 ? 0 : (page - 1) * pageSize + 1}-
              {Math.min(page * pageSize, queryResult.totalCount)}
            </strong>{' '}
            of <strong>{queryResult.totalCount}</strong> records
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Rows per page:</span>
            <select
              className="form-select"
              style={{ height: 26, width: 64, padding: '0 6px', fontSize: 12 }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="pagination-controls">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <span className="material-symbols-outlined icon-sm">chevron_left</span>
            Previous
          </Button>

          <span style={{ fontSize: 12, fontWeight: 600, padding: '0 8px' }}>
            Page {page} of {queryResult.totalPages}
          </span>

          <Button
            variant="secondary"
            size="sm"
            disabled={page >= queryResult.totalPages}
            onClick={() => setPage((p) => Math.min(queryResult.totalPages, p + 1))}
          >
            Next
            <span className="material-symbols-outlined icon-sm">chevron_right</span>
          </Button>
        </div>
      </div>

      {/* Column Visibility Configuration Modal */}
      <ColumnVisibilityModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        onToggleColumn={handleToggleColumn}
        onReset={handleResetColumns}
      />

      {/* Pending Module / Backend Notice Modal */}
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
