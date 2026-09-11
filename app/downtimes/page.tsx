import type { Metadata } from 'next';
import { downtimeEvents } from '@/lib/dummyData';

export const metadata: Metadata = {
  title: 'Downtimes',
  description: 'Downtime log with reason codes, categories, and duration.',
};

const totalDowntime = downtimeEvents.reduce((s, d) => s + d.duration, 0);
const avgDowntime   = Math.round(totalDowntime / downtimeEvents.length);

export default function DowntimesPage() {
  return (
    <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Downtime Log</h2>
          <p className="page-subtitle">All recorded stoppages for Shift 1 · Line A</p>
        </div>

        {/* Summary tiles */}
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 'var(--space-24)' }}>
          <div className="stat-tile">
            <span className="stat-label">Total Events</span>
            <span className="stat-value">{downtimeEvents.length}</span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Total Duration</span>
            <span className="stat-value">{totalDowntime}<span className="stat-unit"> min</span></span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Avg Duration</span>
            <span className="stat-value">{avgDowntime}<span className="stat-unit"> min</span></span>
          </div>
          <div className="stat-tile">
            <span className="stat-label">Availability</span>
            <span className="stat-value">
              {Math.round(((720 - totalDowntime) / 720) * 100)}<span className="stat-unit"> %</span>
            </span>
            <span className="stat-delta up">▲ vs target 92%</span>
          </div>
        </div>

        {/* Downtime breakdown */}
        <div className="grid-2 mb-20">
          {/* By category */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><div className="card-title-bar" />By Category</div>
            </div>
            {(() => {
              const cats: Record<string, number> = {};
              downtimeEvents.forEach(d => { cats[d.category] = (cats[d.category] || 0) + d.duration; });
              const max = Math.max(...Object.values(cats));
              const colors: Record<string,string> = { Mechanical: '#dc2626', Quality: '#d97706', Changeover: '#2563eb', Material: '#f59e0b', Planned: '#6366f1' };
              return Object.entries(cats).map(([cat, mins]) => (
                <div key={cat} className="flex items-center gap-12 mb-12">
                  <span style={{ width: 90, fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>{cat}</span>
                  <div className="progress-bar-track" style={{ flex: 1 }}>
                    <div className="progress-bar-fill" style={{ width: `${(mins / max) * 100}%`, background: colors[cat] || 'var(--color-primary)' }} />
                  </div>
                  <span style={{ width: 44, textAlign: 'right', fontWeight: 600, fontSize: 'var(--font-size-md)' }}>{mins}m</span>
                </div>
              ));
            })()}
          </div>

          {/* Timeline mini */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><div className="card-title-bar" />Occurrence Timeline</div>
            </div>
            <div style={{ position: 'relative', paddingLeft: 16 }}>
              {downtimeEvents.map((d, i) => (
                <div key={d.id} style={{ display: 'flex', gap: 12, marginBottom: i < downtimeEvents.length - 1 ? 16 : 0, alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, marginTop: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.category === 'Planned' ? 'var(--color-primary)' : d.category === 'Changeover' ? 'var(--color-warning)' : 'var(--color-danger)' }} />
                    {i < downtimeEvents.length - 1 && <div style={{ width: 1, height: 24, background: 'var(--color-border-solid)', marginTop: 4 }} />}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>{d.reason}</p>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                      {d.startTime}–{d.endTime} · {d.duration}m · {d.equipment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />Event Log</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Start</th><th>End</th><th>Duration</th><th>Category</th>
                <th>Reason</th><th>Equipment</th><th>Responsible</th>
              </tr>
            </thead>
            <tbody>
              {downtimeEvents.map((d) => {
                const badgeCls = d.category === 'Planned' ? 'badge-blue'
                  : d.category === 'Changeover' ? 'badge-yellow' : 'badge-red';
                return (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'monospace' }}>{d.startTime}</td>
                    <td style={{ fontFamily: 'monospace' }}>{d.endTime}</td>
                    <td style={{ fontWeight: 700 }}>{d.duration} min</td>
                    <td><span className={`badge ${badgeCls}`}>{d.category}</span></td>
                    <td>{d.reason}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{d.equipment}</td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{d.responsible}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  );
}
