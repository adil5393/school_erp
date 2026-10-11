import React from 'react';
import { Breadcrumbs } from '../components/shell/Breadcrumbs';
import { Button } from '../components/ui/Button';
import { AlertBanner } from '../components/ui/AlertBanner';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { useApp } from '../context/AppContext';

/**
 * School Overview & Command Center Workspace (Route: "/")
 * Reserved for Phase 3 Stitch-based implementation.
 * Zero fabricated production data or fake widgets.
 */
export const SchoolOverviewView: React.FC = () => {
  const { schoolProfile, activeAcademicYear, user, isLoading } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Header Strip with Breadcrumbs */}
      <div className="page-header-strip" style={{ margin: '-24px -24px 0 -24px' }}>
        <div className="page-title-group">
          <Breadcrumbs />
          <h1 className="page-title">Overview &amp; Command Center</h1>
          <p className="page-subtitle">
            {schoolProfile?.name || (isLoading ? 'Resolving institution...' : 'School OS')} •{' '}
            {activeAcademicYear?.name || (isLoading ? 'Loading session...' : 'Active Session')} •{' '}
            Operator: {user?.fullName || (isLoading ? 'Authenticating...' : 'Operator')}
          </p>
        </div>

        <div className="page-actions-group">
          {import.meta.env.DEV && (
            <a href="/dev/design-system" style={{ textDecoration: 'none' }}>
              <Button variant="secondary" size="sm" icon="terminal">
                Dev Inspection Console
              </Button>
            </a>
          )}
          <Button variant="accent" size="sm" icon="payments" shortcutHint="F2">
            Fee Terminal
          </Button>
          <Button variant="primary" size="sm" icon="person_add">
            + New Admission
          </Button>
        </div>
      </div>

      {/* Operational Readiness Banner */}
      <AlertBanner type="info" icon="info">
        <strong>Overview Command Center Workspace Reserved:</strong> This primary workspace will be
        populated in Phase 3 using the Stitch command center designs (KPI metric bar, urgent operational
        exceptions matrix, cashier transaction stream, and leave approvals).
      </AlertBanner>

      {/* Clean Unpopulated Workspace Surface */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <Card>
          <CardHeader title="Operational Telemetry" icon="insights" />
          <CardBody>
            <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--sidebar-text-muted)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: 'var(--border-color-strong)', marginBottom: 8, display: 'block' }}>
                dashboard_customize
              </span>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-primary-dark)' }}>
                Command Center Telemetry Stream
              </p>
              <p style={{ fontSize: 12, marginTop: 4 }}>
                Awaiting Phase 3 Stitch visual binding and operational exception data.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Session & Profile Summary" icon="school" />
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8, background: 'var(--color-canvas)', borderRadius: 4, fontSize: 12 }}>
                <span style={{ color: 'var(--sidebar-text-muted)' }}>Institutional Code:</span>
                <span style={{ fontWeight: 600 }}>{schoolProfile?.code || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8, background: 'var(--color-canvas)', borderRadius: 4, fontSize: 12 }}>
                <span style={{ color: 'var(--sidebar-text-muted)' }}>Affiliation Number:</span>
                <span style={{ fontWeight: 600 }}>{schoolProfile?.affiliationNumber || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8, background: 'var(--color-canvas)', borderRadius: 4, fontSize: 12 }}>
                <span style={{ color: 'var(--sidebar-text-muted)' }}>Active Academic Session:</span>
                <span style={{ fontWeight: 600 }}>{activeAcademicYear?.name || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: 8, background: 'var(--color-canvas)', borderRadius: 4, fontSize: 12 }}>
                <span style={{ color: 'var(--sidebar-text-muted)' }}>Principal In-Charge:</span>
                <span style={{ fontWeight: 600 }}>{schoolProfile?.principalName || '—'}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
