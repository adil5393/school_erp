import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { SearchModal } from './SearchModal';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-shell">
      {/* Persistent Dark Navy Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="app-main-wrapper">
        <TopBar />
        <main className="app-content-canvas">{children}</main>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal />
    </div>
  );
};
