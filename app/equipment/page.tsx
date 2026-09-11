import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import { equipmentList } from '@/lib/dummyData';

export const metadata: Metadata = {
  title: 'Equipment',
  description: 'Equipment status — OEE, uptime, and fault history per machine.',
};

const statusConfig: Record<string, { label: string; badgeCls: string; dotColor: string }> = {
  running:     { label: 'Running',     badgeCls: 'badge-green',  dotColor: 'var(--color-success)' },
  idle:        { label: 'Idle',        badgeCls: 'badge-gray',   dotColor: 'var(--color-text-muted)' },
  fault:       { label: 'Fault',       badgeCls: 'badge-red',    dotColor: 'var(--color-danger)' },
  maintenance: { label: 'Maintenance', badgeCls: 'badge-yellow', dotColor: 'var(--color-warning)' },
};

export default function EquipmentPage() {
  const running = equipmentList.filter(e => e.status === 'running').length;
  const faults  = equipmentList.filter(e => e.status === 'fault').length;
  const avgOEE  = Math.round(equipmentList.filter(e => e.oee > 0).reduce((s, e) => s + e.oee, 0) / equipmentList.filter(e => e.oee > 0).length);

  return (
    <>
      <AppHeader pageTitle="Equipment" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Equipment Status</h2>
          <p className="page-subtitle">Real-time OEE, uptime, and fault tracking per machine</p>
        </div>

        {/* Fleet summary */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-24)' }}>
          <div className="stat-tile">
            <span className="stat-label">Total Machines</span>
            <span className="stat-value">{equipmentList.length}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Running</span>
            <span className="stat-value" style={{ color: 'var(--color-success)' }}>{running}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Faults</span>
            <span className="stat-value" style={{ color: faults > 0 ? 'var(--color-danger)' : 'var(--color-text-primary)' }}>{faults}</span>
            {faults > 0 && <span className="stat-delta down">Attention required</span>}
          </div>
          <div className="stat-tile">
            <span className="stat-label">Fleet Avg OEE</span>
            <span className="stat-value">{avgOEE}<span className="stat-unit"> %</span></span>
          </div>
        </div>

        {/* Equipment Cards */}
        <div className="grid-3 mb-20">
          {equipmentList.map((eq) => {
            const cfg = statusConfig[eq.status];
            return (
              <div className="card" key={eq.id} id={`equipment-${eq.id}`}>
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-8">
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.dotColor, boxShadow: `0 0 0 3px ${cfg.dotColor}22` }} />
                    <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>{eq.name}</span>
                  </div>
                  <span className={`badge ${cfg.badgeCls}`}>{cfg.label}</span>
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-12)' }}>{eq.type}</p>

                {/* OEE */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>OEE</span>
                    <span style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>{eq.oee > 0 ? `${eq.oee}%` : '—'}</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className={`progress-bar-fill ${eq.oee >= 80 ? 'success' : eq.oee >= 60 ? 'warning' : 'danger'}`}
                      style={{ width: `${eq.oee}%` }} />
                  </div>
                </div>

                {/* Uptime */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>Uptime</span>
                    <span style={{ fontWeight: 700, fontSize: 'var(--font-size-md)' }}>{eq.uptime > 0 ? `${eq.uptime}%` : '—'}</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className={`progress-bar-fill ${eq.uptime >= 90 ? 'success' : eq.uptime >= 70 ? 'primary' : 'danger'}`}
                      style={{ width: `${eq.uptime}%` }} />
                  </div>
                </div>

                {eq.lastFault && (
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', marginTop: 'var(--space-8)', fontStyle: 'italic' }}>
                    Last fault: {eq.lastFault}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Equipment Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />Equipment List</div>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Machine</th><th>Type</th><th>Status</th><th>OEE</th><th>Uptime</th><th>Last Fault</th></tr>
            </thead>
            <tbody>
              {equipmentList.map((eq) => {
                const cfg = statusConfig[eq.status];
                return (
                  <tr key={eq.id}>
                    <td style={{ fontWeight: 600 }}>{eq.name}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{eq.type}</td>
                    <td><span className={`badge ${cfg.badgeCls}`}>{cfg.label}</span></td>
                    <td style={{ fontWeight: 700 }}>{eq.oee > 0 ? `${eq.oee}%` : '—'}</td>
                    <td style={{ fontWeight: 700 }}>{eq.uptime > 0 ? `${eq.uptime}%` : '—'}</td>
                    <td style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{eq.lastFault || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
