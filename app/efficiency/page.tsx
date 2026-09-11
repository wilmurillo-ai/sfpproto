import type { Metadata } from 'next';
import { efficiencyTrend } from '@/lib/dummyData';

export const metadata: Metadata = {
  title: 'Efficiency',
  description: 'Efficiency trend chart — actual vs target over the shift.',
};

const W = 800, H = 220;
const PAD = { top: 24, right: 16, bottom: 36, left: 48 };
const chartW = W - PAD.left - PAD.right;
const chartH = H - PAD.top  - PAD.bottom;
const yMin = 0, yMax = 100;

function yPos(val: number) { return PAD.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH; }
function xPos(i: number, total: number) { return PAD.left + (i / (total - 1)) * chartW; }

export default function EfficiencyPage() {
  const data = efficiencyTrend;
  const actualData = data.filter(d => d.efficiency > 0);
  const overall = Math.round(actualData.reduce((s, d) => s + d.efficiency, 0) / actualData.length);

  const actualPath = actualData.map((d, i) => {
    const idx = data.indexOf(d);
    return `${i === 0 ? 'M' : 'L'} ${xPos(idx, data.length)} ${yPos(d.efficiency)}`;
  }).join(' ');

  const targetPath = data.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${xPos(i, data.length)} ${yPos(d.target)}`
  ).join(' ');

  const areaPath = actualData.length
    ? actualData.map((d, i) => {
        const idx = data.indexOf(d);
        return `${i === 0 ? 'M' : 'L'} ${xPos(idx, data.length)} ${yPos(d.efficiency)}`;
      }).join(' ') +
      ` L ${xPos(data.indexOf(actualData[actualData.length - 1]), data.length)} ${yPos(0)} L ${xPos(data.indexOf(actualData[0]), data.length)} ${yPos(0)} Z`
    : '';

  return (
    <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Efficiency</h2>
          <p className="page-subtitle">Hourly OEE efficiency vs 85% target</p>
        </div>

        {/* KPI row */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-24)' }}>
          <div className="stat-tile">
            <span className="stat-label">Avg Efficiency</span>
            <span className="stat-value">{overall}<span className="stat-unit"> %</span></span>
            <span className={`stat-delta ${overall >= 85 ? 'up' : 'down'}`}>{overall >= 85 ? '▲ Above target' : '▼ Below target'}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Target</span>
            <span className="stat-value">85<span className="stat-unit"> %</span></span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Peak Hour</span>
            <span className="stat-value">13:00</span>
            <span className="stat-delta up">91%</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Low Hour</span>
            <span className="stat-value">09:00</span>
            <span className="stat-delta down">65% (CO)</span>
          </div>
        </div>

        {/* Chart Card */}
        <div className="card mb-20">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />Hourly Efficiency Trend</div>
            <div className="flex gap-16">
              <div className="flex items-center gap-4">
                <div style={{ width: 20, height: 2, background: 'var(--color-primary)', borderRadius: 1 }} />
                <span className="text-sm text-secondary">Actual</span>
              </div>
              <div className="flex items-center gap-4">
                <div style={{ width: 20, height: 2, background: 'var(--color-danger)', borderRadius: 1, borderTop: '2px dashed var(--color-danger)' }} />
                <span className="text-sm text-secondary">Target 85%</span>
              </div>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 480 }}>
              {/* Y grid lines */}
              {[0, 25, 50, 75, 85, 100].map(v => (
                <g key={v}>
                  <line x1={PAD.left} y1={yPos(v)} x2={W - PAD.right} y2={yPos(v)}
                    stroke={v === 85 ? 'var(--color-status-error)' : 'var(--color-border-default)'}
                    strokeWidth={v === 85 ? 1.5 : 1} strokeDasharray={v === 85 ? '4 3' : undefined} opacity={v === 85 ? 0.4 : 1} />
                  <text x={PAD.left - 8} y={yPos(v) + 4} textAnchor="end" fontSize="10" fill="var(--color-text-secondary)">{v}%</text>
                </g>
              ))}

              {/* Area fill */}
              <path d={areaPath} fill="var(--color-interactive-selected)" />

              {/* Target line */}
              <path d={targetPath} fill="none" stroke="var(--color-status-error)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />

              {/* Actual line */}
              <path d={actualPath} fill="none" stroke="var(--color-interactive-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

              {/* Data points */}
              {actualData.map((d) => {
                const idx = data.indexOf(d);
                return (
                  <circle key={d.hour} cx={xPos(idx, data.length)} cy={yPos(d.efficiency)}
                    r="4" fill="var(--color-interactive-primary)" stroke="var(--color-bg-layer-01)" strokeWidth="2" />
                );
              })}

              {/* X labels */}
              {data.map((d, i) => (
                <text key={d.hour} x={xPos(i, data.length)} y={H - 8} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">
                  {d.hour.slice(0, 5)}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Hour-by-hour table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />Hour-by-Hour</div>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Hour</th><th>Efficiency</th><th>vs Target</th><th>Trend</th></tr>
            </thead>
            <tbody>
              {efficiencyTrend.map((d) => {
                const delta = d.efficiency - d.target;
                const hasData = d.efficiency > 0;
                return (
                  <tr key={d.hour}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>{d.hour}</td>
                    <td style={{ fontWeight: 700 }}>{hasData ? `${d.efficiency}%` : '—'}</td>
                    <td>
                      {hasData ? (
                        <span style={{ fontWeight: 600, color: delta >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                          {delta >= 0 ? '+' : ''}{delta}%
                        </span>
                      ) : '—'}
                    </td>
                    <td>
                      {hasData && (
                        <div className="progress-bar-track" style={{ width: 120 }}>
                          <div className={`progress-bar-fill ${delta >= 0 ? 'success' : 'danger'}`}
                            style={{ width: `${d.efficiency}%` }} />
                        </div>
                      )}
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
