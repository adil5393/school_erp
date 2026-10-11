import React from 'react';
import { useApp } from '../../context/AppContext';
import { SYSTEM_CONFIG } from '../../config/env';

export const MockModeIndicator: React.FC = () => {
  const { isDevMockMode } = useApp();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: 'var(--radius-sm)',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: isDevMockMode ? 'rgba(217, 119, 6, 0.1)' : 'rgba(5, 150, 105, 0.1)',
        border: `1px solid ${isDevMockMode ? 'rgba(217, 119, 6, 0.3)' : 'rgba(5, 150, 105, 0.3)'}`,
        color: isDevMockMode ? '#B45309' : '#047857',
      }}
      title={`Backend API: ${SYSTEM_CONFIG.apiBaseUrl} (Scaffold only)`}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: isDevMockMode ? '#D97706' : '#059669',
        }}
      />
      <span>{isDevMockMode ? 'DEV MOCK MODE' : 'LIVE API'}</span>
    </div>
  );
};
