import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import { summaryRows } from '@/lib/dummyData';

export const metadata: Metadata = {
  title: 'Summary',
  description: 'Production summary — planned vs actual output per SKU.',
};

export default function SummaryPage() {
  const totalPlanned = summaryRows.reduce((s, r) => s + r.planned, 0);
  const totalActual  = summaryRows.reduce((s, r) => s + r.actual, 0);
  const totalAtt     = Math.round((totalActual / totalPlanned) * 1000) / 10;

  return (
    <>
      <AppHeader pageTitle="Summary" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Production Summary</h2>
          <p className="page-subtitle">Shift 1 · Line A — all SKUs</p>
        </div>

        {/* Summary KPIs */}
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
            <span className="stat-label">Overall Attainment</span>
            <span className="stat-value">{totalAtt}<span className="stat-unit"> %</span></span>
            <span className={`stat-delta ${totalAtt >= 100 ? 'up' : totalAtt >= 90 ? 'flat' : 'down'}`}>
              {totalAtt >= 100 ? '▲ On Target' : totalAtt >= 90 ? '→ Near Target' : '▼ Below Target'}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />SKU Breakdown</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Description</th>
                <th>Planned</th>
                <th>Actual</th>
                <th>Variance</th>
                <th>Attainment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((row) => {
                const variance = row.actual - row.planned;
                const badgeCls = row.status === 'on-track' ? 'badge-green'
                  : row.status === 'at-risk' ? 'badge-yellow' : 'badge-red';
                const statusLabel = row.status === 'on-track' ? 'On Track'
                  : row.status === 'at-risk' ? 'At Risk' : 'Behind';
                return (
                  <tr key={row.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)', fontFamily: 'monospace' }}>{row.sku}</td>
                    <td>{row.description}</td>
                    <td>{row.planned.toLocaleString()}</td>
                    <td style={{ fontWeight: 600 }}>{row.actual.toLocaleString()}</td>
                    <td style={{ fontWeight: 600, color: variance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {variance >= 0 ? '+' : ''}{variance}
                    </td>
                    <td>
                      <div className="flex items-center gap-8">
                        <div className="progress-bar-track" style={{ width: 60 }}>
                          <div className={`progress-bar-fill ${row.attainment >= 100 ? 'success' : row.attainment >= 90 ? 'primary' : row.attainment >= 80 ? 'warning' : 'danger'}`}
                            style={{ width: `${Math.min(row.attainment, 100)}%` }} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{row.attainment}%</span>
                      </div>
                    </td>
                    <td><span className={`badge ${badgeCls}`}>{statusLabel}</span></td>
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
