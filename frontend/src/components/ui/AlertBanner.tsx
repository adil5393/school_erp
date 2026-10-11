import React from 'react';

export interface AlertBannerProps {
  type?: 'info' | 'warning' | 'danger';
  icon?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  icon,
  children,
  action,
  className = '',
}) => {
  const defaultIcon =
    type === 'warning' ? 'warning' : type === 'danger' ? 'error' : 'info';

  return (
    <div className={`alert-banner ${type} ${className}`.trim()}>
      <span className="material-symbols-outlined" style={{ flexShrink: 0 }}>
        {icon || defaultIcon}
      </span>
      <div style={{ flex: 1 }}>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description: string;
  icon?: string;
  action?: React.ReactNode;
}> = ({ title, description, icon = 'inbox', action }) => {
  return (
    <div className="empty-state">
      <span className="material-symbols-outlined empty-state-icon">{icon}</span>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export const LoadingSkeleton: React.FC<{
  height?: number | string;
  width?: number | string;
  count?: number;
  className?: string;
}> = ({ height = 24, width = '100%', count = 1, className = '' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${className}`.trim()}
          style={{ height, width }}
        />
      ))}
    </div>
  );
};
