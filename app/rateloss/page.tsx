import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import { rateLossItems } from '@/lib/dummyData';

export const metadata: Metadata = {
  title: 'Rate Loss',
  description: 'Rate loss breakdown — categories and impact on production output.',
};

export default function RateLossPage() {
  const totalMinutes = rateLossItems.reduce((s, r) => s + r.minutes, 0);
  const totalUnits   = rateLossItems.reduce((s, r) => s + r.units, 0);

  // Donut SVG
  const r = 60, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const arcs = rateLossItems.map(item => {
    const dash = (item.percent / 100) * circumference;
    const arc = { dashArray: `${dash} ${circumference - dash}`, dashOffset: -offset, color: item.color };
    offset += dash;
    return arc;
  });

  return (
    <>
      <AppHeader pageTitle="Rate Loss" />
      <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Rate Loss</h2>
          <p className="page-subtitle">Lost production capacity by category — Shift 1 · Line A</p>
        </div>

        {/* KPIs */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 'var(--space-24)' }}>
          <div className="stat-tile">
            <span className="stat-label">Total Loss Time</span>
            <span className="stat-value">{totalMinutes}<span className="stat-unit"> min</span></span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Units Lost</span>
            <span className="stat-value">{totalUnits.toLocaleString()}<span className="stat-unit"> pcs</span></span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Categories</span>
            <span className="stat-value">{rateLossItems.length}</span>
          </div>
        </div>

        <div className="grid-2-1 mb-20">
          {/* Breakdown bars */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><div className="card-title-bar" />Loss Breakdown</div>
            </div>
            <div className="flex flex-col gap-16">
              {rateLossItems.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-8">
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{item.category}</span>
                    </div>
                    <div className="flex gap-16">
                      <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>{item.minutes} min</span>
                      <span style={{ fontWeight: 700, width: 44, textAlign: 'right' }}>{item.percent}%</span>
                    </div>
                  </div>
                  <div className="progress-bar-track" style={{ height: 10 }}>
                    <div className="progress-bar-fill" style={{ width: `${item.percent * 2}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><div className="card-title-bar" />Distribution</div>
            </div>
            <div className="gauge-container">
              <svg width="140" height="140" viewBox="0 0 140 140">
                {arcs.map((arc, i) => (
                  <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                    stroke={arc.color} strokeWidth="18"
                    strokeDasharray={arc.dashArray}
                    strokeDashoffset={arc.dashOffset}
                    transform="rotate(-90 70 70)"
                  />
                ))}
                <text x="70" y="65" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--color-text-primary)">{totalMinutes}</text>
                <text x="70" y="82" textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">min lost</text>
              </svg>
              {/* Legend */}
              <div className="flex flex-col gap-4" style={{ width: '100%' }}>
                {rateLossItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{item.category}</span>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />Rate Loss Detail</div>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Category</th><th>Duration (min)</th><th>Units Lost</th><th>Share</th></tr>
            </thead>
            <tbody>
              {rateLossItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-8">
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                      <span style={{ fontWeight: 600 }}>{item.category}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{item.minutes}</td>
                  <td>{item.units}</td>
                  <td>
                    <div className="flex items-center gap-8">
                      <div className="progress-bar-track" style={{ width: 80 }}>
                        <div className="progress-bar-fill" style={{ width: `${item.percent * 2}%`, background: item.color }} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{item.percent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
