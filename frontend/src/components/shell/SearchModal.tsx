import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Dialog } from '../ui/Dialog';

export const SearchModal: React.FC = () => {
  const { isSearchModalOpen, closeSearchModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const quickShortcuts = [
    { label: 'Fee Collection Terminal', shortcut: 'F2', icon: 'payments', path: '/fees' },
    { label: 'Student Directory', shortcut: 'S', icon: 'school', path: '/students' },
    { label: 'Operational Overview', shortcut: 'O', icon: 'dashboard', path: '/' },
  ];

  return (
    <Dialog
      isOpen={isSearchModalOpen}
      onClose={closeSearchModal}
      title="Universal Institution Quick Find"
      maxWidth={580}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="form-input-wrapper">
          <span className="material-symbols-outlined form-input-icon-left">search</span>
          <input
            type="text"
            autoFocus
            className="form-input has-icon-left"
            placeholder="Search students by GR/PEN/Name, staff ID, fee receipts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--sidebar-text-muted)',
              letterSpacing: '0.05em',
            }}
          >
            Terminal Direct Accelerators
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {quickShortcuts.map((item) => (
              <a
                key={item.label}
                href={item.path}
                onClick={closeSearchModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-canvas)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--color-primary-dark)',
                  textDecoration: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16, color: 'var(--color-accent)' }}
                  >
                    {item.icon}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>
                </div>
                <kbd className="topbar-kbd-shortcut">{item.shortcut}</kbd>
              </a>
            ))}
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            color: 'var(--sidebar-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 8,
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <span>Tip: Press <kbd style={{ fontFamily: 'var(--font-family-mono)' }}>ESC</kbd> to exit search</span>
          <span>School OS Core Index</span>
        </div>
      </div>
    </Dialog>
  );
};
