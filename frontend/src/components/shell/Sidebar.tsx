import React from 'react';
import { NavLink } from 'react-router-dom';
import { APPROVED_NAVIGATION_GROUPS } from '../../types/navigation';
import { useNavigation } from '../../context/NavigationContext';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { isMobileSidebarOpen, closeMobileSidebar } = useNavigation();
  const { schoolProfile, isLoading } = useApp();

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`sidebar-scrim ${isMobileSidebarOpen ? 'visible' : ''}`}
        onClick={closeMobileSidebar}
      />

      <aside className={`app-sidebar ${isMobileSidebarOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo-mark">SO</div>
            <div className="sidebar-brand-text">
              <span className="sidebar-brand-title">School OS</span>
              <span className="sidebar-brand-sub">
                {schoolProfile?.affiliationNumber
                  ? `CBSE Affil. #${schoolProfile.affiliationNumber}`
                  : isLoading
                  ? 'Connecting...'
                  : 'Institutional Suite'}
              </span>
            </div>
          </div>
          <button
            onClick={closeMobileSidebar}
            className="mobile-menu-toggle"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Item Groups */}
        <div className="sidebar-nav-container">
          {APPROVED_NAVIGATION_GROUPS.map((group) => (
            <div key={group.id} className="sidebar-nav-group">
              <span className="sidebar-group-label">{group.label}</span>
              <ul className="sidebar-nav-list">
                {group.items.map((item) => {
                  const isEnabled = item.status === 'ready';

                  if (!isEnabled) {
                    return (
                      <li key={item.id} className="sidebar-nav-item">
                        <div
                          className="sidebar-nav-link disabled"
                          title={`${item.label} (Under active implementation)`}
                        >
                          <div className="sidebar-link-content">
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.label}</span>
                          </div>
                          <span className="sidebar-nav-badge status-dev">Phase 2</span>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={item.id} className="sidebar-nav-item">
                      <NavLink
                        to={item.path}
                        onClick={closeMobileSidebar}
                        className={({ isActive }) =>
                          `sidebar-nav-link ${isActive ? 'active' : ''}`
                        }
                      >
                        <div className="sidebar-link-content">
                          <span className="material-symbols-outlined">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="sidebar-nav-badge">{item.badge}</span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Development Inspection Route Link (Dev Mode Only) */}
          {import.meta.env.DEV && (
            <div className="sidebar-nav-group" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <span className="sidebar-group-label" style={{ color: '#FBBF24' }}>Developer Tools</span>
              <ul className="sidebar-nav-list">
                <li className="sidebar-nav-item">
                  <NavLink
                    to="/dev/design-system"
                    onClick={closeMobileSidebar}
                    className={({ isActive }) =>
                      `sidebar-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <div className="sidebar-link-content">
                      <span className="material-symbols-outlined" style={{ color: '#FBBF24' }}>terminal</span>
                      <span>Design System & Schema</span>
                    </div>
                    <span className="sidebar-nav-badge status-dev">DEV</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <span style={{ fontWeight: 500 }}>
            {schoolProfile
              ? `${schoolProfile.code} • ${schoolProfile.establishedYear}`
              : isLoading
              ? 'Loading node...'
              : 'Enterprise Console'}
          </span>
          <span className="sidebar-status-pill">
            <span className="sidebar-status-dot" />
            <span>Online</span>
          </span>
        </div>
      </aside>
    </>
  );
};
