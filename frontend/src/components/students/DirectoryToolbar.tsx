import React from 'react';
import { Button } from '../ui/Button';

export interface FilterState {
  search: string;
  academicYearId: number;
  className: string;
  section: string;
  status: string;
  feeStatus: string;
}

interface DirectoryToolbarProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  density: 'comfortable' | 'compact';
  onDensityChange: (density: 'comfortable' | 'compact') => void;
  onOpenColumnConfig: () => void;
  onExportCsv: () => void;
  onNewAdmission: () => void;
  availableClasses?: string[];
  availableSections?: string[];
}

export const DirectoryToolbar: React.FC<DirectoryToolbarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  density,
  onDensityChange,
  onOpenColumnConfig,
  onExportCsv,
  onNewAdmission,
  availableClasses = ['All', '10', '9', '8', '7', '6'],
  availableSections = ['All', 'A', 'B', 'C', 'D'],
}) => {
  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.className !== 'ALL' ||
    filters.section !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.feeStatus !== 'ALL';

  return (
    <div className="directory-toolbar">
      <div className="directory-toolbar-top">
        {/* Search & Filters */}
        <div className="directory-search-cluster">
          {/* Main Search Input */}
          <div className="directory-search-input-wrapper">
            <span
              className="material-symbols-outlined"
              style={{
                position: 'absolute',
                left: 9,
                top: 7,
                fontSize: 18,
                color: 'var(--sidebar-text-muted)',
                pointerEvents: 'none',
              }}
            >
              search
            </span>
            <input
              type="text"
              className="form-input has-icon-left"
              style={{ height: 32, fontSize: 12, paddingRight: filters.search ? 28 : 10 }}
              placeholder="Search name, GR no, SPEN, parent..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange({ search: '' })}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 7,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--sidebar-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Clear search"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  close
                </span>
              </button>
            )}
          </div>

          {/* Academic Session Filter */}
          <div className="directory-filter-dropdown">
            <span className="directory-filter-label">AY:</span>
            <select
              className="directory-filter-select"
              value={filters.academicYearId}
              onChange={(e) => onFilterChange({ academicYearId: Number(e.target.value) })}
            >
              <option value={1}>2024-25 AY</option>
              <option value={2}>2023-24 AY</option>
            </select>
          </div>

          {/* Class Filter */}
          <div className="directory-filter-dropdown">
            <span className="directory-filter-label">Class:</span>
            <select
              className="directory-filter-select"
              value={filters.className}
              onChange={(e) => onFilterChange({ className: e.target.value })}
            >
              {availableClasses.map((cls) => (
                <option key={cls} value={cls === 'All' ? 'ALL' : cls}>
                  {cls === 'All' ? 'All Classes' : `Class ${cls}`}
                </option>
              ))}
            </select>
          </div>

          {/* Section Filter */}
          <div className="directory-filter-dropdown">
            <span className="directory-filter-label">Sec:</span>
            <select
              className="directory-filter-select"
              value={filters.section}
              onChange={(e) => onFilterChange({ section: e.target.value })}
            >
              {availableSections.map((sec) => (
                <option key={sec} value={sec === 'All' ? 'ALL' : sec}>
                  {sec === 'All' ? 'All Sec' : `Sec ${sec}`}
                </option>
              ))}
            </select>
          </div>

          {/* Enrollment Status Filter */}
          <div className="directory-filter-dropdown">
            <span className="directory-filter-label">Status:</span>
            <select
              className="directory-filter-select"
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="TC">TC Issued</option>
              <option value="WITHDRAWN">Withdrawn</option>
            </select>
          </div>

          {/* Fee Status Filter */}
          <div className="directory-filter-dropdown">
            <span className="directory-filter-label">Fee:</span>
            <select
              className="directory-filter-select"
              value={filters.feeStatus}
              onChange={(e) => onFilterChange({ feeStatus: e.target.value })}
            >
              <option value="ALL">All Fees</option>
              <option value="Paid">Clear / Paid</option>
              <option value="Partial">Partial</option>
              <option value="Dues">Dues Outstanding</option>
            </select>
          </div>
        </div>

        {/* Action Controls & Density Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Density Switch */}
          <div className="density-control-group">
            <button
              type="button"
              className={`density-control-btn ${density === 'comfortable' ? 'active' : ''}`}
              onClick={() => onDensityChange('comfortable')}
              title="Comfortable row density"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                density_medium
              </span>
              <span>Comfortable</span>
            </button>
            <button
              type="button"
              className={`density-control-btn ${density === 'compact' ? 'active' : ''}`}
              onClick={() => onDensityChange('compact')}
              title="Compact high-density view"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                density_small
              </span>
              <span>Compact</span>
            </button>
          </div>

          {/* Columns */}
          <Button variant="secondary" size="sm" onClick={onOpenColumnConfig}>
            <span className="material-symbols-outlined icon-sm">view_column</span>
            Columns
          </Button>

          {/* Export CSV */}
          <Button variant="secondary" size="sm" onClick={onExportCsv}>
            <span className="material-symbols-outlined icon-sm">file_download</span>
            Export CSV
          </Button>

          {/* New Admission */}
          <Button variant="accent" size="sm" onClick={onNewAdmission}>
            <span className="material-symbols-outlined icon-sm">add</span>
            + New Admission
          </Button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="active-filters-row">
          <span className="active-filters-label">Active Filters:</span>

          {filters.search.trim() && (
            <span className="filter-pill">
              Search: "{filters.search}"
              <button
                type="button"
                className="filter-pill-remove"
                onClick={() => onFilterChange({ search: '' })}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                  close
                </span>
              </button>
            </span>
          )}

          {filters.className !== 'ALL' && (
            <span className="filter-pill">
              Class: {filters.className}
              <button
                type="button"
                className="filter-pill-remove"
                onClick={() => onFilterChange({ className: 'ALL' })}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                  close
                </span>
              </button>
            </span>
          )}

          {filters.section !== 'ALL' && (
            <span className="filter-pill">
              Section: {filters.section}
              <button
                type="button"
                className="filter-pill-remove"
                onClick={() => onFilterChange({ section: 'ALL' })}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                  close
                </span>
              </button>
            </span>
          )}

          {filters.status !== 'ALL' && (
            <span className="filter-pill">
              Status: {filters.status}
              <button
                type="button"
                className="filter-pill-remove"
                onClick={() => onFilterChange({ status: 'ALL' })}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                  close
                </span>
              </button>
            </span>
          )}

          {filters.feeStatus !== 'ALL' && (
            <span className="filter-pill">
              Fee: {filters.feeStatus}
              <button
                type="button"
                className="filter-pill-remove"
                onClick={() => onFilterChange({ feeStatus: 'ALL' })}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                  close
                </span>
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--color-accent)',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0 4px',
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
