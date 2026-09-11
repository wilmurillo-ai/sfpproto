import type { Metadata } from 'next';
import AppHeader from '@/components/AppHeader';
import {
  dashboardKPIs,
  scheduleBlocks,
  downtimeEvents,
  equipmentList,
  efficiencyTrend,
} from '@/lib/dummyData';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Line Dashboard — real-time KPIs, schedule, and line status overview.',
};

function GaugeSVG({ value, color }: { value: number; color?: string }) {
  const trackColor = 'var(--color-border-default)';
  const fillColor  = color ?? 'var(--color-interactive-primary)';
  const r = 54;
  const cx = 64, cy = 64;
  const total = 2 * Math.PI * r;
  const arc = (value / 100) * total * 0.75;
  const offset = total * 0.25 * 0.5;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth="10"
        strokeDasharray={`${total * 0.75} ${total * 0.25}`}
        strokeDashoffset={-offset} strokeLinecap="round" transform="rotate(-225 64 64)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={fillColor} strokeWidth="10"
        strokeDasharray={`${arc} ${total - arc}`}
        strokeDashoffset={-offset} strokeLinecap="round" transform="rotate(-225 64 64)" />
      <text x="64" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="currentColor">{value}</text>
      <text x="64" y="78" textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">%</text>
    </svg>
  );
}

export default function DashboardPage() {
  const SHIFT_START = 6;
  const SHIFT_END = 18;
  const SHIFT_HOURS = SHIFT_END - SHIFT_START;

  const efficiency = 84;
  const attainment = 91;

  return (
    <>
      <AppHeader pageTitle="Line Dashboard" />
      <div className="page-content">
        {/* KPI Tiles */}
        <div className="stat-grid">
          {dashboardKPIs.map((kpi) => (
            <div className="stat-tile" key={kpi.id} id={`kpi-${kpi.id}`}>
              <span className="stat-label">{kpi.label}</span>
              <div className="flex items-center gap-8">
                <span className="stat-value">
                  {kpi.value}
                  <span className="stat-unit"> {kpi.unit}</span>
                </span>
              </div>
              <span className={`stat-delta ${kpi.trend}`}>{kpi.delta}</span>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid-2-1 mb-20">
          {/* Schedule Bar */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-bar" />
                Schedule — Today
              </div>
              <span className="badge badge-blue">Shift 1 · 06:00–18:00</span>
            </div>

            {/* Time axis */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              {Array.from({ length: SHIFT_HOURS + 1 }, (_, i) => (
                <span key={i} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', width: 0, textAlign: 'center' }}>
                  {String(SHIFT_START + i).padStart(2, '0')}h
                </span>
              ))}
            </div>

            <div className="schedule-timeline">
              {scheduleBlocks.map((block) => {
                const left = ((block.startHour - SHIFT_START) / SHIFT_HOURS) * 100;
                const width = ((block.endHour - block.startHour) / SHIFT_HOURS) * 100;
                return (
                  <div
                    key={block.id}
                    className={`schedule-block ${block.status}`}
                    style={{ width: `${width}%`, flexShrink: 0 }}
                    title={`${block.label} (${block.startHour}h – ${block.endHour}h)`}
                  >
                    {width > 6 ? block.label : ''}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-16" style={{ marginTop: 12 }}>
              {[
                { label: 'Running',    cls: 'running'    },
                { label: 'Planned',    cls: 'planned'    },
                { label: 'Changeover', cls: 'changeover' },
                { label: 'Downtime',   cls: 'downtime'   },
                { label: 'Idle',       cls: 'idle'       },
              ].map(({ label, cls }) => (
                <div key={cls} className="flex items-center gap-4">
                  <div className={`schedule-block ${cls}`} style={{ width: 12, height: 12, borderRadius: 3, flexShrink: 0 }} />
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gauges */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><div className="card-title-bar" />Performance</div>
            </div>
            <div className="flex flex-col gap-16 items-center">
              <div className="gauge-container">
                <GaugeSVG value={efficiency} />
                <span style={{ fontSize: 'var(--font-size-paragraph-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Efficiency</span>
              </div>
              <div className="gauge-container">
                <GaugeSVG value={attainment} color="var(--color-status-success)" />
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Attainment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid-2">
          {/* Recent Downtimes */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><div className="card-title-bar" />Recent Downtimes</div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th><th>Category</th><th>Reason</th><th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {downtimeEvents.slice(0, 4).map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-sm)' }}>{d.startTime}</td>
                    <td><span className={`badge ${d.category === 'Planned' ? 'badge-blue' : d.category === 'Changeover' ? 'badge-yellow' : 'badge-red'}`}>{d.category}</span></td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{d.reason}</td>
                    <td style={{ fontWeight: 600 }}>{d.duration}m</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Equipment Status */}
          <div className="card">
            <div className="card-header">
              <div className="card-title"><div className="card-title-bar" />Equipment Status</div>
            </div>
            <div className="flex flex-col gap-12">
              {equipmentList.slice(0, 5).map((eq) => (
                <div key={eq.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                      background: eq.status === 'running' ? 'var(--color-success)'
                        : eq.status === 'fault' ? 'var(--color-danger)'
                        : eq.status === 'maintenance' ? 'var(--color-warning)'
                        : 'var(--color-text-muted)',
                    }} />
                    <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 500 }}>{eq.name}</span>
                  </div>
                  <div className="flex items-center gap-12" style={{ minWidth: 140 }}>
                    <div className="progress-bar-track" style={{ width: 80 }}>
                      <div className={`progress-bar-fill ${eq.status === 'fault' ? 'danger' : eq.status === 'maintenance' ? 'warning' : 'primary'}`}
                        style={{ width: `${eq.uptime}%` }} />
                    </div>
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', width: 36, textAlign: 'right' }}>{eq.uptime}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
