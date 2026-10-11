import React from 'react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  canToggle?: boolean;
}

interface ColumnVisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnConfig[];
  onToggleColumn: (columnId: string) => void;
  onReset: () => void;
}

export const ColumnVisibilityModal: React.FC<ColumnVisibilityModalProps> = ({
  isOpen,
  onClose,
  columns,
  onToggleColumn,
  onReset,
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Table Columns"
      maxWidth={460}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset Defaults
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--sidebar-text-muted)', margin: 0 }}>
          Customize which data columns appear in the Student Directory table. Preferences are applied immediately.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 320, overflowY: 'auto' }}>
          {columns.map((col) => {
            const isLocked = col.canToggle === false;
            return (
              <label
                key={col.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: col.visible ? 'var(--color-surface-white)' : 'var(--color-canvas)',
                  border: '1px solid var(--border-color)',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.75 : 1,
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={col.visible}
                    disabled={isLocked}
                    onChange={() => onToggleColumn(col.id)}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary-dark)' }}>
                    {col.label}
                  </span>
                </div>
                {isLocked && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--sidebar-text-muted)', textTransform: 'uppercase' }}>
                    Required
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};
