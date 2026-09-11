import type { Metadata } from 'next';
import { scheduleBlocks } from '@/lib/dummyData';

export const metadata: Metadata = {
  title: 'Schedule',
  description: 'Production schedule — planned vs actual time blocks for the current shift.',
};

const SHIFT_START = 6;
const SHIFT_END   = 18;
const SHIFT_HOURS = SHIFT_END - SHIFT_START;

const hours = Array.from({ length: SHIFT_HOURS }, (_, i) => SHIFT_START + i);

export default function SchedulePage() {
  return (
    <div className="page-content">
        <div className="page-header">
          <h2 className="page-title">Production Schedule</h2>
          <p className="page-subtitle">Shift 1 · 06:00 – 18:00 · Line A</p>
        </div>

        {/* Full Timeline */}
        <div className="card mb-20">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />Timeline View</div>
            <span className="badge badge-blue">12h window</span>
          </div>

          {/* Hour labels */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${SHIFT_HOURS}, 1fr)`, marginBottom: 6 }}>
            {hours.map((h) => (
              <div key={h} style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border-solid)', paddingLeft: 4 }}>
                {String(h).padStart(2,'0')}:00
              </div>
            ))}
          </div>

          {/* Timeline bar */}
          <div style={{ position: 'relative', height: 56, background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', overflow: 'hidden', display: 'flex' }}>
            {scheduleBlocks.map((block) => {
              const widthPct = ((block.endHour - block.startHour) / SHIFT_HOURS) * 100;
              return (
                <div
                  key={block.id}
                  className={`schedule-block ${block.status}`}
                  style={{ width: `${widthPct}%`, flexShrink: 0, flexGrow: 0 }}
                  title={`${block.label}: ${block.startHour}:00 – ${block.endHour}:00`}
                >
                  {widthPct > 8 ? block.label : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Schedule Table */}
        <div className="card">
          <div className="card-header">
            <div className="card-title"><div className="card-title-bar" />Block Details</div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Label / Product</th>
                <th>Status</th>
                <th>Start</th>
                <th>End</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {scheduleBlocks.map((block, i) => {
                const duration = (block.endHour - block.startHour) * 60;
                const startStr = `${String(Math.floor(block.startHour)).padStart(2,'0')}:${block.startHour % 1 ? '30' : '00'}`;
                const endStr   = `${String(Math.floor(block.endHour)).padStart(2,'0')}:${block.endHour % 1 ? '30' : '00'}`;
                const badgeCls = block.status === 'running' ? 'badge-green'
                  : block.status === 'planned' ? 'badge-blue'
                  : block.status === 'changeover' ? 'badge-yellow'
                  : block.status === 'downtime' ? 'badge-red'
                  : 'badge-gray';
                return (
                  <tr key={block.id}>
                    <td style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>{i + 1}</td>
                    <td style={{ fontWeight: 600 }}>{block.label}</td>
                    <td><span className={`badge ${badgeCls}`}>{block.status}</span></td>
                    <td style={{ fontFamily: 'monospace' }}>{startStr}</td>
                    <td style={{ fontFamily: 'monospace' }}>{endStr}</td>
                    <td style={{ fontWeight: 600 }}>{duration} min</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
  );
}
