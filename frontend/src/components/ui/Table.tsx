import React from 'react';

export const TableContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`table-container ${className}`.trim()}>{children}</div>;
};

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <table className={`data-table ${className}`.trim()} {...props}>
      {children}
    </table>
  );
};

export const TableHead: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  ...props
}) => <thead {...props}>{children}</thead>;

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  children,
  ...props
}) => <tbody {...props}>{children}</tbody>;

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  children,
  ...props
}) => <tr {...props}>{children}</tr>;

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  numeric = false,
  className = '',
  ...props
}) => {
  return (
    <td className={`${numeric ? 'col-numeric' : ''} ${className}`.trim()} {...props}>
      {children}
    </td>
  );
};

export interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  numeric = false,
  className = '',
  ...props
}) => {
  return (
    <th className={`${numeric ? 'col-numeric' : ''} ${className}`.trim()} {...props}>
      {children}
    </th>
  );
};
