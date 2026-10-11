import React from 'react';
import { Button } from '../ui/Button';

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  onExportSelected: () => void;
  onPrintIdCards: () => void;
  onSendNotice: () => void;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  onClearSelection,
  onExportSelected,
  onPrintIdCards,
  onSendNotice,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bulk-action-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="material-symbols-outlined icon-sm">check_circle</span>
        <span>
          <strong>{selectedCount}</strong> student{selectedCount > 1 ? 's' : ''} selected
        </span>
      </div>

      <div className="bulk-action-buttons">
        <Button variant="secondary" size="sm" onClick={onExportSelected}>
          <span className="material-symbols-outlined icon-sm">file_download</span>
          Export Selected CSV
        </Button>

        <Button variant="secondary" size="sm" onClick={onPrintIdCards}>
          <span className="material-symbols-outlined icon-sm">badge</span>
          Print ID Cards
        </Button>

        <Button variant="secondary" size="sm" onClick={onSendNotice}>
          <span className="material-symbols-outlined icon-sm">sms</span>
          Send Notice
        </Button>

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear Selection
        </Button>
      </div>
    </div>
  );
};
