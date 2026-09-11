import type { Metadata } from 'next';
import { attainmentData } from '@/lib/dummyData';

export const metadata: Metadata = {
  title: 'Attainment',
  description: 'Production attainment — planned vs actual units per period.',
};

export default function AttainmentPage() {
  const totalPlanned = attainmentData.reduce((s, r) => s + r.planned, 0);
  const totalActual  = attainmentData.reduce((s, r) => s + r.actual, 0);
  const overallAtt   = Math.round((totalActual / totalPlanned) * 1000) / 10;

  const maxVal = Math.max(...attainmentData.flatMap(r => [r.planned, r.actual]));

  return (
    <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Attainment</h2>
          <p className="page-subtitle">Planned vs Actual units produced per hour</p>
        </div>

        {/* KPIs */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--space-24)' }}>
          <div className="stat-tile">
            <span className="stat-label">Total Planned</span>
            <span className="stat-value">{totalPlanned.toLocaleString()}<span className="stat-unit"> pcs</span></span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Total Actual</span>
            <span className="stat-value">{totalActual.toLocaleString()}<span className="stat-unit"> pcs</span></span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Attainment Rate</span>
            <span className="stat-value">{overallAtt}<span className="stat-unit"> %</span></span>
            <span className={`stat-delta ${overallAtt >= 100 ? 'up' : overallAtt >= 90 ? 'flat' : 'down'}`}>
              {overallAtt >= 100 ? '▲ On Target' : '→ Near Target'}
            </span>
          </div>
        </div>

        {/* Bar chart */}
        <div className="card mb-20">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />Hourly Planned vs Actual</div>
            <div className="flex gap-16">
              <div className="flex items-center gap-4">
                <div style={{ width: 12, height: 12, background: 'var(--color-primary)', borderRadius: 3 }} />
                <span className="text-sm text-secondary">Planned</span>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ width: 12, height: 12, background: 'var(--color-success)', borderRadius: 3 }} />
                <span className="text-sm text-secondary">Actual</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180, paddingBottom: 24, position: 'relative' }}>
            {attainmentData.map((row) => (
              <div key={row.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 160 }}>
                  {/* Planned bar */}
                  <div style={{
                    flex: 1, borderRadius: '4px 4px 0 0',
                    background: 'var(--color-primary)', opacity: 0.3,
                    height: `${(row.planned / maxVal) * 100}%`,
                    position: 'relative',
                    minHeight: 4,
                  }}>
                    <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      {row.planned}
                    </span>
                  </div>
                  {/* Actual bar */}
                  <div style={{
                    flex: 1, borderRadius: '4px 4px 0 0',
                    background: row.actual >= row.planned ? 'var(--color-success)' : 'var(--color-danger)',
                    height: `${(row.actual / maxVal) * 100}%`,
                    position: 'relative',
                    minHeight: 4,
                  }}>
                    <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {row.actual}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textAlign: 'center' }}>
                  {row.period.split('–')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />Period Detail</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th><th>Planned</th><th>Actual</th><th>Variance</th><th>Attainment</th>
              </tr>
            </thead>
            <tbody>
              {attainmentData.map((row) => {
                const variance = row.actual - row.planned;
                return (
                  <tr key={row.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{row.period}</td>
                    <td>{row.planned}</td>
                    <td style={{ fontWeight: 700 }}>{row.actual}</td>
                    <td style={{ fontWeight: 600, color: variance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {variance >= 0 ? '+' : ''}{variance}
                    </td>
                    <td>
                      <div className="flex items-center gap-8">
                        <div className="progress-bar-track" style={{ width: 80 }}>
                          <div className={`progress-bar-fill ${row.attainment >= 100 ? 'success' : row.attainment >= 90 ? 'primary' : 'danger'}`}
                            style={{ width: `${Math.min(row.attainment, 100)}%` }} />
                        </div>
                        <span style={{ fontWeight: 700, color: row.attainment >= 100 ? 'var(--color-success)' : row.attainment >= 90 ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                          {row.attainment}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  );
}
