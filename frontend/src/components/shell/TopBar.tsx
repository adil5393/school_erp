import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useDensity } from '../../context/DensityContext';
import { useNavigation } from '../../context/NavigationContext';
import { MockModeIndicator } from '../dev/MockModeIndicator';

export const TopBar: React.FC = () => {
  const {
    user,
    activeAcademicYear,
    setActiveAcademicYear,
    academicYears,
    isLoading,
    openSearchModal,
  } = useApp();
  const { density, setDensity } = useDensity();
  const { toggleMobileSidebar } = useNavigation();
  const [isSessionDropdownOpen, setIsSessionDropdownOpen] = useState(false);

  return (
    <header className="app-topbar">
      {/* Left Area: Mobile menu & Search */}
      <div className="topbar-left">
        <button
          onClick={toggleMobileSidebar}
          className="mobile-menu-toggle"
          aria-label="Toggle navigation menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="topbar-search-box" onClick={openSearchModal} style={{ cursor: 'pointer' }}>
          <span className="material-symbols-outlined topbar-search-icon">search</span>
          <input
            type="text"
            readOnly
            className="topbar-search-input"
            placeholder="Search students, staff, receipts (Cmd+K)"
          />
          <kbd className="topbar-kbd-shortcut">⌘K</kbd>
        </div>
      </div>

      {/* Right Area: Session, Density, Notifications, User */}
      <div className="topbar-right">
        {/* Explicit Dev Mock Mode Indicator */}
        <MockModeIndicator />

        {/* Density Toggle */}
        <div className="density-toggle-group" role="group" aria-label="Table row density">
          <button
            onClick={() => setDensity('comfortable')}
            className={`density-toggle-btn ${density === 'comfortable' ? 'active' : ''}`}
            title="Comfortable spacing"
          >
            Comfortable
          </button>
          <button
            onClick={() => setDensity('compact')}
            className={`density-toggle-btn ${density === 'compact' ? 'active' : ''}`}
            title="High-density data view"
          >
            Compact
          </button>
        </div>

        <div className="topbar-divider" />

        {/* Academic Session Pill & Selector (Served by Data Provider) */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsSessionDropdownOpen((prev) => !prev)}
            className="session-pill"
            aria-expanded={isSessionDropdownOpen}
            aria-haspopup="true"
          >
            <span className="session-pulse" />
            <span>
              {activeAcademicYear
                ? `${activeAcademicYear.code} AY`
                : isLoading
                ? 'Loading Session...'
                : 'Select Session'}
            </span>
            <span style={{ color: 'var(--sidebar-text-muted)', fontSize: 11 }}>
              {activeAcademicYear?.isActive ? '(Active)' : ''}
            </span>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              arrow_drop_down
            </span>
          </button>

          {isSessionDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                width: 240,
                backgroundColor: 'var(--color-surface-white)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 40,
                padding: 4,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--sidebar-text-muted)',
                  textTransform: 'uppercase',
                  padding: '6px 8px',
                }}
              >
                Academic Session (academic_year table)
              </div>
              {academicYears.map((year) => (
                <button
                  key={year.id}
                  onClick={() => {
                    setActiveAcademicYear(year);
                    setIsSessionDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 12,
                    fontWeight: year.id === activeAcademicYear?.id ? 600 : 400,
                    backgroundColor:
                      year.id === activeAcademicYear?.id ? 'var(--color-surface-subtle)' : 'transparent',
                    color: 'var(--color-primary-dark)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{year.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--sidebar-text-muted)' }}>
                      {year.startDate} to {year.endDate} ({year.statusLabel})
                    </span>
                  </div>
                  {year.id === activeAcademicYear?.id && (
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 14, color: 'var(--color-accent)' }}
                    >
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="topbar-divider" />

        {/* Notifications & Warning Action Icons */}
        <button className="topbar-icon-btn" title="Audit Notifications" aria-label="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          <span className="topbar-notification-badge badge-blue">4</span>
        </button>

        <button className="topbar-icon-btn" title="System Alerts" aria-label="System Alerts">
          <span className="material-symbols-outlined" style={{ color: 'var(--color-warning)' }}>
            warning
          </span>
          <span className="topbar-notification-badge badge-red">2</span>
        </button>

        <div className="topbar-divider" />

        {/* User Identity Profile (Served by Data Provider) */}
        <div
          className="topbar-profile"
          title={user ? `Logged in as ${user.fullName} (${user.email})` : 'User profile'}
        >
          <div className="user-avatar">
            {user?.initials || (isLoading ? '..' : 'U')}
          </div>
          <div className="user-meta">
            <span className="user-name">
              {user?.fullName || (isLoading ? 'Loading user...' : 'Authenticated User')}
            </span>
            <span className="user-role">
              {user?.roleDisplayName || (isLoading ? 'Verifying...' : 'Staff')}
            </span>
          </div>
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 16, color: 'var(--sidebar-text-muted)' }}
          >
            expand_more
          </span>
        </div>
      </div>
    </header>
  );
};
