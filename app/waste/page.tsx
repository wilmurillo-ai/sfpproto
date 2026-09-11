import type { Metadata } from 'next';
import { wasteItems } from '@/lib/dummyData';

export const metadata: Metadata = {
  title: 'Waste',
  description: 'Waste tracking — scrap, rework, and overproduction categories.',
};

export default function WastePage() {
  const totalQty  = wasteItems.reduce((s, w) => s + w.quantity, 0);
  const totalCost = wasteItems.reduce((s, w) => s + w.cost, 0);

  // Donut
  const r = 60, cx = 70, cy = 70;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const arcs = wasteItems.map(item => {
    const dash = (item.percent / 100) * circumference;
    const arc = { dashArray: `${dash} ${circumference - dash}`, dashOffset: -offset, color: item.color };
    offset += dash;
    return arc;
  });

  return (
    <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Waste</h2>
          <p className="page-subtitle">Scrap, rework, and material waste — Shift 1 · Line A</p>
        </div>

        {/* KPIs */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-24)' }}>
          <div className="stat-tile">
            <span className="stat-label">Waste Rate</span>
            <span className="stat-value">1.4<span className="stat-unit"> %</span></span>
            <span className="stat-delta down">▼ -0.3% vs last shift</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Total Items</span>
            <span className="stat-value">{totalQty}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Est. Cost</span>
            <span className="stat-value">${totalCost.toLocaleString()}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Categories</span>
            <span className="stat-value">{wasteItems.length}</span>
          </div>
        </div>

        <div className="grid-2-1 mb-20">
          {/* Breakdown */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><div className="card-title-bar" />Waste by Category</div>
            </div>
            <div className="flex flex-col gap-16">
              {wasteItems.map((item) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-8">
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{item.category}</span>
                    </div>
                    <div className="flex gap-16">
                      <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>
                        {item.quantity} {item.unit}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--color-danger)', width: 52, textAlign: 'right' }}>
                        ${item.cost}
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar-track" style={{ height: 10 }}>
                    <div className="progress-bar-fill" style={{ width: `${item.percent * 2}%`, background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut */}
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
                <text x="70" y="64" textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--color-text-primary)">${totalCost}</text>
                <text x="70" y="82" textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">est. cost</text>
              </svg>
              <div className="flex flex-col gap-4" style={{ width: '100%' }}>
                {wasteItems.map((item) => (
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
            <div className="card-title"><div className="card-title-bar" />Waste Log</div>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Category</th><th>Quantity</th><th>Est. Cost</th><th>Share</th></tr>
            </thead>
            <tbody>
              {wasteItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-8">
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                      <span style={{ fontWeight: 600 }}>{item.category}</span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.quantity} {item.unit}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-danger)' }}>${item.cost.toLocaleString()}</td>
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
  );
}
