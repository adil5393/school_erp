import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SchoolOverviewView } from '../views/SchoolOverviewView';
import { StudentDirectoryView } from '../views/students/StudentDirectoryView';
import { StudentProfileView } from '../views/students/StudentProfileView';
import { DevDesignSystemView } from '../views/dev/DevDesignSystemView';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Primary Overview Dashboard (Reserved for Phase 3 Stitch Implementation) */}
      <Route path="/" element={<SchoolOverviewView />} />

      {/* Phase 2: Student Management UI */}
      <Route path="/students" element={<StudentDirectoryView />} />
      <Route path="/students/:id" element={<StudentProfileView />} />

      {/* Developer Inspection Console (Restricted strictly to Development Mode) */}
      {import.meta.env.DEV && (
        <Route path="/dev/design-system" element={<DevDesignSystemView />} />
      )}

      {/* Fallback & Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

