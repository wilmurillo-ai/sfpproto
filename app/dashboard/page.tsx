import type { Metadata } from 'next';
import { Candybar, KPICard } from '@/components';
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
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">Line Dashboard</h2>
        <p className="page-subtitle">Real-time KPIs, schedule, and line status overview</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-cards-grid mb-24">
        <KPICard
          id="kpi-efficiency"
          title="Net Efficiency"
          value={84}
          unit="%"
          size="Regular"
          type="Simple"
          delta="Positive"
          clickable={true}
          href="/efficiency"
          targetDelta="0.2% vs Target"
          secondaryDelta="+2.4% vs last hr"
        />

        <KPICard
          id="kpi-attainment"
          title="Attainment"
          value={91}
          unit="%"
          size="Regular"
          type="Simple"
          delta="Positive"
          clickable={true}
          href="/attainment"
          targetDelta="4.3% vs Target"
          secondaryDelta="+1.8% vs last shift"
        />

        <KPICard
          id="kpi-downtime"
          title="Downtime"
          value={16}
          unit="%"
          size="Regular"
          type="Compound"
          delta="Negative"
          clickable={true}
          href="/downtimes"
          targetDelta="2% vs Target"
          secondaryDelta="+2.4% vs. last hr"
          subMetrics={[
            { value: 6, label: 'Major Events' },
            { value: '2.17', unit: 'min', label: 'MTBF' },
            { value: '1.55', unit: 'min', label: 'MTTR' },
          ]}
        />

        <KPICard
          id="kpi-rate"
          title="Rate (units/h)"
          value={312}
          unit=" u/h"
          size="Regular"
          type="Simple"
          delta="Positive"
          clickable={true}
          href="/rateloss"
          targetDelta="Normal Pace"
          secondaryDelta="0.0% vs target"
        />

        <KPICard
          id="kpi-output"
          title="Output"
          value="2,480"
          unit=" pcs"
          size="Regular"
          type="Compound"
          delta="Positive"
          clickable={true}
          href="/summary"
          targetDelta="5.2% vs Plan"
          secondaryDelta="+120 vs last hr"
          subMetrics={[
            { value: '2,600', unit: 'pcs', label: 'Target' },
            { value: '98.6', unit: '%', label: 'Yield' },
            { value: '2,445', unit: 'pcs', label: 'Good' },
          ]}
        />

        <KPICard
          id="kpi-waste"
          title="Waste"
          value={1.4}
          unit="%"
          size="Regular"
          type="Simple"
          delta="Positive"
          clickable={true}
          href="/waste"
          targetDelta="-0.3% vs Target"
          secondaryDelta="-0.5% vs yesterday"
        />
      </div>

        {/* Main Grid */}
        <div className="grid-2-1 mb-20">
          {/* Line Performance Candybar */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <div className="card-title-bar" />
                Line Performance
              </div>
              <span className="badge badge-blue">Shift 1 · Active</span>
            </div>

            <Candybar
              size="large"
              initialTimeframe="shift"
              showTimeframeSelector={true}
              showSizeToggle={true}
              showLegend={true}
              showNowNeedle={true}
            />
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
  );
}
